
describe('Library App', () => {
  const title = 'Irrelevant book title';
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('h1', 'LIBRARY APP');
  });


});

