# Tool Shop UI Framework

Playwright end-to-end UI tests for the public [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/) demo. The project uses TypeScript, page objects, custom fixtures, table-driven cases, and isolated browser contexts. It does not call application APIs directly.

## Quick start

Requirements: Node.js 20 or newer and npm.

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
npm run test:smoke
```

Configure local test settings in `.env`; it is intentionally ignored by Git. The invalid-login DDT loads its ten synthetic data sets from `data/invalid-login-cases.csv` and can be run with `npx playwright test tests/account/login-ddt.spec.ts`.

Run all browser tests with `npm test`. This replaces the previous Allure report under `allure-report` after every full run, including runs with test failures. See [local setup](docs/local-setup.md) for environment variables and [test inventory](docs/test-inventory.md) for coverage and known target limitations.

## Common commands

| Command                   | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `npm run test:smoke`      | Critical homepage smoke test                     |
| `npm run test:regression` | Full tagged regression set                       |
| `npm run test:headed`     | Run headed                                       |
| `npm run test:ui`         | Open Playwright UI mode                          |
| `npm run typecheck`       | TypeScript strict type check                     |
| `npm run lint`            | ESLint                                           |
| `npm run format:check`    | Prettier validation                              |
| `npm run report:allure`   | Replace the Allure report using `allure-results` |

Playwright creates HTML, JUnit XML, and Allure results under ignored output folders. View the HTML report with `npx playwright show-report`.

## Safety defaults

Tests that create public demo accounts, send contact requests, or place simulated orders are skipped unless `RUN_MUTATING_TESTS=true` is explicitly set. Authenticated tests require `DEMO_EMAIL` and `DEMO_PASSWORD`. Use credentials for disposable demo accounts only; never commit credentials. See [test data strategy](docs/test-data-strategy.md).

## Framework conventions

- Specs assert user-visible behavior.
- Page objects and shared components own stable locators and common actions.
- Fixtures create page objects per test; Playwright's isolated context is retained.
- DDT is used for comparable input/category cases.
- The public storefront is an external dependency; unavailable routes or backend errors are surfaced as test failures and documented, not hidden.
