# Test data strategy

- Static invalid search/login values live in `data/`.
- `data/invalid-login-cases.csv` is the source of truth for the ten CSV-driven invalid-login scenarios. `helpers/csv-data.ts` validates and loads rows when Playwright discovers the tests.
- Product selection uses catalog UI discovery or one currently observed product URL; prices are read from the rendered cards, never copied as expected constants.
- `createUniqueRegistrationData()` creates a random email alias for a single registration attempt. Do not assume the public app can delete created accounts.
- Authenticated workflows use `DEMO_EMAIL` and `DEMO_PASSWORD`; neither value is logged. Missing credentials skip only those explicitly authenticated cases.
- Browser storage, cart state, and cookies are isolated by Playwright's fresh context per test.
- `RUN_MUTATING_TESTS` defaults to false and gates account creation, contact submission, and order submission because those actions can create persistent public data.
- No API, database, or direct local-storage setup is used.
- Local configuration belongs in `.env`, which is ignored by Git. `.env.example` documents the safe configuration keys; keep real credentials only in `.env` or a secret manager and never commit them.
