import React, { useMemo, useState } from "react";
import { Apple, Leaf, Minus, Plus } from "lucide-react";
import { useSupabaseTable } from "../lib/hooks/useSupabaseTable";

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  icon?: React.ReactNode;
};

export type InventoryListProps = {
  items?: InventoryItem[];
  onChange?: (items: InventoryItem[]) => void;
};

const defaultItems: InventoryItem[] = [
  { id: "tomates", name: "Tomates", quantity: 3, icon: <Apple className="h-6 w-6" /> },
  { id: "lechuga", name: "Lechuga", quantity: 1, icon: <Leaf className="h-6 w-6" /> },
];

export const InventoryList: React.FC<InventoryListProps> = ({ items = defaultItems, onChange }) => {
  // Cargar productos desde Supabase (tabla: products)
  const { data: products, loading, error } = useSupabaseTable<any>("products");

  // Mapear filas crudas a la estructura del componente
  const supabaseItems: InventoryItem[] = useMemo(() => {
    if (!products || products.length === 0) return items;
    return products.map((row: any) => ({
      id: String(row.id ?? row.slug ?? row.name ?? Math.random()),
      name: String(row.name ?? row.title ?? row.label ?? row.id ?? "Sin nombre"),
      quantity: Number(row.quantity ?? row.qty ?? 0),
      icon: <Apple className="h-6 w-6" />,
    }));
  }, [products, items]);

  const [data, setData] = useState<InventoryItem[]>(supabaseItems);

  // Sincronizar cuando llegue data de Supabase
  React.useEffect(() => {
    setData(supabaseItems);
  }, [supabaseItems]);

  const updateQty = (id: string, delta: number) => {
    setData((prev) => {
      const next = prev.map((it) =>
        it.id === id ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it
      );
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Inventario</h2>
      {loading && <div className="text-sm text-slate-600">Cargando productos desde Supabase…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}
      <div className="space-y-3">
        {data.map((it) => (
          <div
            key={it.id}
            className="rounded-3xl shadow-sm bg-white p-4 flex items-center justify-between dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-800/80 dark:text-slate-100">{it.icon}</span>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{it.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Cantidad: {it.quantity}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQty(it.id, -1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={`Disminuir ${it.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateQty(it.id, +1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={`Incrementar ${it.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
