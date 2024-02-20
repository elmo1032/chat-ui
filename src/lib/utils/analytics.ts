// Define the interface for a Google Analytics event
export interface GAEvent {
	// The hit type, which is always "event" for this implementation
	hitType: "event";,
	// The category of the event
	eventCategory: string;
	// The action of the event
	eventAction: string,;
	// Optional fields
	eventLabel?: string;
	eventValue?: number;,
}

// Export a function to send a Google Analytics event
export function sendAnalyticsEvent({
	// Destructure the event properties from the input object
	eventCategory,
	eventAction,
	eventLabel,
	eventValue,
}: Omit<GAEvent, "hitType">): void {
	// Create a new GAEvent object with the mandatory fields
	const event: GAEvent = {
		hitType: "event",
		eventCategory,
		eventAction,
	};

	// Add any optional fields to the event object
	if (eventLabel) {
		event.eventLabel = eventLabel;
	}
	if (eventValue) {
		event.eventValue = eventValue;
	}

	// Check if the gtag function is available on the window object
	// and if it's a function (to avoid errors when calling it)
	if (window?.gtag && typeof window.gtag === "function") {
		// Call the gtag function with the event parameters
		window.gtag("event", eventAction, {
			// Map the event properties to the expected parameter names
			event_category: event.eventCategory,
			event_label: event.eventLabel,
			value: event.eventValue,
		});
	}
}
