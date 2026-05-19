import { useEffect } from 'react';
import Prompt from './Prompt';

export default function TerminalModal({ open, path = '~', command = '', onClose, children }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1001] flex items-start justify-center overflow-y-auto bg-term-bg/90 px-4 py-6 font-mono">
      <div className="w-full max-w-3xl" role="dialog" aria-modal="true" aria-label={command || path}>
        <div className="bg-term-border border border-term-border rounded-t px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-term-red" />
          <span className="w-3 h-3 rounded bg-term-amber" />
          <span className="w-3 h-3 rounded bg-term-green" />
          <span className="ml-2 flex-1 text-term-dim text-xs tracking-wider truncate">
            isher@devbox - {path} - modal - 90x30
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-term-border px-2 py-0.5 text-xs text-term-red transition-all duration-200 hover:border-term-red hover:text-term-bright"
            aria-label="Close modal"
          >
            x
          </button>
        </div>
        <div className="bg-term-surface border border-term-border border-t-0 rounded-b px-5 py-5 shadow-[0_20px_60px_var(--shadow-terminal)]">
          <Prompt path={path} cmd={command} />
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
