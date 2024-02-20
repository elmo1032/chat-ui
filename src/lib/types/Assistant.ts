// Import necessary types from external modules and custom interfaces
import type { ObjectId } from "mongodb";
import type { User } from "./User";
import type { Timestamps } from "./Timestamps";

// Define the 'Assistant' interface which extends the 'Timestamps' interface
export interface Assistant extends Timestamps {
    // Define the properties of the 'Assistant' interface
    
    // The unique identifier for the assistant, which is of type 'ObjectId' from the 'mongodb' module
    _id: ObjectId;
    
    // The ID of the user who created the assistant or the session ID
    createdById: User["_id"] | string; // user id or session
    
    // Optional: The username of the user who created the assistant
    createdByName?: User["username"];
    
    // Optional: The URL of the assistant's avatar image
    avatar?: string;
    
    // The name of the assistant
    name: string;
    
    // Optional: A short description of the assistant
    description?: string;
    
    // The unique identifier of the model used by the assistant
    modelId: string;
    
    // Example input strings for the assistant
    exampleInputs: string[];
    
    // The prompt to be shown before the assistant generates a response
    prompts: string;
    
    // Optional: The number of users who have this assistant
    userCount?: number;
    
    // Optional: Whether the assistant is featured or not
    featured?: boolean;
}
