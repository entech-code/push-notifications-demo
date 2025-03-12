"use client";
import { useEffect, useState } from "react";

export enum DeviceTypes {
  IOS = "ios",
  ANDROID = "android",
  WINDOWS = "windows",
  MAC = "mac",
  UNKNOWN = "unknown",
}

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceTypes>(
    DeviceTypes.UNKNOWN
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDeviceType(getDeviceType());
    }
  }, []);

  return deviceType;
}

function getDeviceType(): DeviceTypes {
  // Add check for server-side rendering
  if (typeof window === "undefined") {
    return DeviceTypes.UNKNOWN; // Default value for SSR
  }

  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) {
    return DeviceTypes.IOS;
  }
  if (/android/i.test(ua)) {
    return DeviceTypes.ANDROID;
  }
  if (/windows/.test(ua)) {
    return DeviceTypes.WINDOWS;
  }
  if (/macintosh|mac os x/i.test(ua)) {
    return DeviceTypes.MAC;
  }
  return DeviceTypes.UNKNOWN;
}

export const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;
