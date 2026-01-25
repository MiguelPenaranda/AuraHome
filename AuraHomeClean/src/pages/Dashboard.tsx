import React from "react";
import { ShoppingCart, AlertTriangle, Boxes } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mi Alacena</h1>

      <div className="flex flex-col gap-3">
        <StatCard
          title="Última compra"
          value={lastPurchase}
          icon={<ShoppingCart className="h-6 w-6" />}
          bgClass="bg-aura-blue"
        />
        <StatCard
          title="Agotados"
          value={outOfStock}
          icon={<AlertTriangle className="h-6 w-6" />}
          bgClass="bg-aura-red"
        />
        <StatCard
          title="Productos totales"
          value={totalProducts}
          icon={<Boxes className="h-6 w-6" />}
          bgClass="bg-aura-green"
        />
      </div>
    </div>
  );
};

export default Dashboard;
