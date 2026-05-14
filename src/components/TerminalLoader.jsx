import Cursor from './Cursor';

export default function TerminalLoader({ value = 'loading...' }) {
  return (
    <span className="block font-mono text-sm leading-relaxed text-term-dim" aria-live="polite">
      {value}
      <Cursor />
    </span>
  );
}
