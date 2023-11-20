#!/bin/bash

# Script to initialize Pulumi projects in src/shared/infrastructure, src/server/infrastructure, and src/client/infrastructure

# Source .env file to get environment variables
if [[ -f .env ]]; then
  source .env
else
  echo "Error: .env file not found."
  exit 1
fi

# Directory paths
shared_infra_dir="src/shared/infrastructureTest"
server_infra_dir="src/server/infrastructureTest"
client_infra_dir="src/client/infrastructureTest"

# Function to initialize Pulumi project
initialize_pulumi_project() {
  local project_dir="$1"
  local project_name="$2"
  local project_description="$3"

  # Check if the directory exists
  if [ ! -d "$project_dir" ]; then
    echo "Error: Directory not found - $project_dir"
    return
  fi

  # Run pulumi new command
  pulumi new aws-typescript --name "$project_name" --description "$project_description" --dir ./"$project_dir" --force --yes
}

# Initialize Pulumi projects
initialize_pulumi_project "$shared_infra_dir" "${PROJECT_NAME}-shared" "${PROJECT_NAME}-shared description"
initialize_pulumi_project "$server_infra_dir" "${PROJECT_NAME}-server" "${PROJECT_NAME}-server description"
initialize_pulumi_project "$client_infra_dir" "${PROJECT_NAME}-client" "${PROJECT_NAME}-client description"

echo "Pulumi projects initialized successfully."