import { Client } from "./Client";
import { DOMAIN, getSharedResources } from "../../shared/infrastructure/common";

(async () => {
  const { deploymentVersion, edgeCertificationArn } =
    await getSharedResources();

  const client = new Client();

  const s3 = client.s3(DOMAIN);

  s3.initiateFileUpload(deploymentVersion);

  const { originAccessIdentity, cdn } = client.cloudfront(
    edgeCertificationArn,
    s3.contentBucket,
    DOMAIN
  );

  s3.attachBucketPolicy(s3.contentBucket, originAccessIdentity);

  client.route53(DOMAIN, cdn.domainName, cdn.hostedZoneId);
})();
