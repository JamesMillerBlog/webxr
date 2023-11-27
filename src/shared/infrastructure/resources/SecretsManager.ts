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
      2. GITHUB CI/CD (add way to create environments through Github UI)



    npm run scripts:generate:client-and-server-envs webxr-shared-dev development
    */

    new aws.secretsmanager.SecretVersion(`${name}_secrets_version`, {
        secretId: secret.id,
        secretString: pulumi.jsonStringify(secrets),
    }, {parent});
  }
}