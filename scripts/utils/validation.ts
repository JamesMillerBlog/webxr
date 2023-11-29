// Function to check if a variable is blank or contains only spaces
export const validateNotBlank = (input: string): void => {
  if (!input.trim()) {
    console.log(
      'Invalid input. The value cannot be blank or contain only spaces.',
    );
    process.exit(1);
  }
};

// Function to validate domain name
export const validateDomain = (domain: string): void => {
  if (domain.match(/^https?:\/\//)) {
    console.log(
      'Invalid domain name. Please provide the domain name without http:// or https://',
    );
    process.exit(1);
  }

  validateNotBlank(domain);

  if (!domain.match(/\..*$/)) {
    console.log('Invalid domain name. It must end with .*');
    process.exit(1);
  }
};

// Function to validate Ready Player Me subdomain
export const validateReadyPlayerMeSubdomain = (subdomain: string): void => {
  if (subdomain.match(/^https?:\/\//)) {
    console.log(
      'Invalid Ready Player Me subdomain. It cannot start with http:// or https://',
    );
    process.exit(1);
  }

  if (subdomain.includes('.')) {
    console.log(
      "Invalid Ready Player Me subdomain. It cannot contain a period ('.')",
    );
    process.exit(1);
  }

  validateNotBlank(subdomain);
};

// Function to validate AWS region
export const validateAwsRegion = (awsRegion: string): void => {
  validateNotBlank(awsRegion);

  if (!awsRegion.match(/^.*-.*-.*$/)) {
    console.log(
      'Invalid AWS region. It must be in the format *-*-*. Example: us-east-1',
    );
    process.exit(1);
  }
};
