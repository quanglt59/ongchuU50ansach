import OrderTable from "@/components/admin/OrderTable";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-800">Quản lý đơn hàng</h1>
      <OrderTable />
    </div>
  );
}
