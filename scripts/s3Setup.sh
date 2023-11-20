#!/bin/bash

# s3Setup.sh - Script to create S3 buckets based on environment variables in .env file.

# Usage:
#   1. Ensure that the AWS CLI is configured with the necessary credentials and default region.
#   2. Create a .env file with the following environment variables:
#      - PROJECT_NAME: The name of the project.
#      - AWS_REGION: The AWS region where S3 buckets will be created.
#   3. Run this script in a Bash environment.
#   4. The script attempts to create three S3 buckets with the following naming conventions:
#      - ${PROJECT_NAME}-shared-pulumi-backend-state
#      - ${PROJECT_NAME}-client-pulumi-backend-state
#      - ${PROJECT_NAME}-server-pulumi-backend-state
#   5. If AWS CLI is not configured, it displays an error message and exits with an error status.
#   6. If bucket creation is unnecessary or unsuccessful, it logs an appropriate message and exits with an error status.
#   7. If successful, it generates a .env file with the bucket names.

# Function to check if the AWS CLI is configured
check_aws_cli() {
  aws s3 ls &>/dev/null
  if [ $? -ne 0 ]; then
    echo "Error: AWS CLI is not configured. Please run 'aws configure' to set up your credentials and default region."
    exit 1
  fi
}

# Function to read existing values from .env file
read_existing_values() {
  if [[ -f .env ]]; then
    source .env
  fi
}

# Function to check if S3 buckets already exist
check_s3_buckets_exist() {
  local buckets=("s3://${PROJECT_NAME}-shared-pulumi-backend-state" "s3://${PROJECT_NAME}-client-pulumi-backend-state" "s3://${PROJECT_NAME}-server-pulumi-backend-state")

  for bucket in "${buckets[@]}"; do
    if aws s3api head-bucket --bucket "$(basename "$bucket")" 2>/dev/null; then
      echo "Bucket $bucket already exists. Skipping bucket creation."
      return 0
    fi
  done

  return 1
}

# Check if the AWS CLI is configured
check_aws_cli

# Read existing values from .env file
read_existing_values

# Source the .env file to get the environment variables
if [[ -f .env ]]; then
  source .env
else
  echo "Error: .env file not found."
  exit 1
fi

# Function to create an S3 bucket
create_s3_bucket() {
  local bucket_name=$1

  aws s3api create-bucket \
    --bucket "$bucket_name" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"

  # Check the exit status of the aws s3api command
  local status=$?

  if [ $status -ne 0 ]; then
    # Check if the error contains "BucketAlreadyOwnedByYou"
    local error_message=$(aws s3api create-bucket --bucket "$bucket_name" --create-bucket-configuration LocationConstraint="$AWS_REGION" 2>&1 >/dev/null)
    if [[ $error_message == *"BucketAlreadyOwnedByYou"* ]]; then
      echo "Bucket $bucket_name already owned by you. Skipping bucket creation."
      return 0
    else
      echo "Failed to create S3 bucket: $bucket_name"
      return 1
    fi
  fi

  echo "S3 bucket created successfully: $bucket_name"
}

# Function to delete an S3 bucket
delete_s3_bucket() {
  local bucket_name=$1

  aws s3api delete-bucket --bucket "$bucket_name"

  # Check the exit status of the aws s3api command
  if [ $? -ne 0 ]; then
    echo "Failed to delete S3 bucket: $bucket_name"
  else
    echo "S3 bucket deleted successfully: $bucket_name"
  fi
}

# Function to clean up and delete S3 buckets
cleanup_and_exit() {
  local buckets=("${PROJECT_NAME}-shared-pulumi-backend-state" "${PROJECT_NAME}-client-pulumi-backend-state" "${PROJECT_NAME}-server-pulumi-backend-state")

  echo "Failed to create S3 buckets. Cleaning up..."

  # Delete any created buckets
  for bucket in "${buckets[@]}"; do
    delete_s3_bucket "$bucket"
  done

  exit 1
}

# Attempt to create S3 buckets
create_s3_bucket "${PROJECT_NAME}-shared-pulumi-backend-state" || cleanup_and_exit
create_s3_bucket "${PROJECT_NAME}-client-pulumi-backend-state" || cleanup_and_exit
create_s3_bucket "${PROJECT_NAME}-server-pulumi-backend-state" || cleanup_and_exit

# Read the existing values from .env file
if [[ -f .env ]]; then
  source .env
fi

# Add or update the variables in the .env file
env_file=".env"

# Loop through the new answers and update or add them to the .env file
for var in SHARED_STATE_BUCKET SERVER_STATE_BUCKET CLIENT_STATE_BUCKET; do
  if [[ -z "${!var}" ]]; then
    # If the variable is empty, add it to the .env file
    echo "$var=${PROJECT_NAME}-${var,,}-pulumi-backend-state" >> "$env_file"
  else
    # Update the existing variable
    sed -i "s/^$var=.*/$var=${PROJECT_NAME}-${var,,}-pulumi-backend-state/" "$env_file"
  fi
done

echo ".env file updated successfully with S3 bucket names."