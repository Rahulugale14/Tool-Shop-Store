# Tool Shop UI Framework — Playwright Agent Context

> **Purpose:** This file is the authoritative project brief and operating contract for any AI coding agent that inspects, creates, refactors, tests, or maintains this repository.
>
> **Project name:** `Tool Shop UI Framework`  
> **System under test:** [Practice Software Testing — Toolshop](https://practicesoftwaretesting.com/)  
> **Automation scope:** Browser-based UI automation only  
> **Language / framework:** TypeScript + Playwright Test  
> **Primary architecture:** Page Object Model (POM), data-driven testing (DDT), fixtures, deterministic test data, clean engineering practices

---

## 1. Primary objective — non-negotiable

Refactor or create the repository as a clean, scalable, maintainable, professional UI automation framework that follows sound software-engineering practices. It must support:

1. UI automation only, using Playwright and TypeScript.
2. Page Object Model (POM) with clear page/component boundaries.
3. Data-driven testing (DDT) for meaningful input and scenario variations.
4. End-to-end UI workflows across realistic customer journeys.
5. Local developer execution on Windows, macOS, and Linux where feasible.
6. Docker-based execution with reproducible dependencies.
7. GitHub Actions CI/CD.
8. Jenkins CI/CD.
9. Environment-specific configuration through `.env` patterns.
10. Type checking, linting, formatting, and explicit quality gates.
11. Allure reports, Playwright HTML reports, and machine-readable JUnit results.
12. Failure screenshots, traces, video where useful, console/page-error capture, and actionable debugging logs.
13. Reliable test isolation, deterministic data, parallel-safe execution, and controlled cleanup.
14. Clear documentation so another SDET can onboard and contribute quickly.

**Do not** turn this into a script dump. Design the framework first, implement it in coherent layers, run it, inspect failures, and refine it.

### Scope boundaries

- **IN SCOPE:** browser UI interactions, visible UI state, navigation, forms, client-side validation, product browsing, cart behavior, authentication UI flows, registration UI, sorting/filtering/search UI, checkout-related UI only to the extent safely supported by the public demo, responsive layouts, accessibility-oriented locator practices, UI regression and E2E journeys.
- **OUT OF SCOPE:** API testing, direct HTTP calls to application endpoints, database testing, SQL, direct database access, backend contract testing, performance/load testing, security penetration testing, and tests that bypass the UI to create or mutate application state.
- Do not use Playwright `request`, `APIRequestContext`, `fetch`, Axios, direct API endpoints, database clients, or hidden application internals to set up or verify test state. Normal browser navigation and browser-rendered UI behavior are allowed.
- Do not claim that a scenario is covered until a real test exists and has been executed successfully or its blocker is documented.
- The demo application is a third-party public environment. Be polite: avoid high-volume traffic, destructive loops, aggressive parallelism, and repeated account creation. Never test denial-of-service behavior.
- Prefer the current v5 site at `https://practicesoftwaretesting.com/`. Keep the base URL configurable; do not hard-code it throughout tests.
- Treat the website as an external dependency that can change. Discover current behavior from the rendered UI and verify assumptions before implementing locators or expected results.

---

## 2. Agent operating protocol

Before writing or changing code, the agent must:

1. Inspect the complete repository: files, package scripts, dependencies, Playwright config, TypeScript config, existing tests, fixtures, CI workflows, Docker files, documentation, and Git state.
2. Preserve useful working code. Do not delete files or rewrite the whole project without explaining why.
3. Inspect the live website in a real browser if browser tooling is available. Visit relevant pages and observe current labels, navigation, forms, product cards, filters, cart, and authentication behavior. If browser inspection is unavailable, state that limitation and use conservative, verifiable locators rather than inventing DOM details.
4. Build a concise feature inventory and testability map before implementing broad coverage.
5. Identify existing conventions and align with them unless they conflict with this document.
6. Produce a small implementation plan, then execute it end to end rather than stopping after generating files.
7. Run the applicable commands: format check, lint, typecheck, focused tests, full suite, and report generation. Record exact outcomes.
8. Fix root causes, not just symptoms. Never make a test pass by removing meaningful assertions, swallowing errors, adding arbitrary sleeps, or weakening configuration without justification.
9. Summarize what changed, what was executed, pass/fail counts, artifacts generated, known limitations, and the next best steps.

### Truthfulness and safety rules

- Never invent selectors, routes, test IDs, product names, prices, success messages, or expected behavior.
- Confirm current behavior before asserting exact text or URL.
- Do not print credentials, tokens, cookies, storage state, or secrets into logs or reports.
- Never commit `.env`, credentials, generated auth state, browser profiles, or secrets.
- Do not use a real person's email or personal information for registration tests.
- Do not rely on shared mutable state between tests.
- Do not silently skip failures or mark tests as expected failures just to obtain a green pipeline.
- Do not automatically retry indefinitely. Retries are a diagnostic safety net, not a substitute for stable tests.
- Do not run destructive or high-volume test loops against the public hosted website.

---

## 3. Target application understanding and discovery

The target is an e-commerce training application called Toolshop. Its public project documentation describes multiple sprint versions, with the current site corresponding to v5. The application is intended for software-testing practice. The UI is the sole system interface for this framework.

### Feature areas to inspect

Confirm which of the following are present and functional on the current target before creating tests:

- Home page and global navigation
- Product listing / catalog
- Product cards and product details
- Product search
- Category navigation and category filtering
- Sorting and other visible catalog filters, if present
- Pagination or load-more behavior, if present
- Product quantity controls, if present
- Add-to-cart action
- Cart page, cart badge/count, line items, quantity updates, removal, subtotal/total
- Registration form and validation
- Login form and validation
- Logout and authenticated navigation
- Customer profile/address fields, if present
- Checkout and order confirmation flow, if supported by the current demo state
- Favorites/wishlist, if present
- Contact or other visible forms, if present
- Footer links and navigation
- Responsive behavior at desktop, tablet, and mobile viewports
- Empty states, error states, disabled states, loading states, and success notifications

This is a **discovery checklist, not a claim that every feature is currently implemented**. Mark each feature as `Confirmed`, `Not present`, `Blocked`, or `Not yet inspected` in the test inventory.

### Test inventory artifact

Create `docs/test-inventory.md` with columns:

| Feature | UI entry point | Scenarios | Priority | Automation status | Notes / evidence |
|---|---|---|---|---|---|

Prioritize:
- **P0:** core purchase/catalog flow and authentication blockers
- **P1:** major user-facing validations and alternate workflows
- **P2:** responsive checks, secondary links, edge cases, and cosmetic behavior

Keep expected outcomes grounded in observed UI behavior. Where business rules are unclear, document the uncertainty rather than inventing requirements.

### Target environments

Use `.env`-driven configuration, for example:

- `.env.example` — safe documented defaults only
- `.env.local` — developer-specific settings, ignored by Git
- `.env.test` — optional local test defaults, no secrets
- CI environment variables / CI secret store — credentials and sensitive values

Suggested non-secret settings:

```dotenv
BASE_URL=https://practicesoftwaretesting.com
TEST_ENV=local
BROWSER=chromium
HEADLESS=true
WORKERS=2
ACTION_TIMEOUT_MS=10000
EXPECT_TIMEOUT_MS=5000
NAVIGATION_TIMEOUT_MS=30000
TRACE_MODE=retain-on-failure
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure
```

Do not load arbitrary `.env.*` files unpredictably. Define and document precedence. CI-provided environment variables should override file defaults. Validate required values early with a typed configuration module. Keep a safe default base URL so a fresh clone can run without credentials.

Credentials, if needed for an authorized demo login, should be optional environment variables such as `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`. Never assume public demo credentials are permanent. Verify any published credentials against current project documentation and use them only for low-impact UI tests. Registration tests should use generated unique aliases only when permitted by the site and avoid uncontrolled account creation.

---

## 4. Recommended architecture

Use a feature-oriented but not overengineered structure. Adapt to the existing repository if it already has a sound equivalent.

```text
tool-shop-ui-framework/
├── .github/
│   └── workflows/
│       ├── playwright-ci.yml
│       └── scheduled-regression.yml        # optional
├── .husky/                                 # optional local hooks
├── config/
│   └── environments.ts                     # typed environment mapping, if needed
├── docker/
│   └── README.md                           # optional Docker notes
├── docs/
│   ├── architecture.md
│   ├── coding-standards.md
│   ├── local-setup.md
│   ├── ci-cd.md
│   ├── test-inventory.md
│   ├── test-data-strategy.md
│   └── troubleshooting.md
├── fixtures/
│   ├── base.fixture.ts                     # custom Playwright fixtures
│   └── test-context.types.ts                # only if custom typing adds value
├── pages/
│   ├── base.page.ts                        # shared, minimal base abstractions
│   ├── home.page.ts
│   ├── product-list.page.ts
│   ├── product-details.page.ts
│   ├── cart.page.ts
│   ├── login.page.ts
│   ├── registration.page.ts
│   ├── account.page.ts                     # only if present
│   └── checkout.page.ts                    # only if present
├── components/
│   ├── header.component.ts
│   ├── footer.component.ts
│   ├── product-card.component.ts
│   ├── pagination.component.ts              # only if present
│   ├── notification.component.ts
│   └── cookie-consent.component.ts           # only if present
├── data/
│   ├── users.data.ts
│   ├── search.data.ts
│   ├── registration.data.ts
│   ├── cart.data.ts
│   └── product.data.ts                       # stable identifiers/criteria, not stale prices
├── factories/
│   ├── user.factory.ts
│   └── test-data.factory.ts
├── helpers/
│   ├── env.ts
│   ├── logger.ts
│   ├── assertions.ts                         # only meaningful domain assertions
│   ├── money.ts                              # if monetary UI values need parsing
│   └── test-id.ts                            # deterministic unique test identifiers
├── tests/
│   ├── smoke/
│   │   ├── home.smoke.spec.ts
│   │   └── catalog.smoke.spec.ts
│   ├── catalog/
│   │   ├── product-list.spec.ts
│   │   ├── search.spec.ts
│   │   ├── category-filter.spec.ts
│   │   └── product-details.spec.ts
│   ├── cart/
│   │   ├── add-to-cart.spec.ts
│   │   ├── cart-quantity.spec.ts
│   │   └── remove-from-cart.spec.ts
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── registration.spec.ts
│   ├── checkout/
│   │   └── checkout.spec.ts                  # only if safely supported
│   ├── forms/
│   │   └── validation.spec.ts
│   └── responsive/
│       └── responsive-navigation.spec.ts
├── test-results/                             # generated; ignored by Git
├── playwright-report/                        # generated; ignored by Git
├── allure-results/                           # generated; ignored by Git
├── allure-report/                            # generated; ignored by Git
├── .dockerignore
├── .env.example
├── .gitignore
├── .npmrc                                   # only if justified
├── .prettierignore
├── .prettierrc.json
├── Dockerfile
├── Jenkinsfile
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
├── tsconfig.json
└── playwright-context.md
```

### Structure rules

- Keep specs focused on behavior and assertions, not DOM implementation details.
- Page objects encapsulate page-specific locators and user actions.
- Components encapsulate reusable sections that appear across pages.
- Fixtures compose page objects and shared test services using Playwright's fixture mechanism.
- Data files contain scenario inputs; factories create unique data when uniqueness is required.
- Helpers should be small, deterministic, and framework-agnostic where possible.
- Avoid a giant `BasePage` that becomes a dumping ground. Put only truly shared behavior there.
- Avoid a generic “click anything” or “find element by string” abstraction that hides Playwright's native API.
- Do not add a service layer for API/database operations; those are out of scope.
- Do not create empty folders or speculative abstractions without a real consumer.
- Keep imports one-way where practical: specs → fixtures/pages/data; pages → components/helpers; fixtures → pages/config. Avoid circular imports.

---

## 5. Page Object Model standards

### Responsibilities

Each page object should:
- Represent one actual page or coherent page-level workflow.
- Receive a `Page` instance through its constructor or fixture injection.
- Define locators as private or readonly members where it improves clarity.
- Expose meaningful user actions (`searchForProduct`, `openProduct`, `addToCart`) rather than low-level implementation details.
- Expose locators or read-only methods only when tests need to make clear assertions.
- Use Playwright locators and auto-waiting; do not cache `ElementHandle` objects.
- Avoid embedding test assertions throughout every action method. Keep most test expectations in specs; page objects may guard essential preconditions only when helpful.
- Avoid navigating in constructors. Constructors should assign dependencies and locators, not perform browser actions.
- Avoid hidden retries, broad exception catches, and arbitrary waits.
- Avoid keeping mutable per-test state in module-level variables.

### Example pattern

```ts
import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole('button', { name: /sign in|login/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

This is an illustrative pattern only. **Verify the actual route, labels, and button name in the current UI before using them.** Prefer exact accessible names once confirmed. Do not preserve multiple speculative selector fallbacks indefinitely.

### Locator priority

Prefer, in order:

1. `getByRole()` with accessible name
2. `getByLabel()`
3. `getByPlaceholder()` when the placeholder is stable and meaningful
4. `getByTestId()` when the application provides a stable test ID
5. `getByText()` for user-visible text where ambiguity is controlled
6. CSS selectors anchored to stable attributes as a last resort

Avoid:
- Absolute XPath
- Long CSS chains
- `nth()` without a documented reason and a stable ordering contract
- Selectors based on styling classes or generated IDs
- `page.locator('div').filter(...)` chains that are hard to understand
- Fixed sleeps such as `waitForTimeout(3000)` to “stabilize” tests
- `networkidle` as a default readiness condition on applications with ongoing network activity

Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`, etc.) and Playwright's auto-waiting. Assert user-visible outcomes, not internal implementation details.

