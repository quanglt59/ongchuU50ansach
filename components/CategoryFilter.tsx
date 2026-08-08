"use client";

import { LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

interface Props {
  value: ProductCategory | "tat-ca";
  onChange: (value: ProductCategory | "tat-ca") => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("tat-ca")}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          value === "tat-ca"
            ? "border-brand-700 bg-brand-700 text-cream-50"
            : "border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-400"
        }`}
      >
        <LayoutGrid size={15} />
        Tất cả
      </button>
      {categories.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            value === key
              ? "border-brand-700 bg-brand-700 text-cream-50"
              : "border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-400"
          }`}
        >
          <CategoryIcon category={key} size={15} />
          {CATEGORY_LABELS[key]}
        </button>
      ))}
    </div>
  );
}
