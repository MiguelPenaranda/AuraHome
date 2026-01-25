import React, { createContext, useContext, useState, ReactNode } from 'react';

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  category: string;
  categoryColor: string;
};

export type InventoryContextValue = {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'categoryColor'> & { categoryColor?: string }) => void;
};

const defaultItems: InventoryItem[] = [
  { id: 'tomates', name: 'Tomates', quantity: 3, category: 'Vegetales', categoryColor: '#FDE68A' },
  { id: 'lechuga', name: 'Lechuga', quantity: 1, category: 'Vegetales', categoryColor: '#BBF7D0' },
  { id: 'leche', name: 'Leche', quantity: 2, category: 'Lácteos', categoryColor: '#BFDBFE' },
];

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

const CATEGORY_COLORS: Record<string, string> = {
  Vegetales: '#BBF7D0',
  Frutas: '#FDE68A',
  Lácteos: '#BFDBFE',
  Proteínas: '#E5E0FF',
  Congelados: '#E3F2FF',
  Bebidas: '#EAF3FF',
};

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(defaultItems);

  const addItem: InventoryContextValue['addItem'] = ({ name, quantity, category, categoryColor }) => {
    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    const color = categoryColor ?? CATEGORY_COLORS[category] ?? '#E2E8F0';
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { id, name, quantity, category, categoryColor: color }];
    });
  };

  return (
    <InventoryContext.Provider value={{ items, addItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
