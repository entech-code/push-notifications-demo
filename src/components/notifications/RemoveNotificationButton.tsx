'use client';
import {Button} from '@mui/material';

export const RemoveNotificationButton: React.FC = () => {
  const handleUnsubscribe = async () => {
    // TODO: remove token from memory
  };

  return <Button onClick={handleUnsubscribe}>Unsubscribe</Button>;
};
