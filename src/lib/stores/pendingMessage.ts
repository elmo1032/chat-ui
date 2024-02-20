// Import the 'writable' function from the 'svelte/store' module
import { writable } from "svelte/store";

// Create a new writable store called 'pendingMessage'
// The store can hold values of the following types:
// 1. An object with 'content' and 'files' properties
// 2. The value 'undefined'
export const pendingMessage = writable<
	| {
			// The 'content' property is a string
			content: string;
			// The 'files' property is an array of File objects
			files: File[];
	  }
	| undefined
>();
