import { supabase } from './supabaseClient';

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    window.location.href = '/login';
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
