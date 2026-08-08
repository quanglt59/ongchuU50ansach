// Script chạy 1 lần để tạo dữ liệu mẫu (fake data) cho collection "products".
//
// Cách chạy (PowerShell):
//   $env:SEED_ADMIN_EMAIL="email admin của bạn"
//   $env:SEED_ADMIN_PASSWORD="mật khẩu admin của bạn"
//   node scripts/seed-products.mjs
//
// Cách chạy (Git Bash):
//   SEED_ADMIN_EMAIL="email admin" SEED_ADMIN_PASSWORD="mật khẩu" node scripts/seed-products.mjs
//
// Cần đăng nhập bằng tài khoản admin (đã có document trong collection "admins") vì
// firestore.rules chỉ cho phép admin tạo sản phẩm mới.

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const PRODUCTS = [
  // Đồ khô, đặc sản
  {
    name: "Măng khô Tây Bắc",
    description: "Măng nứa rừng phơi khô tự nhiên, không lưu huỳnh, ngâm nở dai giòn.",
    price: 180000,
    unit: "500g",
    category: "do-kho",
    stock: 40,
  },
  {
    name: "Mộc nhĩ rừng",
    description: "Mộc nhĩ (nấm tai mèo) hái từ rừng Tây Bắc, phơi khô tự nhiên, tai dày giòn.",
    price: 120000,
    unit: "300g",
    category: "do-kho",
    stock: 35,
  },
  {
    name: "Thịt trâu gác bếp",
    description: "Thịt trâu bản hun khói gác bếp truyền thống, tẩm mắc khén, ớt, gừng.",
    price: 850000,
    unit: "kg",
    category: "do-kho",
    stock: 15,
  },
  {
    name: "Lạp xưởng gác bếp",
    description: "Lạp xưởng làm từ thịt lợn bản, hun khói gác bếp, thơm vị mắc khén đặc trưng.",
    price: 320000,
    unit: "500g",
    category: "do-kho",
    stock: 20,
  },
  {
    name: "Cá suối khô",
    description: "Cá suối nhỏ bắt tự nhiên, sấy khô giòn, ăn kèm cơm hoặc nhậu đều hợp.",
    price: 150000,
    unit: "200g",
    category: "do-kho",
    stock: 25,
  },

  // Đồ tươi (đặt trước 1 ngày)
  {
    name: "Thịt lợn bản",
    description: "Lợn bản nuôi thả tự nhiên, thịt chắc, ít mỡ, thơm ngon đậm vị.",
    price: 220000,
    unit: "kg",
    category: "do-tuoi",
    stock: 10,
  },
  {
    name: "Gà đen bản",
    description: "Gà đen (gà ác Mông) nuôi thả đồi, da giòn thịt chắc, bổ dưỡng.",
    price: 280000,
    unit: "con (~1.2kg)",
    category: "do-tuoi",
    stock: 8,
  },
  {
    name: "Cá suối tươi",
    description: "Cá suối tự nhiên đánh bắt trong ngày, thịt ngọt chắc.",
    price: 150000,
    unit: "kg",
    category: "do-tuoi",
    stock: 6,
  },
  {
    name: "Trứng gà bản",
    description: "Trứng gà bản thả đồi, lòng đỏ đậm, thơm béo tự nhiên.",
    price: 60000,
    unit: "chục (10 quả)",
    category: "do-tuoi",
    stock: 20,
  },

  // Men cay
  {
    name: "Rượu ngô Bắc Hà",
    description: "Rượu ngô nấu men lá truyền thống của người Mông, thơm nồng đặc trưng.",
    price: 150000,
    unit: "chai 500ml",
    category: "men-cay",
    stock: 30,
  },
  {
    name: "Rượu táo mèo",
    description: "Rượu ngâm táo mèo (sơn tra) rừng, vị chua ngọt dễ uống, tốt cho tiêu hoá.",
    price: 180000,
    unit: "chai 500ml",
    category: "men-cay",
    stock: 25,
  },
  {
    name: "Rượu Shan Lùng",
    description: "Rượu đặc sản của người Dao đỏ, nấu từ men lá rừng và thóc nương.",
    price: 200000,
    unit: "chai 500ml",
    category: "men-cay",
    stock: 18,
  },
  {
    name: "Rượu cần",
    description: "Rượu cần truyền thống, ủ men lá, uống bằng cần trúc, hương vị đặc trưng.",
    price: 250000,
    unit: "bình 2L",
    category: "men-cay",
    stock: 10,
  },

  // Gia vị
  {
    name: "Hạt mắc khén",
    description: "Gia vị đặc trưng Tây Bắc, thơm cay nồng, dùng ướp thịt nướng, chẩm chéo.",
    price: 90000,
    unit: "100g",
    category: "gia-vi",
    stock: 50,
  },
  {
    name: "Hạt dổi rừng",
    description: "Hạt dổi nướng thơm, giã nhỏ chấm cùng chẩm chéo hoặc ướp đồ nướng.",
    price: 110000,
    unit: "50g",
    category: "gia-vi",
    stock: 40,
  },
  {
    name: "Ớt khô Mường Khương",
    description: "Ớt bản địa phơi khô, cay thơm đặc trưng, không chất bảo quản.",
    price: 70000,
    unit: "200g",
    category: "gia-vi",
    stock: 45,
  },
  {
    name: "Gừng đá Tây Bắc",
    description: "Gừng núi đá thơm nồng, dùng làm gia vị hoặc pha trà gừng mật ong.",
    price: 40000,
    unit: "500g",
    category: "gia-vi",
    stock: 30,
  },

  // Rau (theo mùa)
  {
    name: "Cải mèo",
    description: "Rau cải mèo bản địa, vị hơi đắng nhẹ, thơm ngon đặc trưng vùng cao.",
    price: 25000,
    unit: "bó",
    category: "rau",
    stock: 30,
  },
  {
    name: "Rau dớn rừng",
    description: "Rau dớn hái tự nhiên trong rừng, giòn ngọt, xào tỏi hoặc luộc đều ngon.",
    price: 30000,
    unit: "bó",
    category: "rau",
    stock: 20,
  },
  {
    name: "Su su Sapa",
    description: "Su su trồng trên nương cao Sa Pa, quả non giòn ngọt tự nhiên.",
    price: 20000,
    unit: "kg",
    category: "rau",
    stock: 35,
  },
  {
    name: "Măng tươi",
    description: "Măng nứa rừng tươi mới hái, giòn ngọt, không hoá chất.",
    price: 45000,
    unit: "kg",
    category: "rau",
    stock: 25,
  },
  {
    name: "Rau bò khai",
    description: "Đặc sản rau rừng Tây Bắc, xào tỏi thơm giòn, giàu dinh dưỡng.",
    price: 35000,
    unit: "bó",
    category: "rau",
    stock: 15,
  },

  // Khác
  {
    name: "Mật ong rừng Tây Bắc",
    description: "Mật ong nguyên chất khai thác từ rừng nguyên sinh, sánh đặc, thơm tự nhiên.",
    price: 250000,
    unit: "chai 500ml",
    category: "khac",
    stock: 20,
  },
  {
    name: "Tinh bột nghệ",
    description: "Tinh bột nghệ nguyên chất, nguyên liệu quý cho sức khoẻ và làm đẹp.",
    price: 130000,
    unit: "200g",
    category: "khac",
    stock: 25,
  },
];

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Dùng Picsum (ảnh ngẫu nhiên ổn định theo seed) làm ảnh minh hoạ tạm thời — thay bằng
// ảnh thật qua Admin sau. Mỗi sản phẩm có 2 ảnh để test tính năng nhiều ảnh.
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

  const productsCol = collection(db, "products");
  let count = 0;
  for (const p of PRODUCTS) {
    const now = Date.now();
    await addDoc(productsCol, {
      ...p,
      imageUrls: placeholderImages(p.name),
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    });
    count += 1;
    console.log(`[${count}/${PRODUCTS.length}] Đã thêm: ${p.name}`);
  }

  console.log(`Xong! Đã tạo ${count} sản phẩm mẫu.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed thất bại:", err);
  process.exit(1);
});
