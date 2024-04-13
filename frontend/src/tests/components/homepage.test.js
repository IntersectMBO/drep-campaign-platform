// page.test.js

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom' // For additional matchers
import Page from '../../app/[locale]/home/page' 
import { useCardano} from '../../context/walletContext'

jest.mock('../../context/walletContext', () => ({
  useCardano: jest.fn(),
}))

describe('Page Component', () => {
  beforeEach(() => {
    // Mocking isEnabled to false initially
    useCardano.mockReturnValue({ isEnabled: false })
  })

  test('renders WalletConnectButton when Cardano is not enabled', () => {
    const { getByText } = render(<Page />)
    expect(getByText('Connect Wallet')).toBeInTheDocument()
  })

  test('renders WalletInfoCard when Cardano is enabled', () => {
    // Mocking isEnabled to true
    useCardano.mockReturnValue({ isEnabled: true, address:'sampleaddress' })
    const { getByTestId } = render(<Page />)
    expect(getByTestId('wallet-info-card')).toBeInTheDocument()
  })

  test('opens ChooseWalletModal when connectWallet is called', () => {
    const { getByText, getByTestId } = render(<Page />)
    fireEvent.click(getByText('Connect Wallet'))
    expect(getByTestId('connect-your-wallet-modal')).toBeInTheDocument()
  })

  test('closes ChooseWalletModal when handleClose is called', () => {
    const { getByText, getByTestId, queryByTestId } = render(<Page />)
    fireEvent.click(getByText('Connect Wallet'))
    fireEvent.click(getByTestId('close-modal-button'))
    expect(queryByTestId('connect-your-wallet-modal')).not.toBeInTheDocument()
  })
})
