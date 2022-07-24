# Mathebau Events

Das ist der Versuch, ein besseres Event Tool zu schreiben.

## Verwendete Technologien

Ich verwende [Remix](https://remix.run/) als Fullstack-NodeJS Web-Framework.

Als start-template habe ich den Remix-Indie-Stack verwendet, und alles was nicht benötigt wird, entfernt (deploymentspezifische sachen etc.)

Enthalten ist noch:

- Production-ready [SQLite Database](https://sqlite.org)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

- Install the dependencies with `npm install`

- Setup database and prisma client

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script (called by npm run setup (see package.json)) creates a new user with some data you can use to get started:

- Email: `mathebauevents@gmail.com`
- Password: `12341234`

## Deployment

- Build the app:

  ```sh
  npm run build
  ```

- Start the remix app server (with correct Enviroment Variables):

  ```sh
  npm start
  ```


## Testing

Kam ich noch nicht wirklich zu. Sollte ich mal tun ;)

### Cypress

Das ist noch start-template dokumentation, funktioniert nicht mehr exakt so (es gibt keine Users und Notes mehr sondern Admins und Events, etc).

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
