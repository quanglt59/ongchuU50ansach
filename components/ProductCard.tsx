"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const thumbnail = product.imageUrls[0];

  function handleAdd() {
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-cream-50 shadow-sm transition hover:shadow-md">
      <Link href={`/san-pham/${product.id}`} className="block aspect-square overflow-hidden bg-brand-50">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-300">
            Chưa có ảnh
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={`/san-pham/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-brand-800 hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-400">{product.unit}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand-700">{formatVND(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label="Thêm vào giỏ hàng"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-cream-50 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
        {outOfStock && <p className="text-xs font-medium text-red-600">Tạm hết hàng</p>}
      </div>
    </div>
  );
}
