"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct, getAllProducts, toggleProductVisibility } from "@/lib/products";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  async function handleToggle(product: Product) {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isVisible: !p.isVisible } : p))
    );
    await toggleProductVisibility(product.id, !product.isVisible);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Xoá sản phẩm "${product.name}"?`)) return;
    await deleteProduct(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  if (loading) return <p className="text-brand-500">Đang tải...</p>;
  if (products.length === 0) return <p className="text-brand-500">Chưa có sản phẩm nào.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-100">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-brand-50 text-brand-700">
          <tr>
            <th className="p-3">Sản phẩm</th>
            <th className="p-3">Giá</th>
            <th className="p-3">Tồn kho</th>
            <th className="p-3">Hiển thị</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-brand-100">
              <td className="flex items-center gap-3 p-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                  {p.imageUrls[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrls[0]} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <span className="font-medium text-brand-800">{p.name}</span>
              </td>
              <td className="p-3">{formatVND(p.price)}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <button
                  onClick={() => handleToggle(p)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    p.isVisible ? "bg-brand-600" : "bg-brand-200"
                  }`}
                  aria-label="Bật/tắt hiển thị"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      p.isVisible ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/san-pham/${p.id}`}
                    className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
                    aria-label="Sửa"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label="Xoá"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
