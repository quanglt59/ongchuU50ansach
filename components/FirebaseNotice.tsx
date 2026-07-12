export default function FirebaseNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gold-500 bg-gold-400/10 p-6 text-center text-sm text-brand-800">
      <p className="font-semibold">Chưa kết nối Firebase</p>
      <p className="mt-1">
        Điền thông tin cấu hình vào file <code className="rounded bg-cream-200 px-1">.env.local</code>{" "}
        (xem hướng dẫn trong <code className="rounded bg-cream-200 px-1">README.md</code>) rồi khởi động
        lại server để trang này hoạt động.
      </p>
    </div>
  );
}
