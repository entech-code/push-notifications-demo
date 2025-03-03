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
  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return DeviceTypes.IOS;
    }
    if (/android/.test(userAgent)) {
      return DeviceTypes.ANDROID;
    }
    if (/windows/.test(userAgent)) {
      return DeviceTypes.WINDOWS;
    }
    if (/macintosh|mac os x/.test(userAgent)) {
      return DeviceTypes.MAC;
    }
    return DeviceTypes.UNKNOWN;
  };

  useEffect(() => {
    setDeviceType(getDeviceType());
  }, [navigator.userAgent]);

  return deviceType;
}

export const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;
