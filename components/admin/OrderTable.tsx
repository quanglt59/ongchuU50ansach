"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/orders";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    await updateOrderStatus(order.id, status);
  }

  if (loading) return <p className="text-brand-500">Đang tải...</p>;
  if (orders.length === 0) return <p className="text-brand-500">Chưa có đơn hàng nào.</p>;

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-brand-100 bg-cream-50 p-4">
          <button
            className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
            onClick={() => setExpanded((cur) => (cur === order.id ? null : order.id))}
          >
            <div>
              <p className="font-semibold text-brand-800">{order.customer.name}</p>
              <p className="text-sm text-brand-500">
                {order.customer.phone} · {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-brand-700">{formatVND(order.total)}</span>
              <select
                value={order.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                className="rounded-lg border border-brand-200 bg-cream-50 px-2 py-1 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </button>

          {expanded === order.id && (
            <div className="mt-3 border-t border-brand-100 pt-3 text-sm">
              <p className="text-brand-700">Địa chỉ: {order.customer.address}</p>
              {order.customer.note && (
                <p className="text-brand-700">Ghi chú: {order.customer.note}</p>
              )}
              <div className="mt-2 flex flex-col gap-1">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-brand-700">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-brand-800">{formatVND(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
