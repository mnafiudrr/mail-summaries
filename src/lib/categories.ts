// Category taxonomy (from user-provided JSON) + classification rules.
// Rules are evaluated top-to-bottom; first match wins.
// Each rule can constrain on senderDomain (substring match) and/or subject/body keywords (regex).

export interface CategoryDef {
  name: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: 'High Impact',
    subcategories: [
      'Travel Update',
      'Utility Notice',
      'OneTime Password',
      'Login & Accounts',
      'Calendar Invites',
      'Reminders',
      'Lease Renewal',
      'Financial Alerts',
      'Email Verification',
      'Digital Signatures',
      'Hiring',
    ],
  },
  {
    name: 'Transactions',
    subcategories: [
      'Order Confirmation',
      'Purchase Receipts',
      'Shipping Notification',
      'Shipping Progress',
      'Delivery Notice',
      'Bill Statement',
      'Bank Statements',
      'Travel Confirmation',
    ],
  },
  {
    name: 'News',
    subcategories: ['News Alerts', 'Newsletters', 'Group Messages'],
  },
  {
    name: 'Social',
    subcategories: ['Social Networking', 'Forum Messages'],
  },
  {
    name: 'Promotional',
    subcategories: [
      'Promotions',
      'Sales',
      'Coupons',
      'Surveys',
      'Feedback / Opinion',
      'Welcome Emails',
    ],
  },
];

export const UNCATEGORIZED = {
  category: 'Uncategorized',
  subcategory: 'Uncategorized',
};

export interface ClassifyInput {
  senderDomain: string;
  subject: string;
  body: string; // snippet/description
}

export interface Classification {
  category: string;
  subcategory: string;
}

interface Rule {
  domain?: string; // substring matched against senderDomain (lowercased)
  pattern?: RegExp; // tested against subject + body (lowercased)
  category: string;
  subcategory: string;
}

