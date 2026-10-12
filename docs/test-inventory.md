# Test inventory

Automated coverage maps to the 49 scenarios in `specs/practice-software-testing-plan.md`. There are 50 Playwright test cases because invalid login is data-driven across two distinct inputs.

| Area                     | Scenarios | Coverage notes                                                                                                                      |
| ------------------------ | --------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| Catalog and discovery    |        13 | Branding/navigation, category routes, search, sorting, category/brand and eco filters, price slider, pagination, product navigation |
| Product and cart         |        12 | Product details, quantity/cart actions, totals/removal, compare, related products, stock, empty checkout                            |
| Account                  |        12 | Login/register, validation, password reset, Google option, sign-out, country/DOB, checkout auth, privacy, responsive keyboard use   |
| Checkout, contact, legal |        12 | Checkout stages/payment, contact validation/attachment, rentals, privacy, external destinations                                     |

## Reconnaissance status (2026-10-12)

Confirmed on the live storefront: title and catalog, top-level Hand Tools/Power Tools/Other/Special Tools links, five-page pagination, sorting options, price sliders, category/brand/eco filters, product cards with Compare controls, login and registration forms, contact fields and its `.txt`/0 KB attachment rule, Rentals, Privacy Policy, and footer resources.

Product IDs in the public catalog changed from the IDs observed during earlier reconnaissance. Tests now find products by their rendered catalog names and follow the current product links rather than relying on fixed IDs. The unauthenticated `/users/me` request returns HTTP 401 as expected. The empty-cart checkout route can still log an uncaught `TypeError` reading `cart_items` from `null`; the empty-cart UI remains on the cart stage and does not advance. This target-side console error is captured on test failure and is not masked.

Unauthenticated favourite attempts produce an explicit unauthorized alert. Product comparison is available and shows a two-product comparison table. Order creation, account creation, and successful contact submission are skipped by default because they persist data on the shared public demo. Set `RUN_MUTATING_TESTS=true` only when using a disposable/test environment. Authenticated tests require supplied demo credentials. External links are checked for destination rather than loaded as part of each test to avoid unnecessary external dependencies.

The latest full run discovered all 50 cases: 40 passed, 10 were skipped by the credential and mutation-safety guards, and none failed. Cases requiring demo credentials or explicit opt-in for persistent actions remain safely skipped by default. Run `npm test` to replace the prior Allure report with a fresh report for that run, including when Playwright reports test failures.
