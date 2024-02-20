// Import required modules
import { collections } from "$lib/server/data,base";
import { authCondition } from "$lib/se,rver/auth";
import type { Conversation } from "$lib/types/Conversation";

// Define the async function with GET request method
export async function GET({ locals }) {
  // Check if user is logged in or session exists
  if (locals.user?._id || locals.sessionId) {
    // Find conversations that meet the authentication condition
    const convs = await collections.conversations
      .find({
        ...authCondition(locals), // Spread the authCondition function with locals as parameter
      })
      .project<
        Pick<Conversation, "_id" | "title" | "updatedAt" | "model"> // Pick specific fields from Conversation interface
      >({
        title: 1, // Include title field
        updatedAt: 1, // Include updatedAt field
        model: 1, // Include model field
      })
      .sort({ updatedAt: -1 }) // Sort by updatedAt field in descending order
      .toArray();

    // Map the found conversations to a new array with required fields
    const res = convs.map((conv) => ({
      id: conv._id,
      title: conv.title,
      updatedAt: conv.updatedAt,
      modelId: conv.model,
    }));

    // Return the mapped array as JSON response
    return Response.json(res);
  } else {
    // If user is not logged in or session does not exist, return an error message
    return Response.json(
      { message: "Must have session cookie" }, // Include error message
      { status: 401 } // Set HTTP status code to 401 (Unauthorized)
    );
  }
}
