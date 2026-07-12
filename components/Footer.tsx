import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-brand-800 text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold">Ông Chú U50 Ăn Sạch</p>
            <p className="mt-2 text-sm text-brand-200">
              Nông sản sạch Tây Bắc — tuyển chọn từ vùng cao, giao tận tay người tiêu dùng.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gold-400">Liên hệ</p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Phone size={16} />
              <a href="tel:0565885555" className="hover:underline">
                0565.88.5555
              </a>
            </div>
            <div className="mt-2 flex items-start gap-2 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>LK140 - DV04 - Đìa Lão, Kiến Hưng, Hà Đông</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gold-400">Chính sách</p>
            <p className="mt-2 text-sm text-brand-200">
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