### Shared components

Use components for genuinely repeated UI sections, such as header/navigation, footer, product cards, notifications, and cookie-consent prompts. A `ProductCardComponent` may be initialized with a card-scoped locator so actions are scoped to the correct product. Do not make a component for every single button.

### Page-object quality

- Page objects must be typed.
- Methods should have descriptive names and explicit parameters/return types where helpful.
- No test-specific expectations or scenario branching inside generic page methods unless it reflects a genuine UI workflow.
- Do not create page objects for routes/features that are not confirmed to exist.
- Do not duplicate locators across specs.
- If the UI changes, update the relevant page/component object once and re-run affected tests.

---

## 6. Test design and naming

Use `@playwright/test`. Every spec should express a user-observable behavior and have a meaningful title.

Good examples:
- `should display products when the catalog loads`
- `should filter products by the selected category`
- `should show a validation message when required login fields are empty`
- `should update the cart when a product is added`
- `should remove a line item from the cart`
- `should prevent registration when required fields are invalid`

Avoid titles like `test 1`, `verify page`, `works fine`, or titles that encode implementation details.

### Test categories and tags

Use Playwright projects, directories, or tags to distinguish:
- `@smoke` — small, critical set for every PR
- `@regression` — broader UI suite
- `@auth` — authentication/registration
- `@catalog` — browsing/search/filtering
- `@cart` — cart interactions
- `@e2e` — multi-page user journeys
- `@responsive` — viewport-specific behavior

