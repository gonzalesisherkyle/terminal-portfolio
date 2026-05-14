import Cursor from './Cursor';
import Prompt from './Prompt';

export default function TerminalReady({ path = '~', cmd = '' }) {
  return (
    <div className="flex items-center">
      <Prompt path={path} cmd={cmd} />
      <Cursor />
    </div>
  );
}
