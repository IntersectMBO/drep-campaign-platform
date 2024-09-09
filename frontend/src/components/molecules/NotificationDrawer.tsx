import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grow from '@mui/material/Grow';
import { Box } from '@mui/material';
import {useGetUserNotificationQuery} from "@/hooks/useGetUserNotificationQuery";
import Typography from "@mui/material/Typography";

export default function NotificationDrawer() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { notifications: notificationItems } = useGetUserNotificationQuery();

  return (
      <div>
        <div className="cursor-pointer">
          <img src="/svgs/bell.svg"
               id="notification-dropdown"
               aria-controls={open ? 'notification-drawer' : undefined}
               aria-haspopup="true"
               alt="Notifs"
               onClick={handleClick}
               aria-expanded={open ? 'true' : undefined} />
        </div>
            <Menu
                id="notification-drawer"
                MenuListProps={{
                  'aria-labelledby': 'notification-drawer',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Grow}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                sx={{
                  '.MuiPaper-root': {
                    borderRadius: '0 0 1rem 1rem',
                    boxShadow: '1px 2px 11px 0 rgba(0, 18, 61, 0.37)',
                    bgcolor: '#F3F5FF',
                  },
                  '.MuiMenu-list': {padding: 0},
                }}
            >
                <Box className='w-72'>
                    <Box className='w-full flex justify-between p-2 items-center'>
                      <Typography variant='h4'>Notifications</Typography>
                    </Box>
                  {!!notificationItems && (<Box className="relative w-full flex flex-col">
                    {notificationItems.map((item, index) => (
                          <MenuItem
                              onClick={handleClose}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#FFC19D',
                                },
                              }}
                          >
                            <Box className="flex max-w-60 gap-4">
                              <Box className="flex flex-col text-wrap text-complementary-500">
                                <p className="p-0 text-base font-normal">{item.label}</p>
                                <p className="text-xs font-normal leading-4">
                                  {item.text}
                                </p>
                              </Box>
                            </Box>
                          </MenuItem>
                    ))}
                  </Box>
                  )}
                </Box>
              {!notificationItems || notificationItems.length <= 0 && (
                  <MenuItem
                      onClick={handleClose}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#FFC19D',
                        },
                      }}
                  >
                  <Box className="flex flex-col text-wrap text-complementary-500 py-2 mb-4">
                    <Typography variant='subtitle2' className='font-bold'>Mempool Clear</Typography>
                    <Typography variant='body1'>You're all caught up.</Typography>
                  </Box>
                  </MenuItem>
              )}
            </Menu>
      </div>
  );
}
