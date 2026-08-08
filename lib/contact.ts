import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { ContactMessage, NewContactMessage } from "./types";

function contactCol() {
  return collection(db, "contactMessages");
}

function toContactMessage(id: string, data: Record<string, unknown>): ContactMessage {
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    content: String(data.content ?? ""),
    createdAt: Number(data.createdAt ?? 0),
  };
}

export async function createContactMessage(data: NewContactMessage): Promise<string> {
  const docRef = await addDoc(contactCol(), { ...data, createdAt: Date.now() });
  return docRef.id;
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const q = query(contactCol(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toContactMessage(d.id, d.data()));
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "contactMessages", id));
}
