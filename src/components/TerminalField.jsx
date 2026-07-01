import { useId } from 'react';

export default function TerminalField({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  checked,
  options = [],
  placeholder = '',
  required = false,
  autoComplete,
  error = '',
  inputMode
}) {
  const generatedId = useId();
  const fieldId = `field-${generatedId}`;
  const errorId = `${fieldId}-error`;

  const baseClass =
    'w-full rounded-sm border border-term-border bg-term-bg px-3 py-2 font-mono text-base sm:text-sm text-term-bright transition-all duration-200 placeholder:text-term-dim focus:border-term-green';

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

  const describedBy = error ? errorId : undefined;

  const labelNode = (
    <span className="block font-mono text-xs text-term-dim mb-1">
      {label}
      {required ? <span className="text-term-red" aria-hidden="true"> *</span> : null}
    </span>
  );

  const errorNode = error ? (
    <p id={errorId} className="mt-1 font-mono text-xs text-term-red">
      {error}
    </p>
  ) : null;

  if (options.length) {
    return (
      <div>
        <label htmlFor={fieldId} className="block">
          {labelNode}
          <select
            id={fieldId}
            className={`${baseClass} min-h-[44px]`}
            value={value}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {errorNode}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={fieldId} className="block">
        {labelNode}
        {multiline ? (
          <textarea
            id={fieldId}
            className={`${baseClass} min-h-28 resize-y`}
            value={value}
            placeholder={placeholder}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            id={fieldId}
            className={`${baseClass} min-h-[44px]`}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </label>
      {errorNode}
    </div>
  );
}
