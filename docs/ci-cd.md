# CI/CD

GitHub Actions runs dependency installation, strict typecheck, lint, formatting validation, Chromium setup, and Playwright smoke/regression tests. It uploads HTML, JUnit, Allure, and failure artifacts even after test failures.

Jenkins uses the checked-in `Jenkinsfile`; install Node.js 20+ and Chromium dependencies on the agent. Add `DEMO_EMAIL`/`DEMO_PASSWORD` as Jenkins credentials only when authenticated tests are selected. Keep `RUN_MUTATING_TESTS=false` for shared public environments.

The suite targets the public demo by default. CI failures caused by target outages (including authorization failures) remain failures and must be reviewed with the attached trace/report.
