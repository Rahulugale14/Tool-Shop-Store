import { type Locator, type Page } from '@playwright/test';

export class ComparisonPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly clearAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Product Comparison', exact: true });
    this.table = page.getByRole('table', { name: 'Product Comparison' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear All', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/comparison');
  }
}
