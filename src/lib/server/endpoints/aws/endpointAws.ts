// Import required modules and functions
import { buildPrompt } from "$lib/buildPrompt";
import { textGenerationStream } from "@huggingface/inference";
import { z } from "zod";
import type { Endpoint } from "../endpoints";

/*
endpointAwsParametersSchema:
Defines the schema for input parameters of the endpointAws function
using zod library for type safety and validation.
*/
export const endpointAwsParametersSchema = z.object({
	weight: z.number().int().positive().default(1),
	model: z.any(),
	type: z.literal("aws"),
	url: z.string().url(),
	accessKey: z.string().min(1),
	secretKey: z.string().min(1),
	sessionToken: z.string().optional(),
	service: z.union([z.literal("sagemaker"), z.literal("lambda")]).default("sagemaker"),
	region: z.string().optional(),
});

/*
endpointAws:
The main function that takes input parameters, initializes AWS client,
and returns a function that generates text using Hugging Face's text generation stream.
*/
export async function endpointAws(
	input: z.input<typeof endpointAwsParametersSchema>
): Promise<Endpoint> {
	let AwsClient;
	try {
		// Import aws4fetch module dynamically
		AwsClient = (await import("aws4fetch")).AwsClient;
	} catch (e) {
		// Error handling for failed import
		throw new Error("Failed to import aws4fetch");
	}

	// Parse input parameters using the defined schema
	const { url, accessKey, secretKey, sessionToken, model, region, service } =
		endpointAwsParametersSchema.parse(input);

	// Initialize AWS client with provided credentials
	const aws = new AwsClient({
		accessKeyId: accessKey,
		secretAccessKey: secretKey,
		sessionToken,
		service,
		region,
	});

	// Return a function that generates text using Hugging Face's text generation stream
	return async ({ messages, continueMessage, preprompt }) => {
		// Build the prompt using the buildPrompt function
		const prompt = await buildPrompt({
			messages,
			continueMessage,
			preprompt,
			model,
		});

		// Call the textGenerationStream function with necessary parameters
		return textGenerationStream(
	
