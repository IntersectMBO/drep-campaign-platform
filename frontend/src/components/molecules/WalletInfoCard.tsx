import { Box, Grow } from '@mui/material';
import { useCardano } from '@/context/walletContext';
import './MoleculeStyles.css';
import { useDRepContext } from '@/context/drepContext';
import { memo, useEffect, useRef, useState } from 'react';
import { ConnectedWalletCard } from '../atoms/ConnectedWalletCard';
import { DelegatedTo } from './DelegatedTo';
import Button from '../atoms/Button';

type WalletInfoCardProps = {
  test_name: string;
};

export const WalletInfoCard = memo(({ test_name }: WalletInfoCardProps) => {
  const { address, isEnabled, disconnectWallet } = useCardano();
  const { setLoginModalOpen, isLoggedIn, logout } = useDRepContext();
  const [showDetails, setShowDetails] = useState(false);

  const dropDownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDetails]);

  async function logUserOut() {
    setShowDetails(false);
    setTimeout(() => {
      logout();
      disconnectWallet();
    }, 400);
  }

  return (
    <Grow
      in={isEnabled}
      style={{ transformOrigin: 'top center' }}
      {...(!!address ? { timeout: 0 } : { timeout: 300 })}
    >
      <Box
        ref={dropDownRef}
        data-testid={`${test_name}-wallet-info-card`}
        className={`relative rounded-3xl bg-gray-800 ${!!isLoggedIn ? 'cursor-pointer' : ''}`}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className="p-1.5"
          onClick={() => {
            isLoggedIn && setShowDetails(!showDetails);
          }}
        >
          <ConnectedWalletCard />
          {!isLoggedIn ? (
            <Button
              size="smallest"
              handleClick={() => setLoginModalOpen(true)}
            >
              Login
            </Button>
          ) : (
            <div className="w-fit">
              <Button size="smallest">
                {' '}
                {showDetails ? (
                  <img
                    src="/svgs/chevron-up.svg"
                    alt="Toggle to close wallet details"
                    className="h-7 w-7"
                  />
                ) : (
                  <img
                    src="/svgs/chevron-down.svg"
                    alt="Toggle to open wallet details"
                    className="h-7 w-7"
                  />
                )}
              </Button>
            </div>
          )}
        </Box>
        <Grow
          in={showDetails}
          style={{ transformOrigin: 'top center' }}
          {...(showDetails ? { timeout: 300 } : {})}
        >
          <Box className="absolute left-0 right-0 z-50">
            <DelegatedTo className="mt-1 rounded-t-3xl" />
            <Box className="flex w-full justify-end rounded-b-3xl bg-gray-100 p-1.5">
              <Button
                size="small"
                sx={{
                  backgroundColor: '#1f2937',
                }}
                handleClick={logUserOut}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Grow>
      </Box>
    </Grow>
  );
});
