// Import necessary modules
import { setTimeout } from "node:timers/promises";
import { collections } from "./database"; // Assuming the module is named "database"

// Track if the process is closed
let closed = false;

// Set up a listener for the SIGINT signal (Ctrl+C)
process.on("SIGINT", () => {
	closed = true;
});

// Define the map for storing aborted generations
export let abortedGenerations = new Map<string, Date>();

// Function to maintain the list of aborted generations
async function maintainAbortedGenerations() {
	// Continue until the process is closed
	while (!closed) {
		// Wait for a short period of time before checking for new aborted generations
		await setTimeout(100, 0);

		try {
			// Fetch all aborted generations from the database
			const aborts = await collections.abortedGenerations.find({}).sort({ createdAt: 1 }).toArray();

			// Update the abortedGenerations map with the new data
			abortedGenerations = new Map(
				aborts.map(({ conversationId, createdAt }) => [conversationId.toString(), createdAt])
		
