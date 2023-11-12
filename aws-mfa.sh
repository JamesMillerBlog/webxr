#!/bin/bash

# Set the profile you want to use for MFA
SOURCE_PROFILE="default"
MFA_PROFILE="default"

# Read the MFA device ARN from the credentials file
MFA_DEVICE_ARN=$(aws configure get mfa_device_arn --profile $SOURCE_PROFILE)
if [ -z "$MFA_DEVICE_ARN" ]; then
  echo "Error: MFA device ARN not found in the ~/.aws/credentials file for profile $SOURCE_PROFILE"
  exit 1
fi

echo "Enter your MFA token code:"
read MFA_CODE

# Get the temporary credentials
CREDENTIALS=$(aws sts get-session-token \
  --serial-number "$MFA_DEVICE_ARN" \
  --token-code "$MFA_CODE" \
  --profile "$SOURCE_PROFILE" \
  --output json 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "Error: Failed to obtain temporary credentials. Please check your MFA token code and try again."
  exit 1
fi

# Extract the credentials from the JSON response
ACCESS_KEY=$(echo "$CREDENTIALS" | jq -r '.Credentials.AccessKeyId')
SECRET_KEY=$(echo "$CREDENTIALS" | jq -r '.Credentials.SecretAccessKey')
SESSION_TOKEN=$(echo "$CREDENTIALS" | jq -r '.Credentials.SessionToken')
EXPIRATION=$(echo "$CREDENTIALS" | jq -r '.Credentials.Expiration')

# Check if the credentials are not empty
if [ -z "$ACCESS_KEY" ] || [ -z "$SECRET_KEY" ] || [ -z "$SESSION_TOKEN" ]; then
  echo "Error: Failed to parse temporary credentials. Please try again."
  exit 1
fi

# Store the temporary credentials in the mfa profile
aws configure set aws_access_key_id "$ACCESS_KEY" --profile "$MFA_PROFILE"
aws configure set aws_secret_access_key "$SECRET_KEY" --profile "$MFA_PROFILE"
aws configure set aws_session_token "$SESSION_TOKEN" --profile "$MFA_PROFILE"

echo "Temporary credentials have been set for the '$MFA_PROFILE' profile. They will expire on $EXPIRATION."