import { Box, Grid, IconButton, SwipeableDrawer } from '@mui/material';
import { useDRepContext } from '@/context/drepContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Background } from '../atoms/Background';
interface SliderMenuProps {
  options: { name: string; path: string }[];
  handleClose: () => void;
}

const DRAWER_PADDING = 2;
// 8 is number of multiple in Material UI 2 is left and right side
const CALCULATED_DRAWER_PADDING = DRAWER_PADDING * 8 * 2;

export const SliderMenu = ({ options, handleClose }: SliderMenuProps) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const { isMobileDrawerOpen, setIsMobileDrawerOpen, currentLocale } =
    useDRepContext();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    // Setting the active link based on the current pathname
    setActiveLink(pathname);
    setScreenWidth(window.innerWidth);
  }, [pathname]);
  return (
    <SwipeableDrawer
      anchor="right"
      onClose={handleClose}
      onOpen={() => setIsMobileDrawerOpen(true)}
      open={isMobileDrawerOpen}
    >
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
                <img src={'/close.svg'} />
              </IconButton>
            </Box>
            <Grid container direction="column" rowGap={4} mt={6} className='text-center'>
              <Grid item >
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
              {options.slice(0, 1).map((option, index) => (
                <Grid item key={index + option.name + option.path + option}>
                  <Link
                    key={index + option.name + option.path + option}
                    href={option.path}
                    className={`${
                      activeLink === `/${currentLocale}${option.path}`
                        ? 'text-orange-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {option.name}
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Background>
    </SwipeableDrawer>
  );
};
