// Import the 'redirect' function from the '@sveltejs/kit' module
import { redirect } from "@sveltejs/kit";

// Define the 'load' function, which is an asynchronous function that takes an object 'params' as an argument
export const load = async ({ params }) => {
  // Redirect the user to the URL "/conversation/{params.id}" with a 302 status code
  throw redirect(3
