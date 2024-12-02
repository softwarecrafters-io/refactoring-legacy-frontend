
describe('Library App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('[data-test-id="titleHeader"]', 'LIBRARY APP');
  });

  it('should be able to add new book', ()=>{
    cy.get('[data-test-id="titleInput"]').type('New book');
    cy.get('[data-test-id="coverInput"]').type('https://bucket.mlcdn.com/a/1590/1590228/images/75a5707709691e7651c5ebcace5287da35c56015.png');

    cy.get('[data-test-id="addButton"]').click();

    cy.contains('[data-test-id="bookList"]', 'New book').should('exist')
    cy.get('[data-test-id="deleteButton"]').click();
  });

  it('should be able to delete a book', ()=>{
    cy.get('[data-test-id="titleInput"]').type('New book');
    cy.get('[data-test-id="coverInput"]').type('https://bucket.mlcdn.com/a/1590/1590228/images/75a5707709691e7651c5ebcace5287da35c56015.png');

    cy.get('[data-test-id="addButton"]').click();

    cy.get('[data-test-id="deleteButton"]').click();
    cy.contains('[data-test-id="bookList"]', 'New book').should('not.exist')
  });

});

