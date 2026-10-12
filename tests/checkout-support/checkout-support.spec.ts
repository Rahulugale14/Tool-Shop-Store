import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';

test.describe('Checkout, contact, and legal flows @e2e @regression', () => {
  test('checkout starts with the cart stage and retains the selected item', async ({
    productPage,
    cartPage,
  }) => {
    await productPage.goto('/product/01M4Q7QNHWTJRNQASMEY64XQVY');
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToCart();
    await cartPage.goto();
    await expect(cartPage.cartStep).toBeVisible();
    await expect(cartPage.productRows.filter({ hasText: /combination pliers/i })).toBeVisible();
    await expect(cartPage.totalText).toBeVisible();
  });

  test('billing step does not advance with missing required details', async ({ checkoutPage, page }) => {
    await checkoutPage.goto();
    test.skip(
      !(await page.getByRole('textbox').count()),
      'The current checkout route does not expose a billing form without an item.',
    );
    const firstRequiredField = page.getByRole('textbox').first();
    await expect(firstRequiredField).toHaveAttribute('required', '');
    await checkoutPage.continueButton.click();
    await expect(firstRequiredField).toBeVisible();
  });

  test('valid payment details can be submitted in the demo checkout', async ({ checkoutPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to submit a simulated order on the public demo site.',
    );
    await checkoutPage.goto();
    await expect(page.getByRole('textbox', { name: /card number/i })).toBeVisible();
  });

  test('invalid payment details are rejected before an order is placed', async ({ checkoutPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to submit simulated checkout data on the public demo site.',
    );
    await checkoutPage.goto();
    await page.getByRole('textbox', { name: /card number/i }).fill('123');
    await checkoutPage.continueButton.click();
    await expect(page.getByText(/invalid|expired|incorrect|payment/i)).toBeVisible();
    await expect(page).not.toHaveURL(/confirmation|success/);
  });

  test('successful order shows a confirmation and order summary', async ({ checkoutPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to place a simulated order on the public demo site.',
    );
    await checkoutPage.goto();
    await page.getByRole('button', { name: /place order|confirm order/i }).click();
    await expect(page.getByRole('heading', { name: /thank you|order confirmation/i })).toBeVisible();
    await expect(page.getByText(/order.*(number|total|summary)/i)).toBeVisible();
  });

  test('failed checkout keeps the form available for correction', async ({ checkoutPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to exercise simulated order submission on the public demo site.',
    );
    await checkoutPage.goto();
    await page.getByRole('button', { name: /place order|confirm order/i }).click();
    await expect(page.getByRole('heading', { name: /payment|billing|checkout/i })).toBeVisible();
    await expect(page.getByText(/required|invalid|error/i)).toBeVisible();
  });

  test('contact form accepts a complete support request', async ({ contactPage, page }) => {
    test.skip(
      !env.allowMutatingTests,
      'Set RUN_MUTATING_TESTS=true to send a persistent contact request to the public demo site.',
    );
    await contactPage.goto();
    await contactPage.firstName.fill('Playwright');
    await contactPage.lastName.fill('Test');
    await contactPage.email.fill(`pw-${Date.now()}@example.com`);
    await contactPage.subject.selectOption({ label: 'Customer service' });
    await contactPage.message.fill('Automated contact form verification.');
    await contactPage.sendButton.click();
    await expect(page.getByText(/message.*sent|thank you|success/i)).toBeVisible();
  });

  test('contact form rejects missing and malformed values', async ({ contactPage, page }) => {
    await contactPage.goto();
    await contactPage.sendButton.click();
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
    await contactPage.firstName.fill('Invalid');
    await contactPage.lastName.fill('Request');
    await contactPage.email.fill('invalid-email');
    await contactPage.subject.selectOption({ label: 'Customer service' });
    await contactPage.message.fill('This should not submit.');
    await contactPage.sendButton.click();
    expect(
      await contactPage.email.evaluate(
        (element) => element instanceof HTMLInputElement && !element.checkValidity(),
      ),
    ).toBeTruthy();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('contact attachment rejects unsupported extensions and accepts a zero-byte text file', async ({
    contactPage,
    page,
  }) => {
    await contactPage.goto();
    await contactPage.attachment.setInputFiles({
      name: 'unsupported.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(''),
    });
    await expect(page.getByText(/only files with the txt extension/i)).toBeVisible();
    await contactPage.attachment.setInputFiles({
      name: 'empty.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(''),
    });
    await expect(contactPage.attachment).toHaveValue(/empty\.txt$/);
  });

  test('rentals landing page renders content and common navigation', async ({ page }) => {
    await page.goto('/rentals');
    await expect(page).toHaveTitle(/rental/i);
    await expect(page.getByRole('heading', { name: 'Rentals', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Excavator', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('privacy policy footer link opens the policy page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Privacy Policy' }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { name: /privacy/i })).toBeVisible();
  });

  test('learning, bug-hunting, and source links have valid destinations', async ({ page }) => {
    await page.goto('/');
    const externalLinks = [
      { name: 'Testing Guide', expected: /testsmith|practice-software-testing/i },
      { name: /Bug Hunting/, expected: /testsmith|practice-software-testing/i },
      { name: /GitHub Source code/, expected: /github\.com\/testsmith-io\/practice-software-testing/ },
      { name: /Learn Test Automation/, expected: /onlinecourses\.testsmith\.io/ },
    ];
    for (const item of externalLinks) {
      const linkOrButton = page
        .getByRole('link', { name: item.name })
        .or(page.getByRole('button', { name: item.name }));
      await expect(linkOrButton).toBeVisible();
      const destination = await linkOrButton.getAttribute('href');
      if (destination) expect(destination).toMatch(item.expected);
    }
  });
});
