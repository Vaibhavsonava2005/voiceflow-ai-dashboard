import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranscript } from '../context/TranscriptContext';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseDeepgramReturn {
  isListening: boolean;
  connectionStatus: ConnectionStatus;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export function useDeepgram(): UseDeepgramReturn {
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const isListeningRef = useRef(false);
  
  const { appendToTranscript, setInterimText } = useTranscript();



  const cleanup = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.onmessage = null;
      socketRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(async (stream: MediaStream) => {
    setConnectionStatus('connecting');
    setError(null);

    let token = '';
    try {
      const res = await fetch('/api/token');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.token) {
        throw new Error('Token not received from backend');
      }
      token = data.token;
    } catch (e) {
      console.error("Deepgram token error:", e);
      setError(`Failed to secure connection token: ${e instanceof Error ? e.message : 'Make sure DEEPGRAM_API_KEY is configured on Vercel.'}`);
      setConnectionStatus('error');
      return;
    }

    const params = new URLSearchParams({
      model: 'nova-2',
      language: 'en',
      smart_format: 'true',
      interim_results: 'true',
      punctuate: 'true',
      endpointing: '100', // Ultra-fast endpointing
      utterance_end_ms: '1000',
    });

    try {
      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params.toString()}`,
        ['token', token]
      );

      socketRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Start MediaRecorder
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(100); // 100ms chunks for butter-smooth live transcription

        // KeepAlive every 3s
        keepAliveRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'KeepAlive' }));
          }
        }, 3000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'Results') {
            const transcript = data.channel?.alternatives?.[0]?.transcript;
            if (!transcript) return;

            if (data.is_final) {
              appendToTranscript(transcript);
              setInterimText('');
            } else {
              setInterimText(transcript);
            }
          }
        } catch (e) {
          console.error('Error parsing Deepgram message:', e);
        }
      };

      socket.onclose = (event) => {
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }

        if (intentionalCloseRef.current) {
          setConnectionStatus('disconnected');
          return;
        }

        // Auto-reconnect
        if (isListeningRef.current && reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          setConnectionStatus('connecting');
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          setTimeout(() => {
            if (isListeningRef.current && streamRef.current) {
              connectWebSocket(streamRef.current);
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= 5) {
          setError('Connection lost. Max reconnection attempts reached.');
          setConnectionStatus('error');
          setIsListening(false);
          isListeningRef.current = false;
        } else {
          setConnectionStatus('disconnected');
        }
      };

      socket.onerror = () => {
        setError('WebSocket connection error');
        setConnectionStatus('error');
      };
    } catch (e) {
      setError(`Failed to connect: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setConnectionStatus('error');
    }
  }, [appendToTranscript, setInterimText]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      intentionalCloseRef.current = false;
      reconnectAttemptsRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      setIsListening(true);
      isListeningRef.current = true;

      await connectWebSocket(stream);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow access to your microphone.');
      } else if (e instanceof DOMException && e.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Failed to start: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
      setConnectionStatus('error');
    }
  }, [connectWebSocket]);

  const stopListening = useCallback(() => {
    intentionalCloseRef.current = true;
    isListeningRef.current = false;
    setIsListening(false);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'CloseStream' }));
    }

    cleanup();
    setConnectionStatus('idle');
  }, [cleanup]);

  useEffect(() => {
    return () => {
      intentionalCloseRef.current = true;
      isListeningRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    isListening,
    connectionStatus,
    startListening,
    stopListening,
    error,
  };
}
