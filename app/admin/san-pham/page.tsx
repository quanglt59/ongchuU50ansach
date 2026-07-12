import Link from "next/link";
import { Plus } from "lucide-react";
import ProductTable from "@/components/admin/ProductTable";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-800">Quản lý sản phẩm</h1>
        <Link
          href="/admin/san-pham/moi"
          className="flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-brand-600"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </Link>
      </div>
      <ProductTable />
    </div>
  );
}
