export const invalidLoginCases = [
  { name: 'unknown email', email: 'nobody@example.invalid', password: 'incorrect-password' },
  { name: 'malformed email', email: 'not-an-email', password: 'irrelevant' },
] as const;
