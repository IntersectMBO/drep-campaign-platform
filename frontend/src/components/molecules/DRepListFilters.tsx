'use client';

import React, { MouseEvent, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grow,
  Radio,
  RadioGroup,
  Switch,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '../atoms/Button';
import DotIcon from '../atoms/svgs/DotIcon';

export default function DRepListFilters() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const value = filtersValue([
      'on_chain',
      'campaign',
      'type',
      'include_retired',
    ]);
    if (value) setIsFiltering(true);
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: string,
  ) => {
    const value = event.target.value;
    updateFilters(filter, value);
  };

  const updateFilters = (filter: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (filter && value) {
      params.set(filter, value);
      params.set('page', '1');
    } else {
      params.delete(filter);
    }
    setIsFiltering(true);
    replace(`${pathName}?${params.toString()}`);
  };

  const handleShow = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filtersValue = (filters?: string[]) => {
    for (const filter of filters) {
      const value = searchParams.get(filter)?.toString();
      if (value) {
        return value;
      }
    }
    return null;
  };

  const resetFilters = (filters?: string[]) => {
    const params = new URLSearchParams(searchParams);
    for (const filter of filters) {
      const value = searchParams.get(filter)?.toString();
      if (value) {
        params.delete(filter);
      }
    }
    setIsFiltering(false);
    replace(`${pathName}?${params.toString()}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filters-popover' : undefined;

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
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className="bg-extra_gray px-6 py-4">
          <Box className="flex flex-col">
            <FormControl>
              <span className="text-xs font-semibold">
                Filter DReps by On-chain Status
              </span>
              <RadioGroup
                name="drep-on-chain-status"
                value={filtersValue(['on_chain'])}
                onChange={(e) => {
                  handleChange(e, 'on_chain');
                }}
              >
                <FormControlLabel
                  value="active"
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  value="inactive"
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  }
                  label="Inactive"
                />
              </RadioGroup>
            </FormControl>
            <Divider />
            <FormControl>
              <span className="text-xs font-semibold">
                Filter DReps by Campaign Status
              </span>
              <RadioGroup
                name="drep-campaign-status"
                value={filtersValue(['campaign'])}
                onChange={(e) => {
                  handleChange(e, 'campaign');
                }}
              >
                <FormControlLabel
                  value="claimed"
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  }
                  label="Claimed"
                />
                <FormControlLabel
                  value="unclaimed"
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  }
                  label="Unclaimed"
                />
              </RadioGroup>
            </FormControl>
            <Divider />

            <FormControl>
              <span className="mt-2 text-xs font-semibold">
                Filter DReps by DRep type
              </span>
              <RadioGroup
                name="drep-types"
                value={filtersValue(['type'])}
                onChange={(e) => {
                  handleChange(e, 'type');
                }}
              >
                <FormControlLabel
                  value="has_script"
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  }
                  label="Scripted DReps"
                />
              </RadioGroup>
            </FormControl>
            <Divider />
            <FormControl>
              <FormControlLabel
                value="include_retired"
                control={
                  <Switch
                    checked={filtersValue(['include_retired']) === 'true'}
                    onChange={(e) => {
                      updateFilters(
                        'include_retired',
                        e.target.checked ? 'true' : '',
                      );
                    }}
                    name="include_retired"
                  />
                }
                label={`${filtersValue(['include_retired']) === 'true' ? 'Including' : 'Excluding'} Retired DReps`}
              />
            </FormControl>
          </Box>
          {isFiltering && (
            <Box className="flex justify-end">
              <Button
                sx={{
                  backgroundColor: '#1f2937',
                }}
                size="extraSmall"
                handleClick={() =>
                  resetFilters([
                    'on_chain',
                    'campaign',
                    'type',
                    'include_retired',
                  ])
                }
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
