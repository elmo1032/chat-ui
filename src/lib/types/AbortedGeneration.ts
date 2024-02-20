// Importing necessary types from their respective modules
import type { Conversation } from "./Conversation";
import type { Timestamps } from "./Timestamps";

// Defining the shape of an object that represents an aborted generation
export interface AbortedGeneration extends Timestamps {
  
    // The ID of the conversation associated with the aborted generation
    conversationId: Conversation["_id"];
    
    // Timestamps related to the aborted generation
    createdAt: Timestamps["createdAt"];
    updatedAt: Timestamps["updatedAt"];
}
