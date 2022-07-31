import seedData from '~/../prisma/seed/data_for_testing.json';
import { dateStringPlusDays, getTodayDateString } from '~/utils/dates';

describe('New Event Page', () => {
  it('successfully loads when logged in', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events/new');
    cy.getBySel('new-event-page').should('exist');
  });

  it('redirects to the login page when not logged in', () => {
    cy.visit('/admin/events/new');
    cy.url().should('include', '/admin-login');
  });

  it('displays error messages on empty inputs', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events/new');
    cy.getBySel('submit-button').click();
    cy.getBySel('eventName-error').should('exist');
    cy.getBySel('startDate-error').should('exist');
    cy.getBySel('endDate-error').should('exist');
    cy.getBySel('location-error').should('exist');
    cy.getBySel('description-error').should('exist');
    cy.getBySel('signupEndDate-error').should('exist');
  })

  it('creates a new event if provided with valid values', () => {
    cy.login({
      email: seedData.admins[0].email,
      password: seedData.admins[0].password
    });
    cy.visit('/admin/events/new');
    cy.get('input[name="eventName"]').type('Event Created By Cypress');
    cy.get('input[name="startDate"]').type(dateStringPlusDays(getTodayDateString(),7));
    cy.get('input[name="location"]').type('CY-Presse');
    cy.get('textarea[name="description"]').type('Wir pressen CYs. Obwohl nur das Startdatum ausgewählt wurde, wurden die anderen Date-Felder automatisch gefüllt.');
    cy.getBySel('submit-button').click();
    cy.getBySel('event-details-page').should('exist');
  })
})