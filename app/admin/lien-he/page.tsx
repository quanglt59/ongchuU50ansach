import ContactMessageTable from "@/components/admin/ContactMessageTable";

export default function AdminContactPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-800">Liên hệ từ khách hàng</h1>
      <ContactMessageTable />
    </div>
  );
}
