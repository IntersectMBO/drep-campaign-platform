'use client';

import React, { MouseEvent, useState } from 'react';
import Popover from '@mui/material/Popover';
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DRepListSort() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    const params = new URLSearchParams(searchParams);

    if (checked) {
      const [sortBy, order] = name.split('-');
      params.set('sortBy', sortBy);
      params.set('order', order);
      params.set('page', '1');
    } else {
      params.delete('sortBy');
      params.delete('order');
    }

    replace(`${pathName}?${params.toString()}`);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isChecked = (sortBy: string, order: string) => {
    return (
      searchParams.get('sortBy')?.toString() === sortBy &&
      searchParams.get('order')?.toString() === order
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? 'sort-popover' : undefined;

  return (
    <Box className="mt-2">
      <Box component="button" aria-describedby={id} onClick={handleClick}>
        <img src="/svgs/arrows-sort.svg" alt="Arrows Sort" />
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className="bg-extra_gray flex flex-col space-y-4 px-4 py-2">
          <FormControl component="fieldset" variant="standard">
            <span className="text-xs font-semibold">Sort by Voting Power</span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked('power', 'desc')}
                    onChange={handleChange}
                    name="power-desc"
                  />
                }
                label="Highest to Lowest"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked('power', 'asc')}
                    onChange={handleChange}
                    name="power-asc"
                  />
                }
                label="Lowest to Highest"
              />
            </FormGroup>
          </FormControl>

          <Divider />

          <FormControl component="fieldset" variant="standard">
            <span className="text-xs font-semibold">
              Sort by Delegators count
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked('delegators', 'desc')}
                    onChange={handleChange}
                    name="delegators-desc"
                  />
                }
                label="Highest to Lowest"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked('delegators', 'asc')}
                    onChange={handleChange}
                    name="delegators-asc"
                  />
                }
                label="Lowest to Highest"
              />
            </FormGroup>
          </FormControl>
        </Box>
      </Popover>
    </Box>
  );
}
