"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessInner />
    </Suspense>
  );
}

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 size={64} className="mx-auto text-brand-600" />
      <h1 className="mt-4 text-2xl font-bold text-brand-800">Đặt hàng thành công!</h1>
      <p className="mt-2 text-brand-600">
        Cảm ơn bạn đã đặt hàng tại Ông Chú U50 Ăn Sạch. Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất.
      </p>
      {orderId && (
        <p className="mt-2 text-sm text-brand-400">
          Mã đơn hàng: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link
        href="/san-pham"
        className="mt-6 inline-block rounded-full bg-brand-700 px-6 py-3 font-semibold text-cream-50 hover:bg-brand-600"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
