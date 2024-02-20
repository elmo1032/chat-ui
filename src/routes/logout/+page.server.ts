// Import necessary modules
import { dev } from "$app/environment"; // for checking if the app is in development mode
import { base } from "$app/paths"; // for getting the base path of the app
import { COOKIE_NAME } from "$env/static/private"; // for getting the name of the cookie
import { collections } from "$lib/server/database"; // for accessing the database collections
import { redirect } from "@sveltejs/kit"; // for redirecting the user to a different page

// Define the actions object with a single async function
export const actions = {
  // The default function will be called when the form is submitted
  async default({ cookies, locals }) {
    // Delete the session from the database using the sessionId from the locals object
    await collections.sessions.deleteOne({ sessionId: locals.sessionId });

    // Delete the cookie with the name COOKIE_NAME
    cookies.delete(COOKIE_NAME, {
      // Set the path to "/" so that the cookie is valid for the entire site
      path: "/",
      // Allow the cookie to be sent with cross-origin requests if the app is in production mode
      sameSite: dev ? "lax" : "none",
      // Set the secure flag to true if the app is in production mode
      secure: !dev,
      // Set the httpOnly flag to true to prevent client-side scripts from accessing the cookie
      httpOnly: true,
    });

    // Redirect the user to the home page with a 303 status code
    throw redirect(303, `${base}/`);
  },
};
