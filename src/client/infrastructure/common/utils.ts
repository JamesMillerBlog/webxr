// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
export function getDomainAndSubdomain(domain: string): {
  subdomain: string;
  parentDomain: string;
} {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];

  for (let x = 0; x < parts.length; x++) {
    if (parts.length > 2) {
      parts.shift();
    }
  }

  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: parts.join(".") + ".",
  };
}
