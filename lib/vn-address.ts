// Dữ liệu tỉnh/thành + phường/xã Việt Nam sau sáp nhập (từ 01/07/2025) — chỉ còn 2 cấp
// (không còn quận/huyện). Nguồn: https://provinces.open-api.vn (API v2).
const BASE_URL = "https://provinces.open-api.vn/api/v2";

export interface VnDivision {
  code: number;
  name: string;
}

export async function getProvinces(): Promise<VnDivision[]> {
  const res = await fetch(`${BASE_URL}/p/`);
  if (!res.ok) throw new Error("Không thể tải danh sách tỉnh/thành phố");
  const data = await res.json();
  return (data as Array<{ code: number; name: string }>).map((p) => ({
    code: p.code,
    name: p.name,
  }));
}

export async function getWardsByProvince(provinceCode: number): Promise<VnDivision[]> {
  const res = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
  if (!res.ok) throw new Error("Không thể tải danh sách phường/xã");
  const data = await res.json();
  const wards = (data?.wards ?? []) as Array<{ code: number; name: string }>;
  return wards.map((w) => ({ code: w.code, name: w.name }));
}
