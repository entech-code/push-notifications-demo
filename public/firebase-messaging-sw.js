console.log("[Firebase SW] Service Worker Loaded");
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js',
);
importScripts("/sw-process-env.js");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("[Firebase SW] Firebase Config:", firebaseConfig);

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(messaging, async (payload) => {
  const { notification, data } = payload;
  const notificationOptions = {
    body: notification?.body,
    icon: notification?.icon || "/logo.svg", // Default icon
    data: { url: data?.url || "/" }, // Store URL in notification data
  };

  await self.registration.showNotification(
    payload.notification.title,
    notificationOptions
  );
});

self.addEventListener("install", (event) => {
  console.log("[Firebase SW] Installing...");
  event.waitUntil(self.skipWaiting()); // Force the new SW to activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("[Firebase SW] Activating...");
  event.waitUntil(
    self.clients.claim() // Take control over all open pages
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Firebase SW] Notification Clicked:", event);
  event.notification.close();

  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});
