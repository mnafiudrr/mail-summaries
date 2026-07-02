interface ToolbarProps {
  count: number;
  onDownload: () => void;
  onReset: () => void;
}

export default function Toolbar({ count, onDownload, onReset }: ToolbarProps) {
  const hasData = count > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        {count === 0
          ? 'No emails loaded'
          : `${count} email${count === 1 ? '' : 's'} loaded`}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          disabled={!hasData}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={onDownload}
          disabled={!hasData}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⬇ Download CSV
        </button>
      </div>
    </div>
  );
}
