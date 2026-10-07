import React from 'react';
import Button from '../atoms/Button';
import { useCardano } from '@/context/walletContext';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { CircularProgress } from '@mui/material';
import { useDRepContext } from '@/context/drepContext';
const LoginButton = ({
  loginMode = false,
  loginPeriod = '24 hrs',
}: {
  loginPeriod?: string;
  loginMode?: boolean;
}) => {
  const { loginSignTransaction, isGettingSignatures } = useCardano();
  const { login } = useDRepContext();
  const { addErrorAlert } = useGlobalNotifications();
  const handleLogin = async () => {
    try {
      if (loginMode) {
        // signs a login message from the server and starts a session
        await login(loginPeriod);
      } else {
        // only collects a signature made with the DRep key
        await loginSignTransaction();
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message;
      if (typeof message === 'string') addErrorAlert(message);
      else if (error instanceof Error) {
        const stringifiedError = error.toString();
        addErrorAlert(stringifiedError);
      } else if (typeof error?.info === 'string') addErrorAlert(error?.info);
    }
  };
  return (
    <Button handleClick={handleLogin} sx={{ width: '100%' }}>
      {isGettingSignatures ? (
        <CircularProgress size={20} color="info" />
      ) : (
        'Login'
      )}
    </Button>
  );
};

export default LoginButton;
