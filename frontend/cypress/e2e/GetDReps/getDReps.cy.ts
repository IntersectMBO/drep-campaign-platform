describe('Load page and show dreps', () => {
  it('should load dreps/list page and show dreps', () => {
    // Load the page
    //add localhost:300 if working with cypress test runner ui
    cy.visit('en/dreps/list');
    cy.intercept(
      {
        method: 'GET',
        url: Cypress.env('backendUrl') + '/dreps',
      },
      {
        fixture: 'drepresexample.json',
      },
    ).as('getDreps');

    cy.wait('@getDreps').then(({ response }) => {
      // Now you should assert that the data fetched by useUsers
      // deep equals the data from the fixture
      const drepid = response.body[0]?.view;
      cy.get(`[data-testid=drep-id-${drepid}]`).should('be.visible');
    });
  });
});
