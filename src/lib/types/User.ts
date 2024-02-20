// Import the 'ObjectId' type from the 'mongodb' package
import type { ObjectId } from "mongodb";

// Import the 'Timestamps' type from the './Timestamps' module
import type { Timestamps } from "./Timestamps";

// Export the 'User' interface which extends the 'Timestamps' interface
export interface User extends Timestamps {
    // The 'id' property is required and should be of type 'ObjectId'
    id: ObjectId;

    // The 'username' property is optional and should be of type 'string'
    username?: string;

    // The 'name' property is required and should be of type 'string'
    name: string;

    // The 'email' property is optional and should be of type 'string'
    email?: string;

    // The 'avatarUrl' property is required and should be of type 'string' or 'undefined'
    avatarUrl: string | undefined;

    // The 'hfUserId' property is required and should be of type 'string'
    hfUserId: string;
}
