"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "./ImageUpload";
import type { Venue, Category, HoursJSON, DayName } from "@/lib/types";

const dayNames: DayName[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayNamesturkish: Record<DayName, string> = {
  monday: "Pazartesi",
  tuesday: "Salı",
  wednesday: "Çarşamba",
  thursday: "Perşembe",
  friday: "Cuma",
  saturday: "Cumartesi",
  sunday: "Pazar",
};

const venueSchema = z.object({
  name: z.string().min(1, "Mekan adı gerekli").max(100, "Maksimum 100 karakter"),
  category_id: z.number({ required_error: "Kategori seçilmeli" }).min(1, "Kategori seçilmeli"),
  description: z.string().nullable(),
  logo_url: z.string().url().nullable(),
  cover_url: z.string().url().nullable(),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli bir telefon numarası girin (örn: 05551234567)")
    .nullable()
    .or(z.literal("")),
  location: z.string().nullable(),
  hours: z.custom<HoursJSON>().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type VenueFormData = z.infer<typeof venueSchema>;

interface VenueFormProps {
  venue?: Venue;
  onSubmit: (data: VenueFormData) => Promise<void>;
}

export function VenueForm({ venue, onSubmit }: VenueFormProps) {
  const router = useRouter();
  const isEditing = !!venue;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: venue
      ? {
          name: venue.name,
          category_id: venue.category_id,
          description: venue.description,
          logo_url: venue.logo_url,
          cover_url: venue.cover_url,
          phone: venue.phone,
          location: venue.location,
          hours: venue.hours,
          is_featured: venue.is_featured,
          is_active: venue.is_active,
        }
      : {
          name: "",
          category_id: 0,
          description: "",
          logo_url: null,
          cover_url: null,
          phone: "",
          location: "",
          hours: null,
          is_featured: false,
          is_active: true,
        },
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleFormSubmit = async (data: VenueFormData) => {
    try {
      // Clean phone number (remove spaces and dashes)
      if (data.phone) {
        data.phone = data.phone.replace(/[\s-]/g, "");
      }

      await onSubmit(data);
      router.push("/venues");
      router.refresh();
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Hours state management
  const [hoursEnabled, setHoursEnabled] = useState<Record<DayName, boolean>>(
    dayNames.reduce((acc, day) => {
      acc[day] = venue?.hours?.[day] !== undefined;
      return acc;
    }, {} as Record<DayName, boolean>)
  );

  const updateHours = (day: DayName, field: "open" | "close" | "is_next_day", value: string | boolean) => {
    const currentHours = watch("hours") || ({} as HoursJSON);

    if (!currentHours[day]) {
      currentHours[day] = { open: "09:00", close: "18:00", is_next_day: false };
    }

    if (field === "is_next_day") {
      currentHours[day]!.is_next_day = value as boolean;
    } else {
      currentHours[day]![field] = value as string;
    }

    setValue("hours", currentHours);
  };

  const toggleDay = (day: DayName, enabled: boolean) => {
    setHoursEnabled({ ...hoursEnabled, [day]: enabled });

    if (enabled) {
      updateHours(day, "open", "09:00");
      updateHours(day, "close", "18:00");
      updateHours(day, "is_next_day", false);
    } else {
      const currentHours = watch("hours") || ({} as HoursJSON);
      delete currentHours[day];
      setValue("hours", currentHours);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Temel Bilgiler
        </h2>

        {/* Venue Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mekan Adı *
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Starbucks"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori *
          </label>
          {loadingCategories ? (
            <div className="py-2 text-gray-500">Kategoriler yükleniyor...</div>
          ) : (
            <select
              {...register("category_id", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value={0}>Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon_name} {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Mekan hakkında kısa açıklama..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Fotoğraflar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <Controller
            name="logo_url"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Logo"
                value={field.value}
                onChange={field.onChange}
                folder="logos"
                disabled={isSubmitting}
              />
            )}
          />

          {/* Cover Image */}
          <Controller
            name="cover_url"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Kapak Fotoğrafı"
                value={field.value}
                onChange={field.onChange}
                folder="covers"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          İletişim Bilgileri
        </h2>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="05551234567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konum (Google Maps Link)
          </label>
          <input
            type="text"
            {...register("location")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="https://maps.google.com/?q=..."
          />
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Çalışma Saatleri
        </h2>

        <div className="space-y-4">
          {dayNames.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-32">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hoursEnabled[day]}
                    onChange={(e) => toggleDay(day, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {dayNamesturkish[day]}
                  </span>
                </label>
              </div>

              {hoursEnabled[day] && (
                <>
                  <input
                    type="time"
                    value={watch("hours")?.[day]?.open || "09:00"}
                    onChange={(e) => updateHours(day, "open", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="time"
                    value={watch("hours")?.[day]?.close || "18:00"}
                    onChange={(e) => updateHours(day, "close", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watch("hours")?.[day]?.is_next_day || false}
                      onChange={(e) => updateHours(day, "is_next_day", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">Ertesi gün</span>
                  </label>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Durum
        </h2>

        <div className="space-y-4">
          {/* Is Featured */}
          <div className="flex items-center">
            <input
              id="is_featured"
              type="checkbox"
              {...register("is_featured")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Öne Çıkan Mekan
            </label>
          </div>

          {/* Is Active */}
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
