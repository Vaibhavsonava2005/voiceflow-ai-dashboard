import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

import nhost from '../lib/nhost';

interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any | null; needsVerification: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const updateStateFromSession = useCallback(() => {
    const session = nhost.getUserSession();
    if (session && session.user) {
      setIsAuthenticated(true);
      setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
        displayName: session.user.displayName ?? undefined,
        avatarUrl: session.user.avatarUrl ?? undefined,
        metadata: session.user.metadata as Record<string, unknown> | undefined,
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Initial check
    updateStateFromSession();
    setIsLoading(false);
    
    // We poll to keep auth state fresh since we don't have onAuthStateChanged
    const interval = setInterval(() => {
      updateStateFromSession();
    }, 2000);
    return () => clearInterval(interval);
  }, [updateStateFromSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await nhost.auth.signInEmailPassword({ email, password });
      updateStateFromSession();
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      setIsLoading(false);
      let errorResponse = error;
      if (error?.response?.body) {
        errorResponse = error.response.body;
      }
      return { error: errorResponse };
    }
  }, [updateStateFromSession]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const result = await nhost.auth.signUpEmailPassword({
        email,
        password,
        options: {
          displayName: displayName || email.split('@')[0],
        },
      });
      updateStateFromSession();
      setIsLoading(false);
      
      if (!result.body.session) {
        return { error: null, needsVerification: true };
      }
      return { error: null, needsVerification: false };
    } catch (error: any) {
      setIsLoading(false);
      let errorResponse = error;
      if (error?.response?.body) {
        errorResponse = error.response.body;
      }
      return { error: errorResponse, needsVerification: false };
    }
  }, [updateStateFromSession]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = nhost.getUserSession();
      if (session?.refreshToken) {
        await nhost.auth.signOut({ refreshToken: session.refreshToken });
      } else {
        await nhost.auth.signOut({});
      }
    } catch (err) {
      console.error(err);
    }
    nhost.clearSession(); // Ensure session is cleared locally
    updateStateFromSession();
    setIsLoading(false);
  }, [updateStateFromSession]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
