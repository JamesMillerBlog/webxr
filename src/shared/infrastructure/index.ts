import * as pulumi from "@pulumi/pulumi";
import { Shared } from "./Shared";

import { client } from "./../../client/infrastructure"

const config = new pulumi.Config();
export const shared = new Shared("wrapperjs:webxr:Shared", config);

export const contentBuckerUri = client.contentBucketUri;