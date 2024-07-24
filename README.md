# DocTime API

NodeJS / ExpressJS API to handle doctor/patients relations and appointments.

## Testing

The API uses different DB for testing. And after the test is done, The DB is truncated.
To run the Jest tests:

```bash
npm run test
```

*Note*
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
