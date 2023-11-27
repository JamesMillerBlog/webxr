import { dynamodb } from '@pulumi/aws';
import { Shared } from '../Shared';
import * as pulumi from '@pulumi/pulumi';

export class DynamoDb {
  id: pulumi.Output<string>;
  table: dynamodb.Table;

  constructor(
    name: string,
    parent: Shared,
    hashKey: string,
    hashKeyType: string,
    rangeKey?: string,
    rangeKeyType?: string,
  ) {
    const hash = {
      name: hashKey,
      type: hashKeyType,
    };
    const attributes = [hash];

    if (rangeKey && rangeKeyType) {
      const range = {
        name: rangeKey,
        type: rangeKeyType,
      };
      attributes.push(range);
    }

    this.table = new dynamodb.Table(
      name,
      {
        name,
        attributes,
        hashKey,
        readCapacity: 20,
        writeCapacity: 20,
      },
      { parent },
    );

    this.id = this.table.id;
  }
}
