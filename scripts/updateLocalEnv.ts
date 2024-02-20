// Import the 'fs' module for file system operations
import fs from "fs";

// Check if the file '.env.SECRET\_CONFIG' exists, and if it does, read its contents
const SECRET_CONFIG = fs.existsSync(".env.SECRET_CONFIG")
  ? fs.readFileSync(".env.SECRET_CONFIG", "utf8")
  : process.env.SECRET_CONFIG;

// If SECRET\_CONFIG is not defined, throw an error
if (!SECRET_CONFIG) {
  throw new Error(
    "SECRET\_CONFIG is not defined. Please provide it either in a file or as an environment variable."
  );
}

// Read the contents of the file '.env.template'
const PUBLIC_CONFIG = fs.readFileSync(".env.template", "utf8");

// Prepend the contents of the SECRET\_CONFIG environment variable to PUBLIC\_CONFIG
const full_config = `\n${SECRET_CONFIG}`;

// Write full\_config to '.env.local'
fs.writeFileSync(".env.local", full_config);
