"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { createContactMessage } from "@/lib/contact";
import { isFirebaseConfigured } from "@/lib/firebase";
import FirebaseNotice from "@/components/FirebaseNotice";

// TODO: cập nhật email thật khi có thông tin chính xác.
const WORKING_HOURS = "8h - 22h, Thứ 2 - Chủ nhật";
const CONTACT_EMAIL = "nongsansachtinhbackan@gmail.com";

const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=20.9486391,105.7918846&z=16&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/ETc53XwNrj4iH45i6";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên đầy đủ"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(\d){9,10}$/, "Số điện thoại không hợp lệ"),
  content: z.string().trim().min(5, "Vui lòng nhập nội dung cần liên hệ"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createContactMessage({
        name: values.name,
        email: values.email ?? "",
        phone: values.phone,
        content: values.content,
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Gửi liên hệ thất bại:", err);
      setSubmitError("Gửi liên hệ thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-2 text-2xl font-bold text-brand-800 sm:text-3xl">Liên hệ</h1>
      <p className="mb-8 text-brand-600">
        Có thắc mắc hoặc muốn đặt hàng số lượng lớn? Gọi hotline hoặc gửi thông tin cho chúng tôi.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl border border-brand-100 bg-cream-50 p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-brand-800">
              Cửa hàng Ông Chú U50 Ăn Sạch
            </h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span className="text-brand-700">LK140-DV04, Đìa Lão, Kiến Hưng, Hà Đông, Hà Nội</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span className="text-brand-700">{WORKING_HOURS}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <div className="flex flex-col text-brand-700">
                  <a href="tel:0565885555" className="hover:underline">
                    0565.88.5555
                  </a>
                  <a href="tel:0869063666" className="hover:underline">
                    0869.063.666
                  </a>
                </div>
              </div>
              {CONTACT_EMAIL && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-brand-600" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-700 hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-cream-50 p-6 shadow-sm sm:p-8">
            <h2 className="mb-1 text-lg font-bold text-brand-800">Liên hệ với chúng tôi</h2>
            <p className="mb-5 text-sm text-brand-500">
              Để lại thông tin, chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.
            </p>

            {!isFirebaseConfigured ? (
              <FirebaseNotice />
            ) : submitted ? (
              <p className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Field label="Họ và tên" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Nguyễn Văn A"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email (không bắt buộc)" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
                      placeholder="email@example.com"
                    />
                  </Field>
                  <Field label="Số điện thoại" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
                      placeholder="0912345678"
                    />
                  </Field>
                </div>
                <Field label="Nội dung" error={errors.content?.message}>
                  <textarea
                    {...register("content")}
                    rows={4}
                    className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Bạn cần hỗ trợ gì?"
                  />
                </Field>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 rounded-full bg-brand-700 py-3 font-semibold text-cream-50 hover:bg-brand-600 disabled:opacity-60"
                >
                  {submitting ? "Đang gửi..." : "Gửi liên hệ"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-brand-100 shadow-sm lg:min-h-full">
          <iframe
            src={MAP_EMBED_SRC}
            className="h-full min-h-[420px] w-full lg:min-h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí Ông Chú U50 Ăn Sạch"
          />
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-cream-50 px-3 py-1.5 text-xs font-semibold text-brand-800 shadow-md hover:bg-cream-100"
          >
            <ExternalLink size={13} />
            Mở Google Maps
          </a>
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
