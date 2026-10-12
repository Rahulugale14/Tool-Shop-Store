import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly googleButton: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email address *' });
    this.passwordInput = page.getByLabel('Password *');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.googleButton = page.getByRole('button', { name: 'Sign in with Google' });
    this.registerLink = page.getByRole('link', { name: 'Register your account' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your Password?' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
