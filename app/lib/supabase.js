import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://maeqndalktmmaldpsjyv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZXFuZGFsa3RtbWFsZHBzanl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODgwNjIsImV4cCI6MjA2MTE2NDA2Mn0.1ZXp2JF1u4jcVa0cI3NaT9NMihJ6768qql3xoX3h1pg';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })