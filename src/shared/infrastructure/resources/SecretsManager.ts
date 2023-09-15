import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Shared } from "../Shared";
import { NAME } from './../common'; 

export class SecretsManager {
  secretId: pulumi.Output<string>;
  secretArn: pulumi.Output<string>;
  secretVersionId: pulumi.Output<string>;
  secretVersionArn: pulumi.Output<string>;

  constructor(parent: Shared) {
    const secret = new aws.secretsmanager.Secret(`${NAME}-secrets`, {}, {parent});
    
    const secretVersion =  new aws.secretsmanager.SecretVersion(`${NAME}-secrets-version`, {
        secretId: secret.id,
        secretString: "example-string-to-protect",
    }, {parent});

    this.secretId = secret.id;
    this.secretArn = secret.arn;
    this.secretVersionId = secretVersion.id;
    this.secretVersionArn = secretVersion.arn;
  }
}
