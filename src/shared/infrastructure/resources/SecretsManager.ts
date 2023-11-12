import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Shared } from "../Shared";
import { ClientSecrets, ServerSecrets } from './../types'

export class SecretsManager {
  // secretId: pulumi.Output<string>;
  // secretArn: pulumi.Output<string>;
  // secretVersionId: pulumi.Output<string>;
  // secretVersionArn: pulumi.Output<string>;

  constructor(name: string, secrets: ClientSecrets | ServerSecrets, parent: Shared) {
    const secret = new aws.secretsmanager.Secret(`${name}36`, {name: `${name}36`}, {parent});
    
    /* 
      1. Replace secrets with pulumi get config and implement pulumi micro stacks
      2. GET GOBBLE WORKING (./aws-mfa.sh)
      3. GITHUB CI/CD
    */

    // (infrastucture secrets, client secrets, server secrets)
    new aws.secretsmanager.SecretVersion(`${name}_secrets_version`, {
        secretId: secret.id,
        secretString: pulumi.jsonStringify(secrets),
    }, {parent});

    // this.secretId = secret.id;
    // this.secretArn = secret.arn;
    // this.secretVersionId = secretVersion.id;
    // this.secretVersionArn = secretVersion.arn;
  }
}