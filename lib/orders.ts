import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { NewOrder, Order, OrderStatus } from "./types";

function ordersCol() {
  return collection(db, "orders");
}

function toOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    items: (data.items as Order["items"]) ?? [],
    customer: (data.customer as Order["customer"]) ?? {
      name: "",
      phone: "",
      address: "",
    },
    total: Number(data.total ?? 0),
    status: (data.status as OrderStatus) ?? "pending",
    createdAt: Number(data.createdAt ?? 0),
  };
}

export async function createOrder(data: NewOrder): Promise<string> {
  const docRef = await addDoc(ordersCol(), {
    ...data,
    status: "pending" as OrderStatus,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(ordersCol(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, "orders", id), { status });
}
