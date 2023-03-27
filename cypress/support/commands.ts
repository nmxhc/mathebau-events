import seedData from '~/../prisma/seed/data_for_testing.json';
import { dateStringPlusDays, getTodayDateString } from '~/utils/dates';

declare global {
  namespace Cypress {
    interface Chainable {
      
      /**
       * get element by its data-cy attribute
       */
      getBySel: typeof getBySel;

      /**
       * seed the database for testing
       */
      seedDb: typeof seedDb;

      /**
       * login with email and password
       */
      login: typeof login;

      typeEventInForm: typeof typeEventInForm;

      loginCypress: typeof loginCypress;

      logout: typeof logout;

      createEventWithDefaultValues: typeof createEventWithDefaultValues;
    }
  }
}

function typeEventInForm(event: { name: string, startDate: string, endDate?: string, location: string, description: string, signupStartDate?: string, signupEndDate?: string, cost?: string, participantsLimit?: number }) {
  if (event.name.length > 0) {
    return cy.get('input[name="eventName"]').type(event.name);
  }
  if (event.startDate.length > 0) {
    return cy.get('input[name="startDate"]').type(event.startDate);
  }
  if (event.endDate) {
    return cy.get('input[name="endDate"]').type(event.endDate);
  }
  if (event.location.length > 0) {
    return cy.get('input[name="location"]').type(event.location);
  }
  if (event.description.length > 0) {
    return cy.get('textarea[name="description"]').type(event.description);
  }
  if (event.signupStartDate) {
    return cy.get('input[name="signupStartDate"]').type(event.signupStartDate)
  }
  if (event.signupEndDate) {
    return cy.get('input[name="signupEndDate"]').type(event.signupEndDate);
  }
  if (event.cost) {
    return cy.get('input[name="cost"]').type(event.cost);
  }
  if (event.participantsLimit) {
    return cy.get('input[name="participantsLimit"]').type(''+event.participantsLimit);
  }
}

function createEvent(event: { eventName: string, startDate: string, endDate: string, location: string, description: string, signupStartDate: string, signupEndDate: string, cost?: string, participantsLimit?: string }) {
  return cy.request({
    method: 'POST',
    url: '/admin/events/new',
    form: true,
    body: event,
    failOnStatusCode: false
  });
}

function createEventWithDefaultValues(event: { name?: string, startDate?: string, endDate?: string, location?: string, description?: string, signupStartDate?: string, signupEndDate?: string, cost?: string, participantsLimit?: number }) {
  return createEvent({
    eventName: event.name === undefined ? 'Event name': event.name,
    startDate: event.startDate === undefined ? dateStringPlusDays(getTodayDateString(),700): event.startDate,
    endDate: event.endDate === undefined ? dateStringPlusDays(getTodayDateString(),700): event.endDate,
    location: event.location === undefined ? 'Event location': event.location,
    description: event.description === undefined ? 'Event description': event.description,
    signupStartDate: event.signupStartDate === undefined ? getTodayDateString(): event.signupStartDate,
    signupEndDate: event.signupEndDate === undefined ? getTodayDateString(): event.signupEndDate,
    cost: event.cost || '',
    participantsLimit: event.participantsLimit ? ''+event.participantsLimit : ''
  })
}

function getBySel (selector: string, ...args: any[]) {
  return cy.get(`[data-cy=${selector}]`, ...args)
}

function seedDb() {
  return cy.exec('npm run db:seed-for-testing')
}

function login(admin: { email: string, password: string }) {
  return cy.request({
    method: 'POST',
    url: '/admin-login',
    form: true,
    body: {
      email: admin.email,
      password: admin.password
    }
  })
}

function loginCypress() {
  return cy.login({
    email: seedData.admins[0].email,
    password: seedData.admins[0].password
  });
}

function logout() {
  return cy.request({
    method: 'POST',
    url: '/admin-logout',
    form: true
  });
}


Cypress.Commands.addAll( { getBySel, seedDb, login, typeEventInForm, loginCypress, logout, createEventWithDefaultValues } )

//used to let typescript know this is no isolated file but a module
export {}