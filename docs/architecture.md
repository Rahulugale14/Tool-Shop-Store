# Architecture

## Layers

- `tests/` contains behavior-focused specs, grouped by feature.
- `fixtures/base.fixture.ts` extends Playwright fixtures and creates per-test page objects.
- `pages/` exposes user actions and page locators for catalog, product, account, contact, and checkout flows.
- `components/` contains shared navigation controls.
- `data/` keeps reusable scenario inputs outside page objects.
- `config/env.ts` is the only runtime environment-variable reader and validates URL/boolean settings.

Dependency direction is tests → fixtures/pages/data; fixtures → pages; pages → components. No application API or database access is used.

## Test lifecycle and isolation

Each Playwright test receives a new browser context and page. Catalog and cart tests create state through the UI. Tests that persist an account, support request, or order require `RUN_MUTATING_TESTS=true`; authenticated tests additionally require a disposable `DEMO_EMAIL`/`DEMO_PASSWORD`.

## Reports

Playwright emits HTML, JUnit XML, and Allure result files. Screenshots, traces, and video are retained for failures. Generated artifacts are ignored by Git.
