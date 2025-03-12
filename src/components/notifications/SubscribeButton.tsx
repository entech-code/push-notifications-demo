"use client";
import {
  Alert,
  Box,
  Button,
  Slide,
  SlideProps,
  Snackbar,
  Typography,
} from "@mui/material";
import { getToken } from "firebase/messaging";
import { useContext, useState } from "react";
import { PushNotificationsContext } from "@/components/notifications/PushNotificationsProvider";
import { useCurrentUser } from "@/utils/useCurrentUser";
import { DeviceTypes, isPWA, useDevice } from "@/utils/useDevice";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary", fontSize: "12px" }}
        >{`${Math.round(props.value)}`}</Typography>
      </Box>
    </Box>
  );
}

export const SubscribeButton: React.FC = () => {
  const messaging = useContext(PushNotificationsContext);
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const device = useDevice();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
        setIsLoading(true);
        if (Notification.permission !== "granted") {
          setProgress(10);
          const result = await Notification.requestPermission();
          setProgress(20);
          if (result !== "granted")
            throw new Error("Notifications are not allowed.");
        }

        if (!("serviceWorker" in navigator)) {
          console.error("Service Workers unavailable");
        }

        let registration = await navigator.serviceWorker.getRegistration("/");
        setProgress(40);
        if (!registration) {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            }
          );
        }
        setProgress(60);

        await navigator.serviceWorker.ready;
        setProgress(80);
        const firebaseToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        setProgress(100);
        if (user) user.data.firebaseToken = firebaseToken;
        setOpen(true);
        setIsLoading(false);
        setProgress(0);
      } else {
        throw new Error("Messaging not initialized");
      }
    } catch (err: any) {
      console.log(err.message);
      alert(err.message);
      setAlertType("error");
      setOpen(true);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Button
        variant={"contained"}
        onClick={handleTokenSubmit}
        className="flex items-center gap-2"
      >
        {isLoading && (
          <CircularProgressWithLabel size={20} color="secondary" value={progress} />
        )}
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
