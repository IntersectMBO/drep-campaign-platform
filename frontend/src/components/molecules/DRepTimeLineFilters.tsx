'use client';
import React, { ChangeEvent, MouseEvent, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grow,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '../atoms/Button';
import DotIcon from '../atoms/svgs/DotIcon';

export default function DRepTimeLIneFilters() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleShow = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filters-popover' : undefined;

  const filterOptions = [
    { label: 'Voting Activity', value: 'va' },
    { label: 'Delegations', value: 'd' },
    { label: 'Notes', value: 'n' },
    // { label: 'Claimed Profile Stats', value: 'cp' },
    // { label: 'Registration', value: 'r' },
  ];

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentFilters = params.get('category')?.split('-') || [];

    if (checked) {
      if (!currentFilters.includes(value)) {
        currentFilters.push(value);
      }
    } else {
      const index = currentFilters.indexOf(value);
      if (index !== -1) {
        currentFilters.splice(index, 1);
      }
    }

    if (currentFilters.length > 0) {
      params.set('category', currentFilters.join('-'));
    } else {
      params.delete('category');
    }

    replace(`${pathName}?${params.toString()}`);
  };

  const resetFilters = () => {
    params.delete('category');
    replace(`${pathName}?${params.toString()}`);
  };

  const currentFilters = params.get('category')?.split('-') || [];
  const isFiltering = currentFilters.length > 0;

  return (
    <Box>
      <Box
        component="button"
        className="relative flex w-6 justify-start"
        aria-describedby={id}
        onClick={handleShow}
      >
        <img
          src="/svgs/filter.svg"
          className="mt-1 h-5 w-5"
          alt="Filter Sort"
        />
        <Grow in={isFiltering}>
          <div className="absolute right-0 top-0">
            <DotIcon color="#f97316" width={17} height={17} />
          </div>
        </Grow>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          '.MuiPaper-root': {
            borderRadius: '0 0 1rem 1rem',
            boxShadow: '1px 2px 11px 0 rgba(0, 18, 61, 0.37)',
            bgcolor: '#F3F5FF',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box className="bg-extra_gray px-6 py-4">
          <Box className="flex flex-col">
            <FormControl>
              <span className="text-xs font-semibold">
                Filter DRep's timeline by activity category
              </span>
              <FormGroup>
                {filterOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        sx={{
                          '&.Mui-checked': {
                            color: '#f97316',
                          },
                        }}
                        checked={currentFilters.includes(option.value)}
                        onChange={handleCheckboxChange}
                        value={option.value}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
          {isFiltering && (
            <Box className="flex justify-end">
              <Button
                sx={{
                  backgroundColor: '#1f2937',
                }}
                size="extraSmall"
                handleClick={resetFilters}
              >
                <span>Reset</span>
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
