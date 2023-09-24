import * as pulumi from "@pulumi/pulumi";
import { SecretsManager } from "./resources";
import { NAME } from "./common";
import { Secrets } from './types'

export class Shared extends pulumi.ComponentResource {
  // public secretId: pulumi.Output<string>;
  // public secretArn: pulumi.Output<string>;
  // public secretVersionArn: pulumi.Output<string>;
  // public secretVersionId: pulumi.Output<string>;

  constructor(secrets:Secrets, opts?: pulumi.ResourceOptions) {
    super("Shared", `${NAME}_shared`, {}, opts, undefined);

    new SecretsManager(`${NAME}_server_secrets`, secrets.server, this)
    new SecretsManager(`${NAME}_client_secrets`, secrets.client, this)
    // const {secretId, secretArn, secretVersionArn, secretVersionId} = secretsManager;

    // this.secretId = secretId;
    // this.secretArn = secretArn
    // this.secretVersionArn = secretVersionArn
    // this.secretVersionId = secretVersionId

    // this.registerOutputs({
    //     secretId: this.secretId,
    //     secretArn: this.secretArn,
    //     secretVersionId: this.secretVersionId,
    //     secretVersionArn: this.secretVersionArn,
    // });
  }
}
