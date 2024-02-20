// This function exports a new function called 'timeout' which takes in three parameters:
// - prom: a Promise of type T
// - time: a number representing the timeout duration in milliseconds
// It returns a new Promise of type T
export const timeout = <T>(prom: Promise<T>, time: number): Promise<T> => {
  // Declare two variables 'timer' and 'deJS' which will be used later in the function
  let timer: NodeJS.Timeout;
  
  // Return a new Promise created by the 'Promise.race' method which takes in an array of Promises
  // The Promise returned by 'Promise.race' will be fulfilled or rejected as soon as one of the Promises
  // in the array is fulfilled or rejected.
  return Promise.race([
    prom, // Include the input Promise 'prom' in the array
    new Promise<T>((_r, rej) => (timer = setTimeout(rej, time))) // Create a new Promise that will be rejected after 'time' milliseconds
  ])
  // The 'finally' method is called on the Promise returned by 'Promise.race'
  // It takes in a callback function that will be called when the Promise is settled (i.e., either fulfilled or rejected)
  .finally(
    // The callback function clears the timeout set by the second Promise in the array
    () => clearTimeout(timer)
  );
};
