describe('Wallet Integration Test', () => {
  it('should connect a wallet and display wallet address', () => {
    // Load the page
    cy.visit('localhost:3000/en/dreps')

    // Click the connect button to open the modal
    cy.get('[data-testid=connect-wallet-button]').click()

    // Wait for the modal to be visible
    cy.get('[data-testid=connect-your-wallet-modal]').should('be.visible')

    // Click on the first available wallet extension like yoroi
    cy.get('[data-testid=yoroi-wallet-button]').first().click()
    // Wait for 30 seconds to 1 minute for the wallet connection of apis  like yoroi
    cy.wait(90000, { log: false }); // Wait for 90 seconds

    // Assert that the component with the wallet address is shown
    cy.get('[data-testid=wallet-info-card]').should('be.visible')
    // Assert that the wallet address matches the expected format
    cy.get('[data-testid=wallet-info-card] .text-sm.font-normal').should('contain', 'addr'); // Assuming the address starts with 'addr'
  })
})
