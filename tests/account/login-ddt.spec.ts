import { expect, test } from '../../fixtures/base.fixture';
import { readCsvRecords } from '../../helpers/csv-data';

type InvalidLoginCase = {
  caseId: string;
  email: string;
  password: string;
  expectedOutcome: 'rejected';
};

const invalidLoginCases: InvalidLoginCase[] = readCsvRecords('invalid-login-cases.csv').map(
  (record, index) => {
    const expectedOutcome = record.expected_outcome;
    if (!record.case_id || !record.email || !record.password || expectedOutcome !== 'rejected') {
      throw new Error(`Invalid login CSV data on row ${index + 2}.`);
    }
    return {
      caseId: record.case_id,
      email: record.email,
      password: record.password,
      expectedOutcome,
    };
  },
);

test.describe('CSV-driven invalid login @auth @regression', () => {
  for (const loginCase of invalidLoginCases) {
    test(`${loginCase.caseId} is ${loginCase.expectedOutcome}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(loginCase.email, loginCase.password);
      await expect(loginPage.page).toHaveURL(/\/auth\/login$/);
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.page.getByText(/invalid|incorrect|unauthorized|failed/i)).toBeVisible();
    });
  }
});
