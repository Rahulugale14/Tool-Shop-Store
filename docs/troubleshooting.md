# Troubleshooting

- **No product cards/details:** verify the target site is responding and inspect the failed request in the Playwright trace. During reconnaissance, product detail data returned HTTP 401.
- **Browser missing:** run `npx playwright install chromium`.
- **Base URL validation error:** set `BASE_URL` to an absolute HTTP(S) URL.
- **Authenticated cases skipped:** provide `DEMO_EMAIL` and `DEMO_PASSWORD` for a disposable demo account.
- **Persistent-action cases skipped:** set `RUN_MUTATING_TESTS=true` only when writes to the target are acceptable.
- **Inspect failures:** run `npx playwright show-report`; open `test-results` attachments or use `npx playwright show-trace <trace.zip>`.
- **Allure:** Java 11+ is required by the Allure CLI. `npm run report:allure` requires a non-empty `allure-results` directory.
