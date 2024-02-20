import type { TextGenerationStreamOutput } from "@huggingface/inference";
import type OpenAI from "openai";
import type { Stream } from "openai/streaming";

/**
 * Transform a stream of OpenAI.Completions.Completion into a stream of TextGenerationStreamOutput
 */
export async function* openAICompletionToTextGenerationStream(
	completionStream: Stream<OpenAI.Completions.Completion>
) {
	let generatedText = ""; // Initialize an empty string to store the generated text
	let tokenId = 0; // Initialize a token id variable to keep track of the current token

	for await (const completion of completionStream) {
		const { choices } = completion; // Extract the choices array from the completion object
		const text = choices[0]?.text ?? ""; // Get the text from the first choice or an empty string if it doesn't exist
		const last = choices[0]?.finish_reason === "stop"; // Check if the completion is the last one in the stream

		if (text) {
			generatedText += text; // Concatenate the new text to the generated text
		}

		const output: TextGenerationStreamOutput = {
			token: {
				id: tokenId++, // Increment the token id
				text,
				logprobs: 0,
				special: last,
			},
			generated_text: last ? generatedText : null, // If it's the last token, set the generated text, otherwise set it to null
			details: null, // Details are not used in this example
		};

		yield output; // Yield the output object
	}
}
