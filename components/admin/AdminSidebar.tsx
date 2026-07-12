"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList, LogOut } from "lucide-react";
import { useAdminAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Package },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ClipboardList },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-full shrink-0 border-b border-brand-100 bg-cream-50 sm:w-56 sm:border-b-0 sm:border-r">
      <nav className="flex gap-1 overflow-x-auto p-3 sm:flex-col sm:overflow-visible">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                active ? "bg-brand-700 text-cream-50" : "text-brand-700 hover:bg-brand-100"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={async () => {
            await logout();
            router.push("/admin/login");
          }}
          className="mt-0 flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 sm:mt-4"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}
