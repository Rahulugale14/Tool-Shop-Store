# Practice Software Testing Toolshop Test Plan

## Application Overview

End-to-end test plan for the Toolshop storefront covering catalog browsing, product discovery, account flows, cart and checkout, and support/legal interactions on the Practice Software Testing demo site.

## Test Scenarios

### 1. Catalog and discovery

**Seed:** `tests/seed.spec.ts`

#### 1.1. Homepage loads with correct branding and navigation

**File:** `tests/catalog-discovery/homepage-load.spec.ts`

**Steps:**
  1. Open the home page and wait for the storefront to render.
    - expect: The page title and branding match the Toolshop demo site.
    - expect: The header includes Home, Categories, Contact, and Sign in links.
    - expect: The product grid is visible and populated with items.

#### 1.2. Header category links navigate to the correct sections

**File:** `tests/catalog-discovery/header-category-links.spec.ts`

**Steps:**
  1. Click each top-level category link in the header.
    - expect: The page updates to the selected category context.
    - expect: The category title and available filters match the chosen section.
    - expect: No broken links or blank pages occur.

#### 1.3. Search returns relevant products for a valid keyword

**File:** `tests/catalog-discovery/search-valid.spec.ts`

**Steps:**
  1. Use the search field with a known product keyword, such as hammer or pliers.
    - expect: Matching products are returned in the product grid.
    - expect: The product names, prices, and stock messaging remain visible and accurate.
    - expect: The user can select a result and open its product page.

#### 1.4. Search handles no-match conditions without breaking UI

**File:** `tests/catalog-discovery/search-no-results.spec.ts`

**Steps:**
  1. Search for a keyword that is not present in the catalog.
    - expect: The app shows a clear empty-state message or no results indicator.
    - expect: The layout remains stable and usable.
    - expect: The user can clear the search and restore the general catalog view.

#### 1.5. Sort by name A-Z works correctly

**File:** `tests/catalog-discovery/sort-name-asc.spec.ts`

**Steps:**
  1. Choose Name (A - Z) from the sort selector.
    - expect: Products appear in alphabetical order by name.
    - expect: The ordering is stable across the visible grid.
    - expect: The result is not mixed with random or outdated product order.

#### 1.6. Sort by name Z-A works correctly

**File:** `tests/catalog-discovery/sort-name-desc.spec.ts`

**Steps:**
  1. Choose Name (Z - A) from the sort selector.
    - expect: Products appear in reverse alphabetical order.
    - expect: The new order differs from the A-Z result and reflects the correct rule.
    - expect: The product names remain readable and untruncated.

#### 1.7. Sort by price low to high works correctly

**File:** `tests/catalog-discovery/sort-price-low-high.spec.ts`

**Steps:**
  1. Choose Price (Low - High) from the sort selector.
    - expect: The lowest-priced products appear first.
    - expect: The price order matches the displayed values for each product card.
    - expect: The page does not lag or display stale pricing.

#### 1.8. Sort by price high to low works correctly

**File:** `tests/catalog-discovery/sort-price-high-low.spec.ts`

**Steps:**
  1. Choose Price (High - Low) from the sort selector.
    - expect: The highest-priced products appear first.
    - expect: The order is consistent with the visible price values.
    - expect: The products remain accessible after sorting.

#### 1.9. Category and brand filters narrow the product list correctly

**File:** `tests/catalog-discovery/filter-category-brand.spec.ts`

**Steps:**
  1. Apply a category filter and a brand filter from the sidebar.
    - expect: Only matching products remain on the page.
    - expect: The filter states are visible to the user.
    - expect: The page updates without duplication or hidden items.

#### 1.10. Eco-friendly filter toggles only eco-friendly products

**File:** `tests/catalog-discovery/filter-eco-friendly.spec.ts`

