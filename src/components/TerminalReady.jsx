import Prompt from './Prompt';

export default function TerminalReady({ path = '~', cmd = '' }) {
  if (!cmd) {
    return null;
  }
  return (
    <div className="flex items-center mb-1">
      <Prompt path={path} cmd={cmd} />
    </div>
  );
}
