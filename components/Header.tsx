"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
];

export default function Header() {
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-200 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/logo.png"
            alt="Ông Chú U50 Ăn Sạch"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="font-extrabold text-brand-700 text-base sm:text-lg">
              Ông Chú U50 Ăn Sạch
            </p>
            <p className="text-xs text-brand-500">Nông sản sạch Tây Bắc</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-800 hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/gio-hang"
            className="relative flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-brand-600"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {totalQty > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-brand-900">
                {totalQty}
              </span>
            )}
          </Link>
          <button
            className="rounded-md p-2 text-brand-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Mở menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-200 bg-cream-50 px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