**Steps:**
  1. Turn on the eco-friendly filter and review the results.
    - expect: Only eco-friendly products remain visible.
    - expect: The filter state is clearly shown to the user.
    - expect: Products that do not meet the rule are hidden or excluded.
  2. Clear the eco-friendly filter.
    - expect: The full product list is restored.
    - expect: No stale filter state remains on the page.

#### 1.11. Price range filter restricts visible products as expected

**File:** `tests/catalog-discovery/price-range-filter.spec.ts`

**Steps:**
  1. Adjust the price range to a smaller set of values.
    - expect: Products outside the selected range disappear from the view.
    - expect: The filter is visually reflected in the UI.
    - expect: The remaining products maintain accurate pricing.
  2. Reset the price range to the maximum values.
    - expect: All products return to view.
    - expect: The prior filter is fully cleared and no stale values remain.

#### 1.12. Pagination navigation across catalog pages is reliable

**File:** `tests/catalog-discovery/pagination.spec.ts`

**Steps:**
  1. Navigate to later catalog pages using the pagination controls.
    - expect: The product list updates to the selected page.
    - expect: The active page indicator changes and matches the visible results.
    - expect: Products are not repeated or skipped between pages.

#### 1.13. Product cards open the correct detail page

**File:** `tests/catalog-discovery/product-card-open.spec.ts`

**Steps:**
  1. Select a product card from the main grid.
    - expect: The correct product detail page opens.
    - expect: The product title and price match the item selected from the catalog.
    - expect: The navigation is free of errors or redirection loops.

### 2. Product detail and cart flows

**Seed:** `tests/seed.spec.ts`

#### 2.1. Product detail page loads complete data for a product

**File:** `tests/product-cart/pdp-load.spec.ts`

**Steps:**
  1. Open a valid product detail page, such as a pliers or hammer item.
    - expect: The product name, price, description, and brand are visible.
    - expect: The image and specification table are present.
    - expect: The quantity control and add-to-cart button are enabled for in-stock items.

#### 2.2. Quantity adjustment on the product page is valid and stable

**File:** `tests/product-cart/quantity-adjustment.spec.ts`

**Steps:**
  1. Increase the quantity above 1 and lower it back to 1.
    - expect: The quantity input updates immediately and remains within valid limits.
    - expect: The add-to-cart flow reflects the selected quantity.
    - expect: The page does not create invalid negative or zero values.

#### 2.3. Add to cart increments the cart count and preserves quantity

**File:** `tests/product-cart/add-to-cart.spec.ts`

**Steps:**
  1. Add a product to the cart from the product detail page.
    - expect: The cart count increases.
    - expect: The item is placed in the cart with the selected quantity and current price.
    - expect: The page message or cart summary reflects the added item.

#### 2.4. Cart page displays correct item details and totals

**File:** `tests/product-cart/cart-page-details.spec.ts`

**Steps:**
  1. Open the cart after adding products.
    - expect: Each item appears as a separate line with the correct name, quantity, unit price, and subtotal.
    - expect: The cart subtotal and total are visible and match the sum of the items.
    - expect: Shipping or tax logic, if displayed, is consistent with the expected state.

#### 2.5. Cart quantity updates change the subtotal correctly

**File:** `tests/product-cart/update-cart-quantity.spec.ts`

**Steps:**
  1. Increase and decrease the quantity for an item from the cart page.
    - expect: The subtotal and total update immediately after each change.
    - expect: The quantity displayed on the cart line item matches the selected value.
    - expect: The cart total is mathematically accurate.

#### 2.6. Removing a cart item updates the summary correctly

**File:** `tests/product-cart/remove-cart-item.spec.ts`

**Steps:**
  1. Remove one item from the cart and then remove the final item.
    - expect: The cart total decreases appropriately after each removal.
    - expect: The empty-cart state appears when the last item is removed.
    - expect: No stale line items remain in the cart summary.

#### 2.7. Favourite action on the product page is reflected in the UI

**File:** `tests/product-cart/favourite-product.spec.ts`

