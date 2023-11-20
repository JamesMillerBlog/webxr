import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { ACM, Cognito, DynamoDb, SecretsManager } from "./resources";
import { BASE_SECRET_NAME, NAME, PROJECT_STACK } from "./common";
import { Secrets } from './types'

export interface SharedResources {
  deploymentVersion: string | pulumi.Output<string>;
  edgeCertificationArn: string | pulumi.Output<string>;
  regionalCertificateArn: string | pulumi.Output<string>;
  cognitoUserPoolArn: pulumi.Output<string>;
}

export class Shared extends pulumi.ComponentResource {
  public deploymentVersion: string | pulumi.Output<string> | undefined;
  public edgeCertNeedsToBeGenerated: pulumi.Output<string> | undefined;
  public edgeCertificationArn: string | pulumi.Output<string> | undefined;
  public regionalCertificateArn: string | pulumi.Output<string> | undefined;
  public cognitoUserPoolArn: pulumi.Output<string> | undefined;

  constructor(opts?: pulumi.ResourceOptions) {
    super("Shared", `${NAME}_shared`, {}, opts, undefined);
  }

  dynamoDb(tableName: string, primaryKeyName: string, primaryKeyType: string) {
    return new DynamoDb(
      `${PROJECT_STACK}_${tableName}`,
      this,
      primaryKeyName,
      primaryKeyType,
    );
  }

  cognito(initialUserEmail: string) {
    return new Cognito(
      `${PROJECT_STACK}_cognito`,
      this,
      initialUserEmail,
    )
  }

  acm(isEdge: boolean, domain: string) {
    return new ACM(NAME, aws.config.profile!, domain, isEdge, this);
  }

  secretsManager(secrets:Secrets) {
    return {
      client:  new SecretsManager(`${BASE_SECRET_NAME}-client-local`, secrets.client, this),
      server:  new SecretsManager(`${BASE_SECRET_NAME}-server-local`, secrets.server, this),
    }
  }

  output(resources: SharedResources) {
    const { deploymentVersion, edgeCertificationArn, regionalCertificateArn, cognitoUserPoolArn }= resources;
    this.deploymentVersion = deploymentVersion;
    this.edgeCertificationArn = edgeCertificationArn;
    this.regionalCertificateArn = regionalCertificateArn;
    this.cognitoUserPoolArn = cognitoUserPoolArn;
    this.registerOutputs(resources);
  }
}
