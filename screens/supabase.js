import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spblsayukimqbwffkjyi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYmxzYXl1a2ltcWJ3ZmZranlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTc5NTEsImV4cCI6MjA2NDk5Mzk1MX0.b9jkbhKqnPxdldXj3WHLQf4b6_VT0-SX2QgEg5fN2RA';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,            // 🔐 Mantiene la sesión activa
    autoRefreshToken: true,          // 🔄 Renueva token automáticamente
    detectSessionInUrl: false        // 🚫 Evita errores con URLs
  }
});
