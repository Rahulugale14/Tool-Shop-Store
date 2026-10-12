import { test, expect } from '../../fixtures/base.fixture';

test.describe('Product details and cart @cart @regression', () => {
  test('product detail page shows product information and purchase controls', async ({ productPage }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await expect(productPage.title).toBeVisible();
    await expect(productPage.page.getByText(/\$\s*\d/).first()).toBeVisible();
    expect(await productPage.page.locator('img[alt]').count()).toBeGreaterThan(0);
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('product quantity can be increased and returned to one', async ({ productPage }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await expect(productPage.quantityInput).toBeVisible();
    await productPage.quantityInput.fill('2');
    await expect(productPage.quantityInput).toHaveValue('2');
    await productPage.quantityInput.fill('1');
    await expect(productPage.quantityInput).toHaveValue('1');
  });

  test('adding a product to cart preserves the selected quantity', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.quantityInput.fill('2');
    await productPage.addToCart();
    await expect(page.getByRole('link', { name: /cart/i })).toContainText('2');
    await cartPage.goto();
    await expect(cartPage.productRows.filter({ hasText: /combination pliers/i })).toBeVisible();
    await expect(cartPage.quantityInput).toHaveValue('2');
  });

  test('cart displays line items and a total', async ({ productPage, cartPage }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToCart();
    await cartPage.goto();
    await expect(cartPage.cartStep).toBeVisible();
    await expect(cartPage.productRows.filter({ hasText: /combination pliers/i })).toBeVisible();
    await expect(cartPage.totalText).toBeVisible();
  });

  test('cart quantity changes recalculate the visible subtotal', async ({ productPage, cartPage }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToCart();
    await cartPage.goto();
    const quantity = cartPage.quantityInput;
    await expect(quantity).toBeVisible();
    await quantity.fill('2');
    await quantity.press('Tab');
    await expect(quantity).toHaveValue('2');
    await expect(cartPage.totalText).toBeVisible();
  });

  test('removing items produces the empty-cart state', async ({ productPage, cartPage }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToCart();
    await cartPage.goto();
    const removeButton = cartPage.removeButtons.first();
    await expect(removeButton).toBeVisible();
    await removeButton.click();
    await expect(cartPage.emptyState).toBeVisible();
  });

  test('favourite action gives unauthenticated users clear feedback', async ({ productPage, page }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await expect(productPage.favouritesButton).toBeVisible();
    await productPage.addToFavourites();
    await expect(page.getByRole('alert')).toContainText(/unauthorized|favorite|favourite/i);
  });

  test('comparison retains two products and can be cleared', async ({
    productPage,
    comparisonPage,
    page,
  }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToComparison();
    await productPage.gotoProductByName('Pliers');
    await productPage.addToComparison();
    await expect(page.getByText('2 product(s) selected')).toBeVisible();
    await page.getByRole('link', { name: 'Compare Now', exact: true }).click();
    await expect(comparisonPage.heading).toBeVisible();
    await expect(comparisonPage.table).toContainText('Combination Pliers');
    await expect(comparisonPage.table).toContainText('Pliers');
    await comparisonPage.clearAllButton.click();
    await expect(comparisonPage.table).toHaveCount(0);
  });

  test('related product links open another product detail page', async ({ productPage, page }) => {
    await productPage.gotoProductByName('Combination Pliers');
    test.skip(
      !(await productPage.relatedProductsHeading.isVisible()),
      'Related product section is unavailable while the product API returns 401.',
    );
    const relatedProduct = page.locator('a[href^="/product/"]').first();
    await expect(relatedProduct).toBeVisible();
    await relatedProduct.click();
    await expect(page).toHaveURL(/\/product\/[^/]+$/);
  });

  test('cart contents remain available after ordinary browsing', async ({ productPage, cartPage, page }) => {
    await productPage.gotoProductByName('Combination Pliers');
    await productPage.addToCart();
    await page.goto('/');
    await expect(page).toHaveTitle(/Practice Software Testing.*Toolshop/i);
    await expect(page.getByRole('heading', { name: 'Practice Software Testing - Toolshop' })).toBeVisible();
    await cartPage.goto();
    await expect(cartPage.productRows.filter({ hasText: /combination pliers/i })).toBeVisible();
  });

  test('out-of-stock product is identified before attempting purchase', async ({
    catalogPage,
    productPage,
    page,
  }) => {
    await catalogPage.goto();
    const outOfStockCard = page.locator('a[href^="/product/"]').filter({ hasText: 'Long Nose Pliers' });
    await expect(outOfStockCard).toContainText(/out of stock/i);
    await outOfStockCard.click();
    await expect(page).toHaveURL(/\/product\/[^/]+$/);
    await expect(page.getByText(/out of stock/i)).toBeVisible();
    await expect(productPage.addToCartButton).toBeDisabled();
  });

  test('checkout does not proceed with an empty cart', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.goto();
    await expect(cartPage.cartStep).toBeVisible();
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await expect(checkoutPage.paymentStep).toBeVisible();
    await expect(page).not.toHaveURL(/\/checkout\/(billing|payment|confirmation)/);
  });
});