Use tags consistently. Keep smoke tests fast and low-dependency. Do not create many browser projects or tags without a practical CI need.

### Assertion standards

- Assert both the action outcome and meaningful state where appropriate.
- For cart flows, verify visible cart state such as line item, quantity, badge, or total according to observed application behavior.
- For searches/filters, verify the result set actually changes and meets the chosen criteria, not merely that a click happened.
- For forms, verify invalid inputs are rejected and valid inputs produce the expected UI state.
- For navigation, assert the URL or unique page heading plus relevant content.
- Do not assert exact product prices unless the scenario has a reliable reason to do so. Prices and catalog contents can change on the public site.
- Prefer stable product selection based on observed product names/categories or deterministic criteria. If no stable product is guaranteed, discover a suitable product through the UI and record the selection logic.
- Make assertions specific enough to detect a regression but not so brittle that harmless copy changes break the suite.

---

## 7. Data-driven testing (DDT)

Use table-driven tests when multiple inputs share the same behavior and setup. Use named cases with explicit expected outcomes.

```ts
import { test, expect } from '../../fixtures/base.fixture';

const searchCases = [
  { name: 'matching product term', query: 'hammer', shouldFindResults: true },
  { name: 'unlikely term', query: 'no-such-tool-term-xyz', shouldFindResults: false },
];

for (const scenario of searchCases) {
  test(`product search: ${scenario.name}`, async ({ productListPage }) => {
    await productListPage.goto();
    await productListPage.searchFor(scenario.query);

    if (scenario.shouldFindResults) {
      await expect(productListPage.productCards.first()).toBeVisible();
    } else {
      await expect(productListPage.emptyState).toBeVisible();
    }
  });
}
```

