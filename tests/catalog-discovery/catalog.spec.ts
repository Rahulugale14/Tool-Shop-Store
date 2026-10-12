import { test, expect } from '../../fixtures/base.fixture';
import { categoryCases, invalidSearchTerm } from '../../data/catalog.data';

function isSorted<T>(values: T[], compare: (previous: T, current: T) => number): boolean {
  return (
    values.length > 1 &&
    values.slice(1).every((current, index) => {
      const previous = values[index];
      return previous !== undefined && compare(previous, current) <= 0;
    })
  );
}

test.describe('Catalog and discovery @catalog @regression', () => {
  test('homepage shows the Toolshop brand, navigation, and product cards @smoke', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto();
    await expect(page).toHaveTitle(/Practice Software Testing.*Toolshop/i);
    await expect(page.getByRole('heading', { name: 'Practice Software Testing - Toolshop' })).toBeVisible();
    await expect(catalogPage.header.homeLink).toBeVisible();
    await expect(catalogPage.header.categoriesButton).toBeVisible();
    await expect(catalogPage.header.contactLink).toBeVisible();
    await expect(catalogPage.header.signInLink).toBeVisible();
    await expect(catalogPage.productCards.first()).toBeVisible();
  });

  test('header category links open each category', async ({ catalogPage, page }) => {
    for (const category of categoryCases) {
      await catalogPage.goto();
      await catalogPage.openCategory(category.name);
      await expect(page).toHaveURL(new RegExp(`/category/${category.slug}$`));
      await expect(page.getByRole('heading', { name: `Category: ${category.name}` })).toBeVisible();
    }
  });

  test('search returns products matching a known tool term', async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.searchFor('hammer');
    await expect(catalogPage.productCards.first()).toBeVisible();
    const matchingNames = (await catalogPage.productCards.allTextContents()).filter((card) =>
      /hammer/i.test(card),
    );
    expect(matchingNames.length).toBeGreaterThan(0);
  });

  test('search shows no products for an unmatched term and can be cleared', async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.searchFor(invalidSearchTerm);
    await expect(catalogPage.productCards).toHaveCount(0);
    await catalogPage.clearSearch();
    await expect(catalogPage.productCards.first()).toBeVisible();
  });

  test('sorts products by name from A to Z', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards.first()).toBeVisible();
    await catalogPage.sortBy('Name (A - Z)');
    await expect
      .poll(async () => {
        const names = await catalogPage.productNames();
        return isSorted(names, (previous, current) => previous.localeCompare(current));
      })
      .toBeTruthy();
  });

  test('sorts products by name from Z to A', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards.first()).toBeVisible();
    await catalogPage.sortBy('Name (Z - A)');
    await expect
      .poll(async () => {
        const names = await catalogPage.productNames();
        return isSorted(names, (previous, current) => current.localeCompare(previous));
      })
      .toBeTruthy();
  });

  test('sorts products by price from low to high', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards.first()).toBeVisible();
    await catalogPage.sortBy('Price (Low - High)');
    await expect
      .poll(async () => {
        const prices = await catalogPage.productPrices();
        return (
          prices.length > 1 &&
          prices.every(Number.isFinite) &&
          isSorted(prices, (previous, current) => previous - current)
        );
      })
      .toBeTruthy();
  });

  test('sorts products by price from high to low', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards.first()).toBeVisible();
    await catalogPage.sortBy('Price (High - Low)');
    await expect
      .poll(async () => {
        const prices = await catalogPage.productPrices();
        return (
          prices.length > 1 &&
          prices.every(Number.isFinite) &&
          isSorted(prices, (previous, current) => current - previous)
        );
      })
      .toBeTruthy();
  });

  test('category and brand selections narrow the catalog', async ({ catalogPage, page }) => {
    await catalogPage.goto();
    await catalogPage.openFilters();
    await expect(catalogPage.productCards.first()).toBeVisible();
    const initialNames = await catalogPage.productNames();
    await page.getByRole('checkbox', { name: 'Hand Tools', exact: true }).check();
    await page.getByRole('checkbox', { name: 'ForgeFlex Tools', exact: true }).check();
    await expect(page.getByRole('checkbox', { name: 'Hand Tools', exact: true })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'ForgeFlex Tools', exact: true })).toBeChecked();
    await expect.poll(() => catalogPage.productNames()).not.toEqual(initialNames);
  });

  test('eco-friendly filter narrows results and restores them when cleared', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto();
    await catalogPage.openFilters();
    await expect(catalogPage.productCards.first()).toBeVisible();
    const initialNames = await catalogPage.productNames();
    const filter = page.getByRole('checkbox', { name: 'Show only eco-friendly products' });
    await filter.check();
    await expect(filter).toBeChecked();
    await expect.poll(() => catalogPage.productNames()).not.toEqual(initialNames);
    await filter.uncheck();
    await expect.poll(() => catalogPage.productNames()).toEqual(initialNames);
  });

  test('price range filter changes the range and exposes a resettable catalog', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goto();
    await catalogPage.openFilters();
    const sliders = page.getByRole('slider');
    await expect(sliders).toHaveCount(2);
    const lowerBound = sliders.first();
    await lowerBound.focus();
    await lowerBound.press('ArrowRight');
    await expect(page.getByText(/\d+\s*-\s*\d+/)).toBeVisible();
    await lowerBound.press('Home');
    await expect(catalogPage.productCards.first()).toBeVisible();
  });

  test('pagination changes the visible catalog page', async ({ catalogPage, page }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards.first()).toBeVisible();
    const firstPageNames = await catalogPage.productNames();
    await page.getByRole('button', { name: 'Page-2' }).click();
    await expect.poll(() => catalogPage.productNames()).not.toEqual(firstPageNames);
    const secondPageNames = await catalogPage.productNames();
    expect(secondPageNames.length).toBeGreaterThan(0);
    expect(secondPageNames).not.toEqual(firstPageNames);
  });

  test('product card opens a detail page for the selected product', async ({ catalogPage, page }) => {
    await catalogPage.goto();
    const firstCard = catalogPage.productCards.first();
    const selectedName = (await firstCard.getByRole('heading').innerText()).trim();
    await firstCard.click();
    await expect(page).toHaveURL(/\/product\/[^/]+$/);
    await expect(page).toHaveTitle(new RegExp(selectedName, 'i'));
  });
});
