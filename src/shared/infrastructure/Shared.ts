import * as pulumi from "@pulumi/pulumi";
import { SecretsManager } from "./resources";

export class Shared extends pulumi.ComponentResource {
  public secretId: pulumi.Output<string>;
  public secretArn: pulumi.Output<string>;
  public secretVersionArn: pulumi.Output<string>;
  public secretVersionId: pulumi.Output<string>;

  constructor(
    name: string,
    config: pulumi.Config,
    opts?: pulumi.ResourceOptions
  ) {
    super("wrapperjs:webxr:Shared", name, {}, opts);

    const secrets = new SecretsManager('webxr-test-secrets-lol', this)

    this.secretId = secrets.secretId;
    this.secretArn =    secrets.secretArn
    this.secretVersionArn = secrets.secretVersionArn
    this.secretVersionId = secrets.secretVersionId

    this.registerOutputs({
        secretId: secrets.secretId,
        secretArn: secrets.secretArn,
        secretVersionId: secrets.secretVersionId,
        secretVersionArn: secrets.secretVersionArn,
    });
  }
}
