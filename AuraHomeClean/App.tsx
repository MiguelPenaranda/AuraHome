import "react-native-gesture-handler";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Grid3X3 } from "lucide-react-native";
import { BebidasIcon, CongeladosIcon, FrutasIcon, LacteosIcon, ProteinasIcon, VegetalesIcon } from "./src/assets/icons/categories";
import AddProductScreen from "./src/screens/AddProductScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { InventoryProvider, useInventory } from "./src/context/InventoryContext";
import supabase from "./src/lib/supabase";

type TabKey = "home" | "add" | "categories";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  categoryColor: string;
};

const palette = {
  background: "#F0F4F8",
  text: "#0B1221",
  muted: "#5B6472",
  card: "#FFFFFF",
  blueSoft: "#DCEBFF",
  yellowSoft: "#FFF4DB",
  whiteSoft: "#FFFFFF",
  accentBlue: "#1D5BFF",
  greyLight: "#F4F6F8",
};

const statCards = [
  { title: "Última compra", value: "12 Ene 2026", color: palette.blueSoft, icon: "🛒" },
  { title: "Productos agotados", value: "3", color: palette.yellowSoft, icon: "🙁" },
  { title: "Total productos", value: "42", color: palette.whiteSoft, icon: "📦" },
];

type CategoryCard = {
  id: string;
  title: string;
  items: string;
  storage: "Despensa seca" | "Frescos y perecederos" | "Congelados" | "Bebidas";
  color: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
};

const categoryCards: CategoryCard[] = [
  {
    id: "granos-legumbres",
    title: "Granos y Legumbres",
    items: "Arroz, lentejas, frijoles, pasta",
    storage: "Despensa seca",
    color: "#FFF4DB",
    Icon: VegetalesIcon,
  },
  {
    id: "harinas-reposteria",
    title: "Harinas y Repostería",
    items: "Harina de trigo, maíz, azúcar, levadura, avena",
    storage: "Despensa seca",
    color: "#FDE8FF",
    Icon: FrutasIcon,
  },
  {
    id: "aceites-condimentos",
    title: "Aceites y Condimentos",
    items: "Aceite de oliva, sal, especias, vinagre, salsas",
    storage: "Despensa seca",
    color: "#E8F5E9",
    Icon: ProteinasIcon,
  },
  {
    id: "enlatados-conservas",
    title: "Enlatados y Conservas",
    items: "Atún, tomate frito, vegetales en conserva, sopas",
    storage: "Despensa seca",
    color: "#E0F2FE",
    Icon: CongeladosIcon,
  },
  {
    id: "snacks-picoteo",
    title: "Snacks y Picoteo",
    items: "Galletas, frutos secos, papas fritas",
    storage: "Despensa seca",
    color: "#FFE2E5",
    Icon: BebidasIcon,
  },
  {
    id: "frutas-verduras",
    title: "Frutas y Verduras",
    items: "Frutero o cajón fresco",
    storage: "Frescos y perecederos",
    color: "#D6F4E7",
    Icon: VegetalesIcon,
  },
  {
    id: "proteinas",
    title: "Proteínas (Carnicería/Pescadería)",
    items: "Pollo, res, pescado, cerdo",
    storage: "Frescos y perecederos",
    color: "#E5E0FF",
    Icon: ProteinasIcon,
  },
  {
    id: "lacteos-huevos",
    title: "Lácteos y Huevos",
    items: "Leche, quesos, yogur, mantequilla, huevos",
    storage: "Frescos y perecederos",
    color: "#F0F4FF",
    Icon: LacteosIcon,
  },
  {
    id: "charcuteria",
    title: "Charcutería",
    items: "Jamón, salchichas, embutidos",
    storage: "Frescos y perecederos",
    color: "#FFEEDF",
    Icon: CongeladosIcon,
  },
  {
    id: "alimentos-congelados",
    title: "Alimentos Congelados",
    items: "Vegetales, helados, comidas listas para congelar",
    storage: "Congelados",
    color: "#E3F2FF",
    Icon: CongeladosIcon,
  },
  {
    id: "liquidos",
    title: "Líquidos",
    items: "Agua, jugos, refrescos, café, té",
    storage: "Bebidas",
    color: "#EAF3FF",
    Icon: BebidasIcon,
  },
];

