// Import necessary modules and dependencies
import { 	Issuer, BaseClient, type UserinfoRes, Response, TokenSet, custom } from "openid-client";
import { addHours, addWeeks } from "date-fns";
import { 	COOKIE_NAME, 	OPENID_CLIENT_ID, 	OPENID_CLIENT_SECRET, 	OPENID_PROVIDER_URL, 	OPENID_SCOPES, 	OPENID_TOLERANCE, 	OPENID_RESOURCE, 	OPENID_CONFIG, } from "$env/static/private";
import { sha256 } from "$lib/utils/sha256";
import { z } from "zod";
import { d, ev } from "$app/environment";
import type { Cookies } from "@sveltejs/kit";
import { collections } from "./database";
import JSON5 from "json5";

// Define interfaces for OIDCSettings and OIDCUserInfo
export interface OIDCSettings {
	redirectURI: string;
}

export interface OIDCUserInfo {
	token: TokenSet;
	userData: UserinfoRes;
}

// Utility function to provide a string with a default value
const stringWithDefault = (val, defaultValue: string) =>
	z
		.string()
		.default(defaultValue)
		.transform((el) => (el ? el : defaultValue));

// Validate and parse the OpenID configuration
const OIDConfig = z
	.object({
		CLIENT_ID: stringWithDefault(OPENID_CLIENT_ID),
		CLIENT_SECRET: stringWithDefault(OPENID_CLIENT_SECRET),
		PROVIDER_URL: stringWithDefault(OPENID_PROVIDER_URL),
		SCOPES: stringWithDefault(OPENID_SCOPES),
		TOLERANCE: stringWithDefault(OPENID_TOLERANCE),
		RESOURCE: stringWithDefault(OPENID_RESOURCE),
	})
	.parse(JSON5.parse(OPENID_CONFIG));

// Check if OpenID configuration is valid
export const requiresUser = !!OIDConfig.CLIENT_ID && !!OIDConfig.CLIENT_SECRET;

// Function to refresh session cookie
export function refreshSessionCookie(cookies: Cookies, sessionId: string) {
	cookies.set(COOKIE_NAME, sessionId, {
		path: "/",
		// So that it works inside the space's iframe
		sameSite: dev ? "lax" : "none",
		secure: !dev,
		httpOnly: true,
		expires: addWeeks(new Date(), 2),
	});
}

// Function to find user by sessionId
export async function findUser(sessionId: string) {
	const session = await collections.sessions.findOne({ sessionId });

	if (!session) {
		return null;
	}

	return await collections.users.findOne({ _id: session.userId });
}

// Auth condition for SvelteKit's load function
export const authCondition = (locals: App.Locals) => {
	return locals.user
		? { userId: locals.user._id }
		: { sessionId: locals.sessionId, userId: { $exists: false } };
};

/**
 * Generates a CSRF token using the user sessionId. Note that we don't need a secret because sessionId is enough.
 */
export async function generateCsrfToken(sessionId: string, redirectUrl: string): Promise<string> {
	const data = {
		expiration: addHours(new Date(), 1).getTime(),
		redirectUrl,
	};

	return Buffer.from(
		JSON.stringify({
			data,
			signature: await sha256(JSON.stringify(data) + "##" + sessionId),
		})
	).toString("base64");
}

async function getOIDCClient(settings: OIDCSettings): Promise<BaseClient> {
	const issuer = await Issuer.discover(OIDConfig.PROVIDER_URL);

	return new issuer.Client({
		client_id: OIDConfig.CLIENT_ID,
		client_secret: OIDConfig.CLIENT_SECRET,
		redirect_uris: [settings.redirectURI],
		response_types: ["code"],
		[custom.clock_tolerance]: OIDConfig.TOLERANCE || undefined,
	});
}

export async function getOIDCAuthorizationUrl(
	settings: OIDCSettings,
	params: { sessionId: string }
): Promise<string> {
	const csrfToken = await generateCsrfToken(params.sessionId, settings.redirectURI);

	return (await getOIDCClient(settings)).authorizationUrl({
		scope: OIDConfig.SCOPES,
		state: csrfToken,
		resource: OIDConfig.RESOURCE || undefined,
	});
}

export async function getOIDCUserData(settings: OIDCSettings, code: string): Promise<OIDCUserInfo> {
	const client = await getOIDCClient(settings);
	const token = await client.callback(settings.redirectURI, { code });
	const userData = await client.userinfo(token);

	return { token, userData };
}

export async function validateAndParseCsrfToken(
	token: string,
	sessionId: string
): Promise<{ redirectUrl: string } | null> {
	try {
		const { data, signature } = JSON.parse(token);
		const reconstructSign = await sha256(JSON.stringify(data) + "##" + sessionId);

		if (data.expiration > Date.now() && signature === reconstructSign) {
			return { redirectUrl: data.redirectUrl };
		}
	} catch (e) {
		console.error(e);
	}
	return null;
}
