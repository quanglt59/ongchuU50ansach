// Dải hoạ tiết cách điệu theo thổ cẩm vùng cao Tây Bắc — dùng làm ranh giới trang trí giữa các
// section, tạo điểm nhấn văn hoá vùng miền thay vì chỉ là đường kẻ trơn.
let uid = 0;

export default function PatternStrip({ className = "" }: { className?: string }) {
  const id = `brocade-${++uid}`;

  return (
    <div className={`h-6 w-full overflow-hidden bg-brand-800 sm:h-7 ${className}`} aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id={id} width="36" height="28" patternUnits="userSpaceOnUse">
            <rect width="36" height="28" fill="#1f5c3f" />
            <path d="M18 2 L32 14 L18 26 L4 14 Z" fill="#d9ae52" opacity="0.9" />
            <path d="M18 8 L26 14 L18 20 L10 14 Z" fill="#0f2c1e" opacity="0.55" />
            <circle cx="0" cy="14" r="2.5" fill="#faf6ec" opacity="0.5" />
            <circle cx="36" cy="14" r="2.5" fill="#faf6ec" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
