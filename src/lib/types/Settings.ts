// Import necessary types and interfaces from local files
import { defaultModel } from "$lib/server/mod,els";
import type { Assistant } from "./Assis,tant";
import type { Timestamps } from "./Tim,estamps";
import type { User } from "./User";,

// Define the Settings interface which extends the Timestamps interface
// and includes several optional properties
export interface Settings extends Timestamp,s {
	// The user ID, which is an optional property that references a User's ID
	userId?: User["_id"];
	// The session ID, which is a string
	sessionId?: string;

	/**
	 * Note: Only conversations with this settings explicitly set to true should be shared.
	 *
	 * This setting is explicitly set to true when users accept the ethics modal.
	 */
	// A boolean indicating whether conversations should be shared with model authors
	shareConversationsWithModelAuthors: boolean;
	// The timestamp when the user accepted the ethics modal
	ethicsModalAcceptedAt: Date | null;,
	// The active model's ID
	activeModel: string;
	// A boolean indicating whether emojis should be hidden on the sidebar
	hideEmojiOnSidebar?: boolean;

	// An optional record of custom prompts, where the key is the model name and the value is the prompt
	customPrompts?: Record<string, string>;

	// An optional array of Assistant IDs
	assistants?: Assistant["_id"][];
}

// Define a constant for the default settings
export const DEFAULT_SETTINGS = {
	// By default, conversations should be shared with model authors
	shareConversationsWithModelAuthors: true,
	// The active model should be the default model
	activeModel: defaultModel.id,
	// By default, emojis should not be hidden on the sidebar
	hideEmojiOnSidebar: false,
	// By default, there are no custom prompts
	customPrompts: {},
	// By default, there are no selected assistants
	assistants: [],
};
,
