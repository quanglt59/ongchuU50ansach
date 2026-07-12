"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { isFirebaseConfigured } from "@/lib/firebase";
import FirebaseNotice from "@/components/FirebaseNotice";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên đầy đủ"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(\d){9,10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ đầy đủ"),
  note: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (items.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const orderId = await createOrder({
        items,
        customer: values,
        total: totalPrice,
      });
      clear();
      router.push(`/dat-hang/thanh-cong?id=${orderId}`);
    } catch {
      setSubmitError("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <FirebaseNotice />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-brand-700">
        Giỏ hàng của bạn đang trống.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">Thông tin đặt hàng</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Họ tên" error={errors.name?.message}>
            <input
              {...register("name")}
              className="w-full rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="Nguyễn Văn A"
            />
          </Field>

          <Field label="Số điện thoại" error={errors.phone?.message}>
            <input
              {...register("phone")}
              className="w-full rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="0912345678"
            />
          </Field>

          <Field label="Địa chỉ nhận hàng" error={errors.address?.message}>
            <textarea
              {...register("address")}
              rows={3}
              className="w-full rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </Field>

          <Field label="Ghi chú (không bắt buộc)">
            <textarea
              {...register("note")}
              rows={2}
              className="w-full rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="Thời gian giao hàng mong muốn, ghi chú thêm..."
            />
          </Field>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand-700 py-3 font-semibold text-cream-50 hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-brand-100 bg-cream-50 p-4">
          <p className="mb-3 font-semibold text-brand-800">Đơn hàng của bạn</p>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-brand-700">
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium text-brand-800">{formatVND(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 font-semibold">
            <span>Tổng cộng</span>
            <span className="text-brand-700">{formatVND(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-brand-800">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
