// Import necessary types from external modules and internal files
import type { ObjectId } from "mongodb"; // MongoDB's ObjectId type
import type { User } from "./User"; // User interface
import type { Assistant } from "./Assistant"; // Assistant interface
import type { Timestamps } from "./Timestamps"; // Timestamps interface

// Define the Report interface which extends the Timestamps interface
export interface Report extends Timestamps {
  // The _id field is of type ObjectId from mongodb
  _id: ObjectId;
  
  // The createdBy field is of type User's id or a string
  createdBy: User["_id"] | string;
  
  // The assistantId field is of type Assistant's id
  assistantId: Assistant["_id"];
  
  // The reason field is optional and can be a string
  reason?: string;
}
