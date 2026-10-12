import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { invalidLoginCases } from '../../data/forms.data';
import { createUniqueRegistrationData } from '../../helpers/test-data';

test.describe('Account and authentication @auth @regression', () => {
  test('valid login establishes an authenticated session', async ({ loginPage, page }) => {
    const email = env.demoEmail;
    const password = env.demoPassword;
    if (!email || !password) {
      test.skip(true, 'Set DEMO_EMAIL and DEMO_PASSWORD to run authenticated tests.');
      return;
    }
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page.getByRole('link', { name: /my account|account|sign out|logout/i })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('link', { name: /my account|account|sign out|logout/i })).toBeVisible();
  });

  for (const scenario of invalidLoginCases) {
    test(`invalid login with ${scenario.name} is rejected`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(scenario.email, scenario.password);
      await expect(loginPage.page).toHaveURL(/\/auth\/login$/);
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.page.getByText(/invalid|incorrect|unauthorized|failed/i)).toBeVisible();
    });
  }

  test('registration can create an account with valid data', async ({ registrationPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to create a persistent account on the public demo site.',
    );
    await registrationPage.goto();
    const user = createUniqueRegistrationData();
    const fields: Array<[string, string]> = [
      ['First name', user.firstName],
      ['Last name', user.lastName],
      ['Date of Birth *', user.dateOfBirth],
      ['Postal code', user.postalCode],
      ['House number', user.houseNumber],
      ['Street', user.street],
      ['City', user.city],
      ['State', user.state],
      ['Phone', user.phone],
      ['Email address', user.email],
      ['Password', user.password],
    ];
    for (const [label, value] of fields) await page.getByRole('textbox', { name: label }).fill(value);
    await registrationPage.country.selectOption({ label: user.country });
    await registrationPage.registerButton.click();
    await expect(page.getByText(/account.*created|registration.*successful|success/i)).toBeVisible();
  });

  test('registration requires mandatory input before submission', async ({ registrationPage }) => {
    await registrationPage.goto();
    await registrationPage.registerButton.click();
    await expect(registrationPage.page.getByText('First name is required')).toBeVisible();
    await expect(registrationPage.page.getByText('Email is required')).toBeVisible();
    await expect(registrationPage.page.getByText('Password is required')).toBeVisible();
    await expect(registrationPage.page).toHaveURL(/\/auth\/register$/);
  });

  test('duplicate registration is rejected', async ({ registrationPage, page }) => {
    const email = env.demoEmail;
    const password = env.demoPassword;
    if (!env.allowMutatingTests) {
      test.skip(
        true,
        'Set RUN_MUTATING_TESTS=true to exercise duplicate-account behavior on the public demo site.',
      );
      return;
    }
    if (!email || !password) {
      test.skip(true, 'Set DEMO_EMAIL and DEMO_PASSWORD to provide a known existing account.');
      return;
    }
    await registrationPage.goto();
    await page.getByRole('textbox', { name: 'First name' }).fill('Existing');
    await page.getByRole('textbox', { name: 'Last name' }).fill('Customer');
    await page.getByRole('textbox', { name: 'Date of Birth *' }).fill('1990-01-15');
    await page.getByRole('combobox', { name: 'Country' }).selectOption({ label: 'United States of America' });
    await page.getByRole('textbox', { name: 'Postal code' }).fill('10001');
    await page.getByRole('textbox', { name: 'House number' }).fill('10');
    await page.getByRole('textbox', { name: 'Street' }).fill('Main Street');
    await page.getByRole('textbox', { name: 'City' }).fill('New York');
    await page.getByRole('textbox', { name: 'State' }).fill('New York');
    await page.getByRole('textbox', { name: 'Phone' }).fill('2025550100');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByLabel('Password').fill(password);
    await registrationPage.registerButton.click();
    await expect(page.getByText(/already exists|already registered|email.*taken/i)).toBeVisible();
  });

  test('forgot-password screen validates missing and malformed email', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/auth\/forgot-password$/);
    const email = page.getByRole('textbox', { name: /email/i });
    await expect(email).toBeVisible();
    await email.fill('invalid-email');
    await page.getByRole('button', { name: 'Set New Password', exact: true }).click();
    await expect(email).toBeVisible();
    expect(
      await email.evaluate((element) => element instanceof HTMLInputElement && !element.checkValidity()),
    ).toBeTruthy();
  });

  test('Google sign-in option is available and can be activated', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.googleButton).toBeVisible();
    await expect(loginPage.googleButton).toBeEnabled();
    await loginPage.googleButton.click();
  });

  test('authenticated users can sign out', async ({ loginPage, page }) => {
    const email = env.demoEmail;
    const password = env.demoPassword;
    if (!email || !password) {
      test.skip(true, 'Set DEMO_EMAIL and DEMO_PASSWORD to run authenticated tests.');
      return;
    }
    await loginPage.goto();
    await loginPage.login(email, password);
    const signOut = page.getByRole('link', { name: /sign out|logout/i });
    await expect(signOut).toBeVisible();
    await signOut.click();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  });

  test('country and date-of-birth fields accept valid values and keep invalid dates editable', async ({
    registrationPage,
  }) => {
    await registrationPage.goto();
    await registrationPage.country.selectOption({ label: 'Canada' });
    await registrationPage.dateOfBirth.fill('1990-01-15');
    await expect(registrationPage.country).toHaveValue(/./);
    await expect(registrationPage.dateOfBirth).toHaveValue('1990-01-15');
    await registrationPage.dateOfBirth.fill('2024-02-31');
    await registrationPage.dateOfBirth.blur();
    await expect(registrationPage.dateOfBirth).toBeVisible();
  });

  test('checkout requires authentication or explicitly offers a guest path', async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.goto();
    await expect(page.getByText(/sign in|login|guest|cart is empty|empty cart/i)).toBeVisible();
  });

  test('privacy policy is reachable and readable', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveTitle(/privacy/i);
    await expect(page.getByRole('heading', { name: /privacy/i })).toBeVisible();
    await expect(page.getByText(/Effective Date/i)).toBeVisible();
    await expect(page.getByText(/Data Removal/i)).toBeVisible();
  });

  test('login and registration forms remain usable on narrow screens with keyboard focus', async ({
    loginPage,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    await page.goto('/auth/register');
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register', exact: true })).toBeVisible();
  });
});