const inventorySeed: InventoryItem[] = [
  { id: "tomates", name: "Tomates", quantity: 3, categoryColor: "#FDE68A" },
  { id: "lechuga", name: "Lechuga", quantity: 1, categoryColor: "#BBF7D0" },
  { id: "leche", name: "Leche", quantity: 2, categoryColor: "#BFDBFE" },
];

const LeafMark = () => (
  <Svg width={18} height={18} viewBox="0 0 256 256" fill={palette.accentBlue}>
    <Path d="M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z" />
  </Svg>
);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Simple startup call to confirm Supabase client works on Android
    supabase.auth.getSession()
      .then(({ data }) => {
        console.log("Supabase session", !!data.session);
      })
      .catch((err) => {
        console.warn("Supabase init error", err);
      });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <InventoryProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreenContainer} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </InventoryProvider>
    </GestureHandlerRootView>
  );
}

function HomeScreenContainer() {
  const [tab, setTab] = useState<TabKey>("home");
  const { items } = useInventory();

  // Verificación de conexión: obtener y loggear categorías al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .limit(50);

      if (error) {
        console.warn('Error cargando categorias:', error.message);
        return;
      }
      console.log('Categorias (total=' + (data?.length ?? 0) + '):', data);
    };
    fetchCategorias();
  }, []);

  const screen = useMemo(() => {
    if (tab === "categories") {
      return <CategoriesScreen />;
    }
    return <DashboardScreen items={items} />;
  }, [tab, items]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <ScrollView contentContainerStyle={styles.scroll}>{screen}</ScrollView>
        <BottomNav active={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}

function DashboardScreen({ items }: { items: InventoryItem[] }) {
  const { items: contextItems } = useInventory();
  const displayItems = items ?? contextItems as any;
  const adjustQty = (id: string, delta: number) => {
    // Quantity adjustments are simplified for now; context addItem merges quantities on add.
  };

  return (
    <View style={{ gap: 18 }}>
      <Header />

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Mi Alacena</Text>
        <Text style={styles.sectionSubtitle}>{items.length} productos</Text>
      </View>

      <View style={{ gap: 12 }}>
        {statCards.map((card) => (
          <View
            key={card.title}
            style={[styles.statCard, { backgroundColor: card.color }, card.title === "Total productos" ? styles.cardShadow : null]}
          >
            <View>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={styles.statValue}>{card.value}</Text>
            </View>
            <Text style={styles.statIcon}>{card.icon}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        {displayItems.map((it) => (
          <ProductRow key={it.id} item={it} onChange={adjustQty} />
        ))}
      </View>
    </View>
  );
}

function ProductRow({ item, onChange }: { item: InventoryItem; onChange: (id: string, delta: number) => void }) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productLeft}>
        <View style={[styles.categoryDot, { backgroundColor: item.categoryColor }]} />
        <View style={{ gap: 2 }}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productMeta}>En stock · {item.quantity} uds</Text>
        </View>
      </View>

      <View style={styles.qtyPill}>
        <TouchableOpacity onPress={() => onChange(item.id, -1)} style={styles.qtyTouch}>
          <Text style={styles.qtySymbol}>-</Text>
        </TouchableOpacity>
        <View style={styles.qtyValueBox}>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
        </View>
        <TouchableOpacity onPress={() => onChange(item.id, 1)} style={styles.qtyTouch}>
          <Text style={styles.qtySymbol}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CategoriesScreen() {
  return (
    <View style={{ gap: 14 }}>
      <Header />
      <View style={styles.bannerCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={styles.bannerTitle}>Organiza tu inventario</Text>
            <Text style={styles.bannerSubtitle}>Estructura por tipo de almacenamiento</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Iconos comentados para aislar el crash */}
            {/* <FrutasIcon width={28} height={28} /> */}
            {/* <CongeladosIcon width={28} height={28} /> */}
            {/* <BebidasIcon width={28} height={28} /> */}
          </View>
        </View>
      </View>

      <View style={styles.categoryGrid}>
        {categoryCards.map(({ id, title, items, storage, color /*, Icon */ }) => (
          <View key={id} style={[styles.categoryCard, { backgroundColor: color }]}> 
            <View style={styles.categoryCardTop}> 
              {/* Icon comentado para aislar el crash */}
              {/* <Icon width={28} height={28} /> */}
            </View>
            <Text style={styles.categoryTitle}>{title}</Text>
            <Text style={styles.categoryItems}>{items}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// AddProductScreen move to src/screens/AddProductScreen and imported above

function Header() {
  return (
    <View style={styles.headerWrap}>
      <LeafMark />
      <Text style={styles.logoText}>AuraHome</Text>
    </View>
  );
}

function FormField({
  label,
  placeholder,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputFake}>
        <Text style={styles.inputPlaceholder}>{placeholder}</Text>
      </View>
    </View>
  );
}

function BottomNav({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const navigation = useNavigation();
  return (
    <View style={styles.navWrap}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => onChange("home")}> 
          <Text style={[styles.navText, active === "home" && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <View style={{ width: 64 }} />
        <TouchableOpacity onPress={() => onChange("categories")}>
          <Text style={[styles.navText, active === "categories" && styles.navTextActive]}>Categorías</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => (navigation as any).navigate('AddProduct')}>
        <Grid3X3 size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  shell: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 140, gap: 16 },
    bannerCard: {
      backgroundColor: "#E8F5E9",
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 18,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    bannerTitle: { fontSize: 18, fontWeight: "700", color: palette.text },
    bannerSubtitle: { fontSize: 13, color: palette.muted },
  headerWrap: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: palette.text,
  },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 22, fontWeight: "700", letterSpacing: 0.4, color: palette.text },
  sectionSubtitle: { fontSize: 14, color: palette.muted, letterSpacing: 0.2 },
  statCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  statTitle: { fontSize: 13, color: palette.muted, marginBottom: 6, letterSpacing: 0.3 },
  statValue: { fontSize: 20, fontWeight: "700", color: palette.text, letterSpacing: 0.4 },
  statIcon: { fontSize: 20 },
  productCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  productLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productName: { fontSize: 16, fontWeight: "600", color: palette.text, letterSpacing: 0.2 },
  productMeta: { fontSize: 13, color: palette.muted },
  qtyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.greyLight,
    borderRadius: 16,
    overflow: "hidden",
  },
  qtyTouch: { paddingHorizontal: 12, paddingVertical: 8 },
  qtySymbol: { fontSize: 16, fontWeight: "700", color: palette.text },
  qtyValueBox: { paddingHorizontal: 12, paddingVertical: 8 },
  qtyValue: { fontSize: 15, fontWeight: "700", color: palette.text },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    borderRadius: 20,
    padding: 14,
    width: "48%",
    minHeight: 150,
    gap: 6,
  },
  categoryCardTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryTitle: { fontSize: 16, fontWeight: "700", color: palette.text, letterSpacing: 0.2 },
  categoryItems: { fontSize: 13, color: palette.muted, lineHeight: 18 },
  formCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  fieldLabel: { fontSize: 13, color: palette.muted },
  inputFake: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  inputPlaceholder: { color: "#94A3B8", fontSize: 14 },
  primaryBtn: {
    marginTop: 6,
    backgroundColor: palette.accentBlue,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#1D5BFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnText: { fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.3 },
  navWrap: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
  navBar: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  navText: { fontSize: 14, fontWeight: "600", color: palette.muted },
  navTextActive: { color: palette.accentBlue },
  fab: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: palette.accentBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D5BFF",
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  // central grid icon replaces plus label
});
