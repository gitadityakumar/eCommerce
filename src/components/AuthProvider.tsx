'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth/actions';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image ?? undefined,
          });
        }
        else {
          setUser(null);
        }
      }
      catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        initAuth();
      });
    }
    else {
      timeoutId = setTimeout(initAuth, 1500);
    }

    return () => {
      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [setUser]);

  return <>{children}</>;
}
