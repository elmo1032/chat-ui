// Define a UUID type as the return type of the `crypto.randomUUID()` function
type UUID = ReturnType<typeof crypto.randomUUID>;

// Export a function that generates a random UUID
export function randomUUID(): UUID {
    // Check if the `randomUUID()` function is available in the `crypto` object
    if (!("randomUUID" in crypto)) {
        // If not, define a fallback implementation for generating a UUID
        // Only for old Safari / iOS versions
        return "10000000-1000-4000-8000-100000000000"
            .replace(/[018]/g, (c) => 
                // XOR the character with a random value and convert it to a hexadecimal string
                (
                    Number(c) ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
                ).toString(16)
            ) as UUID;
    }
    // If the `randomUUID()` function is available, use it to generate a UUID
    return crypto.randomUUID();
}
