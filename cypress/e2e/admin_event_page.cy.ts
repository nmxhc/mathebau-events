
describe ('Admin Event Page', () => {

  before(() => {
    cy.loginCypress()
    cy.createEventWithDefaultValues({name:'Admin Event Page Test'}).then((response) => {
      // @ts-ignore
      cy.wrap(response.redirects[0].split('admin/events/')[1]).as('eventId');
    });
  })

  it ('redirects to the login page if not logged in', function () {
    cy.logout()
    cy.visit('/admin/events/' + this.eventId)
    cy.url().should('include', '/admin-login')
  })

  it ('should show the event page when logged in', function () {
    cy.loginCypress()
    cy.visit('/admin/events/' + this.eventId);
    cy.getBySel('admin-event-page').should('exist');
  })

  it ('has a functioning delete button and modal', function () {
    cy.loginCypress()
    cy.visit('/admin/events/' + this.eventId);
    
    cy.getBySel('delete-event-button').click();
    cy.getBySel('delete-event-modal').should('be.visible');
    cy.getBySel('delete-event-modal-close-button').click();
    cy.getBySel('delete-event-modal').should('not.be.visible');

    cy.getBySel('delete-event-button').click();
    cy.getBySel('delete-event-modal').should('be.visible');
    cy.getBySel('delete-event-modal-cancel-button').click();
    cy.getBySel('delete-event-modal').should('not.be.visible');

    cy.getBySel('delete-event-button').click();
    cy.getBySel('delete-event-modal-confirm-button').click();
    cy.getBySel('admin-events-page').should('exist');
    cy.contains('Admin Event Page Test').should('not.exist');
  })
})