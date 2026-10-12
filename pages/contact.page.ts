import { type Locator, type Page } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly subject: Locator;
  readonly message: Locator;
  readonly attachment: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByRole('textbox', { name: 'First name' });
    this.lastName = page.getByRole('textbox', { name: 'Last name' });
    this.email = page.getByRole('textbox', { name: 'Email address' });
    this.subject = page.getByRole('combobox', { name: 'Subject' });
    this.message = page.getByRole('textbox', { name: 'Message *' });
    this.attachment = page.locator('input[type="file"]');
    this.sendButton = page.getByRole('button', { name: 'Send', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact');
  }
}
