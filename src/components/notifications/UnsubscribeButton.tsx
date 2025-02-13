"use client";
import { Alert, Button, Slide, SlideProps, Snackbar } from "@mui/material";
import { useState } from "react";
import { useCurrentUser } from "@/utils/useCurrentUser";

export const UnsubscribeButton: React.FC = () => {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleClose = () => {
    setOpen(false);
    setAlertType("success");
  };

  const handleUnsubscribe = async () => {
    try {
      if (user) user.data.firebaseToken = undefined;
      setOpen(true);
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
      setAlertType("error");
      setOpen(true);
    }
  };

  return (
    <>
      <Button variant={"contained"} onClick={handleUnsubscribe}>
        Unsubscribe
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
            ? "Operation successful!"
            : "Operation failed!"}
        </Alert>
      </Snackbar>
    </>
  );
};
