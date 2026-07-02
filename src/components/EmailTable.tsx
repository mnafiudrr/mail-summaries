import type { EmailRow } from '../lib/types';

interface EmailTableProps {
  rows: EmailRow[];
}

export default function EmailTable({ rows }: EmailTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
        No emails yet. Upload some <span className="font-medium">.eml</span> files to get started.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-slate-600">
          <tr>
            <th className="px-3 py-2 font-semibold">Filename</th>
            <th className="px-3 py-2 font-semibold">Title</th>
            <th className="px-3 py-2 font-semibold">Description</th>
            <th className="px-3 py-2 font-semibold">Sender</th>
            <th className="px-3 py-2 font-semibold">Sender Domain</th>
            <th className="px-3 py-2 font-semibold">Receiver</th>
            <th className="px-3 py-2 font-semibold">Date</th>
            <th className="px-3 py-2 font-semibold">Attachments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={`${row.messageId || row.filename}-${i}`} className="hover:bg-slate-50 align-top">
              <td className="px-3 py-2 max-w-[200px] break-words text-slate-700">{row.filename}</td>
              <td className="px-3 py-2 max-w-[220px] break-words font-medium text-slate-800">
                {row.subject || '—'}
              </td>
              <td className="px-3 py-2 max-w-[320px] break-words text-slate-600">{row.description || '—'}</td>
              <td className="px-3 py-2 max-w-[200px] break-words text-slate-600">{row.sender || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap text-slate-600">{row.senderDomain || '—'}</td>
              <td className="px-3 py-2 max-w-[200px] break-words text-slate-600">{row.receiver || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap text-slate-600">{row.date || '—'}</td>
              <td className="px-3 py-2 max-w-[220px] break-words text-slate-600">{row.attachments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
