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

- Or start the dev server with e2e testing:

  ```sh
  npm run test:e2e:dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script currently leaves the database empty, this needs to be fixed.

## Deployment

- Build the app:

  ```sh
  npm run build
  ```

- Start the remix app server (with correct Enviroment Variables):

  ```sh
  npm start
  ```

### Cypress

Verwende ich für e2e testing. Die Tests liegen im `/cypress/e2e` Ordner.

In /cypress/support/commands.ts sind nützliche befehle ausgelagert wie zum Beispiel `cy.login(email, password)`.

Vor den Tests muss die Datenbank in den entsprechenden State gebracht werden. Das geht in der CLI mit `npm run db:seed-for-testing` und in einem cypress test mit `cy.seedDb()`. Der State, der geladen wird, ist in `/prisma/seed/data_for_testing.ts` und wird vom seed script `(/prisma/seed.ts`) automatisch in die datenbank übertragen.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

```

```
