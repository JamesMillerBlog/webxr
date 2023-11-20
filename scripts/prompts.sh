#!/bin/bash

# prompts.sh - Script to interactively prompt the user for information and generate a .env file.

# Usage:
#   1. Run this script in a Bash environment.
#   2. Follow the prompts to enter the requested information.
#   3. Ensure that the provided values are not blank or contain only spaces.
#   4. The script will generate a .env file with the entered values.

# Function to check if a variable is blank or contains only spaces
validate_not_blank() {
  if [[ -z "$1" || "$1" =~ ^\ +$ ]]; then
    echo "Invalid input. The value cannot be blank or contain only spaces."
    exit 1
  fi
}

# Function to validate domain name
validate_domain() {
  # Check if the domain name contains http:// or https://
  if [[ $DOMAIN_NAME =~ ^https?:// ]]; then
    echo "Invalid domain name. Please provide the domain name without http:// or https://"
    exit 1
  fi

  validate_not_blank "$DOMAIN_NAME"

  # Check if the domain name contains .com or any other valid extension
  if [[ ! $DOMAIN_NAME =~ \..* ]]; then
    echo "Invalid domain name. It must contain a valid domain extension like .com"
    exit 1
  fi
}

# Function to validate AWS region
validate_aws_region() {
  validate_not_blank "$AWS_REGION"

  # Check if AWS_REGION matches the expected format
  if [[ ! $AWS_REGION =~ .*-.* ]]; then
    echo "Invalid AWS region. It must be in the format *-*-"
    exit 1
  fi
}

# Function to validate initial user email
validate_initial_user_email() {
  validate_not_blank "$INITIAL_USER_EMAIL"

  # Check if INITIAL_USER_EMAIL matches the expected format
  if [[ ! $INITIAL_USER_EMAIL =~ .*@.* ]]; then
    echo "Invalid initial user email. It must be in the format *@*.*"
    exit 1
  fi
}

# Function to read existing values from .env file
read_existing_values() {
  if [[ -f .env ]]; then
    source .env
  fi
}

# Display usage notes
echo "Usage:"
echo "1. Enter the requested information when prompted."
echo "2. Ensure that the provided values are not blank or contain only spaces."
echo "3. The script will generate a .env file with the entered values."
echo ""

# Read existing values from .env file
read_existing_values

# Prompt the user for input
read -p "Enter domain name: " DOMAIN_NAME
validate_domain

read -p "Enter Ready Player Me Subdomain: " READY_PLAYER_ME
validate_not_blank "$READY_PLAYER_ME"

read -p "Enter name of project: " PROJECT_NAME
validate_not_blank "$PROJECT_NAME"

read -p "Enter AWS region: " AWS_REGION
validate_aws_region

read -p "Enter initial user: " INITIAL_USER_EMAIL
validate_initial_user_email

# Add or update the variables in the .env file
env_file=".env"
for var in DOMAIN_NAME READY_PLAYER_ME PROJECT_NAME AWS_REGION INITIAL_USER_EMAIL; do
  value=$(eval echo "\$$var")
  if [[ -z "$value" ]]; then
    # If the variable is empty, skip it
    continue
  fi

  if grep -q "^$var=" "$env_file"; then
    # Update the existing variable
    sed -i -E "s|^$var=.*$|$var=$value|" "$env_file"
  else
    # Add the new variable
    echo "$var=$value" >> "$env_file"
  fi
done