// Ordered rules — most specific first. Domain rules narrow by sender;
// keyword-only rules act as catch-alls for any sender.
const RULES: Rule[] = [
  // ---- High Impact: security / verification / login ----
  {
    pattern: /(one[- ]?time password|\botp\b|verification code|kode verifikasi)/i,
    category: 'High Impact',
    subcategory: 'OneTime Password',
  },
  {
    pattern: /(verif(y|ikasi|ication)|verify your|perangkat baru|login (di|on) perangkat|new device|sign-?in attempt|percobaan login|keamanan akun|multi-?factor|mfa|pertanyaan keamanan)/i,
    category: 'High Impact',
    subcategory: 'Login & Accounts',
  },
  {
    domain: 'shopee',
    pattern: /(verif|verify|penambahan password|keamanan)/i,
    category: 'High Impact',
    subcategory: 'Email Verification',
  },
  // ---- High Impact: financial alerts (Jenius) ----
  {
    domain: 'jenius',
    pattern: /(dormant|blokir|unblock|peringatan|keamanan|password|optimalisasi sistem|maintenance|syarat & ketentuan|limit|mata uang asing|expired|biaya|suku bunga|status rekening|penghentian)/i,
    category: 'High Impact',
    subcategory: 'Financial Alerts',
  },
  // ---- Transactions: travel confirmation / tickets ----
  {
    domain: 'redbus',
    pattern: /(informasi tiket|e-?tiket|tiket|rencana perjalanan|perjalanan anda|id tiket)/i,
    category: 'Transactions',
    subcategory: 'Travel Confirmation',
  },
  {
    domain: 'traveloka',
    pattern: /(e-?tiket|pesanan|pembayaran|pemesanan|booking|order)/i,
    category: 'Transactions',
    subcategory: 'Travel Confirmation',
  },
  {
    domain: 'qoala',
    pattern: /(sertifikat|asuransi|perlindungan)/i,
    category: 'Transactions',
    subcategory: 'Purchase Receipts',
  },
  // ---- Transactions: refunds / cancellations ----
  {
    pattern: /(refund|pengembalian dana|pembatalan|dibatalkan|cancel(l?ed)?)/i,
    category: 'Transactions',
    subcategory: 'Purchase Receipts',
  },
  // ---- Transactions: order/payment confirmations ----
  {
    pattern: /(order (cancelled|confirmed|placed)|payment (expired|success|received)|konfirmasi order|pembayaran berhasil|receipt|struck)/i,
    category: 'Transactions',
    subcategory: 'Order Confirmation',
  },
  // ---- Transactions: shipping / delivery ----
  {
    pattern: /(shipping|pengiriman|resi|lacak|package|delivery|pengantaran|out for delivery)/i,
    category: 'Transactions',
    subcategory: 'Shipping Notification',
  },
  {
    pattern: /(bill statement|tagihan|invoice|bank statement|rekening koran)/i,
    category: 'Transactions',
    subcategory: 'Bill Statement',
  },
  // ---- News: newsletters ----
  {
    domain: 'dicoding',
    pattern: /(newsletter)/i,
    category: 'News',
    subcategory: 'Newsletters',
  },
  {
    pattern: /(newsletter|digest|weekly update|bulletin)/i,
    category: 'News',
    subcategory: 'Newsletters',
  },
  // ---- Promotional ----
  {
    domain: 'jenius',
    pattern: /(cashback|diskon|promo|sale|voucher|potongan|thr|liburan|jepang|cash cow|maxi saver|lira|poin|travelling|nabung|debit card|kredit|skin game|spesial ulang tahun|ultah)/i,
    category: 'Promotional',
    subcategory: 'Promotions',
  },
  {
    domain: 'redbus',
    pattern: /(promo|diskon|voucher|sale|menanti|booth|ngga lagi|antri|menipis|ka99et)/i,
    category: 'Promotional',
    subcategory: 'Promotions',
  },
  {
    domain: 'traveloka',
    pattern: /(sale|kupon|diskon|promo|liburan|paket|voucher)/i,
    category: 'Promotional',
    subcategory: 'Sales',
  },
  {
    domain: 'dicoding',
    pattern: /(diskon|promo|bootcamp|academy|affiliate|komisi|buy 1 get 1|payday|skill)/i,
    category: 'Promotional',
    subcategory: 'Sales',
  },
  {
    pattern: /(diskon|promo(si)?|sale|cashback|voucher|kupon|hemat|potongan|diskon s\.?d|big sale|mega sale|10\.10|11\.11|12\.12|payday|gratis ongkir)/i,
    category: 'Promotional',
    subcategory: 'Promotions',
  },
  {
    pattern: /(survey|survei|feedback|ulasan|review|peringkat pengalaman|beri peringkat|rating)/i,
    category: 'Promotional',
    subcategory: 'Feedback / Opinion',
  },
  {
    pattern: /(selamat datang|welcome|hai selamat)/i,
    category: 'Promotional',
    subcategory: 'Welcome Emails',
  },
  // ---- High Impact: hiring ----
  {
    pattern: /(lowongan|hire|hiring|job offer|tawaran kerja|recruit|talent|career|karier|affiliate program)/i,
    category: 'High Impact',
    subcategory: 'Hiring',
  },
  // ---- High Impact: reminders ----
  {
    pattern: /(reminder|pengingat|jangan lupa|don\'t forget|segera|before it expires|akan berakhir|terakhir|last (day|chance))/i,
    category: 'High Impact',
    subcategory: 'Reminders',
  },
];

export function classifyEmail(input: ClassifyInput): Classification {
  const domain = (input.senderDomain || '').toLowerCase();
  const haystack = `${input.subject || ''}\n${input.body || ''}`.toLowerCase();

  for (const rule of RULES) {
    if (rule.domain && !domain.includes(rule.domain)) continue;
    if (rule.pattern && !rule.pattern.test(haystack)) continue;
    return { category: rule.category, subcategory: rule.subcategory };
  }

  return { ...UNCATEGORIZED };
}
