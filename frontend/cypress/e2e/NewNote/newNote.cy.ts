describe('Create new note if wallet is connected', () => {
  let noteId;
  it('should create a new note', () => {
    //check if backend is running
    cy.request(Cypress.env('backendUrl') + '/notes/all' ).should((response) => {
      expect(response.status).to.eq(200);
    } );

    // Load the page ps. remove localhost:300 if testing via cli
    cy.visit('/en/dreps/workflow/notes/new');

    // Click the connect button to open the modal
    cy.get('[data-testid=header-connect-wallet-button]').click();

    // Wait for the modal to be visible
    cy.get('[data-testid=connect-your-wallet-modal]').should('be.visible');

    // Assume yoroi extension is installed
    cy.get('[data-testid=yoroi-wallet-button]').click();
    cy.wait(20000);
    cy.get('[data-testid=post-title-input]')
      .type('Sample Title')
      .should('have.value', 'Sample Title');
    cy.get('[data-testid=post-tag-input]')
      .type('sample tag')
      .should('have.value', 'sample tag');

    // Type content into the editor
    cy.get('[data-testid="post-editor-input"]').type('This is a test note.');

    // Verify that the typed content appears in the editor
    cy.get('[data-testid="post-editor-input"]').should(
      'contain.text',
      'This is a test note.',
    );
    cy.get('input[value="everyone"]').click();
    cy.get('input[value="everyone"]').should('be.checked');
    cy.intercept('POST', Cypress.env('backendUrl') +  '/notes/new').as('add-note');
    cy.get('[data-testid=post-submit-button]').click();
    cy.wait('@add-note').then(({ response }) => {
      expect(response.body).to.have.property('noteAdded');
      noteId = response.body.noteAdded;
      expect(noteId).to.be.a('number');
    });
  });
  it('should update an existing note', () => {
    // Load the page ps. remove localhost:3000 if testing via cli
    cy.visit(`en/dreps/workflow/notes/${noteId}/update`);

    // Click the connect button to open the modal
    cy.get('[data-testid=header-connect-wallet-button]').click();

    // Wait for the modal to be visible
    cy.get('[data-testid=connect-your-wallet-modal]').should('be.visible');

    // Assume yoroi extension is installed
    cy.get('[data-testid=yoroi-wallet-button]').click();
    cy.wait(20000);
    cy.log('Note ID from the previous test:', noteId);
    //clears existing input
    cy.get('[data-testid=post-title-input]').clear();
    cy.get('[data-testid=post-tag-input]').clear();
    cy.get('[data-testid=post-editor-input]').clear();

    cy.get('[data-testid=post-title-input]')
      .type('Update Title')
      .should('have.value', 'Update Title');
    cy.get('[data-testid=post-tag-input]')
      .type('update tag')
      .should('have.value', 'update tag');

    // Type content into the editor
    cy.get('[data-testid="post-editor-input"]').type('This is a update note.');

    // Verify that the typed content appears in the editor
    cy.get('[data-testid="post-editor-input"]').should(
      'contain.text',
      'This is a update note.',
    );
    cy.get('input[value="myself"]').click();
    cy.get('input[value="myself"]').should('be.checked');
    cy.intercept('POST', Cypress.env('backendUrl') + `/notes/${noteId}/update`).as(
      'update-note',
    );
    cy.get('[data-testid=post-submit-button]').click();
    cy.wait('@update-note').then(({ response }) => {
      expect(response.body).to.have.property('id');
      expect(response.body.id).to.be.a('number');

      expect(response.body).to.have.property('title');
      expect(response.body.title).to.contain('Update Title');

      expect(response.body).to.have.property('note_tag');
      expect(response.body.note_tag).to.contain('update tag');

      expect(response.body).to.have.property('content');
      expect(response.body.content).to.contain(
        '<p>This is a update note.</p>',
      );

      expect(response.body).to.have.property('visibility');
      expect(response.body.visibility).to.contain('myself');
    });
  });
});
