import Vegetales from "./carrot.svg";
import Frutas from "./apple.svg";
import Lacteos from "./drop.svg";
import Proteinas from "./hamburger.svg";
import Congelados from "./ice-cream.svg";
import Bebidas from "./beer.svg";

export const CategoryIcons = {
	vegetales: Vegetales,
	frutas: Frutas,
	lacteos: Lacteos,
	proteinas: Proteinas,
	congelados: Congelados,
	bebidas: Bebidas,
};

// Compatibilidad con imports existentes
export { default as VegetalesIcon } from "./carrot.svg";
export { default as FrutasIcon } from "./apple.svg";
export { default as LacteosIcon } from "./drop.svg";
export { default as ProteinasIcon } from "./hamburger.svg";
export { default as CongeladosIcon } from "./ice-cream.svg";
export { default as BebidasIcon } from "./beer.svg";

export default CategoryIcons;
