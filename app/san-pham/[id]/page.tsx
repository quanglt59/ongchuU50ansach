"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";
import { getProductById } from "@/lib/products";
import { isFirebaseConfigured } from "@/lib/firebase";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Product } from "@/lib/types";
import FirebaseNotice from "@/components/FirebaseNotice";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getProductById(params.id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <FirebaseNotice />
      </div>
    );
  }

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-brand-500">Đang tải...</p>;
  }

  if (!product || !product.isVisible) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-brand-700">Không tìm thấy sản phẩm này.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-brand-50">
            {product.imageUrls[activeImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrls[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-300">
                Chưa có ảnh
              </div>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    activeImage === index ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-brand-800">{product.name}</h1>
          <p className="mt-1 text-brand-400">{product.unit}</p>
          <p className="mt-4 text-3xl font-extrabold text-brand-700">{formatVND(product.price)}</p>
          <p className="mt-4 whitespace-pre-line text-brand-700">{product.description}</p>

          {product.stock <= 0 ? (
            <p className="mt-6 font-semibold text-red-600">Tạm hết hàng</p>
          ) : (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-brand-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 text-brand-700"
                  aria-label="Giảm số lượng"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-brand-700"
                  aria-label="Tăng số lượng"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  addItem(product, qty);
                  router.push("/gio-hang");
                }}
                className="flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 font-semibold text-cream-50 hover:bg-brand-600"
              >
                <ShoppingCart size={18} />
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
