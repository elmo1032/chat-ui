// This is an async function named "share" that takes three parameters:
// - url: a required string representing the URL to be shared
// - title: a required string representing the title of the content being shared
// - text: an optional string representing additional text to be shared along with the URL
export async function share(url: string, title: string, text?: string) {
  // Check if the "navigator.share" method is available in the user's browser
  if (navigator.share) {
    // If it is, use it to share the URL and title
    try {
      await navigator.share({ url, title, text });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  } else {
    // If "navigator.share" is not available, use "navigator.clipboard.writeText"
    // to copy the URL to the user's clipboard instead
    try {
      await navigator.clipboard.writeText(url);
      console.log("URL copied to clipboard:", url);
    } catch (error) {
      console.error("Error copying URL to clipboard:", error);
    }
  }
}
