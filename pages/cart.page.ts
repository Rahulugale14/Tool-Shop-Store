import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartStep: Locator;
  readonly productRows: Locator;
  readonly quantityInput: Locator;
  readonly totalText: Locator;
  readonly removeButtons: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartStep = page.getByRole('listitem').filter({ hasText: /Cart\s*1/ });
    this.productRows = page.getByRole('row');
    this.quantityInput = page.getByRole('spinbutton');
    this.totalText = page.getByRole('row').filter({ hasText: /^Total\b/i }).last();
    this.removeButtons = page.locator('table a.btn-danger');
    this.emptyState = page.getByText(/cart is empty|empty cart|no items/i);
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }
}
