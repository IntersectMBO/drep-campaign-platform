import React from 'react'
import Button from '../atoms/Button'

const WalletConnectButton = ({handleClick}) => {
  return (
    <Button handleClick={handleClick}>
     <p>Connect Wallet</p>
    </Button>
  )
}

export default WalletConnectButton