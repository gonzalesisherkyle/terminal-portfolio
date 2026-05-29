import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('terminal-theme') || 'green');
  const [crtEnabled, setCrtEnabled] = useState(() => localStorage.getItem('terminal-crt') !== 'false');
  const [matrixEnabled, setMatrixEnabled] = useState(() => localStorage.getItem('terminal-matrix') === 'true');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-green', 'theme-amber', 'theme-cyberpunk', 'theme-dracula', 'theme-mono');
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('terminal-theme', theme);
  }, [theme]);

  const addHistory = useCallback((command, output, path) => {
    setHistory((prev) => [...prev, { command, output, path }]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      crtEnabled,
      setCrtEnabled,
      matrixEnabled,
      setMatrixEnabled,
      history,
      addHistory,
      clearHistory
    }),
    [theme, crtEnabled, matrixEnabled, history, addHistory, clearHistory]
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
