"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/lib/orders";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "tat-ca">("tat-ca");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    await updateOrderStatus(order.id, status);
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchStatus = statusFilter === "tat-ca" || o.status === statusFilter;
      const matchSearch =
        !term ||
        o.customer.name.toLowerCase().includes(term) ||
        o.customer.phone.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  if (loading) return <p className="text-brand-500">Đang tải...</p>;
  if (orders.length === 0) return <p className="text-brand-500">Chưa có đơn hàng nào.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("tat-ca")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === "tat-ca"
                ? "border-brand-700 bg-brand-700 text-cream-50"
                : "border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-400"
            }`}
          >
            Tất cả
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === status
                  ? "border-brand-700 bg-brand-700 text-cream-50"
                  : "border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-400"
              }`}
            >
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, mã đơn..."
            className="w-full rounded-full border border-brand-200 bg-cream-50 py-2 pl-10 pr-4 text-sm text-brand-800 outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-500">Không tìm thấy đơn hàng phù hợp.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
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
      )}
    </div>
  );
}
