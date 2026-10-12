import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly headings: Locator;
  readonly cartStep: Locator;
  readonly paymentStep: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headings = page.getByRole('heading');
    this.cartStep = page.getByRole('listitem', { name: /Cart 1/ });
    this.paymentStep = page.getByRole('listitem').filter({ hasText: /Payment\s*4/ });
    this.continueButton = page.getByRole('button', { name: /continue|next|checkout|place order|confirm/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }
}
