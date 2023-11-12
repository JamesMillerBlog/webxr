import * as pulumi from '@pulumi/pulumi';
import {
  DOMAIN,
  NAME,
  PROJECT_STACK,
} from '../../shared/infrastructure/common';
import {
  DynamoDb,
  RestApiGateway,
  WebsocketApiGateway,
  Cognito,
  Route53,
  RestLambda,
  WebsocketLambda,
} from './resources';
import { ACM } from '../../shared/infrastructure/resources';

export class Server extends pulumi.ComponentResource {
  public usersTableId: pulumi.Output<string>;
  public socketConnectionsTableId: pulumi.Output<string>;
  public cognitoIdentityPoolId: pulumi.Output<string>;
  public cognitoUserPoolClientId: pulumi.Output<string>;
  public cognitoUserPoolId: pulumi.Output<string>;

  constructor(
    edgeCert: ACM,
    regionalCert: ACM,
    deploymentVersion: string,
    opts?: pulumi.ResourceOptions,
  ) {
    super('Server', `${NAME}_server`, {}, opts, undefined);

    const cognito = new Cognito(
      `${PROJECT_STACK}_cognito`,
      this,
      'hi@jamesmiller.blog',
    );

    const { endpoints } = new RestLambda(this, PROJECT_STACK);
    const { routes } = new WebsocketLambda(this, `${PROJECT_STACK}_websockets`);

    const restApiGateway = new RestApiGateway(
      this,
      `${PROJECT_STACK}_rest_api`,
      edgeCert,
      endpoints,
      cognito.userPoolArn,
      deploymentVersion,
    );

    const websocketApiGateway = new WebsocketApiGateway(
      this,
      `${PROJECT_STACK}_websockets_api`,
      regionalCert,
      routes,
      deploymentVersion,
    );

    new Route53(DOMAIN, restApiGateway, websocketApiGateway, this);

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
