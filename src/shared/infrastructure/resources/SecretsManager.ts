import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { type Shared } from '../Shared';
import { type ClientSecrets, type ServerSecrets } from '../types';

export class SecretsManager {
  name: string;
  constructor(
    name: string,
    secrets: ClientSecrets | ServerSecrets,
    parent: Shared,
  ) {
    this.name = name;
    const secret = new aws.secretsmanager.Secret(
      `${this.name}`,
      { name: this.name },
      { parent },
    );

    new aws.secretsmanager.SecretVersion(
      `${name}_secrets_version`,
      {
        secretId: secret.id,
        secretString: pulumi.jsonStringify(secrets),
      },
      { parent },
    );
  }
}
