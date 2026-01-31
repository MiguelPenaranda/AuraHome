import React, { useMemo } from "react";
import { ShoppingCart, AlertTriangle, Boxes } from "lucide-react";
import { useSupabaseTable } from "../lib/hooks/useSupabaseTable";

export type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  bgClass?: string; // Tailwind class for background
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgClass = "bg-white" }) => (
  <div className={`rounded-3xl shadow-sm ${bgClass} p-4 flex items-center gap-3`}>
    {icon && <div className="text-slate-800/80 dark:text-slate-100">{icon}</div>}
    <div className="flex-1">
      <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
      <div className="text-xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  </div>
);

export type DashboardProps = {
  lastPurchase?: string;
  outOfStock?: number;
  totalProducts?: number;
};

export const Dashboard: React.FC<DashboardProps> = ({
  lastPurchase = "12 Ene, 2026",
  outOfStock = 3,
  totalProducts = 42,
}) => {
  // Cargar productos e inventario para estadísticas
  const { data: products } = useSupabaseTable<any>("products");
  const { data: transactions } = useSupabaseTable<any>("inventory_transctions");

  const computedTotals = useMemo(() => {
    const total = Array.isArray(products) ? products.length : totalProducts;
    let agotados = 0;
    if (Array.isArray(products)) {
      agotados = products.filter((p: any) => Number(p.quantity ?? p.qty ?? 0) === 0).length;
    } else {
      agotados = outOfStock;
    }
    let ultima = lastPurchase;
    if (Array.isArray(transactions) && transactions.length > 0) {
      const latest = transactions
        .slice()
        .sort((a: any, b: any) => new Date(b.created_at ?? b.date ?? 0).getTime() - new Date(a.created_at ?? a.date ?? 0).getTime())[0];
      const d = new Date(latest.created_at ?? latest.date ?? Date.now());
      ultima = d.toLocaleDateString();
    }
    return { total, agotados, ultima };
  }, [products, transactions, totalProducts, outOfStock, lastPurchase]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mi Alacena</h1>

      <div className="flex flex-col gap-3">
        <StatCard
          title="Última compra"
          value={computedTotals.ultima}
          icon={<ShoppingCart className="h-6 w-6" />}
          bgClass="bg-aura-blue"
        />
        <StatCard
          title="Agotados"
          value={computedTotals.agotados}
          icon={<AlertTriangle className="h-6 w-6" />}
          bgClass="bg-aura-red"
        />
        <StatCard
          title="Productos totales"
          value={computedTotals.total}
          icon={<Boxes className="h-6 w-6" />}
          bgClass="bg-aura-green"
        />
      </div>
    </div>
  );
};

export default Dashboard;
