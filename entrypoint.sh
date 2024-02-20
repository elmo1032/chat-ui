# Define the local environment variable file path
ENV_LOCAL_PATH=/app/.env.local

# Check if DOTENV_LOCAL is set in the environment variables
if test -z "${DOTENV_LOCAL}"; then
    # If DOTENV_LOCAL is not set, check if the .env.local file exists
    if ! test -f "${ENV_LOCAL_PATH}"; then
        # If .env.local does not exist, use the default .env config
        echo "DOTENV_LOCAL was not found in the ENV variables and .env.local is not set using a bind volume. We are using the default .env config."
    fi;
else
    # If DOTENV_LOCAL is set, create the .env.local file
    echo "DOTENV_LOCAL was found in the ENV variables. Creating .env.local file."
    echo "${DOTENV_LOCAL}" > "${ENV_LOCAL_PATH}"
fi;

# Check if INCLUDE_DB is set to true
if [ "${INCLUDE_DB}" = "true" ]; then
    echo "INCLUDE_DB is set to true."

    # Define the MongoDB config
    MONGODB_CONFIG="MONGODB_URL=mongodb://localhost:27017"
    # Check if the MongoDB config is already in the .env.local file
    if ! grep -q "^${MONGODB_CONFIG}$" "${ENV_LOCAL_PATH}"; then
      # If the MongoDB config is not in the .env.local file, append it
      echo "Appending MONGODB_URL"
      touch /app/.env.local
      echo -e "\n${MONGODB_CONFIG}" >> "${ENV_LOCAL_PATH}"
    fi

    # Create the necessary directories for MongoDB
    mkdir -p /data/db
    # Start the local MongoDB instance
    mongod &
    echo "Starting local MongoDB instance."
fi;

# Build and preview the application
npm run build
npm run preview -- --host 0.0
