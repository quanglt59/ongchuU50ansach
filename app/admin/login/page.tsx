"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { useAdminAuth } from "@/lib/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase";
import FirebaseNotice from "@/components/FirebaseNotice";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
  "auth/wrong-password": "Email hoặc mật khẩu không đúng.",
  "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/too-many-requests": "Bạn đã thử sai quá nhiều lần. Vui lòng thử lại sau ít phút.",
  "auth/network-request-failed": "Lỗi kết nối mạng. Kiểm tra lại internet.",
  "auth/invalid-api-key": "Cấu hình Firebase (.env.local) không hợp lệ.",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      console.error("Đăng nhập admin thất bại:", err);
      if (err instanceof FirebaseError) {
        setError(AUTH_ERROR_MESSAGES[err.code] ?? `Đăng nhập thất bại (${err.code}).`);
      } else if (err instanceof Error && err.message === "not-admin") {
        setError("Tài khoản này chưa được cấp quyền admin (chưa có document trong collection \"admins\").");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <FirebaseNotice />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold text-brand-800">Đăng nhập quản trị</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-brand-100 bg-cream-50 p-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Mật khẩu</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-brand-700 py-3 font-semibold text-cream-50 hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
