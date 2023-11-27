import * as pulumi from "@pulumi/pulumi";

export const CONFIG = new pulumi.Config();
export const DOMAIN = CONFIG.require("targetDomain");
export const PROJECT_SHARED_RESOURCES = CONFIG.require("projectSharedResources");
export const REGION = CONFIG.require("region")

export const ORG = pulumi.getOrganization()
export const PROJECT = pulumi.getProject();
export const STACK = pulumi.getStack();

export const NAME = `${ORG}_${PROJECT}_${STACK}`;
export const PROJECT_STACK = `${PROJECT}_${STACK}`;
export const BASE_SECRET_NAME = `${PROJECT.replace('-shared', '')}`;
export const SHARED_STACK = new pulumi.StackReference(
`${ORG}/${PROJECT_SHARED_RESOURCES}/${STACK}`,
);

export const TEN_MINUTES = 60 * 10;
