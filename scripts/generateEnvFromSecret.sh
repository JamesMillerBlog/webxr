#!/bin/bash

# Usage: generate-env.sh <SECRET_NAME> <FILE_LOCATION> <ENV_FILE_NAME>
# e.g: ./generateEnvFromSecret.sh your-secret-name /path/to/files development
# This script retrieves a secret from AWS Secrets Manager, extracts key-value pairs from the 'SecretString', and
# creates or overwrites an environment file with the specified name and location.
#
# Parameters:
#   <SECRET_NAME>      The name or ARN of the secret in AWS Secrets Manager.
#   <FILE_LOCATION>    The location where the environment file will be created.
#   <ENV_FILE_NAME>    The name of the environment file (e.g., development, production, etc.).

# Check if all required parameters are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <SECRET_NAME> <FILE_LOCATION> <ENV_FILE_NAME>"
    exit 1
fi

# AWS Secret Name
SECRET_NAME="$1"

# File location
FILE_LOCATION="$2"

# Env file name
ENV_FILE_NAME="$3"

# Retrieve the secret value from AWS Secrets Manager
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --output json)

# Check if the retrieval was successful
if [ $? -ne 0 ]; then
    echo "Failed to retrieve secret from AWS Secrets Manager"
    exit 1
fi

# Extract values from SecretString dynamically
IFS=$'\n'       
# Set Internal Field Separator to newline
for property in $(echo "$SECRET_JSON" | jq -r '.SecretString | fromjson | to_entries[] | "\(.key)=\(.value)"'); do
    echo "$property"
done > "$FILE_LOCATION/.env.$ENV_FILE_NAME"

echo "Environment file ($FILE_LOCATION/.env.$ENV_FILE_NAME) has been created successfully."