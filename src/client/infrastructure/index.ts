import * as pulumi from "@pulumi/pulumi";
import { Client } from "./Client";

const stackConfig = new pulumi.Config();
export const client = new Client("wrapperjs:webxr:Client", stackConfig);
