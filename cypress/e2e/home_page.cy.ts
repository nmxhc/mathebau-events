describe('The Home Page', () => {
  // this is slow, so it's commented out as long as no tests modify the database
  // before(() => {
  //   cy.seedDb()
  // })

  it('successfully loads', () => {
    cy.visit('/')
  })

  it('displays the seeded upcoming events', () => {
    cy.visit('/')
    cy.getBySel('upcoming-events').contains('Zukünftiges Event 1')
    cy.getBySel('upcoming-events').contains('Zukünftiges Event 2')
    cy.getBySel('upcoming-events').contains('Zukünftiges Event 3')
  })

  it('displays none of the seeded past events', () => {
    cy.visit('/')
    cy.getBySel('upcoming-events').contains('Laufendes Event').should('not.exist')
    cy.getBySel('upcoming-events').contains('Vergangenes Event').should('not.exist')
  })

  it('has a link to the admin login page', () => {
    cy.visit('/')
    cy.getBySel('admin-login-link').click().then(() => {})
    cy.url().should('contain', '/admin-login')
  })
})