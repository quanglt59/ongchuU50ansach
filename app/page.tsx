import Link from "next/link";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FirebaseNotice from "@/components/FirebaseNotice";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getVisibleProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadFeatured() {
  if (!isFirebaseConfigured) return [];
  try {
    const products = await getVisibleProducts();
    return products.slice(0, 8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await loadFeatured();

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-700 to-brand-800 text-cream-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center gap-5">
            <span className="w-fit rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
              Mang hương vị núi rừng Tây Bắc đến bàn ăn Hà Nội
            </span>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Ông Chú U50 Ăn Sạch
            </h1>
            <p className="max-w-md text-brand-100">
              Rau củ, trái cây, gạo và đặc sản vùng cao Tây Bắc — chọn lọc kỹ càng, giao tận tay,
              vì một bữa ăn sạch cho gia đình bạn.
            </p>
            <div className="flex gap-3">
              <Link
                href="/san-pham"
                className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-brand-900 hover:bg-gold-400"
              >
                Xem sản phẩm
              </Link>
              <a
                href="tel:0565885555"
                className="rounded-full border border-cream-50/40 px-6 py-3 font-semibold hover:bg-cream-50/10"
              >
                Gọi đặt hàng
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Ông Chú U50 Ăn Sạch"
              className="h-56 w-56 rounded-full shadow-xl sm:h-72 sm:w-72"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Feature icon={<Leaf size={22} />} title="100% tự nhiên" desc="Nông sản trồng theo hướng hữu cơ, không chất bảo quản." />
          <Feature icon={<ShieldCheck size={22} />} title="Nguồn gốc rõ ràng" desc="Thu mua trực tiếp từ nông hộ vùng Tây Bắc." />
          <Feature icon={<Truck size={22} />} title="Giao hàng tận nơi" desc="Đặt hàng nhanh chóng, giao tận cửa nhà bạn." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="mb-3 text-sm font-semibold text-brand-500">Danh mục</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/san-pham?category=${key}`}
              className="rounded-full border border-brand-200 bg-cream-50 px-4 py-1.5 text-sm font-medium text-brand-700 hover:border-brand-400"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-800">Sản phẩm nổi bật</h2>
          <Link href="/san-pham" className="text-sm font-medium text-brand-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {!isFirebaseConfigured ? (
          <FirebaseNotice />
        ) : featured.length === 0 ? (
          <p className="text-brand-500">Chưa có sản phẩm nào được hiển thị.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-cream-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-brand-800">{title}</p>
        <p className="text-sm text-brand-500">{desc}</p>
      </div>
    </div>
  );
}
