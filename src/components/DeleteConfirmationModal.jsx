import TerminalModal from './TerminalModal';
import OutputLine from './OutputLine';
import CommandButton from './CommandButton';

export default function DeleteConfirmationModal({
  open,
  path,
  command,
  itemLabel,
  pending = false,
  error = '',
  onConfirm,
  onClose
}) {
  return (
    <TerminalModal open={open} path={path} command={command} onClose={onClose} closeDisabled={pending}>
      <div className="grid gap-3">
        <OutputLine label="target" value={itemLabel} variant="bright" />
        <OutputLine value="# delete permanently? this action cannot be undone" variant="red" />
        <div className="flex flex-wrap gap-2">
          <CommandButton onClick={onConfirm} variant="danger" disabled={pending}>
            {pending ? 'deleting...' : 'delete'}
          </CommandButton>
          <CommandButton onClick={onClose} disabled={pending}>
            cancel
          </CommandButton>
        </div>
        {error ? <OutputLine value={error} variant="red" /> : null}
      </div>
    </TerminalModal>
  );
}
