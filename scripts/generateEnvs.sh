#!/bin/bash

# Usage: generate-multiple-envs.sh <BASE_NAME> <ENVIRONMENT>
# eg: ./generate-multiple-envs.sh webxr-shared-dev development

# This script calls the generate-env.sh script with different parameters for server and client environments.
#
# Parameters:
#   <BASE_NAME>    The base name for the environments.
#   <ENVIRONMENT>  The environment (e.g., development, production, etc.).

# Check if all required parameters are provided

# Check if all required parameters are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <BASE_NAME> <ENVIRONMENT>"
    exit 1
fi

# Base name for the environments
BASE_NAME="$1"

# Environment (e.g., development, production, etc.)
ENVIRONMENT="$2"

# Call the generate env script with parameters for server local environment (auto generated)
./scripts/generateEnvFromSecret.sh "${BASE_NAME}-server-local" ./src/server "$ENVIRONMENT.local"

# Call the generate env script with parameters for server environment (manually configured)
# ./scripts/generateEnvFromSecret.sh "${BASE_NAME}-server" ./src/server "$ENVIRONMENT"

# Call the generate env script with parameters for client local environment (auto generated)
./scripts/generateEnvFromSecret.sh "${BASE_NAME}-client-local" ./src/client "$ENVIRONMENT.local"

# Call the generate env script with parameters for client environment (manually configured)
# ./scripts/generateEnvFromSecret.sh "${BASE_NAME}-client" ./src/client "$ENVIRONMENT"

echo "Environment files have been created successfully for both server and client."