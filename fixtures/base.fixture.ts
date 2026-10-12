import { test as base, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { ProductPage } from '../pages/product.page';
import { LoginPage } from '../pages/login.page';
import { RegistrationPage } from '../pages/registration.page';
import { ContactPage } from '../pages/contact.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ComparisonPage } from '../pages/comparison.page';
import { CartPage } from '../pages/cart.page';

type AppFixtures = {
  browserDiagnostics: void;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  contactPage: ContactPage;
  checkoutPage: CheckoutPage;
  comparisonPage: ComparisonPage;
  cartPage: CartPage;
};

export const test = base.extend<AppFixtures>({
  browserDiagnostics: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      await use();
      if (testInfo.status !== testInfo.expectedStatus && errors.length > 0) {
        await testInfo.attach('browser-errors', {
          body: Buffer.from(errors.join('\n')),
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registrationPage: async ({ page }, use) => use(new RegistrationPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  comparisonPage: async ({ page }, use) => use(new ComparisonPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
});

export { expect };
