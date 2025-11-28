"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/venues/ImageUpload";
import type { MenuItem, Venue } from "@/lib/types";

const menuItemSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli").max(200, "Maksimum 200 karakter"),
  venue_id: z.number({ required_error: "Mekan seçilmeli" }).min(1, "Mekan seçilmeli"),
  description: z.string().nullable(),
  price: z
    .number({ required_error: "Fiyat gerekli" })
    .positive("Fiyat pozitif bir sayı olmalıdır")
    .min(0, "Fiyat 0 veya daha büyük olmalı"),
  image_url: z.string().url().nullable(),
  category: z.string().nullable(),
  is_available: z.boolean().default(true),
  is_approved: z.boolean().default(false),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
}

// Common menu categories
const menuCategories = [
  "Ana Yemekler",
  "Başlangıçlar",
  "Salatalar",
  "İçecekler",
  "Sıcak İçecekler",
  "Tatlılar",
  "Atıştırmalıklar",
  "Pizzalar",
  "Burgerler",
  "Sandviçler",
  "Kahvaltı",
  "Diğer",
];

export function MenuItemForm({ menuItem, onSubmit }: MenuItemFormProps) {
  const router = useRouter();
  const isEditing = !!menuItem;

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: menuItem
      ? {
          name: menuItem.name,
          venue_id: menuItem.venue_id,
          description: menuItem.description,
          price: menuItem.price,
          image_url: menuItem.image_url,
          category: menuItem.category,
          is_available: menuItem.is_available,
          is_approved: menuItem.is_approved,
        }
      : {
          name: "",
          venue_id: 0,
          description: "",
          price: 0,
          image_url: null,
          category: "",
          is_available: true,
          is_approved: false,
        },
  });

  // Load venues
  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select('*')
        .eq("is_active", true);

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error("Error loading venues:", error);
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleFormSubmit = async (data: MenuItemFormData) => {
    try {
      await onSubmit(data);
      router.push("/menu-items");
      router.refresh();
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Temel Bilgiler
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ürün Adı *
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Americano"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Venue */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mekan *
          </label>
          {loadingVenues ? (
            <div className="py-2 text-gray-500">Mekanlar yükleniyor...</div>
          ) : (
            <select
              {...register("venue_id", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value={0}>Mekan seçin</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          )}
          {errors.venue_id && (
            <p className="mt-1 text-sm text-red-600">{errors.venue_id.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            {...register("category")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Kategori seçin (opsiyonel)</option>
            {menuCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Menü kategorisi (örn: İçecekler, Ana Yemekler)
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Ürün açıklaması..."
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat (TL) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0.00"
            min="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Ürün Fotoğrafı
        </h2>

        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Fotoğraf"
              value={field.value}
              onChange={field.onChange}
              folder="menu-items"
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Durum
        </h2>

        <div className="space-y-4">
          {/* Is Available */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="is_available"
                type="checkbox"
                {...register("is_available")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                Mevcut
              </label>
              <p className="text-sm text-gray-500">
                Ürün şu anda satışta mı? (Tükendiyse işareti kaldırın)
              </p>
            </div>
          </div>

          {/* Is Approved */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="is_approved"
                type="checkbox"
                {...register("is_approved")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="is_approved" className="text-sm font-medium text-gray-700">
                Onaylı
              </label>
              <p className="text-sm text-gray-500">
                AI menü onayı için kullanılır (Admin onayı gerekebilir)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
