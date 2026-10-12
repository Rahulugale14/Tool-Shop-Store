import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class CatalogPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly productCards: Locator;
  readonly filtersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.productCards = page.locator('a[href^="/product/"]');
    this.filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openFilters(): Promise<void> {
    if (
      (await this.filtersButton.isVisible()) &&
      (await this.filtersButton.getAttribute('aria-expanded')) !== 'true'
    ) {
      await this.filtersButton.click();
    }
  }

  async searchFor(term: string): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('textbox', { name: 'Search' }).fill(term);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
  }

  async clearSearch(): Promise<void> {
    const clearButton = this.page.getByRole('button', { name: 'X', exact: true });
    if (await clearButton.isVisible()) await clearButton.click();
  }

  async sortBy(label: string): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('combobox', { name: 'sort' }).selectOption({ label });
  }

  async productNames(): Promise<string[]> {
    const headings = this.productCards.getByRole('heading');
    return (await headings.allTextContents()).map((name) => name.trim());
  }

  async productPrices(): Promise<number[]> {
    const text = await this.productCards.allTextContents();
    return text.map((card) => {
      const amount = card.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
      const value = amount?.[1];
      return value ? Number(value.replaceAll(',', '')) : Number.NaN;
    });
  }

  async openFirstProduct(): Promise<void> {
    await this.productCards.first().click();
  }

  async openCategory(name: string): Promise<void> {
    await this.header.openCategories();
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
