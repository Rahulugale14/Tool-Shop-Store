import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseCsv(contents: string, fileName: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let insideQuotes = false;

  for (let index = 0; index < contents.length; index += 1) {
    const character = contents[index];
    if (character === undefined) continue;

    if (insideQuotes) {
      if (character === '"' && contents[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        insideQuotes = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      insideQuotes = true;
    } else if (character === ',') {
      row.push(field.trim());
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && contents[index + 1] === '\n') index += 1;
      row.push(field.trim());
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (insideQuotes) throw new Error(`CSV file "${fileName}" contains an unclosed quoted field.`);
  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.some((value) => value !== '')) rows.push(row);
  }
  return rows;
}

export function readCsvRecords(fileName: string): Array<Record<string, string>> {
  const contents = readFileSync(resolve(__dirname, '..', 'data', fileName), 'utf8');
  const [headers, ...rows] = parseCsv(contents, fileName);
  if (!headers || headers.length === 0) {
    throw new Error(`CSV file "${fileName}" must contain a header row.`);
  }
  if (new Set(headers).size !== headers.length || headers.some((header) => header === '')) {
    throw new Error(`CSV file "${fileName}" contains missing or duplicate headers.`);
  }

  return rows.map((values, rowIndex) => {
    if (values.length !== headers.length) {
      throw new Error(
        `CSV file "${fileName}" row ${rowIndex + 2} has ${values.length} fields; expected ${headers.length}.`,
      );
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}
