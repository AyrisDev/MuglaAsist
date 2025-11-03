"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/venues/ImageUpload";
import type { Event } from "@/lib/types";

const eventSchema = z.object({
  title: z.string().min(1, "Başlık gerekli").max(200, "Maksimum 200 karakter"),
  description: z.string().min(1, "Açıklama gerekli"),
  location: z.string().nullable(),
  event_date: z.string().min(1, "Etkinlik tarihi gerekli"),
  image_url: z.string().url().nullable(),
  is_active: z.boolean().default(true),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          location: event.location,
          event_date: event.event_date.slice(0, 16), // Convert to datetime-local format
          image_url: event.image_url,
          is_active: event.is_active,
        }
      : {
          title: "",
          description: "",
          location: "",
          event_date: "",
          image_url: null,
          is_active: true,
        },
  });

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      await onSubmit(data);
      router.push("/events");
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

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etkinlik Başlığı *
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Bahar Şenliği 2025"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama *
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Etkinlik hakkında detaylı açıklama..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etkinlik Tarihi ve Saati *
          </label>
          <input
            type="datetime-local"
            {...register("event_date")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {errors.event_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.event_date.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konum
          </label>
          <input
            type="text"
            {...register("location")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Kampüs Ana Bahçesi"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Etkinlik Görseli
        </h2>

        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Etkinlik Görseli"
              value={field.value}
              onChange={field.onChange}
              folder="events"
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
          Pasif etkinlikler mobil uygulamada gösterilmez
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
