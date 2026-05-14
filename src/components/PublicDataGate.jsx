import TerminalWindow from './TerminalWindow';
import Prompt from './Prompt';
import OutputLine from './OutputLine';
import TerminalReady from './TerminalReady';
import { usePublicData } from '../context/PublicDataContext';

export default function PublicDataGate({ path, children }) {
  const { isInitialLoading } = usePublicData();

  if (!isInitialLoading) {
    return children;
  }

  return (
    <TerminalWindow path={path}>
      <Prompt path={path} cmd="preload ./portfolio-data" />
      <OutputLine value="warming portfolio cache..." variant="dim" />
      <TerminalReady path={path} />
    </TerminalWindow>
  );
}
