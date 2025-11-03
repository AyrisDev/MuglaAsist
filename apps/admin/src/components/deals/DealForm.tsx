"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/venues/ImageUpload";
import type { Deal, Venue } from "@/lib/types";

const dealSchema = z
  .object({
    venue_id: z
      .number({ required_error: "Mekan seçilmeli" })
      .min(1, "Mekan seçilmeli"),
    title: z.string().min(1, "Başlık gerekli").max(200, "Maksimum 200 karakter"),
    title_en: z.string().max(200, "Maksimum 200 karakter").nullable().or(z.literal("")),
    description: z.string().min(1, "Açıklama gerekli"),
    description_en: z.string().nullable().or(z.literal("")),
    discount_percentage: z
      .number()
      .int()
      .min(0, "0 ile 100 arası olmalı")
      .max(100, "0 ile 100 arası olmalı")
      .nullable()
      .or(z.literal(0)),
    terms: z.string().nullable().or(z.literal("")),
    valid_from: z.string().min(1, "Başlangıç tarihi gerekli"),
    valid_until: z.string().min(1, "Bitiş tarihi gerekli"),
    image_url: z.string().url().nullable(),
    is_active: z.boolean().default(true),
  })
  .refine((data) => new Date(data.valid_until) >= new Date(data.valid_from), {
    message: "Bitiş tarihi başlangıç tarihinden önce olamaz",
    path: ["valid_until"],
  });

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal?: Deal;
  onSubmit: (data: DealFormData) => Promise<void>;
}

export function DealForm({ deal, onSubmit }: DealFormProps) {
  const router = useRouter();
  const isEditing = !!deal;

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          venue_id: deal.venue_id,
          title: deal.title,
          title_en: deal.title_en,
          description: deal.description,
          description_en: deal.description_en,
          discount_percentage: deal.discount_percentage,
          terms: deal.terms,
          valid_from: deal.valid_from.slice(0, 16), // datetime-local format
          valid_until: deal.valid_until.slice(0, 16),
          image_url: deal.image_url,
          is_active: deal.is_active,
        }
      : {
          venue_id: 0,
          title: "",
          title_en: "",
          description: "",
          description_en: "",
          discount_percentage: 0,
          terms: "",
          valid_from: "",
          valid_until: "",
          image_url: null,
          is_active: true,
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
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error("Error loading venues:", error);
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleFormSubmit = async (data: DealFormData) => {
    try {
      await onSubmit(data);
      router.push("/deals");
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
            <p className="mt-1 text-sm text-red-600">
              {errors.venue_id.message}
            </p>
          )}
        </div>

        {/* Title (TR) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fırsat Başlığı (Türkçe) *
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Öğrenci İndirimi"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Title (EN) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fırsat Başlığı (English)
          </label>
          <input
            type="text"
            {...register("title_en")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="e.g: Student Discount"
          />
          {errors.title_en && (
            <p className="mt-1 text-sm text-red-600">{errors.title_en.message}</p>
          )}
        </div>

        {/* Description (TR) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama (Türkçe) *
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Fırsat hakkında detaylı açıklama..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Description (EN) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama (English)
          </label>
          <textarea
            {...register("description_en")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Detailed description about the deal..."
          />
          {errors.description_en && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description_en.message}
            </p>
          )}
        </div>

        {/* Discount Percentage */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            İndirim Yüzdesi
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register("discount_percentage", { valueAsNumber: true })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="20"
              min="0"
              max="100"
            />
            <span className="text-gray-600">%</span>
          </div>
          {errors.discount_percentage && (
            <p className="mt-1 text-sm text-red-600">
              {errors.discount_percentage.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            0 ile 100 arası bir sayı girin
          </p>
        </div>

        {/* Terms */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Şartlar ve Koşullar
          </label>
          <textarea
            {...register("terms")}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Sadece öğrencilere geçerlidir. Öğrenci kimliği gösterilmelidir."
          />
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.terms.message}
            </p>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Geçerlilik Tarihleri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi *
            </label>
            <input
              type="datetime-local"
              {...register("valid_from")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.valid_from && (
              <p className="mt-1 text-sm text-red-600">
                {errors.valid_from.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi *
            </label>
            <input
              type="datetime-local"
              {...register("valid_until")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.valid_until && (
              <p className="mt-1 text-sm text-red-600">
                {errors.valid_until.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Fırsat Görseli
        </h2>

        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Fırsat Görseli"
              value={field.value}
              onChange={field.onChange}
              folder="deals"
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Durum</h2>

        <div className="flex items-center">
          <input
            id="is_active"
            type="checkbox"
            {...register("is_active")}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Aktif
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500 ml-6">
          Pasif fırsatlar mobil uygulamada gösterilmez
        </p>
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
