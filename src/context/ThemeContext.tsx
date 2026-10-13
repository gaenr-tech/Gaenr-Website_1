import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getDeviceThemeCookie(): ThemeMode | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )gaenr_device_theme=([^;]+)/);
  if (match && (match[1] === 'dark' || match[1] === 'light')) {
    return match[1] as ThemeMode;
  }
  return null;
}

function setDeviceThemeCookie(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  // 10 years persistence per device
  document.cookie = `gaenr_device_theme=${mode}; path=/; max-age=315360000; SameSite=Lax`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gaenr_theme');
        if (saved === 'dark' || saved === 'light') {
          return saved;
        }
        const cookieTheme = getDeviceThemeCookie();
        if (cookieTheme === 'dark' || cookieTheme === 'light') {
          return cookieTheme;
        }
      } catch {}
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  const applyTheme = (mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0d1527';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  };

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('gaenr_theme', theme);
      setDeviceThemeCookie(theme);
    } catch {}
  }, [theme]);

  // Sync theme changes across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gaenr_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
