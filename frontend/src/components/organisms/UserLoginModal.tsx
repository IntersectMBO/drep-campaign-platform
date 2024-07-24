import {
  Box,
  Typography,
  Switch,
  switchClasses,
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContents, ModalHeader, ModalWrapper } from '../atoms';
import { useDRepContext } from '@/context/drepContext';
import LoginButton from '../molecules/LoginButton';
import { useScreenDimension } from '@/hooks';
import { ChangeEvent, useState } from 'react';
import { useCardano } from '@/context/walletContext';
import WalletConnectButton from '../molecules/WalletConnectButton';

export const getSwitchWithTextTrack = (isMobile, switchWidth) =>
  styled(Switch)(({ theme }) => ({
    width: switchWidth,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: '#fff',
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: 'none',
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      },
    },
    [`& .${switchClasses.track}`]: {
      background: 'linear-gradient(to right, #ee0979, #ff6a00)',
      opacity: '1 !important',
      borderRadius: 20,
      position: 'relative',
      '&:before, &:after': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        width: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center',
        textWrap: 'nowrap',
        fontSize: isMobile ? 8 : 12,
        fontWeight: 500,
      },
      '&:before': {
        content: '"Sign in with hot wallet"',
        left: 8,
        opacity: 0,
      },
      '&:after': {
        content: '"Sign in with hardware wallet"',
        paddingLeft: 30,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: '#fff',
        transform: `translateX(calc(${switchWidth} - 105%))`,
        '&:hover': {
          backgroundColor: 'rgba(24,90,257,0.08)',
        },
      },

      [`& .${switchClasses.thumb}`]: {
        backgroundColor: 'none',
        '&::before': {},
      },
      [`& + .${switchClasses.track}`]: {
        background: 'linear-gradient(to right, #43cea2, #185a9d)',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
  }));

export function UserLoginModal() {
  const { setLoginModalOpen } = useDRepContext();
  const { isEnabled } = useCardano();
  const [isChecked, setIsChecked] = useState(false);
  const [loginPeriod, setLoginPeriod] = useState('24 hrs');
  const { isMobile } = useScreenDimension();
  const [isHardware, setIsHardware] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsHardware(!event.target.checked);
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      setLoginPeriod('2 weeks');
      setIsChecked(true);
    } else {
      setLoginPeriod('24 hrs');
      setIsChecked(false);
    }
  };

  const SwitchWithTextTrack = getSwitchWithTextTrack(
    isMobile,
    isMobile ? '9.375rem' : '15.625rem',
  );
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
            <LoginButton
              isHardware={isHardware}
              loginMode
              loginPeriod={loginPeriod}
            />
          ) : (
            <WalletConnectButton test_name={'login'} />
          )}
          <label htmlFor="switch">
            <SwitchWithTextTrack
              id="switch"
              checked={!isHardware}
              onChange={handleChange}
            />
          </label>
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
          Signing in with a hardware wallet requires signing an expired
          transaction.
        </Typography>
      </ModalContents>
    </ModalWrapper>
  );
}