**Steps:**
  1. Add a product to favourites from the product detail page.
    - expect: The favourite state changes visually and remains consistent after the page updates.
    - expect: The user can identify the saved product without confusion or duplicate actions.

#### 2.8. Compare action works across multiple products

**File:** `tests/product-cart/compare-products.spec.ts`

**Steps:**
  1. Mark two or more products for comparison from the product grid or product page.
    - expect: The compare state is retained across navigations.
    - expect: The list or compare panel shows each selected product and its key details.
    - expect: The selection can be cleared or updated without errors.

#### 2.9. Related products navigate correctly and remain relevant

**File:** `tests/product-cart/related-products.spec.ts`

**Steps:**
  1. Open the related products section on a product page and select one related item.
    - expect: The related product opens correctly and matches the intended product.
    - expect: The product data and page title update to the selected item with no stale content.

#### 2.10. Cart content persists during standard browsing

**File:** `tests/product-cart/cart-persistence.spec.ts`

**Steps:**
  1. Add items to the cart, navigate to another product or category, and then reopen the cart.
    - expect: The selected products remain in the cart across navigation.
    - expect: The cart total and item list remain consistent after page changes.
    - expect: No data loss occurs from routine browsing.

#### 2.11. Out-of-stock items are blocked from being added to the cart

**File:** `tests/product-cart/out-of-stock.spec.ts`

**Steps:**
  1. Open a product flagged as out of stock and attempt to add it to the cart.
    - expect: The add-to-cart control is disabled or the action is rejected.
    - expect: The cart count does not increase.
    - expect: The user sees a clear, non-ambiguous stock message.

#### 2.12. Checkout is gated until the cart contains items

**File:** `tests/product-cart/checkout-entry.spec.ts`

**Steps:**
  1. Attempt to enter checkout with an empty cart and then repeat with at least one item in the cart.
    - expect: The empty-cart state blocks checkout appropriately.
    - expect: After adding an item, the checkout flow can proceed to the next required step.
    - expect: The workflow is clear and consistent across both states.

### 3. Authentication and account flows

**Seed:** `tests/seed.spec.ts`

#### 3.1. Valid login succeeds and preserves session state

**File:** `tests/account/login-valid.spec.ts`

**Steps:**
  1. Navigate to the login page and sign in with a valid account.
    - expect: The user is authenticated and the login form is replaced or updated by the signed-in state.
    - expect: The header reflects the user being signed in.
    - expect: The user can continue browsing or checking out without an authentication error.
  2. Refresh the page after sign-in.
    - expect: The authenticated state is preserved if the app supports persistent sessions.
    - expect: The user is not unexpectedly logged out or redirected to a login screen.

#### 3.2. Invalid login attempts show clear authentication errors

**File:** `tests/account/login-invalid.spec.ts`

**Steps:**
  1. Submit the login form with a wrong password or non-existent email.
    - expect: The app shows a clear and user-friendly authentication error message.
    - expect: The login page stays stable and still allows another attempt.
    - expect: The system does not expose internal or technical details.

#### 3.3. Valid registration creates the account successfully

**File:** `tests/account/register-valid.spec.ts`

**Steps:**
  1. Open the registration page and complete all required fields with valid data.
    - expect: The account is created successfully.
    - expect: The user sees confirmation or the next step in the flow.
    - expect: The registration data is captured in the correct fields without data loss.

#### 3.4. Required fields must be completed before creation

**File:** `tests/account/register-required-fields.spec.ts`

**Steps:**
  1. Submit the registration form without filling required values.
    - expect: Validation messages appear for the incomplete fields.
    - expect: The account is not created.
    - expect: The form remains editable so the user can correct the issues.

#### 3.5. Duplicate registration is rejected

**File:** `tests/account/register-duplicate-email.spec.ts`

**Steps:**
  1. Attempt to register again with an already-used email address.
    - expect: The system blocks the duplicate email and explains the issue.
    - expect: The user is guided to sign in instead of creating a second account.
    - expect: The original account remains unaffected.

