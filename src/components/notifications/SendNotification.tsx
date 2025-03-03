import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
  SlideProps,
  Slide,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/utils/useCurrentUser";

export default function NotificationForm() {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const { token } = useCurrentUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      notificationTitle: "",
      firebaseToken: token || "",
      url: "",
      notificationBody: "",
    },
  });

  useEffect(() => {
    if (token) {
      setValue("firebaseToken", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send notification.");

      setAlertType("success");
      setOpen(true);
    } catch (err: any) {
      console.log(err.message);
      setAlertType("error");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAlertType("success");
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Send Notification
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="notificationTitle"
            control={control}
            rules={{ required: "Notification title is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notification Title"
                fullWidth
                margin="normal"
                error={!!errors.notificationTitle}
                helperText={errors.notificationTitle?.message as string}
              />
            )}
          />

          <Controller
            name="firebaseToken"
            control={control}
            rules={{ required: "Firebase token is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Firebase Token"
                fullWidth
                margin="normal"
                error={!!errors.firebaseToken}
                helperText={errors.firebaseToken?.message as string}
              />
            )}
          />

          <Controller
            name="url"
            control={control}
            rules={{
              pattern: {
                value: /^(https?:\/\/)?([\w\d.-]+)\.([a-z]{2,})(\/.*)?$/i,
                message: "Enter a valid URL",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL"
                fullWidth
                margin="normal"
                error={!!errors.url}
                helperText={errors.url?.message as string}
              />
            )}
          />

          <Controller
            name="notificationBody"
            control={control}
            rules={{ required: "Notification body is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notification Body"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={!!errors.notificationBody}
                helperText={errors.notificationBody?.message as string}
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Notification
          </Button>
        </form>
      </Container>
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
            ? "Notification sent successfully!"
            : "Failed to send notification!"}
        </Alert>
      </Snackbar>
    </>
  );
}
