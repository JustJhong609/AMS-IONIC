import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export const useAuth = (callback?: (user: AuthUser | null) => void) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const authUser: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || '',
          };
          setUser(authUser);
          callback?.(authUser);
        } else {
          setUser(null);
          callback?.(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        callback?.(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
        };
        setUser(authUser);
        callback?.(authUser);
      } else {
        setUser(null);
        callback?.(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      callback?.(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, signOut };
};
