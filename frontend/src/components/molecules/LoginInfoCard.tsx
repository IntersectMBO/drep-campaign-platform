import { Box, Button, Typography } from '@mui/material';
import { useCardano } from '@/context/walletContext';
import './MoleculeStyles.css';
import { useDRepContext } from '@/context/drepContext';
import { removeItemFromLocalStorage } from '@/lib';
import Cookies from 'js-cookie'
export const LoginInfoCard = () => {
  const { loginCredentials } = useCardano();
  const {setIsLoggedIn}=useDRepContext()
  const onClickLogout = async () => {
    removeItemFromLocalStorage('token');
    Cookies.remove('token', { path: '/' });
    setIsLoggedIn(false);
  };

  return (
    loginCredentials?.signature && (
      <Box
        data-testid="wallet-info-card"
        sx={{
          border: 1,
          borderColor: 'lightBlue',
          borderRadius: 3,
          px: 1.25,
          py: 1,
          position: 'relative',
          width: '7.5rem',
        }}
      >
        <Typography className="text-sm font-medium text-gray-200">
          Logged in as
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography className="flex-1 overflow-hidden overflow-ellipsis text-sm font-normal">
            {loginCredentials.signature}
          </Typography>
          <Button
            data-testid={'disconnect-button'}
            variant="text"
            onClick={onClickLogout}
            className="flex w-[0.0625rem] justify-end"
          >
            <img src="/svgs/close.svg" alt="Close Icon" />
          </Button>
        </Box>
      </Box>
    )
  );
};