This is a pattern, not a promise that these exact selectors or empty-state messages exist. Implement it only after inspecting the real UI.

### DDT rules

- Each case must have a clear name, input, and expected outcome.
- Do not overuse DDT for scenarios that have meaningfully different workflows.
- Keep test data separate from page-object code.
- Do not share mutable objects across tests.
- Avoid massive data matrices that hammer the public site. Keep the normal CI set bounded.
- For invalid form cases, use a small representative matrix: empty required fields, malformed email, weak password, and boundary cases only where the UI/business rules support them.
- Do not hard-code secrets in test data.
- Keep dynamic data reproducible where possible. If random data is used, include a deterministic seed or record a safe identifier in the test output.
- Test names should make failed data cases understandable in reports.

---

## 8. Fixtures and test isolation

Create a typed custom fixture layer extending Playwright's `test`. Fixtures should create page objects per test and provide a single clean import path for tests.

Illustrative pattern:

```ts
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductListPage } from '../pages/product-list.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';

type AppFixtures = {
  homePage: HomePage;
  productListPage: ProductListPage;
  cartPage: CartPage;
  loginPage: LoginPage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
```

Adapt the imported pages to actual confirmed features. Avoid importing all page objects into every fixture if that makes the fixture graph unnecessarily expensive or confusing.

### Isolation requirements

- Rely on Playwright's fresh browser context per test by default.
- Do not use one shared `Page` or browser context across tests.
- Do not depend on test execution order.
- Avoid storage-state reuse unless there is a clear benefit and it is safely isolated. If authenticated storage state is introduced, document how it is created, secured, ignored by Git, and invalidated.
- Each test must create its own cart/session state through UI interactions when feasible.
- Do not assume the public site resets server-side state after a test.
- For persistent server-side actions (registration, order placement, profile changes), use dedicated test identities only when permitted; generate unique addresses cautiously, and document cleanup limitations.
- Avoid tests that require a previously created account or order unless the dependency is explicit and independently managed.
- Tests should be parallel-safe. If the public environment exhibits shared-state conflicts, reduce worker count or isolate affected tests rather than adding hidden cross-test dependencies.
- Use cleanup hooks only for state the test can safely and legitimately clean up through the UI. Cleanup should not mask the original failure; log cleanup failures separately.
- Prefer test-level setup and teardown through fixtures or `try/finally` when it makes resource ownership clear.
- Do not use application APIs, database writes, or direct local storage mutation as a shortcut for setup.

---

## 9. Deterministic test data and factories

Separate:
- **Static scenario data:** fixed search terms, valid/invalid input examples, expected validation categories.
- **Generated unique data:** registration emails or names where a new record is needed.
- **Observed catalog data:** product criteria and category names that may change; avoid copying a stale product catalog into constants.
- **Secrets:** environment variables or CI secret store only.

Create a factory such as `createUniqueUser()` that returns a typed user object. It should generate a collision-resistant email alias without including personal information or secrets. Prefer an explicit test-run identifier plus a safe random suffix if the site accepts it. If randomness is used, log the generated non-sensitive identifier so the run can be diagnosed.

