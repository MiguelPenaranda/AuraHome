import React from "react";
import {
  Apple,
  Carrot,
  Milk,
  Fish,
  Wheat,
  Drumstick,
  CookingPot,
  CupSoda,
  Snowflake,
  Smile,
} from "lucide-react";

export type CategoriesGridProps = {
  onSelect?: (categoryId: string) => void;
};

const Card: React.FC<{
  id: string;
  onSelect?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
  label: string;
}> = ({ id, onSelect, className = "", children, label }) => (
  <button
    type="button"
    onClick={() => onSelect?.(id)}
    className={`relative rounded-3xl shadow-sm ${className}`}
  >
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
    <div className="absolute bottom-3 left-0 right-0 text-center text-slate-900 dark:text-white font-semibold">
      {label}
    </div>
  </button>
);

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      {/* Banner Superior */}
      <div className="rounded-3xl bg-[#E8F5E9] px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Explora por categorías</h2>
            <p className="text-sm text-slate-600">Organiza tu inventario con AuraHome</p>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Apple className="h-7 w-7" />
            <Carrot className="h-7 w-7" />
            <Smile className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Bento Grid de Categorías */}
      <div className="grid grid-cols-2 gap-3">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-3">
          <Card
            id="vegetales"
            onSelect={onSelect}
            label="Vegetales"
            className="bg-[#E8F5E9] h-64"
          >
            <Carrot className="h-12 w-12 text-slate-800/80" />
          </Card>

          <Card
            id="lacteos"
            onSelect={onSelect}
            label="Lácteos"
            className="bg-[#FFFDE7] h-28"
          >
            <Milk className="h-12 w-12 text-slate-800/80" />
          </Card>

          <Card
            id="proteinas_pescado_trigo"
            onSelect={onSelect}
            label="Proteínas"
            className="bg-[#FFF3E0] h-36"
          >
            <div className="flex items-center gap-6">
              <Fish className="h-10 w-10 text-slate-800/80" />
              <Wheat className="h-10 w-10 text-slate-800/80" />
            </div>
          </Card>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-3">
          <Card
            id="frutas"
            onSelect={onSelect}
            label="Frutas"
            className="bg-[#FFF3E0] aspect-square"
          >
            <Apple className="h-12 w-12 text-slate-800/80" />
          </Card>

          <Card
            id="salsas_aderezos"
            onSelect={onSelect}
            label="Salsas y Aderezos"
            className="bg-[#FFFDE7] h-48"
          >
            <CookingPot className="h-12 w-12 text-slate-800/80" />
          </Card>

          <Card
            id="proteinas_pollo"
            onSelect={onSelect}
            label="Proteínas"
            className="bg-[#E8F5E9] h-36"
          >
            <Drumstick className="h-12 w-12 text-slate-800/80" />
          </Card>
        </div>
      </div>

      {/* Fila Inferior */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          id="congelados"
          onSelect={onSelect}
          label="Congelados"
          className="bg-[#E3F2FD] aspect-square"
        >
          <Snowflake className="h-12 w-12 text-slate-800/80" />
        </Card>
        <Card
          id="bebidas"
          onSelect={onSelect}
          label="Bebidas"
          className="bg-[#F3E5F5] aspect-square"
        >
          <CupSoda className="h-12 w-12 text-slate-800/80" />
        </Card>
      </div>
    </div>
  );
};

export default CategoriesGrid;
