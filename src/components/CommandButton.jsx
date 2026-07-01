export default function CommandButton({ children, onClick, type = 'button', disabled = false, variant = 'default' }) {
  const variantClass =
    variant === 'danger'
      ? 'text-term-red hover:border-term-red hover:text-term-bright'
      : 'text-term-cyan hover:border-term-green hover:text-term-green';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-sm border border-term-border px-4 py-2 font-mono text-xs transition-all duration-200 disabled:text-term-dim disabled:hover:border-term-border ${variantClass}`}
    >
      {children}
    </button>
  );
}
