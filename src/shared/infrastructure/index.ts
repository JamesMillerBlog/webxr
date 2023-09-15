import * as pulumi from "@pulumi/pulumi";
import { Shared } from "./Shared";

import { client } from "./../../client/infrastructure"

export const shared = new Shared();

export const contentBuckerUri = client.contentBucketUri;