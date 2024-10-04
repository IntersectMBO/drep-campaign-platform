import React, { useEffect, useState } from 'react';
import { Box, Drawer, Grid, IconButton } from '@mui/material';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Background } from '../atoms/Background';
import WalletConnectButton from '@/components/molecules/WalletConnectButton';
import { WalletInfoCard } from '@/components/molecules';
import VoltaireMenu from '../molecules/VoltaireMenu';
import DRepMenu from '../molecules/DRepMenu';
import { useScreenDimension } from '@/hooks';

interface SliderMenuProps {
  isOpen: boolean;
  handleClose: () => void;
}

const DRAWER_PADDING = 2;
const CALCULATED_DRAWER_PADDING = DRAWER_PADDING * 8 * 2;

export const SliderMenu = ({ isOpen, handleClose }: SliderMenuProps) => {
  const { currentLocale } = useDRepContext();
  const { screenWidth } = useScreenDimension();
  const { isEnabled } = useCardano();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(null);
  const [currentPath, setCurrentPath] = useState(pathname);
  useEffect(() => {
    setActiveLink(pathname);
    if (isOpen && pathname !== currentPath) {
      handleClose();
    }
  }, [pathname]);

  return (
    <Drawer anchor="right" onClose={handleClose} open={isOpen}>
      <Background>
        <Box
          sx={{
            flex: 1,
            px: DRAWER_PADDING,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                py: 3,
                width: screenWidth - CALCULATED_DRAWER_PADDING,
              }}
            >
              <IconButton
                data-testid="close-drawer-button"
                onClick={handleClose}
                sx={{ padding: 0 }}
              >
                <img src={'/svgs/close.svg'} alt="Close" />
              </IconButton>
            </Box>
            <Grid
              container
              direction="column"
              rowGap={4}
              mt={6}
              className="flex flex-col items-center text-center"
            >
              <Grid item>
                {!isEnabled ? (
                  <WalletConnectButton test_name={'mobile-menu'} />
                ) : (
                  <WalletInfoCard test_name={'mobile-menu'} />
                )}
              </Grid>
              <Grid item>
                <Link
                  href={'/'}
                  className={`${
                    activeLink === `/${currentLocale}`
                      ? 'text-orange-500'
                      : 'text-gray-800'
                  }`}
                >
                  CIP
                </Link>
              </Grid>
              <Grid item>
                <DRepMenu />
              </Grid>
              <Grid item>
                <VoltaireMenu />
              </Grid>
              {/* <Grid item>
                <div className="cursor-pointer">
                  <img src="/svgs/bell.svg" alt="Notifications" />
                </div>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Background>
    </Drawer>
  );
};
