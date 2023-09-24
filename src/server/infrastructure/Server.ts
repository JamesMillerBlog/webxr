import * as pulumi from '@pulumi/pulumi';
import { NAME, PROJECT_STACK } from '../../shared/infrastructure/common';
import {
  DynamoDb,
  RestApiGateway,
  WebsocketApiGateway,
  Cognito,
} from './resources';

export class Server extends pulumi.ComponentResource {
  public usersTableId: pulumi.Output<string>;
  public socketConnectionsTableId: pulumi.Output<string>;
  public cognitoIdentityPoolId: pulumi.Output<string>;
  // public cognitoUserPoolClientArn: pulumi.Output<string>;
  public cognitoUserPoolClientId: pulumi.Output<string>;
  public cognitoUserPoolId: pulumi.Output<string>;

  constructor(opts?: pulumi.ResourceOptions) {
    super('Server', `${NAME}_server`, {}, opts, undefined);

    new RestApiGateway(this, `${PROJECT_STACK}_rest_api`);
    new WebsocketApiGateway(this, `${PROJECT_STACK}_websockets_api`);

    const usersTable = new DynamoDb(
      `${PROJECT_STACK}_users_table`,
      this,
      'uid',
      'S',
    );
    const socketConnectionsTable = new DynamoDb(
      `${PROJECT_STACK}_socket_connections_table`,
      this,
      'connectionId',
      'S',
    );

    const cognito = new Cognito(
      `${PROJECT_STACK}_cognito`,
      this,
      'hi@jamesmiller.blog',
    );

    this.usersTableId = usersTable.id;
    this.socketConnectionsTableId = socketConnectionsTable.id;
    this.cognitoIdentityPoolId = cognito.identityPoolId;
    // this.cognitoUserPoolClientArn = cognito.userPoolClientArn;
    this.cognitoUserPoolClientId = cognito.userPoolClientId;
    this.cognitoUserPoolId = cognito.userPoolId;

    this.registerOutputs({
      usersTableId: this.usersTableId,
      socketConnectionsTableId: this.socketConnectionsTableId,
      cognitoIdentityPoolId: this.cognitoIdentityPoolId,
      // cognitoUserPoolClientArn: this.cognitoUserPoolClientArn,
      cognitoUserPoolClientId: this.cognitoUserPoolClientId,
      cognitoUserPoolId: this.cognitoUserPoolId,
    });
  }
}
