import React from 'react';
import Button from '../atoms/Button';
import { useCardano } from '@/context/walletContext';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { CircularProgress } from '@mui/material';
import { useDRepContext } from '@/context/drepContext';
import { userLogin } from '@/services/requests/userLogin';
import { setItemToLocalStorage } from '@/lib';
const LoginButton = ({
  isHardware = false,
  loginMode = false,
  loginPeriod = '24 hrs',
}: {
  isHardware?: boolean;
  loginPeriod?: string;
  loginMode?: boolean;
}) => {
  const {
    loginSignTransaction,
    loginHardwareWalletTransaction,
    isGettingSignatures,
    stakeKeyBech32,
    dRepIDBech32,
  } = useCardano();
  const { setIsLoggedIn, setLoginModalOpen, drepId } = useDRepContext();
  const { addErrorAlert } = useGlobalNotifications();
  const handleLogin = async () => {
    let signature;
    let key;
    try {
      if (isHardware) {
        const { signature: hardwareSig, vkey } =
          await loginHardwareWalletTransaction();
        signature = hardwareSig;
        key = vkey;
      } else {
        const { signature: hotSig, key: hotSigKey } =
          await loginSignTransaction();
        signature = hotSig;
        key = hotSigKey;
      }

      if (signature && key && loginMode) {
        setIsLoggedIn(true);
        const loginCredentials = {
          drepId,
          voterId: dRepIDBech32,
          stakeKey: stakeKeyBech32,
          signature,
          key,
          expiry: loginPeriod,
        };
        const { token } = await userLogin(loginCredentials);
        setItemToLocalStorage('signatures', { signature, key });
        setItemToLocalStorage('token', token);
        setIsLoggedIn(true);
        setLoginModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
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
