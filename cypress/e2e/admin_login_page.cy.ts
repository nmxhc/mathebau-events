import seedData from '~/../prisma/seed/data_for_testing.json';


describe('The Admin Login Page', () => {

  // this is slow, so it's commented out as long as no tests modify the database
  // before(() => {
  //   cy.seedDb()
  // })

  it('successfully loads', () => {
    cy.visit('/admin-login')
    cy.get('input[type="password"]').should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('lets you login', () => {
    cy.visit('/admin-login')
    cy.get('input[type="email"]').type(seedData.admins[0].email)
    cy.get('input[type="password"]').type(seedData.admins[0].password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/events')
    cy.contains(seedData.admins[0].name)
    cy.getCookie('__session_admin').should('exist')
  })

  it('redirects you if you are already logged in', ()  => {
    cy.login(seedData.admins[0])
    cy.visit('/admin-login')
    cy.url().should('not.be', '/admin-login')
    cy.contains(seedData.admins[0].name)
  })

  it('shows errors for invalid inputs', () => {
    cy.visit('/admin-login')

    cy.get('button[type="submit"]').click()
    cy.getBySel(`email-error`).should('contain', 'invalid')

    cy.get('input[type="email"]').type('not-an-email')
    cy.get('button[type="submit"]').click()
    cy.getBySel(`email-error`).should('contain', 'invalid')
    
    cy.get('input[type="email"]').clear().type('some@email.com')
    cy.get('button[type="submit"]').click()
    cy.getBySel(`password-error`).should('contain', 'required')

    cy.get('input[type="password"]').type('shortPW')
    cy.get('button[type="submit"]').click()
    cy.getBySel(`password-error`).should('contain', 'short')

    cy.get('input[type="password"]').clear().type('loooooooongWroooongPassword')
    cy.get('button[type="submit"]').click()
    cy.getBySel(`email-error`).should('contain', 'email or password')

    cy.get('input[type="email"]').clear().type(seedData.admins[0].email)
    cy.get('button[type="submit"]').click()
    cy.getBySel(`email-error`).should('contain', 'email or password')
  })
})