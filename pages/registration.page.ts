import { type Locator, type Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dateOfBirth: Locator;
  readonly country: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByRole('textbox', { name: 'First name' });
    this.lastName = page.getByRole('textbox', { name: 'Last name' });
    this.dateOfBirth = page.getByRole('textbox', { name: 'Date of Birth *' });
    this.country = page.getByRole('combobox', { name: 'Country' });
    this.email = page.getByRole('textbox', { name: 'Email address' });
    this.password = page.getByLabel('Password');
    this.registerButton = page.getByRole('button', { name: 'Register', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/register');
  }
}
