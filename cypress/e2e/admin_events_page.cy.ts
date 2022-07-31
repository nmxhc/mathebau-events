import seedData from '~/../prisma/seed/data_for_testing.json';

describe('Admin Events Page', () => {

  it('successfully loads when logged in', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events');
  });

  it('redirects to the login page when not logged in', () => {
    cy.visit('/admin/events');
    cy.url().should('include', '/admin-login');
  })

  it('displays events of admin correctly', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events');
    cy.getBySel('upcoming-admin-events').getBySel('Laufendes-Event-box').getBySel('event-ongoing-info').should('exist');
    cy.getBySel('upcoming-admin-events').getBySel('Zukünftiges-Event-1-box').getBySel('signup-ended-info').should('exist');
    cy.getBySel('upcoming-admin-events').getBySel('Zukünftiges-Event-3-box').getBySel('signup-start-info').should('exist');
    cy.getBySel('past-admin-events').getBySel('Vergangenes-Event-box').getBySel('event-ended-info').should('exist');
    cy.getBySel('admin-logout-link').click();
    cy.login({
      email: seedData.admins[1].email,
      password: seedData.admins[1].password
    });
    cy.visit('/admin/events');
    cy.getBySel('upcoming-admin-events').getBySel('Zukünftiges-Event-2-box').getBySel('signup-ongoing-info').should('exist');
    cy.getBySel('upcoming-admin-events').getBySel('Zukünftiges-Event-3-box').getBySel('signup-start-info').should('exist');
    cy.getBySel('past-admin-events').getBySel('Vergangenes-Event-box').getBySel('event-ended-info').should('exist');
  })

  it('has a functioning new-event button', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events');
    cy.getBySel('new-event-button').click();
    cy.url().should('include', '/admin/events/new');
  })

})