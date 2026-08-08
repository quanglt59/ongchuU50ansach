import { Package, Beef, Wine, FlameKindling, Carrot, Gift, type LucideIcon } from "lucide-react";
import type { ProductCategory } from "./types";

export const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  "do-kho": Package,
  "do-tuoi": Beef,
  "men-cay": Wine,
  "gia-vi": FlameKindling,
  rau: Carrot,
  khac: Gift,
};

export function CategoryIcon({
  category,
  size = 20,
  className,
}: {
  category: ProductCategory;
  size?: number;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon size={size} className={className} />;
}
