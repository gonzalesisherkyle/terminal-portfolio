export default function TerminalLink({ href, children, size = 'sm', className = '' }) {
  if (!href) {
    return null;
  }

  const sizeClass = size === 'xs' ? 'text-xs' : 'text-sm';

  return (
    <a
      className={`font-mono ${sizeClass} text-term-cyan border-b border-dashed border-term-cyan/30 transition-all duration-200 hover:text-term-bright hover:border-term-cyan ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
