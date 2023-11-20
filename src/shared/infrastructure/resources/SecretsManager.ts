import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Shared } from "../Shared";
import { ClientSecrets, ServerSecrets } from '../types'

export class SecretsManager {
  name: string;
  constructor(name: string, secrets: ClientSecrets | ServerSecrets, parent: Shared) {
    // needs updating
    this.name = name;
    const secret = new aws.secretsmanager.Secret(`${this.name}`, {name: this.name}, {parent});
    
    /* 
      1. Update unwrap and gobble commands
        - 'setup' bash script to ask what 
            domain name
            ready player me username
            name of project (webxr) ** used to generate 3 s3 bucket unique names
            region
            init user (hi@jamesmiller.blog)


        - setup should overwrite Pulumi.yaml's and create 3 s3 buckets for state
        
        - use those details to set a config, with --secret for domain name and ready player me
        - should take this opportunity to log into pulumi on that s3 bucket and select stack
        - use those config --secret details to create a secret with pulumi that ignoreChanges those props (manual inputs)
        - get (non-local) secrets for env (client only)
        - duplicate secret (for PRs)
        - finished (destroy s3 state buckets)
      2. GITHUB CI/CD (add way to create environments through Github UI)


      IN THE NEW SECRET SHOULD BE:
      - name of project 
      - init user
      - ready player me
      - domain name


     MAKE CURRENT SECRET NOT LOCAL, NEW SECRET MUST BE IS LOCAL,

    S3 bucket naming example:
      webxr-shared-pulumi-backend-state
      webxr-client-pulumi-backend-state
      webxr-server-pulumi-backend-state
    


    npm run scripts:generate:client-and-server-envs webxr-shared-dev development
    */

    new aws.secretsmanager.SecretVersion(`${name}_secrets_version`, {
        secretId: secret.id,
        secretString: pulumi.jsonStringify(secrets),
    }, {parent});
  }
}