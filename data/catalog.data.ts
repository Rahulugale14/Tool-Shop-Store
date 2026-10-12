export const categoryCases = [
  { name: 'Hand Tools', slug: 'hand-tools' },
  { name: 'Power Tools', slug: 'power-tools' },
  { name: 'Other', slug: 'other' },
  { name: 'Special Tools', slug: 'special-tools' },
] as const;

export const sortCases = [
  { label: 'Name (A - Z)', mode: 'ascending' },
  { label: 'Name (Z - A)', mode: 'descending' },
  { label: 'Price (Low - High)', mode: 'ascending' },
  { label: 'Price (High - Low)', mode: 'descending' },
] as const;

export const invalidSearchTerm = 'no-such-tool-term-xyz';
