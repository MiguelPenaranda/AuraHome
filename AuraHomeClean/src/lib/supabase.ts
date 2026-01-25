import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validación defensiva
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Error: Variables de entorno de Supabase no encontradas.",
    "Asegúrate de que el archivo .env tenga los prefijos EXPO_PUBLIC_ y de reiniciar el server con 'npx expo start -c'"
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        persistSession: false,
        autoRefreshToken: false, 
    },
});

export default supabase;

console.log("✅ Supabase Client inicializado correctamente");