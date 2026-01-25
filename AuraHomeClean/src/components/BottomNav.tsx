import React from "react";
import { Home, Grid3X3 } from "lucide-react";

export type NavKey = "home" | "categories";

export type BottomNavProps = {
  active?: NavKey;
  onNavigate?: (key: NavKey) => void;
};

export const BottomNav: React.FC<BottomNavProps> = ({ active = "home", onNavigate }) => {
  const baseBtn = "flex h-10 w-10 items-center justify-center transition-colors";
  const inactive = "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white";
  const activeCls = "text-blue-600 dark:text-blue-400";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px] px-6 pb-4">
        <div className="relative">
          <nav className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
            <ul className="flex items-center justify-between px-4 py-3">
              <li>
                <button
                  type="button"
                  aria-label="Home"
                  onClick={() => onNavigate?.("home")}
                  className={`${baseBtn} ${active === "home" ? activeCls : inactive}`}
                >
                  <Home className="h-6 w-6" />
                </button>
              </li>
              <li>
                {/* spacing placeholder to visually center items around the floating action */}
                <span className="block w-12" />
              </li>
              {/* right-side placeholder to keep symmetry */}
              <li>
                <span className="block w-10" />
              </li>
            </ul>
          </nav>

          {/* Floating Add Button */}
          <button
            type="button"
            aria-label="Categorías"
            onClick={() => onNavigate?.("categories")}
            className="absolute -top-6 left-1/2 -translate-x-1/2 grid h-12 w-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
          >
            <Grid3X3 className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
