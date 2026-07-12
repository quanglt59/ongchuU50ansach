"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

interface AdminAuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
        if (!adminDoc.exists()) {
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        setUser(firebaseUser);
        setIsAdmin(true);
        setLoading(false);
      } catch (err) {
        console.error("Kiểm tra quyền admin thất bại:", err);
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      login: async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const adminDoc = await getDoc(doc(db, "admins", cred.user.uid));
        if (!adminDoc.exists()) {
          await signOut(auth);
          throw new Error("not-admin");
        }
      },
      logout: () => signOut(auth),
    }),
    [user, isAdmin, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth phải được dùng bên trong AdminAuthProvider");
  return ctx;
}
