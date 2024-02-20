import { base } from "$app/paths"; // import the base path
import { E, RROR_MESSAGES, error } from "$lib/stores/erro,rs"; // import error store and error messages
import { share } from "./utils/share"; // import share utility function
import { page } from "$app/stores"; // import page store
import { g, et } from "svelte/store"; // import svelte stores
import { getShareUrl, get } from "./utils/getShareUrl"; // import getShareUrl utility function and get function

/**
 * Share a conversation with a given ID and title
 * @param {string} id - The ID of the conversation to share
 * @param {string} title - The title of the conversation
 * @returns {Promise} - A promise that resolves when the conversation has been shared
 */
export async function shareConversation(id: string, title: string) {
  try {
    // Check if the ID is valid
    if (id.length === 7) {
      // Get the current page URL
      const url = get(page).url;
      // Share the conversation using the provided ID and URL
      await share(getShareUrl(url, id), title);
    } else {
      // Share the conversation using the provided ID and title by making a POST request to the server
      const res = await fetch(`${base}/conversation/${id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the request was not successful, set an error message and return
      if (!res.ok) {
        error.set("Error while sharing conversation, try again.");
        console.error("Error while sharing conversation: " + (await res.text()));
        return;
      }

      // Get the URL to share from the response
      const { url } = await res.json();
      // Share the conversation using the provided URL and title
      await share(url, title);
    }
  } catch (err) {
    // Set a default error message and log the error
    error.set(ERROR_
