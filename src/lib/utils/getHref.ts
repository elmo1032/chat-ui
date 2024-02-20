export function getHref(
	url: URL | string,
	modifications: {
		newKeys?: Record<string, string | undefined | null>;
		existingKeys?: { behaviour: "delete_except" | "delete"; keys: string[] };
	}
) {
	// Create a new URL object based on the input URL
	const newUrl = new URL(url);
	const { newKeys, existingKeys } = modifications;

	// Existing keys logic
	if (existingKeys) {
		const { behaviour, keys } = existingKeys;
		// If the behaviour is to delete specific keys
		if (behaviour === "delete") {
			// Loop through the keys and delete them from the URL's search parameters
			for (const key of keys) {
				newUrl.searchParams.delete(key);
	
