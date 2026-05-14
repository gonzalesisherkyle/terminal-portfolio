export default function TerminalField({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  checked,
  options = [],
  placeholder = ''
}) {
  const baseClass =
    'w-full rounded-sm border border-term-border bg-term-bg px-3 py-2 font-mono text-sm text-term-bright outline-none transition-all duration-200 placeholder:text-term-dim focus:border-term-green';

  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 font-mono text-xs text-term-text">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded-sm border-term-border bg-term-bg accent-term-green"
        />
        <span>{label}</span>
      </label>
    );
  }

  if (options.length) {
    return (
      <label className="block">
        <span className="block font-mono text-xs text-term-dim mb-1">{label}</span>
        <select className={baseClass} value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="block font-mono text-xs text-term-dim mb-1">{label}</span>
      {multiline ? (
        <textarea
          className={`${baseClass} min-h-28 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={baseClass}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
