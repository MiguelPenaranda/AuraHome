import React, { useMemo, useState } from "react";
import { CircleHelp, Info, Plus } from "lucide-react";
import { SvgProps } from "react-native-svg";
import {
  BebidasIcon,
  CongeladosIcon,
  FrutasIcon,
  LacteosIcon,
  ProteinasIcon,
  VegetalesIcon,
} from "../assets/icons/categories";

export type AddItemFormValues = {
  name: string;
  category: string;
  brand?: string;
  quantity: number;
};

export type AddItemFormProps = {
  categories?: { id: string; label: string }[];
  onSubmit?: (values: AddItemFormValues) => void;
};

const defaultCategories = [
  { id: "vegetales", label: "Vegetales" },
  { id: "frutas", label: "Frutas" },
  { id: "lacteos", label: "Lácteos" },
  { id: "proteinas", label: "Proteínas" },
  { id: "congelados", label: "Congelados" },
  { id: "bebidas", label: "Bebidas" },
];

import { useSupabaseTable } from "../lib/hooks/useSupabaseTable";

export const AddItemForm: React.FC<AddItemFormProps> = ({
  categories = defaultCategories,
  onSubmit,
}) => {
  // Cargar categorías desde Supabase
  const { data: categoriesData, loading, error } = useSupabaseTable<any>("Categories");
  const categoriesList: { id: string; label: string }[] = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return categories;
    return categoriesData.map((row: any) => ({
      id: String(row.id ?? row.key ?? row.slug ?? Math.random()),
      label: String(row.name ?? row.label ?? row.title ?? row.id ?? "Sin nombre"),
    }));
  }, [categoriesData, categories]);
  const categoryIcons: Record<string, React.FC<SvgProps>> = useMemo(
    () => ({
      vegetales: VegetalesIcon,
      frutas: FrutasIcon,
      lacteos: LacteosIcon,
      proteinas: ProteinasIcon,
      congelados: CongeladosIcon,
      bebidas: BebidasIcon,
    }),
    [],
  );

  const [values, setValues] = useState<AddItemFormValues>({
    name: "",
    category: categoriesList[0]?.id ?? "",
    brand: "",
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: name === "quantity" ? Number(value) : value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  const currentCategoryIcon = categoryIcons[values.category];
  const CurrentCategoryIcon = currentCategoryIcon;

  return (
    <div className="min-h-full bg-[#f6fbff] p-4 sm:p-6">
      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
        >
          <CircleHelp className="h-4 w-4 text-[#2c6ef2]" />
          <span>Agregar Producto</span>
        </button>

        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
          <h1 className="text-2xl font-semibold text-slate-900">Agregar Producto</h1>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Nombre/Categoría</span>
            <div className="relative flex flex-col gap-3 rounded-2xl bg-[#F5F7F9] px-4 py-3 pr-12 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                {CurrentCategoryIcon ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                    <CurrentCategoryIcon width={24} height={24} />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-white shadow-sm" />
                )}

                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2c6ef2]"
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Ej. Tomates cherry"
                className="w-full rounded-xl border border-transparent bg-white px-3 py-3 text-base text-slate-900 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2c6ef2]"
              />

              <Info className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Compañía/Marca</span>
            <div className="relative rounded-2xl bg-[#F5F7F9] px-4 py-3 pr-12 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <input
                name="brand"
                value={values.brand ?? ""}
                onChange={handleChange}
                placeholder="Ej. Huerta del Sol"
                className="w-full rounded-xl border border-transparent bg-white px-3 py-3 text-base text-slate-900 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2c6ef2]"
              />
              <Info className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Cantidad</span>
            <div className="relative rounded-2xl bg-[#F5F7F9] px-4 py-3 pr-24 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <input
                type="number"
                name="quantity"
                min={1}
                value={values.quantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-transparent bg-white px-3 py-3 text-base text-slate-900 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2c6ef2]"
              />
              <Info className="absolute right-20 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#2c6ef2] text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F5F7F9] focus:ring-[#2c6ef2]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
