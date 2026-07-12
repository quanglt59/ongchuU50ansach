"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/products";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  CATEGORY_LABELS,
  MAX_PRODUCT_IMAGES,
  type NewProduct,
  type Product,
  type ProductCategory,
} from "@/lib/types";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "kg");
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? "rau");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [isVisible, setIsVisible] = useState(product?.isVisible ?? true);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = MAX_PRODUCT_IMAGES - imageUrls.length;

  function addImageUrl(url: string) {
    setImageUrls((prev) => (prev.length >= MAX_PRODUCT_IMAGES ? prev : [...prev, url]));
  }

  function removeImageUrl(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddUrlClick() {
    const url = newImageUrl.trim();
    if (!url) return;
    addImageUrl(url);
    setNewImageUrl("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, remainingSlots);
    e.target.value = "";
    if (files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImageToCloudinary(file);
        addImageUrl(url);
      }
    } catch (err) {
      console.error("Upload ảnh thất bại:", err);
      setUploadError(
        err instanceof Error && err.message === "cloudinary-not-configured"
          ? "Chưa cấu hình Cloudinary (.env.local). Dán link ảnh thủ công bên dưới."
          : "Upload ảnh thất bại. Vui lòng thử lại hoặc dán link ảnh thủ công."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data: NewProduct = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        unit: unit.trim(),
        category,
        imageUrls,
        stock: Number(stock) || 0,
        isVisible,
      };

      if (isEdit && product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      router.push("/admin/san-pham");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-brand-800">Tên sản phẩm</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-brand-800">Mô tả</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Giá (đ)</span>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Đơn vị</span>
          <input
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="kg, túi, hộp..."
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Danh mục</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          >
            {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-800">Tồn kho</span>
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-brand-800">
          Ảnh sản phẩm ({imageUrls.length}/{MAX_PRODUCT_IMAGES})
        </span>

        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative h-24 w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Ảnh ${index + 1}`} className="h-24 w-24 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  aria-label="Xoá ảnh"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {remainingSlots > 0 ? (
          <>
            {isCloudinaryConfigured && (
              <label className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleFileChange}
                  className="text-sm text-brand-700"
                />
                {uploading && <span className="text-xs text-brand-500">Đang upload...</span>}
                {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
              </label>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://... (hoặc dán link ảnh có sẵn)"
                className="flex-1 rounded-lg border border-brand-200 bg-cream-50 px-3 py-2 outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddUrlClick}
                className="rounded-lg border border-brand-300 px-4 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Thêm
              </button>
            </div>
            <span className="text-xs text-brand-400">
              {isCloudinaryConfigured
                ? "Chọn nhiều ảnh để tự upload, hoặc dán link ảnh có sẵn. Tối đa 5 ảnh."
                : "Dán link ảnh đã upload sẵn (Google Drive, Imgur, CDN...). Ảnh cần ở chế độ công khai. Tối đa 5 ảnh."}
            </span>
          </>
        ) : (
          <span className="text-xs text-brand-400">Đã đạt tối đa {MAX_PRODUCT_IMAGES} ảnh.</span>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium text-brand-800">Hiển thị sản phẩm này trên web</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-brand-700 py-3 font-semibold text-cream-50 hover:bg-brand-600 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
      </button>
    </form>
  );
}
