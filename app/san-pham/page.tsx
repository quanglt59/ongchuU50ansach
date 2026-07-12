"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import FirebaseNotice from "@/components/FirebaseNotice";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getVisibleProducts } from "@/lib/products";
import { CATEGORY_NOTES, type Product, type ProductCategory } from "@/lib/types";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as ProductCategory | null) ?? "tat-ca";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<ProductCategory | "tat-ca">(initialCategory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getVisibleProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Không thể tải sản phẩm:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === "tat-ca" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">Sản phẩm</h1>

      {!isFirebaseConfigured ? (
        <FirebaseNotice />
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter value={category} onChange={setCategory} />
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {category !== "tat-ca" && CATEGORY_NOTES[category] && (
            <p className="mb-6 rounded-lg border border-gold-500 bg-gold-400/10 px-4 py-2 text-sm text-brand-800">
              {CATEGORY_NOTES[category]}
            </p>
          )}

          {loading ? (
            <p className="text-brand-500">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-red-600">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          ) : filtered.length === 0 ? (
            <p className="text-brand-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
