import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSupabaseTable } from '../lib/hooks/useSupabaseTable';

type RouteParams = { categoryId?: string; categoryLabel?: string };

export default function CategoryProductsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryLabel } = (route.params ?? {}) as RouteParams;

  // Datos crudos desde Supabase
  const { data: products, loading, error } = useSupabaseTable<any>('products');

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!categoryId && !categoryLabel) return products;
    return products.filter((p: any) => {
      const cid = String(p.category_id ?? p.categoryId ?? p.category_key ?? p.category_slug ?? '');
      const cname = String(p.category ?? p.category_name ?? p.categoryLabel ?? '');
      const matchId = categoryId ? cid === String(categoryId) : false;
      const matchLabel = categoryLabel ? cname === String(categoryLabel) : false;
      return matchId || matchLabel;
    });
  }, [products, categoryId, categoryLabel]);

  const items = filtered.map((row: any) => ({
    id: String(row.id ?? row.slug ?? Math.random()),
    name: String(row.name ?? row.title ?? row.label ?? 'Sin nombre'),
    quantity: Number(row.quantity ?? row.qty ?? 0),
  }));

  const title = categoryLabel ? `Productos · ${categoryLabel}` : 'Productos por categoría';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
          <Text style={styles.backText}>{'<'} Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {loading && <Text style={styles.info}>Cargando productos…</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}

      <View style={{ gap: 10 }}>
        {items.length === 0 && !loading ? (
          <Text style={styles.info}>No hay productos para esta categoría.</Text>
        ) : (
          items.map((it) => (
            <View key={it.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{it.name}</Text>
                <Text style={styles.cardMeta}>
                  {it.quantity > 0 ? 'En stock' : 'Agotado'} · {it.quantity} uds
                </Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: it.quantity > 0 ? '#DCEBFF' : '#FFE2E5' }] }>
                <Text style={[styles.statusText, { color: it.quantity > 0 ? '#1D5BFF' : '#B00020' }] }>
                  {it.quantity > 0 ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#EAF3FF' },
  backText: { color: '#1D5BFF', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#0B1221' },
  info: { color: '#5B6472', fontSize: 14 },
  error: { color: '#B00020', fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0B1221' },
  cardMeta: { fontSize: 13, color: '#5B6472' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
