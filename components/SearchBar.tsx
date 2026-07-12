"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm sản phẩm..."
        className="w-full rounded-full border border-brand-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-brand-800 outline-none focus:border-brand-500"
      />
    </div>
  );
}
