import * as pulumi from "@pulumi/pulumi";
import { Shared } from "./Shared";

const stackConfig = new pulumi.Config();
export const shared = new Shared("wrapperjs:webxr:Shared", stackConfig);