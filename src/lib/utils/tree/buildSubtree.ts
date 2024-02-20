import type { Conversation } from "$lib/types/Conversation";
import type { Message } from "$lib/types/Message";

/**
 * Builds a subtree of messages in a conversation, including the message with the given ID and its ancestors.
 * @param conv - The conversation object, containing messages and rootMessageId properties.
 * @param id - The ID of the message to include in the subtree.
 * @returns An array of message objects, including the message with the given ID and its ancestors.
 */
export function buildSubtree(
	conv: Pick<Conversation, "messages" | "rootMessageId">,
	id: Message["id"]
): Message[] {
	// Check if the conversation has a root message ID
	if (!conv.rootMessageId) {
		// If not, return a slice of the conversation's messages up to the message with the given ID
		if (conv.messages.length === 0) return [];
		const index = conv.messages.findIndex((m) => m.id === id);
		if (index === -1) throw new Error("Message not found");
		return conv.messages.slice(0, index + 1);
	} else {
		// If the conversation has a root message ID, find the message with the given ID and create an ancestor tree
		const message = conv.messages.find((m) => m.id === id);
		if (!message) throw new Error("Message not found");

		// Return an array containing the ancestors of the message (if any) and the message itself
		return [
			...(message.ancestors?.map((ancestorId) => {
				const ancestor = conv.messages.find((m) => m.id === ancestorId);
				if (!ancestor) throw new Error("Ancestor not found");
				return ancestor;
			}) ?? []),
			message,
		];
	}
}
