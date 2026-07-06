'use client';

import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry } from '@/types';
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ENTRIES } from '@/lib/constants';

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let parsed: HistoryEntry[] = [];
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) parsed = JSON.parse(raw);
    } catch {
      // ignore parse errors
    }

    Promise.resolve().then(() => {
      if (parsed.length > 0) setEntries(parsed);
      setIsLoaded(true);
    });
  }, []);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setEntries(prev => {
      const filtered = prev.filter(e => e.id !== entry.id);
      const updated = [entry, ...filtered].slice(0, MAX_HISTORY_ENTRIES);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch { /* quota exceeded */ }
      return updated;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(HISTORY_STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return { entries, isLoaded, addEntry, removeEntry, clearAll };
}
