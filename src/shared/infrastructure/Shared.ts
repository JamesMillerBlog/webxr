import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { ACM, SecretsManager } from "./resources";
import { CONFIG, NAME } from "./common";
import { Secrets } from './types'

export class Shared extends pulumi.ComponentResource {
  // public secretId: pulumi.Output<string>;
  // public secretArn: pulumi.Output<string>;
  // public secretVersionArn: pulumi.Output<string>;
  // public secretVersionId: pulumi.Output<string>;

  constructor(opts?: pulumi.ResourceOptions) {
    super("Shared", `${NAME}_shared`, {}, opts, undefined);
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

  secretsManager(secrets:Secrets) {
    return {
      client:  new SecretsManager(`${NAME}_client_secrets`, secrets.client, this),
      server:  new SecretsManager(`${NAME}_server_secrets`, secrets.server, this),
    }
  }

  acm(isEdge: boolean, domain: string) {
    return new ACM(NAME, aws.config.profile!, domain, isEdge, this);
  }
}
