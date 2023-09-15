import * as pulumi from "@pulumi/pulumi";

export const CONFIG = new pulumi.Config();
export const DOMAIN = CONFIG.require("targetDomain");



export const ORG = pulumi.getOrganization()
export const PROJECT = pulumi.getProject();
export const STACK = pulumi.getStack();
export const NAME = `${ORG}/${PROJECT}/${STACK}`;