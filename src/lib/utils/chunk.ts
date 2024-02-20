/**
 * Chunk array into arrays of length at most `chunkSize`
 *
 * @param chunkSize must be greater than or equal to 1
 */
export function chunk<T extends unknown[] | string>(arr: T, chunkSize: number): T[] {
    // Check if `chunkSize` is a valid number and is greater than or equal to 1
    if (isNaN(chunkSize) || chunkSize < 1) {
        throw new RangeError("Invalid chunk size: " + chunkSize);
    }

    // If the array is empty, return an empty array
    if (!arr.length) {
        return [];
    }

    // Small optimization to not chunk arrays unless needed
    if (arr.length <= chunkSize) {
        return [arr];
    }

    // Use the `range` function to create an array of indices, then use the `map` function to extract the corresponding
    // elements from the original array
    return range(Math.ceil(arr.length / chunkSize)).map((i) => {
        return arr.slice(i * chunkSize, (i + 1) * chunkSize);
    }) as T[];
}

/**
 * Create an array of numbers from `n` to `b` (exclusive)
 *
 * @param n The start of the range
 * @param b The end of the range (optional)
 */
function range(n: number, b?: number): number[] {
    // If `b` is not provided, create an array of numbers from 0 to `n` (exclusive)
    if (b === undefined) {
        return Array(n).fill(0).map((_, i) => i);
    }

    // Create an array of numbers from `n` to `b` (exclusive)
    return Array(b - n).fill(0).map((_, i) => n + i);
}
