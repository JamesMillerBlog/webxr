import { Server } from './Server';
import { DOMAIN, getSharedResources } from '../../shared/infrastructure/common';

(async () => {
  const {
    cognitoUserPoolArn,
    deploymentVersion,
    edgeCertificationArn,
    regionalCertificateArn,
  } = await getSharedResources();
  const server = new Server();

  const { endpoints } = server.restLambda();

  const restApi = server.restApiGateway(
    endpoints,
    edgeCertificationArn,
    cognitoUserPoolArn,
    deploymentVersion,
  );

  const { routes } = server.websocketLambda();

  const websocketApi = server.websocketApiGateway(
    routes,
    regionalCertificateArn,
    deploymentVersion,
  );

  server.route53(DOMAIN, restApi, websocketApi);
})();
