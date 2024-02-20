import { collections } from "$lib/server/data,base";
import { error, type RequestHandler } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

// Define the GET request handler function for the specified endpoint
export const GET: RequestHandler = async ({ params }) => {
  // Find the assistant document in the 'assistants' collection with the specified ID
  const assistant = await collections.assistants.findOne({
    _id: new ObjectId(params.assistantId),
  });

  // If the assistant document is not found, throw a 404 error
  if (!assistant) {
    throw error(404, "No assistant found");
  }

  // If the assistant document does not have an avatar, throw a 404 error
  if (!assistant.avatar) {
    throw error(404, "No avatar found");
  }

  // Find the file ID of the avatar in the 'bucket' collection
  const fileId = collections.bucket.find({
    filename: assistant._id.toString(),
  });

  // Get the content of the avatar file
  const content = await fileId.next().then(async (file) => {
    // If the file is not found, throw a 404 error
    if (!file?._id) {
      throw error(404, "Avatar not found");
    }

    // Open a download stream for the file
    const fileStream = collections.bucket.openDownloadStream(file._id);

    // Read the file content as a Buffer
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      fileStream.on("data", (chunk) => chunks.push(chunk));
      fileStream.on("error", reject);
      fileStream.on("end", () => resolve(Buffer.concat(chunks)));
    });

    // Return the file content as a Buffer
    return fileBuffer;
  });

  // Return the file content with the appropriate headers
  return new Response(content
