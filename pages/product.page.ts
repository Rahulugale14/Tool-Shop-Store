import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly title: Locator;
  readonly addToCartButton: Locator;
  readonly favouritesButton: Locator;
  readonly compareButton: Locator;
  readonly quantityInput: Locator;
  readonly relatedProductsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 1 });
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.favouritesButton = page.getByRole('button', { name: 'Add to favourites', exact: true });
    this.compareButton = page.getByRole('button', { name: 'Compare', exact: true });
    this.quantityInput = page.getByRole('spinbutton');
    this.relatedProductsHeading = page.getByRole('heading', { name: 'Related products', exact: true });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async gotoProductByName(name: string): Promise<void> {
    await this.page.goto('/');
    const productLink = this.page
      .locator('a[href^="/product/"]')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .first();
    await productLink.click();
    await this.title.waitFor({ state: 'visible' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.page
      .getByRole('alert')
      .filter({ hasText: 'Product added to shopping cart.' })
      .waitFor({ state: 'visible' });
  }

  async addToFavourites(): Promise<void> {
    await this.favouritesButton.click();
  }

  async addToComparison(): Promise<void> {
    await this.compareButton.click();
  }
}