#### 3.6. Forgot password flow is reachable and handles invalid input

**File:** `tests/account/forgot-password.spec.ts`

**Steps:**
  1. Open the forgot-password flow from the login screen and submit an empty or invalid email.
    - expect: The flow warns the user about invalid or missing input.
    - expect: The user is not redirected to an error page or broken handler.
    - expect: The request does not expose internal implementation details.

#### 3.7. Google sign-in option is present and initiated correctly

**File:** `tests/account/google-signin.spec.ts`

**Steps:**
  1. Locate the Google Sign in button on the login page and activate it in a supported environment.
    - expect: The Google sign-in flow is initiated or the correct provider button is rendered.
    - expect: The user receives the expected redirect or modal flow.
    - expect: The app remains stable while the authentication provider is engaged.

#### 3.8. Signed-in users can log out successfully

**File:** `tests/account/sign-out.spec.ts`

**Steps:**
  1. Sign in and then choose the sign-out option.
    - expect: The app logs the user out without error.
    - expect: The header and page state update to the signed-out version.
    - expect: The user cannot continue as the logged-in profile without re-authentication.

#### 3.9. Country and date-of-birth fields behave with valid and invalid values

**File:** `tests/account/dob-and-country.spec.ts`

**Steps:**
  1. Select a few countries and enter a valid date of birth during registration.
    - expect: The data is accepted and stored correctly.
    - expect: The form remains stable and does not reset or clear unrelated fields.
  2. Submit invalid DOB values such as impossible dates or empty dates.
    - expect: The validation errors reflect the problem clearly.
    - expect: The account is not created until the values are corrected.

#### 3.10. Checkout protects access until the user is authenticated or guest flow is allowed

**File:** `tests/account/session-required-checkout.spec.ts`

**Steps:**
  1. Add a product to the cart and start checkout before sign-in.
    - expect: The app enforces the required sign-in or guest flow before order completion.
    - expect: The user is not allowed to skip past the authorization requirement without action.
  2. Sign in and continue the checkout.
    - expect: The user session is recognized and the current cart and order flow continue correctly.
    - expect: The checkout state remains intact without duplicate prompts or lost items.

#### 3.11. Privacy policy and data retention messaging are available and consistent

**File:** `tests/account/privacy-policy.spec.ts`

**Steps:**
  1. Open the privacy policy page and review the statements about Google Sign-In and data removal.
    - expect: The privacy policy is complete and readable.
    - expect: The message aligns with the app’s authentication and retention behavior.
    - expect: The policy page is not broken or truncated.

#### 3.12. Authentication screens remain usable on different viewports and with keyboard navigation

**File:** `tests/account/ui-accessibility.spec.ts`

**Steps:**
  1. Open the login and registration pages in a desktop viewport and a narrow screen width.
    - expect: Forms remain readable and aligned without overlaps or hidden inputs.
    - expect: The required field labels remain visible and interactive.
  2. Tab through all form controls using the keyboard.
    - expect: Focus is visible and follows a logical order.
    - expect: The user can complete the form without a mouse.

### 4. Checkout, contact, and legal flows

**Seed:** `tests/seed.spec.ts`

#### 4.1. Checkout progresses cleanly through the cart, billing, and payment steps

**File:** `tests/checkout-support/checkout-flow.spec.ts`

**Steps:**
  1. Add an item to the cart and begin the checkout flow.
    - expect: The cart step is shown first and is populated with the selected product.
    - expect: The user can move through each checkout stage without losing cart state.
    - expect: The checkout steps are clearly labeled and sequential.

#### 4.2. Billing form blocks incomplete data before payment

**File:** `tests/checkout-support/billing-required-fields.spec.ts`

**Steps:**
  1. Try to continue from billing with required values left empty.
    - expect: Validation errors appear for the missing billing fields.
    - expect: The system does not advance to payment until required details are completed.
    - expect: The user can correct the values and continue.

