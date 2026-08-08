"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getProvinces, getWardsByProvince, type VnDivision } from "@/lib/vn-address";
import FirebaseNotice from "@/components/FirebaseNotice";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên đầy đủ"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(\d){9,10}$/, "Số điện thoại không hợp lệ"),
  detail: z.string().trim().min(3, "Vui lòng nhập số nhà, đường/thôn xóm"),
  note: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<VnDivision[]>([]);
  const [wards, setWards] = useState<VnDivision[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch((err) => console.error("Không thể tải danh sách tỉnh/thành:", err))
      .finally(() => setLoadingProvinces(false));
  }, []);

  useEffect(() => {
    setWardCode("");
    if (!provinceCode) {
      setWards([]);
      return;
    }
    setLoadingWards(true);
    getWardsByProvince(Number(provinceCode))
      .then(setWards)
      .catch((err) => console.error("Không thể tải danh sách phường/xã:", err))
      .finally(() => setLoadingWards(false));
  }, [provinceCode]);

  async function onSubmit(values: FormValues) {
    if (items.length === 0) return;

    const province = provinces.find((p) => p.code === Number(provinceCode));
    const ward = wards.find((w) => w.code === Number(wardCode));
    if (!province || !ward) {
      setAddressError("Vui lòng chọn Tỉnh/Thành phố và Phường/Xã");
      return;
    }
    setAddressError(null);

    setSubmitting(true);
    setSubmitError(null);
    try {
      const orderId = await createOrder({
        items,
        customer: {
          name: values.name,
          phone: values.phone,
          address: `${values.detail}, ${ward.name}, ${province.name}`,
          note: values.note,
        },
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold text-brand-800 sm:text-3xl">Thông tin đặt hàng</h1>

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-2xl border border-brand-100 bg-cream-50 p-6 shadow-sm sm:p-8 lg:col-span-3"
        >
          <Field label="Họ tên" error={errors.name?.message}>
            <input
              {...register("name")}
              className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500"
              placeholder="Nguyễn Văn A"
            />
          </Field>

          <Field label="Số điện thoại" error={errors.phone?.message}>
            <input
              {...register("phone")}
              className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500"
              placeholder="0912345678"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tỉnh/Thành phố">
              <select
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                disabled={loadingProvinces}
                className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500 disabled:opacity-60"
              >
                <option value="">
                  {loadingProvinces ? "Đang tải..." : "-- Chọn tỉnh/thành --"}
                </option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Phường/Xã">
              <select
                value={wardCode}
                onChange={(e) => setWardCode(e.target.value)}
                disabled={!provinceCode || loadingWards}
                className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500 disabled:opacity-60"
              >
                <option value="">
                  {loadingWards ? "Đang tải..." : "-- Chọn phường/xã --"}
                </option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {addressError && <span className="-mt-3 text-xs text-red-600">{addressError}</span>}

          <Field label="Địa chỉ cụ thể" error={errors.detail?.message}>
            <input
              {...register("detail")}
              className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500"
              placeholder="Số nhà, tên đường/thôn xóm"
            />
          </Field>

          <Field label="Ghi chú (không bắt buộc)">
            <textarea
              {...register("note")}
              rows={3}
              className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 outline-none focus:border-brand-500"
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

        <div className="h-fit rounded-2xl border border-brand-100 bg-cream-50 p-6 shadow-sm sm:p-8 lg:col-span-2 lg:sticky lg:top-24">
          <p className="mb-4 text-lg font-semibold text-brand-800">Đơn hàng của bạn</p>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-brand-700">
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium text-brand-800">{formatVND(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-brand-100 pt-4 text-lg font-semibold">
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
