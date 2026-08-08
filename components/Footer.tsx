import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import PatternStrip from "./PatternStrip";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

export default function Footer() {
  const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];

  return (
    <footer className="mt-12 bg-brand-800 text-cream-100">
      <PatternStrip />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-9 w-9 rounded-full object-cover" />
              <p className="text-lg font-extrabold">Ông Chú U50 Ăn Sạch</p>
            </div>
            <p className="mt-3 text-sm text-brand-200">
              Nông sản sạch Tây Bắc — tuyển chọn từ vùng cao, giao tận tay người tiêu dùng.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gold-400">Danh mục</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {categories.map((key) => (
                <li key={key}>
                  <Link href={`/san-pham?category=${key}`} className="text-brand-200 hover:text-cream-50 hover:underline">
                    {CATEGORY_LABELS[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gold-400">Liên hệ</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Phone size={16} />
              <a href="tel:0565885555" className="hover:underline">
                0565.88.5555
              </a>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Phone size={16} />
              <a href="tel:0869063666" className="hover:underline">
                0869.063.666
              </a>
            </div>
            <div className="mt-2 flex items-start gap-2 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>LK140-DV04, Đìa Lão, Kiến Hưng, Hà Đông, Hà Nội</span>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gold-400">Chính sách</p>
            <p className="mt-3 text-sm text-brand-200">
              Cam kết nông sản sạch, nguồn gốc rõ ràng, đổi trả nếu hàng lỗi.
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-brand-700 pt-4 text-center text-xs text-brand-300">
          © {new Date().getFullYear()} Ông Chú U50 Ăn Sạch. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
