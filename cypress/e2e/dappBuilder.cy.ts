describe('dApp Builder route', () => {
  it('loads the builder canvas', () => {
    cy.visit('/dapp-builder/default');
    cy.get('[data-testid="builder-canvas"]').should('be.visible');
  });
});
