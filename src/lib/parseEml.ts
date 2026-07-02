import PostalMime from 'postal-mime';
import type { EmailRow } from './types';

const MAX_DESC = 255;

function formatAddress(addr: { name?: string; address?: string } | undefined): string {
  if (!addr) return '';
  const name = addr.name?.trim();
  const address = addr.address?.trim();
  if (name && address) return `${name} <${address}>`;
  return address || name || '';
}

function formatAddressList(list: { name?: string; address?: string }[] | undefined): string {
  if (!list || list.length === 0) return '';
  return list.map(formatAddress).join('; ');
}

function stripHtml(html: string): string {
  // Remove style/script blocks first, then tags, then decode entities, collapse whitespace.
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatAttachments(
  attachments:
    | { filename?: string | null; content?: unknown; mimeType?: string; size?: number }[]
    | undefined,
): string {
  if (!attachments || attachments.length === 0) return 'none';
  return attachments
    .map((a) => {
      const name = a.filename || '(unnamed)';
      const size = a.size ? ` (${formatBytes(a.size)})` : '';
      return `${name}${size}`;
    })
    .join('; ');
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function extractDomain(addr: { address?: string } | undefined): string {
  const email = addr?.address?.trim();
  if (!email) return '';
  const at = email.lastIndexOf('@');
  if (at === -1 || at === email.length - 1) return '';
  return email.slice(at + 1).toLowerCase();
}

export async function parseEmlFile(file: File): Promise<EmailRow> {
  const raw = await file.text();
  const parsed = await PostalMime.parse(raw);

  // Prefer plain text; fall back to stripped HTML.
  let body = parsed.text?.trim() || '';
  if (!body && parsed.html) {
    body = stripHtml(parsed.html);
  }

  const description = truncate(body, MAX_DESC);

  return {
    filename: file.name,
    subject: parsed.subject?.trim() || '',
    description,
    sender: formatAddress(parsed.from),
    senderDomain: extractDomain(parsed.from),
    receiver: formatAddressList(parsed.to),
    date: parsed.date || '',
    attachments: formatAttachments(parsed.attachments),
    cc: formatAddressList(parsed.cc),
    messageId: parsed.messageId || '',
  };
}

export async function parseEmlFiles(files: File[]): Promise<EmailRow[]> {
  const results = await Promise.allSettled(files.map(parseEmlFile));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<EmailRow> => r.status === 'fulfilled',
    )
    .map((r) => r.value);
}
