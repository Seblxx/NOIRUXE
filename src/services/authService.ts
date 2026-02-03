import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role?: string;
}

// Set token in axios defaults for API calls
const setAxiosToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // Also store in localStorage for the api instance
  localStorage.setItem('token', token);
};

// Clear token from both axios and localStorage
const clearAxiosToken = () => {
  delete axios.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Initialize axios with token if exists
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.access_token) {
    setAxiosToken(session.access_token);
  }
});

// Listen for auth changes and update axios token
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.access_token) {
    setAxiosToken(session.access_token);
  } else {
    clearAxiosToken();
  }
});

export const login = async (credentials: LoginRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session?.access_token) {
    setAxiosToken(data.session.access_token);
  }

  return data;
};

export const register = async (credentials: LoginRequest) => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getProfile = async (): Promise<AdminProfile | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    role: user.role,
  };
};

export const logout = async () => {
  await supabase.auth.signOut();
  clearAxiosToken();
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