Do not use `Math.random()` everywhere without a traceable strategy. Use deterministic fixed data for negative validation cases. For tests requiring an existing user, load credentials from environment configuration and skip/fail clearly according to the agreed policy when those credentials are absent. Do not silently skip core smoke tests because optional credentials are missing; keep authenticated tests separately selectable if necessary.

Do not assume generated registrations can be deleted. Since the target is a public demo, avoid creating a new account on every retry or every browser project unless the site explicitly supports safe disposable accounts.

---

## 10. Configuration and environment management

Create a single typed configuration module responsible for reading and validating process environment variables. Do not scatter `process.env` throughout the codebase.

Configuration requirements:
- `BASE_URL` with a safe default of `https://practicesoftwaretesting.com`
- Environment name (local/ci/staging if applicable)
- Browser/project selection
- Headless mode
- Worker count
- Timeout settings
- Retry settings
- Trace, screenshot, and video modes
- Optional test credentials
- Optional log level

Validate numeric values and boolean strings rather than relying on truthy strings (`"false"` is still truthy in JavaScript). Fail fast on malformed configuration. Never log passwords.

Suggested precedence:
1. Explicit process/CI environment variables
2. Selected local `.env` file
3. Safe defaults for non-secret settings

Document the precedence in `docs/local-setup.md`. Use a maintained `.env` loader only if needed; if adding one, keep it minimal and pin it in the lockfile. Ensure environment loading happens before configuration is imported. Do not add a complex configuration framework for a single base URL.

`.env.example` should contain keys and placeholder values only. `.env*` files with actual values must be ignored, with `.env.example` explicitly allowed. Do not place secrets in Docker image layers or GitHub workflow YAML.

---

## 11. Playwright configuration standards

Configure `playwright.config.ts` with:
- `testDir`
- `fullyParallel` only if the target can tolerate it
- CI-aware retries
- bounded workers in CI
- `forbidOnly` in CI
- meaningful timeouts
- `baseURL` from typed configuration
- screenshot on failure
- trace retained on failure or first retry, with a documented strategy
- video retained on failure if storage cost is acceptable
- reporters for HTML, JUnit, and Allure
- browser projects appropriate to the agreed support matrix

Start with Chromium for the most reliable smoke/CI baseline. Add Firefox and WebKit only after the core suite is stable and the target/browser support goals justify the extra runtime. If multi-browser testing is enabled, keep it selectable and avoid multiplying expensive registration/checkout tests unnecessarily.

Recommended artifact policy:
- HTML report: generated per run, not committed
- JUnit XML: generated for Jenkins/GitHub test result ingestion
- Allure results: generated per run and retained as CI artifacts
- Screenshot: only on failure
- Trace: retained on failure; inspect with Playwright Trace Viewer
- Video: retain on failure where supported and useful
- Logs: timestamped, concise, no secrets

Do not set every test to a huge timeout. Prefer a reasonable global timeout and specific overrides only for genuinely slower flows. Use Playwright web-first assertions and avoid fixed sleeps.

---

## 12. Logging and diagnostics

Implement useful diagnostics without building a custom logging platform.

At minimum:
- Test title, environment, browser/project, and base URL (URL only, no credentials)
- Test start/end and duration where practical
- Action-level logging for important multi-step flows
- Browser console errors and uncaught page errors attached to failed tests
- Screenshot and trace on failure
- Clear error context when a page object action fails
- Test data identifiers that are safe to log

Do not log every locator poll or every keystroke. Do not attach secrets, cookies, authorization headers, storage-state files, or full sensitive form contents. Keep logs readable and actionable.

Use Playwright's built-in test output and attachments first. Add a small helper only when it makes diagnostics more consistent. A logger must not swallow exceptions or replace Playwright's original error stack.

---

## 13. Reports and quality gates

### Required reporting

1. **Playwright HTML report** for interactive failure exploration.
2. **JUnit XML** for CI test result publishing.
3. **Allure results/report** for richer history and categorization.
4. **Failure screenshot** and trace attachment for failed tests.
5. Optional video on failure if useful and affordable.

Choose a maintained Allure Playwright reporter package and document any local CLI requirement. Pin dependencies and keep `package-lock.json` committed. Ensure report generation works on a clean clone. Avoid relying on a globally installed Allure binary without documenting it; a Docker or local documented CLI path is acceptable.

### Quality gates

The normal verification pipeline should include:
1. dependency install using the lockfile (`npm ci`)
2. formatting check
3. ESLint
4. TypeScript typecheck
5. focused smoke test
6. full UI regression suite where appropriate
7. report publication/upload even when tests fail
8. clear final pipeline status

Never make the pipeline green if lint/typecheck fails. Test failure must fail the job, while reports and artifacts should still upload using an always-run/finally step. Avoid making Allure generation failure obscure the original test failure; preserve both statuses when possible.

