// This is an exported function named "sum" that takes in an array of numbers (nums) as an argument
// and returns a single number as a result
export function sum(nums: number[]): number {
  
  // The "reduce" method is used to iterate over each element in the "nums" array and accumulate
  // a value that is returned at the end of the iteration. In this case, we are accumulating
  // the sum of all numbers in the array.
  // The "a" parameter represents the accumulator (the sum in this case), and the "b" parameter
  // represents the current element being processed in the array.
  // The second argument (0) is the initial value of the accumulator.
  return nums.reduce((a, b) => a + b, 0);
  
  // At the end of the iteration, the accumulated sum is returned as the result of the "sum" function
}
