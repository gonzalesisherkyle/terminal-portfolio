import TerminalLink from './TerminalLink';

export default function ResumeLink({ href }) {
  if (!href) {
    return null;
  }

  return (
    <span className="block font-mono text-sm leading-relaxed text-term-text">
      <span className="text-term-dim">resume : </span>
      <TerminalLink href={href}>./resume</TerminalLink>
    </span>
  );
}
