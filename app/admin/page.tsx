"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "shipping", "done", "cancelled"];

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<OrderStatus, number>>({
    pending: 0,
    confirmed: 0,
    shipping: 0,
    done: 0,
    cancelled: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllOrders()])
      .then(([products, orders]) => {
        setProductCount(products.length);
        setVisibleCount(products.filter((p) => p.isVisible).length);
        setTotalOrders(orders.length);
        setStatusCounts({
          pending: orders.filter((o) => o.status === "pending").length,
          confirmed: orders.filter((o) => o.status === "confirmed").length,
          shipping: orders.filter((o) => o.status === "shipping").length,
          done: orders.filter((o) => o.status === "done").length,
          cancelled: orders.filter((o) => o.status === "cancelled").length,
        });
        setRevenue(
          orders.filter((o) => o.status === "done").reduce((sum, o) => sum + o.total, 0)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-800">Tổng quan</h1>
      {loading ? (
        <p className="text-brand-500">Đang tải...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Stat label="Tổng sản phẩm" value={productCount} />
            <Stat label="Đang hiển thị" value={visibleCount} />
            <Stat label="Tổng đơn hàng" value={totalOrders} />
            <Stat label="Doanh thu (đơn hoàn thành)" value={formatVND(revenue)} />
          </div>

          <p className="mb-3 mt-8 text-sm font-semibold text-brand-500">Đơn hàng theo trạng thái</p>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
            {STATUS_ORDER.map((status) => (
              <Stat
                key={status}
                label={ORDER_STATUS_LABELS[status]}
                value={statusCounts[status]}
              />
            ))}
          </div>
        </>
      )}
      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/san-pham"
          className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-brand-600"
        >
          Quản lý sản phẩm
        </Link>
        <Link
          href="/admin/don-hang"
          className="rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Quản lý đơn hàng
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-cream-50 p-4">
      <p className="text-sm text-brand-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-800">{value}</p>
    </div>
  );
}
