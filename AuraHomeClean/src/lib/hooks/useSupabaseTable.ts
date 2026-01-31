import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

/**
 * Hook para consumir tablas de Supabase filtradas por hogar
 * @param tableName - Nombre de la tabla (products, categories, etc.)
 * @param homeId - ID del hogar del perfil actual
 */
export function useSupabaseTable(tableName: string, homeId: string | undefined) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!homeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: result, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .eq('home_id', homeId);

      if (queryError) throw queryError;

      setData(result || []);
      setError(null);
    } catch (err: any) {
      console.error(`Error cargando tabla ${tableName}:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tableName, homeId]);

  useEffect(() => {
    fetchData();

    // Suscripción en tiempo real para mantener la UI sincronizada
    if (homeId) {
      const channel = supabase
        .channel(`realtime:${tableName}:${homeId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: `home_id=eq.${homeId}`,
          },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tableName, homeId, fetchData]);

  return { data, loading, error, refetch: fetchData };
}