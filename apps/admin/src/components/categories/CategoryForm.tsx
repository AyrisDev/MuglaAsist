"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli").max(100, "Maksimum 100 karakter"),
  icon_name: z.string().min(1, "İkon gerekli").max(10, "Maksimum 10 karakter"),
  order_index: z.number().int().min(0, "Sıra 0 veya daha büyük olmalı"),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          icon_name: category.icon_name,
          order_index: category.order_index,
          is_active: category.is_active,
        }
      : {
          name: "",
          icon_name: "🍔",
          order_index: 0,
          is_active: true,
        },
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      router.push("/categories");
      router.refresh();
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Common emoji icons for quick selection
  const commonIcons = ["🍔", "☕", "🍕", "🍜", "🍰", "🥤", "🍗", "🥗"];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        </h2>

        {/* Category Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kategori Adı *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Kahveciler"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Icon */}
        <div className="mb-4">
          <label
            htmlFor="icon_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            İkon (Emoji) *
          </label>
          <div className="flex items-center gap-2">
            <input
              id="icon_name"
              type="text"
              {...register("icon_name")}
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-2xl text-center"
              placeholder="🍔"
            />
            <div className="flex gap-1">
              {commonIcons.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("icon_name") as HTMLInputElement;
                    if (input) input.value = emoji;
                  }}
                  className="w-10 h-10 text-2xl hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          {errors.icon_name && (
            <p className="mt-1 text-sm text-red-600">{errors.icon_name.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Kategoriyi temsil eden bir emoji seçin veya girin
          </p>
        </div>

        {/* Order Index */}
        <div className="mb-4">
          <label
            htmlFor="order_index"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Görüntüleme Sırası *
          </label>
          <input
            id="order_index"
            type="number"
            {...register("order_index", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0"
            min="0"
          />
          {errors.order_index && (
            <p className="mt-1 text-sm text-red-600">
              {errors.order_index.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Kategorilerin sıralanma düzeni (0'dan başlar)
          </p>
        </div>

        {/* Is Active */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="is_active"
              type="checkbox"
              {...register("is_active")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-700"
            >
              Aktif
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500 ml-6">
            Pasif kategoriler kullanıcılara gösterilmez
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Kaydediliyor..."
              : isEditing
              ? "Güncelle"
              : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
