import Papa from 'papaparse';
import type { EmailRow } from './types';

const CSV_COLUMNS: { key: keyof EmailRow; header: string }[] = [
  { key: 'filename', header: 'Filename' },
  { key: 'subject', header: 'Title' },
  { key: 'description', header: 'Description' },
  { key: 'sender', header: 'Sender' },
  { key: 'senderDomain', header: 'Sender Domain' },
  { key: 'receiver', header: 'Receiver' },
  { key: 'date', header: 'Date' },
  { key: 'attachments', header: 'Attachments' },
  { key: 'cc', header: 'CC' },
  { key: 'messageId', header: 'Message ID' },
  { key: 'category', header: 'Category' },
  { key: 'subcategory', header: 'Sub-Category' },
];

export function buildCsv(rows: EmailRow[]): string {
  const data = rows.map((row) => {
    const obj: Record<string, string> = {};
    for (const col of CSV_COLUMNS) {
      obj[col.header] = row[col.key] ?? '';
    }
    return obj;
  });
  return Papa.unparse(data, { quotes: true });
}

export function downloadCsv(rows: EmailRow[]): void {
  const csv = buildCsv(rows);
  // Prepend BOM so Excel reads UTF-8 (emoji etc.) correctly.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  link.download = `eml-export-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
