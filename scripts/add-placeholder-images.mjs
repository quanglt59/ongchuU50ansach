// Script bổ sung ảnh minh hoạ cho các sản phẩm ĐÃ TỒN TẠI trong Firestore mà chưa có ảnh
// (ví dụ sản phẩm được tạo bằng bản seed-products.mjs cũ, trước khi có ảnh).
// Không tạo sản phẩm mới — chỉ cập nhật field imageUrls cho sản phẩm đang thiếu ảnh.
//
// Cách chạy (PowerShell):
//   $env:SEED_ADMIN_EMAIL="email admin của bạn"
//   $env:SEED_ADMIN_PASSWORD="mật khẩu admin của bạn"
//   node scripts/add-placeholder-images.mjs

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

function loadEnvLocal() {
  const content = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnvLocal();

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error("Thiếu SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD trong biến môi trường.");
  process.exit(1);
}

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function placeholderImages(name) {
  const slug = slugify(name);
  return [
    `https://picsum.photos/seed/${slug}-1/800/800`,
    `https://picsum.photos/seed/${slug}-2/800/800`,
  ];
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`Đăng nhập với ${adminEmail}...`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

  const snap = await getDocs(collection(db, "products"));
  let updated = 0;
  let skipped = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const hasImages = Array.isArray(data.imageUrls) && data.imageUrls.length > 0;
    if (hasImages) {
      skipped += 1;
      continue;
    }
    await updateDoc(doc(db, "products", docSnap.id), {
      imageUrls: placeholderImages(data.name ?? docSnap.id),
      updatedAt: Date.now(),
    });
    updated += 1;
    console.log(`Đã thêm ảnh cho: ${data.name}`);
  }

  console.log(`Xong! Cập nhật ${updated} sản phẩm, bỏ qua ${skipped} sản phẩm đã có ảnh.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Cập nhật thất bại:", err);
  process.exit(1);
});
