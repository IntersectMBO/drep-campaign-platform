'use client';
import { useScreenDimension } from '@/hooks';
import { Box, Grid, IconButton, SwipeableDrawer } from '@mui/material';
import React, { useState } from 'react';
import { Background } from './Background';
import Link from 'next/link';
interface SliderMenuProps {
  options: { name: string; path: string }[];
  handleClose: () => void;
}

const DRAWER_PADDING = 2;
// 8 is number of multiple in Material UI 2 is left and right side
const CALCULATED_DRAWER_PADDING = DRAWER_PADDING * 8 * 2;
const DRepProfileBar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Function;
}) => {
  const { isMobile, screenWidth } = useScreenDimension();
  const [active, setIsActive] = useState(0);
  const utilityLinks = [
    {
      icon: '/user-circle-filled-orange',
      title: 'Profile',
      link: '#',
    },
    {
      icon: '/file-stack',
      title: 'Notes',
      link: '#',
    },
    {
      icon: '/governance-actions',
      title: 'Gov Tools',
      link: '#',
    },
    {
      icon: '/guides',
      title: 'Guides',
      link: '#',
    },
    {
      icon: '/message-question',
      title: 'FAQs',
      link: '#',
    },
  ];
  return (
    <div className="bg-white">
      <SwipeableDrawer
        anchor="left"
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
      >
        <Box
          sx={{
            flex: 1,
            px: DRAWER_PADDING,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: 250,
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
                onClick={() => setIsOpen(false)}
                sx={{ padding: 0 }}
              >
                <img src={'/svgs/close.svg'} />
              </IconButton>
            </Box>
            <Grid
              container
              direction="column"
              rowGap={4}
              mt={6}
              className="text-center"
            >
              {utilityLinks.map((link, index) => (
                <Grid item key={index + link.title}>
                  <Link
                    href={link.link}
                    className={`${active === index && 'bg-blue-100'} ml-5 flex flex-row items-center justify-start gap-3 rounded-3xl px-3 py-3 hover:bg-blue-50`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsActive(index);
                    }}
                  >
                    <img
                      src={`/svgs${active === index ? link.icon + '-active' : link.icon}.svg`}
                    />
                    <p>{link.title}</p>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default DRepProfileBar;
