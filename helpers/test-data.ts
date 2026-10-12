import { randomUUID } from 'node:crypto';

export type RegistrationData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
};

export function createUniqueRegistrationData(): RegistrationData {
  const id = randomUUID().replaceAll('-', '').slice(0, 14);
  return {
    firstName: 'Playwright',
    lastName: 'Test',
    dateOfBirth: '1990-01-15',
    country: 'United States of America',
    postalCode: '10001',
    houseNumber: '10',
    street: 'Main Street',
    city: 'New York',
    state: 'New York',
    phone: '2025550100',
    email: `pw-${id}@example.com`,
    password: `Pw!${id}aA1`,
  };
}
