import { Box, Typography, Checkbox } from '@mui/material';
import { ModalContents, ModalHeader, ModalWrapper } from '../atoms';
import { useDRepContext } from '@/context/drepContext';
import LoginButton from '../molecules/LoginButton';
import { useState } from 'react';
import { useCardano } from '@/context/walletContext';
import WalletConnectButton from '../molecules/WalletConnectButton';

export function UserLoginModal() {
  const { setLoginModalOpen } = useDRepContext();
  const { isEnabled } = useCardano();
  const [isChecked, setIsChecked] = useState(false);
  const [loginPeriod, setLoginPeriod] = useState('24 hrs');

  const handleCheck = (e) => {
    if (e.target.checked) {
      setLoginPeriod('2 weeks');
      setIsChecked(true);
    } else {
      setLoginPeriod('24 hrs');
      setIsChecked(false);
    }
  };

  return (
    <ModalWrapper
      dataTestId="login-modal"
      onClose={() => setLoginModalOpen(false)}
    >
      <ModalHeader
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '4rem',
        }}
      >
        <img src="/img/info-circle.png" width={'0.125rem'} alt="login icon" />

        <Typography variant="h4" className="py-1 text-center" component="span">
          Login
        </Typography>
      </ModalHeader>

      <ModalContents>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            maxHeight: '31.25rem',
            overflow: 'auto',
            width: '100%',
            padding: '0.25rem',
          }}
        >
          {isEnabled ? (
            <LoginButton loginMode loginPeriod={loginPeriod} />
          ) : (
            <WalletConnectButton test_name={'login'} />
          )}
        </Box>

        <label
          htmlFor="checkbox"
          className="flex cursor-pointer items-center gap-1"
        >
          <Checkbox id="checkbox" checked={isChecked} onChange={handleCheck} />
          <Typography variant="subtitle2" color={'dimgray'}>
            Keep me logged in for two weeks.
          </Typography>
        </label>
        <Typography variant="subtitle2" color={'dimgray'}>
          Your wallet will ask you to sign a login message with your stake key,
          and with your DRep key if you are a registered DRep.
        </Typography>
      </ModalContents>
    </ModalWrapper>
  );
}
