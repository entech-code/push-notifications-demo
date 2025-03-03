"use client";
import { Alert, Button, Slide, SlideProps, Snackbar } from "@mui/material";
import { getToken } from "firebase/messaging";
import { useContext, useState } from "react";
import { PushNotificationsContext } from "@/components/notifications/PushNotificationsProvider";
import { useCurrentUser } from "@/utils/useCurrentUser";
import { DeviceTypes, isPWA, useDevice } from "@/utils/useDevice";

export const SubscribeButton: React.FC = () => {
  const messaging = useContext(PushNotificationsContext);
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const device = useDevice();

  const handleClose = () => {
    setOpen(false);
    setAlertType("success");
  };

  const handleTokenSubmit = async () => {
    try {
      if (device === DeviceTypes.IOS && !isPWA())
        throw new Error(
          'In IPhone you must install the app first, by clicking on Share button in browser and selecting “Add to Home Screen"'
        );
      if (messaging) {
        if (Notification.permission !== "granted") {
          const result = await Notification.requestPermission();
          if (result !== "granted")
            return alert("Notifications are not allowed.");
        }

        if (!("serviceWorker" in navigator)) {
          console.error("Service Workers unavailable");
        }

        let registration = await navigator.serviceWorker.getRegistration("/");

        if (!registration) {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            }
          );
        }

        await navigator.serviceWorker.ready;

        const firebaseToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (user) user.data.firebaseToken = firebaseToken;
        setOpen(true);
      }
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
      setAlertType("error");
      setOpen(true);
    }
  };

  return (
    <>
      <Button variant={"contained"} onClick={handleTokenSubmit}>
        Subscribe to Notifications
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={function SlideTransition(props: SlideProps) {
          return <Slide {...props} direction="up" />;
        }}
      >
        <Alert onClose={handleClose} severity={alertType} variant="filled">
          {alertType === "success"
            ? "Subscription successful!"
            : "Subscription failed!"}
        </Alert>
      </Snackbar>
    </>
  );
};
