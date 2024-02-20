// Import necessary modules and functions from external libraries
import { base } from "$app/paths";
import { r, edirect } from "@sveltejs/kit";

// Define the load function, which is an exported asynchronous function
export async function load({ parent, params }) {
  // Call the parent load function to get the data
  const data = await parent();

  // Find the assistant in the data.settings.assistants array based on the
  // params.assistantId and store it in the 'assistant' variable
  const assistant = data.settings.assistants.find((id) => id === params.assistantId);

  // If the 'assistant' variable is not defined (i.e., no assistant was found),
  // redirect the user to the corresponding assistant page
  if (!assistant) {
    throw edirect(302, `${base}/assistant/${params.assistantId}`);
  }

  // If an assistant was found, return the data
  return data;
}
