"use client";

import { Device } from "../stores";
import { DOMAIN_NAME, IS_LOCAL } from "./consts";

export const checkDevice = async () => {
  if (typeof navigator === "undefined") return Device.WEB;

  const xr = navigator ? navigator.xr : undefined;
  if (await xr.isSessionSupported("immersive-ar")) return Device.WEB_AR;
  else if (await xr.isSessionSupported("immersive-vr")) return Device.WEB_VR;

  return Device.WEB;
};

export const imageUrl = (asset: string): string => {
  if (IS_LOCAL) return asset;
  return `https://${DOMAIN_NAME}${asset}`;
};
