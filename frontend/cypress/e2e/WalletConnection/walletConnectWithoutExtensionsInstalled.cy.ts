describe('Wallet Integration Test', () => {
  it('should display no wallets to connect', () => {
    // Load the page
    cy.visit('en/dreps');

    // Click the connect button to open the modal
    cy.get('[data-testid=header-connect-wallet-button]').click();

    // Wait for the modal to be visible
    cy.get('[data-testid=connect-your-wallet-modal]').should('be.visible');

    cy.get('[data-testid=no-wallets-message]')
      .should('be.visible')
      .and('contain', 'No wallets to Connect');
  });
});
