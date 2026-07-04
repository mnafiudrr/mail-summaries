export interface EmailRow {
  filename: string;
  subject: string; // title
  description: string; // body snippet, max 255 chars
  sender: string;
  senderDomain: string;
  receiver: string;
  date: string;
  attachments: string; // formatted string for CSV cell
  cc: string;
  messageId: string;
  category: string;
  subcategory: string;
}
