// This function converts a file into a base64 string
const file2base64 = (file: File): Promise<string> => {
  // Return a new promise that resolves to a string
  return new Promise<string>((resolve, reject) => {
    // Create a new FileReader object
    const reader = new FileReader();
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
    
    // When the file has been loaded
    reader.onload = () => {
      // Get the data URL result
      const dataUrl = reader.result as string;
      
      // Split the data URL to get the base64 string
      const base64 = dataUrl.split(",")[1];
      
      // Resolve the promise with the base64 string
      resolve(base64);
    };
    
    // If there was an error reading the file
    reader.onerror = (error) => {
      // Reject the promise with the error
      reject(error);
    };
  });
};

// Export the file2base64 function as the default export
export default file2base64;
