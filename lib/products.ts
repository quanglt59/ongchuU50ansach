import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { NewProduct, Product } from "./types";

function productsCol() {
  return collection(db, "products");
}

function toProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    price: Number(data.price ?? 0),
    unit: String(data.unit ?? ""),
    category: (data.category as Product["category"]) ?? "khac",
    imageUrls: Array.isArray(data.imageUrls)
      ? data.imageUrls.map(String)
      : data.imageUrl
        ? [String(data.imageUrl)]
        : [],
    stock: Number(data.stock ?? 0),
    isVisible: Boolean(data.isVisible),
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

export async function getVisibleProducts(): Promise<Product[]> {
  // Không dùng orderBy() kèm where() ở đây để tránh phải tạo composite index trên Firestore —
  // sắp xếp lại ở client sau khi lấy dữ liệu.
  const q = query(productsCol(), where("isVisible", "==", true));
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => toProduct(d.id, d.data()));
  return products.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(productsCol(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data());
}

export async function createProduct(data: NewProduct): Promise<string> {
  const now = Date.now();
  const docRef = await addDoc(productsCol(), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<NewProduct>): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

export async function toggleProductVisibility(id: string, isVisible: boolean): Promise<void> {
  await updateDoc(doc(db, "products", id), { isVisible, updatedAt: Date.now() });
}
