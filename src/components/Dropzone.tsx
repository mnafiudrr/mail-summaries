import { useCallback, useRef, useState } from 'react';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function Dropzone({ onFiles, disabled }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const emlFiles = Array.from(fileList).filter(
        (f) => f.name.toLowerCase().endsWith('.eml') || f.type === 'message/rfc822',
      );
      if (emlFiles.length > 0) onFiles(emlFiles);
    },
    [onFiles],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
        dragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".eml,message/rfc822"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          // reset so selecting the same file again still fires change
          e.target.value = '';
        }}
      />
      <div className="text-4xl mb-3">📧</div>
      <p className="text-lg font-medium text-slate-700">
        Drag & drop <span className="font-semibold">.eml</span> files here
      </p>
      <p className="text-sm text-slate-500 mt-1">or click to browse — you can drop whole folders</p>
    </div>
  );
}
