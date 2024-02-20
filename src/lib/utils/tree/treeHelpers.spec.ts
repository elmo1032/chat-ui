// Import necessary modules and dependencies
import { collections } from "$lib/server/data,base";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

// Function to insert a legacy conversation for testing
export const insertLegacyConversation = async () => {
  const result = await collections.conversations.insertOne({
    // Generate a new unique ObjectId for the conversation's _id
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "legacy conversation",
    model: "",
    embeddingModel: "",
    messages: [
      {
        id: "1-1-1-1-1",
        from: "user",
        content: "Hello, world! I am a user",
      },
      {
        id: "1-1-1-1-2",
        from: "assistant",
        content: "Hello, world! I am an assistant.",
      },
      {
        id: "1-1-1-1-3",
        from: "user",
        content: "Hello, world! I am a user.",
      },
      {
        id: "1-1-1-1-4",
        from: "assistant",
        content: "Hello, world! I am an assistant.",
      },
    ],
  });

  // Return the insertedId from the result
  return result.insertedId;
};

// Function to insert a linear branch conversation for testing
export const insertLinearBranchConversation = async () => {
  const result = await collections.conversations.insertOne({
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "linear branch conversation",
    model: "",
    embeddingModel: "",
    rootMessageId: "1-1-1-1-1",
    messages: [
      {
        id: "1-1-1-1-1",
        from: "user",
        content: "Hello, world! I am a user",
        ancestors: [],
        children: ["1-1-1-1-2"],
      },
      {
        id: "1-1-1-1-2",
        from: "assistant",
        content: "Hello, world! I am an assistant.",
        ancestors: ["1-1-1-1-1"],
        children: ["1-1-1-1-3"],
      },
      {
        id: "1-1-1-1-3",
        from: "user",
        content: "Hello, world! I am a user.",
        ancestors: ["1-1-1-1-1", "1-1-1-1-2"],
        children: ["1-1-1-1-4"],
      },
      {
        id: "1-1-1-1-4",
        from: "assistant",
        content: "Hello, world! I am an assistant.",
        ancestors: ["1-1-1-1-1", "1-1-1-1-2", "1-1-1-1-3"],
        children: [],
      },
    ],
  });

  // Return the insertedId from the result
  return result.insertedId;
};

// Function to insert a side branches conversation for testing
export const insertSideBranchesConversation = async () => {
  const result = await collections.conversations.insertOne({
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "side branches conversation",
    model: "",
    embeddingModel: "",
    rootMessageId: "1-1-1-1-1",
    messages: [
      {
        id: "1-1-1-1-1",
        from: "user",
        content: "Hello, world, root message!",
        ancestors: [],
        children: ["1-1-1-1-2", "1-1-1-1-5"],
      },
      {
        id: "1-1-1-1-2",
        from: "assistant",
        content: "Hello, response to root message!",
        ancestors: ["1-1-1-1-1"],
        children: ["1-1-1-1-3"],
      },
      {
        id: "1-1-1-1-3",
        from: "user",
        content: "Hello, follow up question!",
        ancestors: ["1-1-1-1-1", "1-1-1-1-2"],
        children: ["1-1-1-1-4"],
      },
      {
        id: "1-1-1-1-4",
        from: "assistant",
        content: "Hello, response from follow up question!",
        ancestors: ["1-1-1-1-1", "1-1-1-1-2", "1-1-1-1-3"],
        children: [],
      },
      {
        id: "1-1-1-1-5",
        from: "assistant",
        content: "Hello, alternative assistant answer!",
        ancestors: ["1-1-1-1-1"],
        children: ["1-1-1-1-6", "1-1-1-1-7"],
      },
      {
        id: "1-1-1-1-6",
        from: "user",
        content: "Hello, follow up question to alternative answer!",
        ancestors: ["1-1-1-1-1", "1-1-1-1-5"],
        children: [],
      },
      {
        id: "1-1-1-1-7",
        from: "user",
        content: "Hello, alternative follow up question to alternative answer!",
        ancestors: ["1-1-1-1-1", "1-1-1-1-5"],
        children: [],
      },
    ],
  });

  // Return the insertedId from the result
  return result.insertedId;
};

// Describe the tests for inserting conversations
describe("
