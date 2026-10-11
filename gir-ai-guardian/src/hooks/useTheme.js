import { useState, useEffect } from 'react';

/** Persist and toggle dark/light mode on <html> element */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('gir-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('gir-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gir-theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  return { isDark, toggle };
}
