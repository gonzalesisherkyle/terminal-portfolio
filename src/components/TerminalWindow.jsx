export default function TerminalWindow({ path = '~', children }) {
  return (
    <main className="max-w-4xl mx-auto px-4 pb-10 pt-5 font-mono">
      <div className="bg-term-border border border-term-border rounded-t px-4 py-2 flex items-center gap-2">
        <span className="w-3 h-3 rounded bg-term-red" />
        <span className="w-3 h-3 rounded bg-term-amber" />
        <span className="w-3 h-3 rounded bg-term-green" />
        <span className="ml-2 text-term-dim text-xs tracking-wider truncate">
          user@devbox - {path} - bash - 120x40
        </span>
      </div>
      <div className="bg-term-surface border border-term-border border-t-0 rounded-b px-5 py-5 shadow-[0_20px_60px_var(--shadow-terminal)]">
        {children}
      </div>
    </main>
  );
}
