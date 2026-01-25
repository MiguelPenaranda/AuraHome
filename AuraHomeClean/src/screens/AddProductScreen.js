import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CategoryIcons from '../assets/icons/categories';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useInventory } from '../context/InventoryContext';

const productOptions = ['Tomates', 'Lechuga', 'Leche', 'Manzanas', 'Huevos'];
const categories = [
  { key: 'Vegetales', iconKey: 'vegetales' },
  { key: 'Frutas', iconKey: 'frutas' },
  { key: 'Lácteos', iconKey: 'lacteos' },
  { key: 'Proteínas', iconKey: 'proteinas' },
  { key: 'Congelados', iconKey: 'congelados' },
  { key: 'Bebidas', iconKey: 'bebidas' },
];

const AddProductScreen = () => {
  const navigation = useNavigation();
  const { addItem } = useInventory();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [showNameOptions, setShowNameOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  const SelectedIcon = useMemo(() => {
    if (!category) return null;
    const key = categories.find((c) => c.key === category)?.iconKey;
    return key ? CategoryIcons[key] : null;
  }, [category]);

  const confirmAdd = () => {
    const qty = Number(detail) > 0 ? Number(detail) : 1;
    if (!name || !category) return;
    addItem({ name, quantity: qty, category });
    (navigation).navigate('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Estilizado */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.helpButton}>
          <Feather name="help-circle" size={16} color="#1D5BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Producto</Text>
      </View>

      {/* Campo 1: Nombre con selector */}
      <View style={styles.inputWrapper}>
        {/* Icono comentado para aislar crash */}
        {/* {SelectedIcon ? <SelectedIcon width={22} height={22} style={styles.leadingIcon} /> : null} */}
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowNameOptions((s) => !s)}>
          <Text style={[styles.inputText, !name && styles.placeholder]}>{name || 'Nombre del producto'}</Text>
        </TouchableOpacity>
        <Feather name="info" size={18} color="#CBD5E0" />
      </View>
      {showNameOptions && (
        <View style={styles.selectorCard}>
          {productOptions.map((opt) => (
            <TouchableOpacity key={opt} style={styles.selectorItem} onPress={() => { setName(opt); setShowNameOptions(false); }}>
              <Text style={styles.selectorText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Campo 2: Categoría con icono */}
      <View style={styles.inputWrapper}>
        {/* Icono comentado para aislar crash */}
        {/* {SelectedIcon ? <SelectedIcon width={22} height={22} style={styles.leadingIcon} /> : null} */}
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCategoryOptions((s) => !s)}>
          <Text style={[styles.inputText, !category && styles.placeholder]}>{category || 'Categoría'}</Text>
        </TouchableOpacity>
        <Feather name="info" size={18} color="#CBD5E0" />
      </View>
      {showCategoryOptions && (
        <View style={styles.selectorCard}>
          {categories.map(({ key, iconKey }) => {
            const IconComp = CategoryIcons[iconKey];
            return (
              <TouchableOpacity key={key} style={styles.selectorItem} onPress={() => { setCategory(key); setShowCategoryOptions(false); }}>
                {/* Icono comentado para aislar crash */}
                {/* {IconComp ? <IconComp width={20} height={20} style={{ marginRight: 8 }} /> : null} */}
                <Text style={styles.selectorText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Campo 3: Detalle/Cantidad con botón + */}
      <View style={styles.quantityContainer}>
        <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}> 
          <TextInput
            placeholder="Detalle / Cantidad"
            keyboardType="default"
            value={detail}
            onChangeText={setDetail}
            style={styles.input}
            placeholderTextColor="#A0AEC0"
          />
          <Feather name="info" size={18} color="#CBD5E0" />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={confirmAdd}>
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  helpButton: { backgroundColor: '#EAF3FF', padding: 6, borderRadius: 12, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A202C' },
  form: { },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: { flex: 1, color: '#2D3748', fontSize: 16, marginLeft: 10 },
  inputText: { fontSize: 16, color: '#2D3748' },
  placeholder: { color: '#A0AEC0' },
  leadingIcon: { marginRight: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  addButton: {
    backgroundColor: '#4A90E2',
    height: 60,
    width: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginTop: -12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  selectorItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  selectorText: { fontSize: 16, color: '#1A202C' },
});

export default AddProductScreen;
