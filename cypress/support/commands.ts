
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
    }
  }
}

function getBySel (selector: string, ...args: any[]) {
  return cy.get(`[data-cy=${selector}]`, ...args)
}

function seedDb() {
  cy.exec('npm run db:seed-for-testing')
}

function login(admin: { email: string, password: string }) {
  cy.request({
    method: 'POST',
    url: '/admin-login',
    form: true,
    body: {
      email: admin.email,
      password: admin.password
    }
  })
}


Cypress.Commands.addAll( { getBySel, seedDb, login } )

//used to let typescript know this is no isolated file but a module
export {}