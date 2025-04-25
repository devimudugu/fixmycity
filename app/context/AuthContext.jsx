import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user ?? null);
      } catch (error) {
        console.log('Error getting initial session:', error.message);
      } finally {
        setAuthLoading(false);
      }
    };

    getInitialSession();

    // Set up the auth state listener
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user ?? null);
      }
    );

    // Clean up the subscription
    return () => {
      if (authSubscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};