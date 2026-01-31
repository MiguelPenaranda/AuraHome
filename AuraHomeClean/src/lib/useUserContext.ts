import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUserContext() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error en fetchProfile:", error.message);
      }
      setProfile(data);
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      // IMPORTANTE: Siempre detenemos la carga al final
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Verificación inicial
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. Suscripción a cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, profile, loading };
}