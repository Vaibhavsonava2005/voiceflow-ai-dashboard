import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  formatted: string;
}

export function useTimer(): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return { seconds, isRunning, start, stop, reset, formatted };
}
