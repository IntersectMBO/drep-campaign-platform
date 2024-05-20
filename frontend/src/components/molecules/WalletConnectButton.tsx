import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import { useDRepContext } from '@/context/drepContext';

const WalletConnectButton = ({ test_name }) => {
  const { setIsWalletListModalOpen } = useDRepContext();
  return (
    <Button
      handleClick={() => setIsWalletListModalOpen(true)}
      data-testid={`${test_name}-connect-wallet-button`}
      size='small'
    >
      <p>Connect Wallet</p>
    </Button>
  );
};

export default WalletConnectButton;
