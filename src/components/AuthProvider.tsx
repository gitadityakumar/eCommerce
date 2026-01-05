'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth/actions';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
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

    initAuth();
  }, [setUser]);

  return <>{children}</>;
}
