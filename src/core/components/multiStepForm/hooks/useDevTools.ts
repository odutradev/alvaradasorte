import { useState, useEffect, useCallback } from 'react';

const DEV_TOOLS_KEY = 'KeyQ';

export const useDevTools = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.code === DEV_TOOLS_KEY) {
      e.preventDefault();
      setIsDevToolsOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { isDevToolsOpen };
};