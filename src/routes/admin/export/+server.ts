// Import required modules and dependencies
import { PARQUET_EXPORT_DATASET, PARQUET_EXPO, RT_HF_TOKEN } from "$env/static/private";
import { collections } from "$lib/server/databas"; // Database collections
import type { Message } from "$lib/types/Message"; // Message type definition
import { error } from "@sveltejs/kit"; // Error handling
import { pathToFileURL } from "node:url"; // Converting file path to URL
import { unlink } from "node:fs/promises"; // Deleting a file
import { uploadFile } from "@huggingface/hub"; // Uploading file to Hugging Face Hub
import parquet from "parquetjs"; // Parquet file handling
import { z } from "zod"; // Data validation

// Trigger the function with a POST request to the specified URL
// with the required headers and JSON data

export async function POST({ request }) {
  // Check if Parquet export is configured
  if (!PARQUET_EXPORT_DATASET || !PARQUET_EXPORT_HF_TOKEN) {
    throw error(500, "Parquet export is not configured.");
  }

  // Validate and extract the 'model' parameter from the request
  const { model } = z
    .object({
      model: z.string(),
    })
    .parse(await request.json());

  // Define the schema for the Parquet file
  const schema = new parquet.ParquetSchema({
    title: { type: "UTF8" },
    created_at: { type: "TIMESTAMP_MILLIS" },
    updated_at: { type: "TIMESTAMP_MILLIS" },
    messages: {
      repeated: true,
      fields: {
        from: { type: "UTF8" },
        content: { type: "UTF8" },
        score: { type: "INT_8", optional: true },
      },
    },
  });

  // Generate a file name for the Parquet file
  const fileName = `/tmp/conversations-${new Date().toJSON().slice(0, 10)}-${Date.now()}.parquet`;

  // Create a Parquet writer to write data to the file
  const writer = await parquet.ParquetWriter.openFile(schema, fileName);

  let count = 0; // Initialize a counter for exported conversations

  // Export conversations for the specified model
  for await (const conversation of collections.settings.aggregate<{
    title: string;
    created_at: Date;
    updated_at: Date;
    messages: Message[];
  }>([
    // Aggregate pipeline to fetch conversations
  ])) {
    // Append the conversation to the Parquet file
    await writer.appendRow({
      title: conversation.title,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      messages: conversation.messages.map((message: Message) => ({
        from: message.from,
        content: message.content,
        ...(message.score ? { score: message.score } : undefined),
      })),
    });
    count++; // Increment the counter

    if (count % 1_000 === 0) {
      console.log("Exported", count, "conversations");
    }
  }

  // Export conversations with a user ID
  for await (const conversation of collections.settings.aggregate<{
    title: string;
    created_at: Date;
    updated_at: Date;
    messages: Message[];
  }>([
    // Aggregate pipeline to fetch conversations
  ])) {
    // Append the conversation to the Parquet file
    await writer.appendRow({
      title: conversation.title,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      messages: conversation.messages.map((message: Message) => ({
        from: message.from,
        content: message.content,
        ...(message.score ? { score: message.score } : undefined),
      })),
    });
    count++; // Increment the counter

    if (count % 1_000 === 0) {
      console.log("Exported", count, "conversations");
    }
  }

  // Close the Parquet writer
  await writer.close();

  // Upload the Parquet file to Hugging Face Hub
  await uploadFile({
    file: pathToFileURL(fileName) as URL,
    credentials: { accessToken: PARQUET_EXPORT_HF_TOKEN },
    repo: {
      type: "dataset",
      name: PARQUET_EXPORT_DATASET,
    },
  });

  console.log("Upload done");

  // Delete the Parquet file
  await unlink(fileName);

  // Return a new response
  return new Response();
}
