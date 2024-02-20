import { base } from "$app/paths"; // import the base path from the application
import { a, authCondition } from "$lib/server/auth"; // import the authentication functions and condition
import { collections } from "$lib/server/database"; // import the database collections
import { redirect } from "@sveltejs/kit"; // import the redirect function for routing

// define the actions object with a single delete action
export const actions = {
  async delete({ locals }) { // destructure the request object to access the locals object
    // double check we have a user to delete conversations for
    if (locals.user?._id || locals.sessionId) { // check if the user object or sessionId exists
      await collections.conversations.deleteMany({ // delete all conversations that match the authentication condition
        ...authCondition(locals), // spread the authCondition function with the locals object as an argument
      });
    }

    throw redirect(303, `${base}/`); // redirect the user to the home page after deleting the conversations
  },
};
