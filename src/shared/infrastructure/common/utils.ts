import * as aws from 'aws-sdk';
import { SharedResources } from "../Shared";
import { SHARED_STACK } from "./consts";
import { REGION } from '../common';

aws.config.update({region: REGION});

export const getDomainAndSubdomain = (domain: string): {
  subdomain: string;
  parentDomain: string;
} => {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  } else if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];

  for (let x = 0; x < parts.length; x++) {
    if (parts.length > 2) {
      parts.shift();
    }
  }

  return {
    subdomain,
    parentDomain: parts.join(".") + ".",
  };
}


export const getSharedResources = async () => {
  const {
    cognitoUserPoolArn,
    deploymentVersion,
    edgeCertificationArn,
    regionalCertificateArn,
  }: SharedResources = await SHARED_STACK.requireOutputValue('shared');
  
  if (
    !cognitoUserPoolArn ||
    !deploymentVersion ||
    !edgeCertificationArn ||
    !regionalCertificateArn
  ) {
    throw new Error('Shared resources need to be created, rerun shared stack');
  }
  return {
    cognitoUserPoolArn: String(cognitoUserPoolArn),
    deploymentVersion: String(deploymentVersion),
    edgeCertificationArn: String(edgeCertificationArn),
    regionalCertificateArn: String(regionalCertificateArn),
  };
};