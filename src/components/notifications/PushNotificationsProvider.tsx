"use client";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { getMessaging, Messaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const PushNotificationsContext = createContext<Messaging | undefined>(
  undefined,
);

const PushNotificationsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [messaging, setMessaging] = useState<Messaging | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const app = initializeApp(firebaseConfig);
      const messagingInstance = getMessaging(app);
      setMessaging(messagingInstance);

      const unsubscribe = onMessage(messagingInstance, async (payload) => {
        if (Notification.permission === "granted" && payload.notification) {
          const url = payload.data?.url || "/";
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(
            payload?.notification?.title || "",
            {
              body: payload.notification?.body,
              icon: "/logo.svg",
              data: { url },
            },
          );
        }
      });

      return () => unsubscribe();
    }
  }, [isClient]);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <PushNotificationsContext.Provider value={messaging}>
      {children}
    </PushNotificationsContext.Provider>
  );
};

export default PushNotificationsProvider;
