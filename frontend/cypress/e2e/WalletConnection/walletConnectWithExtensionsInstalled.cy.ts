import { CardanoBrowserWallet } from '@/models/wallet';

describe('Wallet Integration Test', () => {
  it('should connect a wallet and display wallet address', () => {
    // Load the page
    cy.visit('/en/dreps');

    // Click the connect button to open the modal
    cy.get('[data-testid=header-connect-wallet-button]').click();

    // Wait for the modal to be visible
    cy.get('[data-testid=connect-your-wallet-modal]').should('be.visible');

    // Assume extension is installed and wallet is connected
    // Assert that the component with the wallet address is shown
    cy.get('[data-testid=wallet-info-card]').should('be.visible');
    // Assert that the wallet address matches the expected format
    cy.get('[data-testid=wallet-info-card] .text-sm.font-normal').should(
      'contain',
      'addr',
    ); // Assuming the address starts with 'addr'
  });
});
