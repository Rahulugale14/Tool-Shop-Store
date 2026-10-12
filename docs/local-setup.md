# Local setup

## Requirements

- Node.js 20+
- npm
- Chromium installed with `npx playwright install chromium`
- Java 11+ only when generating the Allure HTML report

## Install and run

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
npm run typecheck
npm run lint
npm run format:check
npm run test:smoke
```

Run everything with `npm test`. Use `npx playwright show-report` to inspect the HTML report and `npm run report:allure` to generate the Allure report.

## Environment variables

The runtime loads `.env` with dotenv, while existing process/CI variables take precedence, followed by safe defaults. The file is ignored by Git.

| Variable             | Default                               | Purpose                              |
| -------------------- | ------------------------------------- | ------------------------------------ |
| `BASE_URL`           | `https://practicesoftwaretesting.com` | Absolute HTTP(S) target URL          |
| `CI`                 | `false`                               | Enables CI retries/worker policy     |
| `HEADLESS`           | `true`                                | Playwright browser mode              |
| `RUN_MUTATING_TESTS` | `false`                               | Opt in to persistent demo operations |
| `DEMO_EMAIL`         | unset                                 | Optional test account                |
| `DEMO_PASSWORD`      | unset                                 | Optional test account password       |

Do not check in `.env` or real credentials. `BASE_URL` is validated as an absolute HTTP(S) URL; boolean values accept only `true` or `false`.

## Outputs

- `playwright-report/`: HTML report
- `test-results/junit.xml`: JUnit results
- `allure-results/`: raw Allure data
- `allure-report/`: generated Allure HTML
- `test-results/`: traces, screenshots, and video for failures
