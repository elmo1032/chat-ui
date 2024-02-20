// Import required modules
import { collections } from "$lib/server/data,base";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import {
  insertLegacyConversation,
  insertSid,
  eBranchesConversation,
} from "./treeHelpers.spec";
import { addChildren } from "./addChildren";
import type { Message } from "$lib/types/Message";

// Define a new message with required properties
const newMessage: Omit<Message, "id"> = {
  content: "new message",
  from: "user",
};

// Freeze the newMessage object to make it immutable
Object.freeze(newMessage);

// Test suite for addChildren function
describe("addChildren", async () => {
  // Test case: should let you append on legacy conversations
  it("should let you append on legacy conversations", async (context) => {
    // Insert a new legacy conversation and get its details
    const convId = await insertLegacyConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Store the initial length of the conversation messages
    const convLength = conv.messages.length;

    // Add a child to the last message of the conversation
    addChildren(conv, newMessage, conv.messages[conv.messages.length - 1].id);
    expect(conv.messages.length).toEqual(convLength + 1);
  });

  // Test case: should not let you create branches on legacy conversations
  it("should not let you create branches on legacy conversations", async () => {
    // Insert a new legacy conversation and get its details
    const convId = await insertLegacyConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Attempt to add a child to the first message of the conversation
    expect(() => addChildren(conv, newMessage, conv.messages[0].id)).toThrow();
  });

  // Test case: should not let you create a message that already exists
  it("should not let you create a message that already exists", async () => {
    // Insert a new legacy conversation and get its details
    const convId = await insertLegacyConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Create a message with the same properties as the first message of the conversation
    const messageThatAlreadyExists: Message = {
      id: conv.messages[0].id,
      content: "new message",
      from: "user",
    };

    // Attempt to add the duplicate message as a child to the first message of the conversation
    expect(() => addChildren(conv, messageThatAlreadyExists, conv.messages[0].id)).toThrow();
  });

  // Test case: should let you create branches on conversations with subtrees
  it("should let you create branches on conversations with subtrees", async () => {
    // Insert a conversation with subtrees and get its details
    const convId = await insertSidBranchesConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Get the number of children of the first message of the conversation
    const nChildren = conv.messages[0].children?.length;
    if (!nChildren) throw new Error("No children found");

    // Add a child to the first message of the conversation
    addChildren(conv, newMessage, conv.messages[0].id);
    expect(conv.messages[0].children?.length).toEqual(nChildren + 1);
  });

  // Test case: should let you create a new leaf
  it("should let you create a new leaf", async () => {
    // Insert a conversation with subtrees and get its details
    const convId = await insertSideBranchesConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Get the parent ID and number of children of the last message of the conversation
    const parentId = conv.messages[conv.messages.length - 1].id;
    const nChildren = conv.messages[conv.messages.length - 1].children?.length;

    if (nChildren === undefined) throw new Error("No children found");
    expect(nChildren).toEqual(0);

    // Add a child to the last message of the conversation
    addChildren(conv, newMessage, parentId);
    expect(conv.messages[conv.messages.length - 2].children?.length).toEqual(nChildren + 1);
  });

  // Test case: should let you append to an empty conversation without specifying a parentId
  it("should let you append to an empty conversation without specifying a parentId", async () => {
    // Define an empty conversation object
    const conv = {
      _id: new ObjectId(),
      rootMessageId: undefined,
      messages: [] as Message[],
    };

    // Add a child to the empty conversation
    addChildren(conv, newMessage);
    expect(conv.messages.length).toEqual(1);
    expect(conv.rootMessageId).toEqual(conv.messages[0].id);
  });

  // Test case: should throw if you don't specify a parentId in a conversation with messages
  it("should throw if you don't specify a parentId in a conversation with messages", async () => {
    // Insert a new legacy conversation and get its details
    const convId = await insertLegacyConversation();
    const conv = await collections.conversations.findOne({ _id: new ObjectId(convId) });
    if (!conv) throw new Error("Conversation not found");

    // Attempt to add a child to the conversation without specifying a parentId
    expect(() => addChildren(conv, newMessage)).toThrow
