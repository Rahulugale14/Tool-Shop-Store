function readBoolean(value: string | undefined, fallback: boolean, name: string): boolean {
  if (value === undefined || value === '') return fallback;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`${name} must be "true" or "false".`);
}

function readBaseUrl(value: string | undefined): string {
  const candidate = value ?? 'https://practicesoftwaretesting.com';
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('BASE_URL must be an absolute HTTP(S) URL.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('BASE_URL must use HTTP or HTTPS.');
  }
  return parsed.toString().replace(/\/$/, '');
}

export const env = {
  baseUrl: readBaseUrl(process.env.BASE_URL),
  isCI: readBoolean(process.env.CI, false, 'CI'),
  headless: readBoolean(process.env.HEADLESS, true, 'HEADLESS'),
  allowMutatingTests: readBoolean(process.env.RUN_MUTATING_TESTS, false, 'RUN_MUTATING_TESTS'),
  demoEmail: process.env.DEMO_EMAIL,
  demoPassword: process.env.DEMO_PASSWORD,
  get hasDemoCredentials(): boolean {
    return Boolean(this.demoEmail && this.demoPassword);
  },
} as const;
