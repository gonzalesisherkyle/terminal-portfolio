export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'term-bg': 'var(--bg)',
        'term-surface': 'var(--surface)',
        'term-border': 'var(--border)',
        'term-green': 'var(--green)',
        'term-green-dim': 'var(--green-dim)',
        'term-green-mid': 'var(--green-muted)',
        'term-amber': 'var(--amber)',
        'term-cyan': 'var(--cyan)',
        'term-red': 'var(--red)',
        'term-text': 'var(--text)',
        'term-dim': 'var(--text-dim)',
        'term-bright': 'var(--text-bright)'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace']
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 4px var(--green)' },
          '50%': { opacity: 0.4, boxShadow: 'none' }
        },
        glitch: {
          '0%, 95%, 100%': {
            textShadow: '0 0 8px var(--glow-green)',
            transform: 'none'
          },
          '96%': {
            textShadow: '-2px 0 var(--red), 2px 0 var(--cyan)',
            transform: 'translateX(1px)'
          },
          '97%': {
            textShadow: '2px 0 var(--red), -2px 0 var(--cyan)',
            transform: 'translateX(-1px)'
          },
          '98%': {
            textShadow: '0 0 8px var(--glow-green)',
            transform: 'none'
          }
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        fadeUp: 'fadeUp 0.4s ease forwards',
        pulse: 'pulse 2s ease-in-out infinite',
        glitch: 'glitch 8s infinite'
      }
    }
  },
  plugins: []
};
