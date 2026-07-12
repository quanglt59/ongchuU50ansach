"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase";
import AdminSidebar from "@/components/admin/AdminSidebar";

function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, loading } = useAdminAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isFirebaseConfigured || loading) return;
    if (!isAdmin && !isLoginPage) router.replace("/admin/login");
    if (isAdmin && isLoginPage) router.replace("/admin");
  }, [isAdmin, loading, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!isFirebaseConfigured || loading || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-500">
        {isFirebaseConfigured ? "Đang kiểm tra quyền truy cập..." : "Chưa cấu hình Firebase."}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
