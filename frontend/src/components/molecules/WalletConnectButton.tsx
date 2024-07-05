import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';

const WalletConnectButton = ({ test_name }) => {
  const { setIsWalletListModalOpen } = useDRepContext();
  const {isEnabling}=useCardano()
  return (
    <Button
      handleClick={() => setIsWalletListModalOpen(true)}
      data-testid={`${test_name}-connect-wallet-button`}
      size='small'
    >
      <p>
        {isEnabling ? 'Connecting...' : 'Connect Wallet'}
      </p>
    </Button>
  );
};

export default WalletConnectButton;
