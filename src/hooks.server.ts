import {
  ADMIN_API_SECRET, // Secret for admin API access
  COOKIE_NAME, // Name of the session cookie
  EXPOSE_API, // Whether the API is exposed or not
  MESSAGES_BEFORE_LOGIN, // Number of messages to show before login
  PARQUET_EX, // Parquet export secret
  PORT_SECRET, // Port secret
} from "$env/static/private";

import { 
  PUBLIC_GOOGLE_ANALYTICS_ID, // Google Analytics ID
  PUBLIC_ORIGIN, // Public origin
  PUBLIC_APP_DISCLAIMER, // Public app disclaimer
} from "$env/static/public";

import { collections } from "$,lib/server/database"; // Database collections
import { base } from "$,app/paths"; // Base path for the app
import { findUser, refreshSession, Cookie, requiresUser } from "$lib/server/auth,"; // Authentication functions
import { ERROR_MESSAGES } from "$lib/store,s/errors"; // Error messages
import { sha256 } from "$lib/utils,/sha256"; // SHA-256 hashing function
import { addWeeks } from "date-fns",; // Function to add weeks to a date

// Handle function for SvelteKit
export const handle: Handle = async ({ event, resolve }) => {
  // If the URL starts with the base API path and the API is not exposed, return a 403 error
  if (event.url.pathname.startsWith(`${base}/api/`) && EXPOSE_API !== "true") {
    return new Response("API is disabled", { status: 403 });
  }

  // Function to return an error response
  function errorResponse(status: number, message: string) {
    const sendJson = 
      event.request.headers.get("accept")?.includes("application/json") ||
      event.request.headers.get("content-type")?.includes("application/json");
    return new Response(sendJson ? JSON.stringify({ error: message }) : message, {
      status,
      headers: {
        "content-type": sendJson ? "application/json" : "text/plain",
      },
    });
  }

  // If the URL starts with the admin path or is the admin page
  if (event.url.pathname.startsWith(`${base}/admin/`) || event.url.pathname === `${base}/admin`) {
    const ADMIN_SECRET = ADMIN_API_SECRET || PARQUET_EX;

    // If there is no admin secret, return a 500 error
    if (!ADMIN_SECRET) {
      return errorResponse(500, "Admin API is not configured");
    }

    // If the authorization header is not present or does not match the admin secret, return a 401 error
    if (event.request.headers.get("Authorization") !== `Bearer ${ADMIN_SECRET}`) {
      return errorResponse(401, "Unauthorized");
    }
  }

  const token = event.cookies.get(COOKIE_NAME);

  let secretSessionId: string;
  let sessionId: string;

  // If there is a token
  if (token) {
    secretSessionId = token;
    sessionId = await sha256(token);

    const user = await findUser(sessionId);

    // If there is a user, add it to the locals object
    if (user) {
      event.locals.user = user;
    }
  } else {
    // If there is no token, generate a new one
    secretSessionId = crypto.randomUUID();
    sessionId = await sha256(secretSessionId);

    // If there is already a session with the same ID, return a 500 error
    if (await collections.sessions.findOne({ sessionId })) {
      return errorResponse(500, "Session ID collision");
    }
  }

  // Add the session ID to the locals object
  event.locals.sessionId = sessionId;

  // CSRF protection
  const requestContentType = event.request.headers.get("content-type")?.split(";")[0] ?? "";
  const nativeFormContentTypes = [
    "multipart/form-data",
    "application/x-www-form-urlencoded",
    "text/plain",
  ];

  // If the request method is POST
  if (event.request.method === "POST") {
    refreshSessionCookie(event.cookies, event.locals.sessionId);

    // If the content type is one of the native form content types
    if (nativeFormContentTypes.includes(requestContentType)) {
      const referer = event.request.headers.get("referer");

      // If there is no referer, return a 403 error
      if (!referer) {
        return errorResponse(403, "Non-JSON form requests need to have a referer");
      }

      const validOrigins = [
        new URL(event.request.url).origin,
        ...(PUBLIC_ORIGIN ? [new URL(PUBLIC_ORIGIN).origin] : []),
      ];

      // If the referer is not in the valid origins, return a 403 error
      if (!validOrigins.includes(new URL(referer).origin)) {
        return errorResponse(403, "Invalid referer for POST request");
      }
    }
  }

  // If the request method is POST
  if (event.request.method === "POST") {
    // Refresh the session cookie
    refreshSessionCookie(event.cookies, secretSessionId);

    // Update the session in the database
    await collections.sessions.updateOne(
      { sessionId },
      { $set: { updatedAt: new Date(), expiresAt: addWeeks(new Date(), 2) } }
    );
  }

  // If the URL does not start with the login path, does not