#### 4.3. Valid payment information is accepted

**File:** `tests/checkout-support/payment-valid.spec.ts`

**Steps:**
  1. Complete the payment form with valid card details and continue.
    - expect: The payment details are accepted and the order is ready to submit.
    - expect: The UI remains stable and no cryptic validation error appears.
    - expect: The user can proceed to confirmation without a broken form.

#### 4.4. Invalid payment data is rejected with a clear message

**File:** `tests/checkout-support/payment-invalid.spec.ts`

**Steps:**
  1. Enter incomplete, expired, or malformed payment data.
    - expect: The form blocks order submission and shows clear validation guidance.
    - expect: The user is not sent to a confirmation page with invalid payment data.
    - expect: The payment details remain editable after the validation error.

#### 4.5. Successful order completion produces a valid confirmation

**File:** `tests/checkout-support/order-confirmation.spec.ts`

**Steps:**
  1. Submit a valid order after filling all required data.
    - expect: The confirmation screen loads with the order summary, total, and status.
    - expect: The order information includes the purchased items and expected totals.
    - expect: The user can clearly understand that the purchase was completed.

#### 4.6. Failed checkout attempts are handled gracefully

**File:** `tests/checkout-support/order-failure.spec.ts`

**Steps:**
  1. Attempt to place an order with invalid payment or incomplete form data.
    - expect: The order is not created.
    - expect: The checkout form remains active and shows only relevant error messages.
    - expect: The user can fix the issues and retry without re-entering unrelated data.

#### 4.7. Contact form accepts valid support requests

**File:** `tests/checkout-support/contact-valid.spec.ts`

**Steps:**
  1. Open the Contact page and submit a fully-complete request with valid values.
    - expect: The form accepts the submission and shows the expected success-state message or confirmation.
    - expect: The data is captured without truncation or empty field loss.
    - expect: The user can continue browsing afterward without frustration.

#### 4.8. Contact form rejects incomplete or malformed requests

**File:** `tests/checkout-support/contact-invalid.spec.ts`

**Steps:**
  1. Submit the Contact form with missing required information or malformed email content.
    - expect: The app flags the missing or invalid fields clearly.
    - expect: The contact request is not delivered or accepted until the values are fixed.
    - expect: The flow remains usable for a correct resubmission.

#### 4.9. Attachment validation enforces the allowed file type

**File:** `tests/checkout-support/contact-attachment.spec.ts`

**Steps:**
  1. Upload a file with a non-.txt extension and then upload a valid .txt file.
    - expect: The unsupported attachment is rejected with a clear message.
    - expect: The valid .txt attachment is accepted without blocking the request.
    - expect: The supported file type is clearly documented by the form behavior.

#### 4.10. Rentals landing page loads and remains usable

**File:** `tests/checkout-support/rentals-page.spec.ts`

**Steps:**
  1. Open the Rentals page from the main navigation or a link.
    - expect: The page title and content load successfully.
    - expect: The user can read the rental overview without broken layout or blank sections.
    - expect: The storefront retains consistent navigation after returning home.

#### 4.11. Privacy page is readable and consistent with the app’s documented policy

**File:** `tests/checkout-support/privacy-page.spec.ts`

**Steps:**
  1. Open the Privacy Policy page and review the language around Google Sign-In and data retention.
    - expect: The page loads without formatting issues and the legal text is readable.
    - expect: The content aligns with the actual platform behavior.
    - expect: The user can clearly understand the privacy position of the application.

#### 4.12. External support and learning links open to valid destinations

**File:** `tests/checkout-support/external-links.spec.ts`

**Steps:**
  1. Open the Testing Guide, Bug Hunting, GitHub, and course links presented on the site.
    - expect: Each external destination loads successfully and matches the intended resource.
    - expect: The links are not broken or redirecting to an unrelated page.
    - expect: The storefront continues to function correctly after opening the external page.
