"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";
import { formatVND } from "@/lib/format";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllOrders()])
      .then(([products, orders]) => {
        setProductCount(products.length);
        setVisibleCount(products.filter((p) => p.isVisible).length);
        setPendingOrders(orders.filter((o) => o.status === "pending").length);
        setRevenue(
          orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0)
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Stat label="Tổng sản phẩm" value={productCount} />
          <Stat label="Đang hiển thị" value={visibleCount} />
          <Stat label="Đơn chờ xác nhận" value={pendingOrders} />
          <Stat label="Tổng doanh thu" value={formatVND(revenue)} />
        </div>
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
