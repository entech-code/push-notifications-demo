'use client';
import { SubscribeButton } from "@/components/notifications/SubscribeButton";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCurrentUser } from "@/utils/useCurrentUser";
import NotificationForm from "@/components/notifications/SendNotification";
import { UnsubscribeButton } from "@/components/notifications/UnsubscribeButton";

export default function Home() {
  const { token, user } = useCurrentUser();

  const handleContentCopyClick = () => {
    navigator.clipboard.writeText(user?.data.firebaseToken || "");
  };
  return (
    <div className="grid grid-rows-[20px_auto_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full gap-5 flex flex-col row-start-2 items-center">
        <Card className="w-full flex-grow">
          <Container maxWidth="sm">
            <CardContent className="flex flex-col gap-3">
              <TextField
                value={token || ""}
                id="outlined-basic"
                label="Your Firebase Token"
                variant="outlined"
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleContentCopyClick} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box className="flex gap-3 justify-around">
                <SubscribeButton />
                <UnsubscribeButton />
              </Box>
            </CardContent>
          </Container>
        </Card>
        <Card className="w-full flex-grow">
          <CardContent className="flex flex-col gap-3">
            <NotificationForm />
          </CardContent>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
