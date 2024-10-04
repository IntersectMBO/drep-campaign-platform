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
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '../atoms/Button';
import DotIcon from '../atoms/svgs/DotIcon';

type SortOption = {
  label: string;
  value: string;
};

type ListSortProps = {
  tableType: string;
  sortOptions: { category: string; options: SortOption[] }[];
};

export default function ListSort({ tableType, sortOptions }: ListSortProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const value = sortValue();
    if (value) setIsFiltering(true);
  }, []);

  const setSorts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      const [sort, order] = value.split('-');
      params.set('sort', sort);
      params.set('order', order);
      params.set('page', '1');
    } else {
      params.delete('sort');
      params.delete('order');
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

  const sortValue = () => {
    let sort = searchParams.get('sort')?.toString();
    let order = searchParams.get('order')?.toString();

    if (sort && order) {
      return `${sort}-${order}`;
    } else {
      return null;
    }
  };

  const resetSort = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('sort');
    params.delete('order');
    setIsFiltering(false);
    replace(`${pathName}?${params.toString()}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'sort-popover' : undefined;

  return (
    <Box>
      <Box
        component="button"
        className="relative flex w-6 justify-start"
        aria-describedby={id}
        onClick={handleShow}
      >
        <img
          src="/svgs/arrows-sort.svg"
          className="mt-1 h-5 w-5"
          alt="Arrows Sort"
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
          <p className="text-sm font-semibold">Sort {tableType} by:</p>
          <Box className="flex flex-col">
            {sortOptions.map((category, index) => (
              <Box key={index} className="mt-2">
                <FormControl>
                  <span className="text-xs font-semibold">
                    {category.category}
                  </span>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={sortValue()}
                    onChange={setSorts}
                  >
                    {category.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option.value}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: '#f97316',
                              },
                            }}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                {index < sortOptions.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
          {isFiltering && (
            <Box className="flex justify-end">
              <Button
                sx={{
                  backgroundColor: '#1f2937',
                }}
                size="extraSmall"
                handleClick={resetSort}
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
