import { formatAvailability } from '../utils/format';

export default function StatusBar({ status, location }) {
  return (
    <div className="flex flex-wrap gap-5 items-center bg-term-green/[0.06] border border-term-green/20 px-3 py-1.5 rounded-sm font-mono text-xs mb-4">
      <span className="text-term-dim">
        <span className="inline-block w-1.5 h-1.5 rounded bg-term-green mr-1.5 animate-pulse" />
        <span className="text-term-green">{formatAvailability(status)}</span>
      </span>
      {location ? (
        <span className="text-term-dim">
          location: <span className="text-term-green">{location}</span>
        </span>
      ) : null}
    </div>
  );
}
