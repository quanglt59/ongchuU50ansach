"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";

export default function CartPage() {
  const { items, totalPrice, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-brand-700">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/san-pham"
          className="mt-4 inline-block rounded-full bg-brand-700 px-6 py-3 font-semibold text-cream-50 hover:bg-brand-600"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">Giỏ hàng</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border border-brand-100 bg-cream-50 p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-50">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-800">{item.name}</p>
              <p className="text-sm text-brand-400">{item.unit}</p>
              <p className="font-semibold text-brand-700">{formatVND(item.price)}</p>
            </div>
            <div className="flex items-center rounded-full border border-brand-200">
              <button
                onClick={() => setQty(item.productId, item.qty - 1)}
                className="p-2 text-brand-700"
                aria-label="Giảm số lượng"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{item.qty}</span>
              <button
                onClick={() => setQty(item.productId, item.qty + 1)}
                className="p-2 text-brand-700"
                aria-label="Tăng số lượng"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="p-2 text-red-500 hover:text-red-600"
              aria-label="Xoá sản phẩm"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-brand-100 bg-cream-50 p-4">
        <span className="text-lg font-semibold text-brand-800">Tổng cộng</span>
        <span className="text-2xl font-extrabold text-brand-700">{formatVND(totalPrice)}</span>
      </div>

      <Link
        href="/dat-hang"
        className="mt-6 block rounded-full bg-brand-700 py-3 text-center font-semibold text-cream-50 hover:bg-brand-600"
      >
        Tiến hành đặt hàng
      </Link>
    </div>
  );
}
