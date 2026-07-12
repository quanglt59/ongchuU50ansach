export type ProductCategory =
  | "do-kho"
  | "do-tuoi"
  | "men-cay"
  | "gia-vi"
  | "rau"
  | "khac";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "do-kho": "Đồ khô, đặc sản",
  "do-tuoi": "Đồ tươi",
  "men-cay": "Men cay",
  "gia-vi": "Gia vị",
  rau: "Rau (theo mùa)",
  khac: "Khác",
};

// Ghi chú thêm cho 1 số danh mục cần lưu ý đặc biệt khi khách đặt hàng.
export const CATEGORY_NOTES: Partial<Record<ProductCategory, string>> = {
  "do-tuoi": "Lưu ý: đặt hàng trước 1 ngày vì không trữ đồ đông lạnh.",
};

export const MAX_PRODUCT_IMAGES = 5;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: ProductCategory;
  imageUrls: string[];
  stock: number;
  isVisible: boolean;
  createdAt: number;
  updatedAt: number;
}

export type NewProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  qty: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "done"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  done: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: OrderCustomer;
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export type NewOrder = Omit<Order, "id" | "createdAt" | "status">;