Suggested scripts (adjust to the actual chosen packages):

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:regression": "playwright test --grep @regression",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:chromium": "playwright test --project=chromium",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "report:allure": "allure generate allure-results --clean -o allure-report"
  }
}
```

These scripts are a proposed baseline. Make sure every referenced CLI exists in `devDependencies`, and ensure report commands handle missing results gracefully. Do not add scripts that are untested or misleading.

---

## 14. TypeScript, ESLint, and Prettier

Use strict TypeScript. Recommended compiler options include:
- `strict: true`
- `noImplicitAny: true`
- `noUncheckedIndexedAccess: true` where practical
- `exactOptionalPropertyTypes: true` if compatible with the codebase
- `forceConsistentCasingInFileNames: true`
- `esModuleInterop: true`
- `resolveJsonModule: true` only if JSON imports are needed
- a suitable modern `target` and `module` compatible with Playwright and the installed Node.js LTS

ESLint should catch unsafe TypeScript, unused variables/imports, inconsistent patterns, and obvious errors. Use a maintained TypeScript ESLint setup compatible with the installed ESLint major version. Prettier should own formatting; avoid conflicting stylistic ESLint rules.

Standards:
- No `any` unless justified and isolated.
- Avoid non-null assertions unless an invariant is clearly established.
- Prefer `unknown` plus narrowing over `any`.
- Use explicit return types on public page-object methods and non-trivial helpers.
- Avoid ignored promises and unhandled async work.
- Do not disable lint rules globally to get the build passing.
- Any rule suppression must be local, justified, and ideally temporary.

---

## 15. Git hygiene and repository standards

Create/maintain `.gitignore` entries for at least:
- `node_modules/`
- `.env` and real `.env.*` files (allow `.env.example`)
- `playwright-report/`
- `test-results/`
- `allure-results/`
- `allure-report/`
- `blob-report/`
- generated screenshots/videos/traces
- authentication state such as `playwright/.auth/`
- OS/editor artifacts

Commit the package lockfile. Do not commit generated reports or test evidence by default. Use descriptive commit messages and keep changes logically grouped. Do not rewrite Git history or force-push unless explicitly asked.

---

## 16. Docker execution

Provide a Dockerfile using an official Playwright image that matches the project's installed Playwright version, or use an appropriately maintained Node LTS image and install the required browsers/dependencies. Version compatibility must be deliberate: the Playwright package version and browser image version must match.

Requirements:
- Reproducible installation with `npm ci`
- Non-interactive/headless execution by default
- A configurable `BASE_URL`
- Correct report and test-result output handling
- Non-root execution when practical and supported
- `.dockerignore` excluding secrets, `node_modules`, reports from previous runs, Git metadata, and local `.env` files
- Exit code reflects test success/failure
- No secrets baked into the image
- Documentation for build, smoke run, regression run, and copying/persisting reports

Illustrative commands to document and then verify:

```bash
docker build -t tool-shop-ui-framework .
docker run --rm -e BASE_URL=https://practicesoftwaretesting.com tool-shop-ui-framework
```

Mount an output directory/volume if reports must persist outside the container. Confirm that the chosen image's working directory and user permissions permit writing artifacts. Do not assume the illustrative Docker commands work until tested against the actual Dockerfile.

---

## 17. GitHub Actions CI/CD

Create a workflow such as `.github/workflows/playwright-ci.yml` that:
- Runs on pull requests and pushes to the main development branch
- Supports manual dispatch if useful
- Uses a supported Node.js LTS version
- Uses `npm ci`
- Installs the Playwright browsers required by the selected projects
- Runs format check, lint, typecheck, smoke tests, and regression tests according to a sensible PR/runtime strategy
- Sets `CI=true`
- Uses bounded concurrency and workers to avoid overloading the public demo
- Uploads Playwright HTML report, JUnit XML, Allure results, traces, and screenshots as artifacts even on failure
- Uses least-privilege workflow permissions
- Does not expose secrets in logs
- Has a timeout to prevent hung jobs
- Uses caching only where safe and useful
- Reports failures clearly

Avoid using an obsolete action version. Pin actions to a supported major version or an immutable SHA if the repository policy requires it. Use CI environment variables for credentials; never put credentials in YAML. Keep the workflow readable and maintainable.

Suggested strategy:
- Pull request: quality gates + smoke suite
- Main branch: quality gates + full regression
- Scheduled run: optional broader cross-browser suite after the core suite is reliable

Do not run expensive cross-browser suites on every PR by default without a reason.

---

## 18. Jenkins CI/CD

Create a declarative `Jenkinsfile` with stages such as:
1. Checkout
2. Install dependencies (`npm ci`)
3. Install/verify browsers if the agent image does not already include them
4. Format check
5. Lint
6. Typecheck
7. UI smoke or regression tests
8. Generate reports
9. Publish JUnit results
10. Archive HTML, Allure results, screenshots, videos, and traces
11. Clean workspace safely

Requirements:
- Use `post { always { ... } }` to publish reports and archive artifacts after failures.
- Preserve the original test exit status.
- Use Jenkins credentials binding for secrets if credentials are needed.
- Never echo credentials.
- Document required agent capabilities: Node version, browser dependencies or Docker support, disk space, and network access to the target.
- Make the target URL configurable through Jenkins environment variables/parameters.
- Avoid deleting useful diagnostics before they are archived.
- Use `disableConcurrentBuilds()` or a reasonable concurrency limit if simultaneous runs destabilize the public demo.
- Keep the pipeline declarative and readable.
- If Docker is the canonical Jenkins execution environment, document that assumption and make the Jenkinsfile match it.

The pipeline must fail on quality-gate or test failures, but still publish the evidence.

---

## 19. E2E workflow strategy

Build end-to-end scenarios only after the component-level UI behavior is understood. Potential journeys, subject to confirmation against the live application:

1. **Browse and search:** open home → navigate to catalog → search for a term → verify matching results.
2. **Category filtering:** open catalog → choose a category → verify visible products match the category.
3. **Product details:** select a visible product → verify title/details and key controls.
4. **Cart addition:** select a product → add it to cart → open cart → verify the line item and visible count/quantity.
5. **Cart quantity/removal:** change quantity or remove an item → verify the cart reflects the change.
6. **Login validation:** submit empty or invalid values → verify validation behavior.
7. **Valid login/logout:** use an authorized configured test account → verify authenticated state → log out → verify anonymous state.
8. **Registration validation:** submit missing/invalid fields → verify validation messages without creating unnecessary accounts.
9. **Registration success:** only if explicitly allowed and safe; use unique test data and document the persistent side effect.
10. **Checkout journey:** only if the live demo supports a safe, repeatable completion path. Do not place real orders or use real payment details.
11. **Responsive navigation:** verify essential navigation and catalog controls at supported viewport sizes.

Keep critical journeys independent. If one workflow depends on an account, it should provision or select that account through a documented, safe process and should not rely on a different test having run first.

---

## 20. Reliability and anti-flakiness rules

- Use locator auto-waiting and web-first assertions.
- Wait for the specific user-visible condition that matters.
- Use `expect.poll()` only for legitimate eventual UI state, not to hide incorrect synchronization.
- Avoid fixed sleeps and broad `waitForLoadState('networkidle')` as default strategies.
- Avoid asserting a locator count before the page has reached the relevant state.
- Use stable accessible locators.
- Keep test data and state isolated.
- Do not over-parallelize the public website. Start conservatively (for example, 1–2 workers in CI), measure stability, then adjust.
- Use retries only in CI as a diagnostic safety net; report flaky/retried tests clearly.
- Investigate every retry-passing test. Do not accept a permanently flaky suite.
- Avoid test interdependence, order dependence, and shared mutable globals.
- Avoid blanket exception handling and conditional “if element exists, pass” patterns.
- Do not silently skip when an expected page element is missing. That may indicate a real regression.
- When the site is unavailable, distinguish infrastructure/target outage from a product assertion failure using clear diagnostics.
- Keep third-party demo limitations documented; do not weaken every assertion to accommodate intermittent target issues.

---

## 21. Accessibility and responsive UI practices

This is a UI automation framework, not a full accessibility certification tool. Still:
- Prefer role- and label-based locators.
- Verify important controls are visible and usable by keyboard where practical.
- Include representative desktop and mobile viewport checks.
- Check that navigation, search, product cards, and cart controls remain usable at supported widths.
- Avoid pixel-perfect assertions unless visual regression is explicitly approved.
- If adding accessibility tooling, use it as a separate, documented layer and avoid presenting a limited automated scan as full accessibility compliance.

---

## 22. Security and privacy

- Treat `.env` files, storage-state JSON, cookies, and screenshots as potentially sensitive artifacts.
- Never commit secrets or real customer data.
- Do not print password values or serialize all process environment variables.
- Use only test identities and fictitious data.
- Do not use real payment details.
- Keep CI artifact retention reasonable.
- Avoid attaching full-page screenshots if they expose personal information.
- Do not test admin-only or destructive functionality unless explicitly approved and safely scoped.
- Public demo credentials, if discovered in documentation, are not secrets but can change; do not make core tests depend on them without validation.
- The public site is not controlled by this project; keep test volume respectful and never probe hidden endpoints.

---

## 23. Documentation deliverables

Maintain:
- `README.md`: project purpose, prerequisites, quick start, commands, reports, troubleshooting.
- `docs/architecture.md`: layer responsibilities, dependency direction, fixture lifecycle, POM and DDT design.
- `docs/local-setup.md`: Node version, install, browser install, `.env` setup, local commands, environment precedence.
- `docs/ci-cd.md`: GitHub Actions and Jenkins setup, secrets, artifacts, supported execution modes.
- `docs/test-inventory.md`: observed feature matrix, priority, scenarios, automation status, known limitations.
- `docs/test-data-strategy.md`: data sources, generation, uniqueness, cleanup, and persistence risks.
- `docs/troubleshooting.md`: common failures, trace viewer usage, report commands, target outage diagnosis.
- `playwright-context.md`: this authoritative agent contract.

Avoid contradictory instructions between README and this file. If implementation choices change, update the documentation in the same change.

---

## 24. Definition of done

The project is not complete merely because files have been generated. It is complete when the applicable items below have been verified.

### Architecture
- [ ] Clean, documented folder structure exists.
- [ ] POM is implemented for confirmed pages and reusable UI components.
- [ ] Specs focus on behavior and assertions.
- [ ] Fixtures inject page objects cleanly.
- [ ] DDT is used where it improves clarity and coverage.
- [ ] No API or database test code exists.

### Execution
- [ ] Fresh-clone setup is documented.
- [ ] `npm ci` succeeds.
- [ ] Playwright browser installation is documented and reproducible.
- [ ] Local smoke tests run successfully against the configured base URL.
- [ ] Full suite can be run independently.
- [ ] Environment settings are validated and `.env.example` is present.
- [ ] Docker build and test execution have been verified, or any external blocker is explicitly documented.

### Quality
- [ ] Typecheck passes.
- [ ] ESLint passes.
- [ ] Prettier check passes.
- [ ] No `test.only` remains.
- [ ] No unhandled promise or obvious untyped escape hatch remains.
- [ ] No arbitrary sleep is used for synchronization without a written, exceptional reason.
- [ ] No hard-coded secrets exist.
- [ ] No tests depend on execution order.

### Reporting and CI
- [ ] HTML report is generated.
- [ ] JUnit XML is generated and parseable by CI.
- [ ] Allure results are generated and report generation is documented.
- [ ] Failure screenshots and traces are captured and inspectable.
- [ ] GitHub Actions workflow is syntactically valid and configured.
- [ ] Jenkinsfile is syntactically valid and configured.
- [ ] CI publishes evidence even after test failure.
- [ ] Pipeline exit status correctly reflects quality/test failures.

### Test coverage
- [ ] Test inventory accurately reflects the current website.
- [ ] Critical catalog and cart UI paths have meaningful assertions.
- [ ] Authentication/form tests are included where supported and safe.
- [ ] E2E tests are independent and deterministic as far as the public target allows.
- [ ] Unsupported or blocked flows are documented, not falsely marked complete.

At the end, provide a concise completion report listing each command run, its result, the number of tests passed/failed/skipped, report locations, Docker/CI validation status, and any known external blockers. Never claim a check passed unless it was actually executed.

---

## 25. Suggested implementation sequence for agents

Execute in phases. Keep the repository runnable after each phase.

### Phase 1 — Repository and target reconnaissance
- Inspect the existing project and Git state.
- Inspect the live site and current project documentation.
- Build `docs/test-inventory.md`.
- Record observed routes, labels, product-card structure, cart behavior, forms, and any test-environment limitations.
- Identify the minimal viable P0 smoke suite.

### Phase 2 — Framework foundation
- Establish Node/TypeScript conventions and package scripts.
- Add strict TypeScript, ESLint, Prettier, `.gitignore`, `.env.example`, typed environment validation, and Playwright config.
- Confirm one trivial smoke test runs before building many page objects.

### Phase 3 — POM and fixtures
- Implement page objects and shared components for confirmed UI features.
- Implement custom fixtures and typed test data/factories.
- Confirm locator uniqueness and avoid brittle selectors.

### Phase 4 — Core UI coverage
- Add catalog, search, category, product-details, cart, and form/auth tests according to observed features.
- Use DDT where appropriate.
- Add at least one coherent E2E journey.
- Run tests and diagnose actual failures.

### Phase 5 — Diagnostics and reporting
- Configure HTML, JUnit, and Allure.
- Verify screenshots/traces on a deliberately failing local test, then remove or restore the deliberate failure.
- Ensure artifacts contain no secrets.

### Phase 6 — Docker and CI/CD
- Build and run the Docker image.
- Add GitHub Actions.
- Add Jenkins pipeline.
- Validate workflow syntax and commands as far as the available environment allows.
- Ensure reports upload after failures.

### Phase 7 — Hardening and documentation
- Run format, lint, typecheck, smoke, and full suite.
- Investigate flakes and remove arbitrary sleeps.
- Review secret handling, test isolation, parallel safety, and `.gitignore`.
- Update all documentation and produce the final execution report.

---

## 26. Final instructions to the coding agent

You are acting as a senior SDET and test-automation architect.

**Your job is to deliver a working, verifiable framework—not just a proposed architecture.**

- Start by inspecting the repository and target application.
- Respect the UI-only scope.
- Prefer readable, maintainable code over clever abstractions.
- Follow POM, DDT, fixture, configuration, isolation, and reporting standards in this file.
- Use current, compatible, pinned dependencies and commit the lockfile.
- Validate every significant change by running the relevant checks.
- Keep CI, Docker, and local execution consistent.
- Document assumptions, site limitations, and unverified behaviors explicitly.
- Do not fabricate successful runs, coverage, routes, selectors, or results.
- If a requirement cannot be completed due to missing access, unavailable tooling, public-site behavior, or environment constraints, implement what is safe and feasible, record the exact blocker, and provide the next action needed.

**Success means another SDET can clone the repository, configure it, run the UI suite locally or in CI, inspect failures through reports/traces, and extend coverage without having to redesign the framework.**
