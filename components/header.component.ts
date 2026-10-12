import { type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly toggleButton: Locator;
  readonly homeLink: Locator;
  readonly categoriesButton: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleButton = page.getByRole('button', { name: 'Toggle navigation' });
    this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
    this.categoriesButton = page.getByRole('button', { name: 'Categories', exact: true });
    this.contactLink = page.getByRole('link', { name: 'Contact', exact: true });
    this.signInLink = page.getByRole('link', { name: 'Sign in', exact: true });
    this.cartLink = page.getByRole('link', { name: /cart/i });
  }

  async openNavigation(): Promise<void> {
    if (await this.toggleButton.isVisible()) {
      await this.toggleButton.click();
    }
  }

  async openCategories(): Promise<void> {
    await this.openNavigation();
    await this.categoriesButton.click();
  }
}
