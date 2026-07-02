import { useEffect, useState } from 'react';
import Dropzone from './components/Dropzone';
import EmailTable from './components/EmailTable';
import Toolbar from './components/Toolbar';
import { parseEmlFiles } from './lib/parseEml';
import { downloadCsv } from './lib/csvExport';
import type { EmailRow } from './lib/types';

const STORAGE_KEY = 'eml-to-csv:rows';

function loadRows(): EmailRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EmailRow[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [rows, setRows] = useState<EmailRow[]>(() => loadRows());
  const [parsing, setParsing] = useState(false);

  // Persist to localStorage whenever rows change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // ignore quota errors
    }
  }, [rows]);

  const handleFiles = async (files: File[]) => {
    setParsing(true);
    try {
      const newRows = await parseEmlFiles(files);
      setRows((prev) => {
        // Dedupe by messageId (fallback to filename) against existing rows.
        const seen = new Set(prev.map((r) => r.messageId || r.filename));
        const additions = newRows.filter((r) => {
          const key = r.messageId || r.filename;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return [...prev, ...additions];
      });
    } finally {
      setParsing(false);
    }
  };

  const handleReset = () => {
    if (rows.length === 0) return;
    if (window.confirm('Clear all loaded emails? This cannot be undone.')) {
      setRows([]);
    }
  };

  const handleDownload = () => {
    if (rows.length === 0) return;
    downloadCsv(rows);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">EML → CSV</h1>
          <p className="text-sm text-slate-500">
            Upload multiple <span className="font-medium">.eml</span> files, preview the extracted
            data, and download it as a CSV. Everything runs in your browser.
          </p>
        </header>

        <div className="space-y-4">
          <Dropzone onFiles={handleFiles} disabled={parsing} />

          {parsing && (
            <p className="text-center text-sm text-blue-600">Parsing files…</p>
          )}

          <Toolbar count={rows.length} onDownload={handleDownload} onReset={handleReset} />

          <EmailTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
