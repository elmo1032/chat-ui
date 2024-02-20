// Import required types from external modules
import type { ObjectId } from "mongodb";
import type { Message } from "./Message";
import type { Timestamps } from "./Timestamps";
import type { User } from "./User";
import type { Assistant } from "./Assistant";

// Define the Conversation interface which extends the Timestamps interface
export interface Conversation extends Timestamps {
  // The unique identifier for the conversation, an instance of ObjectId from mongodb
  _id: ObjectId;

  // Optional session identifier, used to group messages
  sessionId?: string;

  // Optional user identifier, linked to a User object
  userId?: User["_id"];

  // Model and embedding model used for the conversation
  model: string;
  embeddingModel: string;

  // Title of the conversation
  title: string;

  // Optional root message identifier, linked to a Message object
  rootMessageId?: Message["id"];

  // Array of messages in the conversation
  messages: Message[];

  // Optional metadata for the conversation
  meta?: {
    // Optional fromShareId, used for sharing purposes
    fromShareId?: string;
  };

  // Optional pre-prompt for the conversation
  prompts?: string;

  // Optional assistant identifier, linked to an Assistant object
  assistantId?: Assistant["_id"];
}
