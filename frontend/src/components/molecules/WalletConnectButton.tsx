import React from 'react'
import Button from '../atoms/Button'
import { useDRepContext } from '@/context/drepContext'

const WalletConnectButton = () => {
  const {setIsWalletListModalOpen}=useDRepContext()
  return (
    <Button handleClick={()=>setIsWalletListModalOpen(true)} data-testid='connect-wallet-button'>
     <p>Connect Wallet</p>
    </Button>
  )
}

export default WalletConnectButton