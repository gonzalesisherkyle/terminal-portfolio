const variantClasses = {
  default: 'text-term-text',
  bright: 'text-term-bright',
  green: 'text-term-green',
  cyan: 'text-term-cyan',
  amber: 'text-term-amber',
  red: 'text-term-red',
  dim: 'text-term-dim'
};

export default function OutputLine({
  label,
  value,
  variant = 'default',
  className = '',
  multiline = false,
  justify = false
}) {
  const textClass = variantClasses[variant] || variantClasses.default;
  const multilineClass = multiline ? 'whitespace-pre-line' : '';
  const justifyClass = justify ? 'text-justify' : '';

  return (
    <span className={`block font-mono text-sm leading-relaxed ${textClass} ${justifyClass} ${multilineClass} ${className}`}>
      {label ? <span className="text-term-dim">{label} : </span> : null}
      {value}
    </span>
  );
}
