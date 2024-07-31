# DocTime API

NodeJS / ExpressJS API to handle doctor/patients relations and appointments.

## Testing

The API uses different DB for testing. And after the test is done, The DB is truncated.
To run the Jest tests:

```bash
npm run test
```

_Note_
**Insure the environment variable for test db is set**

## Run the API

The API uses nodemon to run the typescript app in dev mode. Run the 'dev' script to run on your local machine (The port is set in `.env` file).

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint and Prettier

Linter:

```bash
npm run lint
```

Prettier:

```bash
npm run format
```

## CI/CD

We use GitHub Actions and Husky To insure code quality.
The Pre-Commit Hooks with Husky lint and type check before committing. After pushing to Main, The GitHub Actions runs the tests, generate Coverage Directory.
The Coverage Directory is auto-deployed in Cloudflare Page: [Page URL](https://doctime-api-coverage.pages.dev)
