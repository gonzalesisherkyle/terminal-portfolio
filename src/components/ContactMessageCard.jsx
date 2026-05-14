import CommandButton from './CommandButton';
import OutputLine from './OutputLine';
import { formatDate } from '../utils/format';

export default function ContactMessageCard({ message, onRead, onDelete }) {
  return (
    <article className="relative border border-term-border rounded-sm px-4 py-3 my-2 transition-all duration-200 hover:border-term-green/40">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="font-mono text-sm text-term-cyan font-bold">{message.name}</span>
        <span className={message.read ? 'font-mono text-xs text-term-dim' : 'font-mono text-xs text-term-green'}>
          {message.read ? 'read' : 'unread'}
        </span>
      </div>
      <OutputLine label="email" value={message.email} variant="bright" />
      <OutputLine label="date" value={formatDate(message.createdAt)} variant="dim" />
      <p className="font-mono text-sm text-term-text mt-2 whitespace-pre-wrap">{message.message}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <CommandButton onClick={onRead} disabled={message.read}>
          mark-read
        </CommandButton>
        <CommandButton onClick={onDelete} variant="danger">
          delete
        </CommandButton>
      </div>
    </article>
  );
}
