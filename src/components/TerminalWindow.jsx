import TerminalShell from './TerminalShell';
import { SHELL_IDENTITY } from '../constants/shell';

export default function TerminalWindow({ path = '~', title, children }) {
  return (
    <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-4 pb-10 pt-5 font-mono">
      {title ? <h1 className="sr-only">{title}</h1> : null}
      <div className="bg-term-border border border-term-border rounded-t px-4 py-2 flex items-center gap-2">
        <span aria-hidden="true" className="w-3 h-3 rounded bg-term-red" />
        <span aria-hidden="true" className="w-3 h-3 rounded bg-term-amber" />
        <span aria-hidden="true" className="w-3 h-3 rounded bg-term-green" />
        <span className="ml-2 text-term-dim text-xs tracking-wider truncate">
          {SHELL_IDENTITY} - {path} - bash - 120x40
        </span>
      </div>
      <div className="bg-term-surface border border-term-border border-t-0 rounded-b px-5 py-5 shadow-[0_20px_60px_var(--shadow-terminal)]">
        {children}
        <TerminalShell currentPath={path} />
      </div>
    </main>
  );
}
