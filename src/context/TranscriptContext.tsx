import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  duration: number;
  wordCount: number;
}

interface TranscriptContextType {
  currentTranscript: string;
  interimText: string;
  history: TranscriptEntry[];
  wordCount: number;
  setCurrentTranscript: (text: string) => void;
  setInterimText: (text: string) => void;
  appendToTranscript: (text: string) => void;
  saveToHistory: (duration: number) => void;
  clearCurrent: () => void;
  clearHistory: () => void;
}

const TranscriptContext = createContext<TranscriptContextType | null>(null);

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [history, setHistory] = useState<TranscriptEntry[]>([]);

  const wordCount = currentTranscript
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  const appendToTranscript = useCallback((text: string) => {
    setCurrentTranscript(prev => {
      const separator = prev && !prev.endsWith(' ') ? ' ' : '';
      return prev + separator + text;
    });
  }, []);

  const saveToHistory = useCallback((duration: number) => {
    setCurrentTranscript(prev => {
      if (prev.trim()) {
        const trimmed = prev.trim();
        const entry: TranscriptEntry = {
          id: crypto.randomUUID(),
          text: trimmed,
          timestamp: new Date(),
          duration,
          wordCount: trimmed.split(/\s+/).filter(w => w.length > 0).length,
        };
        setHistory(h => [entry, ...h]);
      }
      return '';
    });
    setInterimText('');
  }, []);

  const clearCurrent = useCallback(() => {
    setCurrentTranscript('');
    setInterimText('');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <TranscriptContext.Provider value={{
      currentTranscript,
      interimText,
      history,
      wordCount,
      setCurrentTranscript,
      setInterimText,
      appendToTranscript,
      saveToHistory,
      clearCurrent,
      clearHistory,
    }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  const ctx = useContext(TranscriptContext);
  if (!ctx) throw new Error('useTranscript must be used within TranscriptProvider');
  return ctx;
}
