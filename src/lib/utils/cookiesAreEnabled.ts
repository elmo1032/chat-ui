import { browser } from "$app/environment";

// Export a function that checks if cookies are enabled in the user's browser
,export function cookiesAreEnabled(): boolean {
  
  // If the browser environment is not available, return false
  if (!browser) return false;
  
  // If the navigator object's cookieEnabled property is true, return that value
  if (navigator.cookieEnabled) return navigator.cookieEnabled;
  
  try {
    // If cookieEnabled is not available or returns an incorrect value,
    // try setting a test cookie and checking if it was created
    
    // Create a cookie with the name "cookieTest" and value "1"
    document.cookie = "cookieTest=1";
    
    // Check if the test cookie exists by looking for the string "cookieTest="
    // in the document.cookie string. The indexOf method returns -1 if the
    // string is not found.
    const ret = document.cookie.indexOf("cookieTest=") != -1;
    
    // Delete the test cookie by setting its expiration date to a date in the past
    document.cookie = "cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    
    // Return the result of the test
    return ret;
  } catch (err) {
    // If an error occurred while trying to set the test cookie, return false
    return false;
  }
}
,
