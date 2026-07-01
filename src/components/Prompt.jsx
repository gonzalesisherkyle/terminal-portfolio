import { SHELL_HOST, SHELL_USER } from '../constants/shell';

export default function Prompt({ user = SHELL_USER, host = SHELL_HOST, path = '~', cmd = '' }) {
  return (
    <div className="flex flex-wrap items-baseline mb-0.5 font-mono text-sm min-w-0">
      <span className="whitespace-nowrap">
        <span className="text-term-green">{user}</span>
        <span className="text-term-dim">@</span>
        <span className="text-term-cyan">{host}</span>
      </span>
      <span className="text-term-green mx-1">:</span>
      <span className="text-term-amber max-w-full truncate">{path}</span>
      <span className="text-term-green mx-1">$</span>
      {cmd ? <span className="text-term-bright ml-1 break-words">{cmd}</span> : null}
    </div>
  );
}
