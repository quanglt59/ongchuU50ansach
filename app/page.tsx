import Link from "next/link";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FirebaseNotice from "@/components/FirebaseNotice";
import PatternStrip from "@/components/PatternStrip";
import { CategoryIcon } from "@/lib/category-icons";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getVisibleProducts } from "@/lib/products";
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadFeatured() {
  if (!isFirebaseConfigured) return [];
  try {
    const products = await getVisibleProducts();
    return products.slice(0, 10);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await loadFeatured();

  return (
    <div>
      <section className="relative overflow-hidden text-cream-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/anhnuirung.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/75 to-brand-800/30" />

        <div className="relative mx-auto flex min-h-[960px] max-w-6xl flex-col justify-center gap-5 px-4 py-16 sm:min-h-[900px] sm:px-6 sm:py-20">
          <span className="w-fit rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
            Mang hương vị núi rừng Tây Bắc đến bàn ăn Hà Nội
          </span>
          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-sm sm:text-5xl">
            Ông Chú U50 Ăn Sạch
          </h1>
          <p className="max-w-xl text-brand-100 sm:text-lg">
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
      </section>

      <PatternStrip />

      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Feature icon={<Leaf size={22} />} title="100% tự nhiên" desc="Nông sản trồng theo hướng hữu cơ, không chất bảo quản." />
            <Feature icon={<ShieldCheck size={22} />} title="Nguồn gốc rõ ràng" desc="Thu mua trực tiếp từ nông hộ vùng Tây Bắc." />
            <Feature icon={<Truck size={22} />} title="Giao hàng tận nơi" desc="Đặt hàng nhanh chóng, giao tận cửa nhà bạn." />
          </div>
        </div>
      </section>

      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-14">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/anhcuahang.JPG"
              alt="Bản làng và ruộng bậc thang Tây Bắc"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              Câu chuyện thương hiệu
            </span>
            <h2 className="mt-4 text-2xl font-bold text-brand-800 sm:text-3xl">
              Từ bản làng Tây Bắc đến bữa cơm Hà Nội
            </h2>
            <p className="mt-4 text-brand-700">
              Ông Chú U50 Ăn Sạch ra đời từ tình yêu với vùng đất Tây Bắc — nơi có những thửa ruộng
              bậc thang, những phiên chợ vùng cao và nông sản sạch của bà con dân bản. Chúng tôi trực
              tiếp thu mua từ nông hộ, chọn lọc kỹ từng mớ rau, cân gạo, chum rượu — để mỗi sản phẩm
              đến tay bạn vẫn giữ trọn hương vị núi rừng.
            </p>
            <p className="mt-3 text-brand-700">
              Không qua trung gian, không chất bảo quản — chỉ có sự tử tế của người làm nông và sự
              chỉn chu của một "ông chú" muốn cả nhà mình và mọi gia đình đều được ăn sạch mỗi ngày.
            </p>
          </div>
        </div>
      </section>

      <PatternStrip />

      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-gold-600">
            Đặc sản vùng cao
          </p>
          <h2 className="mb-8 text-center text-2xl font-bold text-brand-800 sm:text-3xl">
            Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((key) => (
              <Link
                key={key}
                href={`/san-pham?category=${key}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-cream-50 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-cream-50">
                  <CategoryIcon category={key} size={26} />
                </div>
                <span className="text-sm font-semibold text-brand-800">{CATEGORY_LABELS[key]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-800 sm:text-2xl">Sản phẩm nổi bật</h2>
          <Link href="/san-pham" className="text-sm font-medium text-brand-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {!isFirebaseConfigured ? (
          <FirebaseNotice />
        ) : featured.length === 0 ? (
          <p className="text-brand-500">Chưa có sản phẩm nào được hiển thị.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
