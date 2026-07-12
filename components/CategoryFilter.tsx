"use client";

import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

interface Props {
  value: ProductCategory | "tat-ca";
  onChange: (value: ProductCategory | "tat-ca") => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  const options: Array<{ key: ProductCategory | "tat-ca"; label: string }> = [
    { key: "tat-ca", label: "Tất cả" },
    ...(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            value === opt.key
              ? "border-brand-700 bg-brand-700 text-cream-50"
              : "border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
