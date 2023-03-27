import seedData from '~/../prisma/seed/data_for_testing.json';

describe('The Logout Route', () => {
  
  it('redirects to the home page when visited', () => {
    cy.visit('/admin-logout');
    cy.getBySel('home-page').should('exist');
  });

  it('logs the user out when requested with POST', () => {
    cy.loginCypress();
    cy.request({
      method: 'POST',
      url: '/admin-logout',
      form: true
    });
    cy.getCookie('__session_admin').should('not.exist');
  })
})