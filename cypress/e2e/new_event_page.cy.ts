import { dateStringPlusDays, getTodayDateString } from '~/utils/dates';

describe('New Event Page', () => {

  beforeEach(() => {
    cy.loginCypress()
    cy.visit('/admin/events/new')
  })

  it('successfully loads when logged in', () => {
    cy.getBySel('new-event-page').should('exist');
  });

  it('redirects to the login page when not logged in', () => {
    cy.logout();
    cy.visit('/admin/events/new');
    cy.url().should('include', '/admin-login');
  });

  it('creates a new event if provided with valid values', () => {
    cy.typeEventInForm({
      name: 'Cy-Event',
      startDate: dateStringPlusDays(getTodayDateString(),7),
      description: 'Desc',
      location: 'Cy-Presse',
    })
    cy.getBySel('submit-button').click();
    cy.getBySel('event-details-page').should('exist');

    cy.createEventWithDefaultValues({}).its('status').should('eq', 200);
    cy.createEventWithDefaultValues({ cost:'50 Euro', participantsLimit: 10 }).its('status').should('eq', 200);
    cy.createEventWithDefaultValues({
      startDate: dateStringPlusDays(getTodayDateString(),1),
      endDate: dateStringPlusDays(getTodayDateString(),1),
      signupStartDate: getTodayDateString(),
      signupEndDate: getTodayDateString(),
    }).its('status').should('eq', 200);
  })

  it('stays at same page if required Information is missing', () => {
    cy.typeEventInForm({
      name: '',
      startDate: dateStringPlusDays(getTodayDateString(),7),
      location: 'F',
      description: 'F',
    })
    cy.getBySel('submit-button').click();
    cy.getBySel('new-event-page').should('exist');

    cy.createEventWithDefaultValues({startDate: ''}).its('status').should('eq', 400);
    cy.createEventWithDefaultValues({location:''}).its('status').should('eq', 400);
    cy.createEventWithDefaultValues({description:''}).its('status').should('eq', 400);
  })

  it('fails if dates are in wrong order', () => {
    cy.createEventWithDefaultValues({
      startDate: dateStringPlusDays(getTodayDateString(),0),
    }).its('status').should('eq', 400);

    cy.createEventWithDefaultValues({
      signupStartDate: dateStringPlusDays(getTodayDateString(),-1),
    }).its('status').should('eq', 400);

    cy.createEventWithDefaultValues({
      startDate: dateStringPlusDays(getTodayDateString(),2),
      endDate: dateStringPlusDays(getTodayDateString(),1),
    }).its('status').should('eq', 400);

    cy.createEventWithDefaultValues({
      startDate: dateStringPlusDays(getTodayDateString(),1),
      signupEndDate: dateStringPlusDays(getTodayDateString(),1),
    }).its('status').should('eq', 400);

    cy.createEventWithDefaultValues({
      signupStartDate: dateStringPlusDays(getTodayDateString(),1),
      signupEndDate: dateStringPlusDays(getTodayDateString(),0),
    }).its('status').should('eq', 400);
  })
})