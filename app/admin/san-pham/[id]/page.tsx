"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(params.id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-brand-500">Đang tải...</p>;
  if (!product) return <p className="text-brand-700">Không tìm thấy sản phẩm.</p>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-800">Sửa sản phẩm</h1>
      <ProductForm product={product} />
    </div>
  );
}
