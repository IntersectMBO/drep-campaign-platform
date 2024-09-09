import React from 'react';
import Button from '../atoms/Button';
import Link from 'next/link';
import { urls } from '@/constants';

const BecomeADRepButton = () => {
  return (
    <Button sx={{ width: 'fit-content' }} variant="contained">
      <Link href={`${urls.govToolUrl}/register_drep`} target="_blank">
        Become A DRep
      </Link>
    </Button>
  );
};

export default BecomeADRepButton;
