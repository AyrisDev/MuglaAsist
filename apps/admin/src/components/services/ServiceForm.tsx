"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import type { ServiceData } from "@/lib/types";

const serviceSchema = z.object({
  data_key: z
    .string()
    .min(1, "Anahtar gerekli")
    .max(50, "Maksimum 50 karakter")
    .regex(
      /^[a-z0-9_-]+$/,
      "Sadece küçük harf, rakam, tire ve alt çizgi kullanın"
    ),
  title: z.string().min(1, "Başlık gerekli").max(200, "Maksimum 200 karakter"),
  content: z.string().min(1, "İçerik gerekli"),
  metadata: z.string().nullable(),
  is_active: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: ServiceData;
  onSubmit: (data: {
    data_key: string;
    title: string;
    content: string;
    metadata: Record<string, any> | null;
    is_active: boolean;
  }) => Promise<void>;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          data_key: service.data_key,
          title: service.title,
          content: service.content,
          metadata: service.metadata ? JSON.stringify(service.metadata, null, 2) : "",
          is_active: service.is_active,
        }
      : {
          data_key: "",
          title: "",
          content: "",
          metadata: "",
          is_active: true,
        },
  });

  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      // Parse metadata JSON if provided
      let parsedMetadata: Record<string, any> | null = null;
      if (data.metadata && data.metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(data.metadata);
        } catch (e) {
          alert("Metadata geçerli bir JSON formatında değil");
          return;
        }
      }

      await onSubmit({
        data_key: data.data_key,
        title: data.title,
        content: data.content,
        metadata: parsedMetadata,
        is_active: data.is_active,
      });
      router.push("/services");
      router.refresh();
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
        </h2>

        {/* Data Key */}
        <div className="mb-4">
          <label
            htmlFor="data_key"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Anahtar (Key) *
          </label>
          <input
            id="data_key"
            type="text"
            {...register("data_key")}
            disabled={isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono ${
              isEditing ? "bg-gray-100" : ""
            }`}
            placeholder="ornek-anahtar"
          />
          {errors.data_key && (
            <p className="mt-1 text-sm text-red-600">
              {errors.data_key.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Sistemde kullanılacak benzersiz anahtar (örn: bus-schedule,
            shuttle-times)
          </p>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Başlık *
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="ör: Otobüs Saatleri"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Content (Markdown) */}
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            İçerik (Markdown) *
          </label>
          <textarea
            id="content"
            {...register("content")}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
            placeholder="# Başlık&#10;&#10;İçerik buraya yazılacak...&#10;&#10;- Liste öğesi 1&#10;- Liste öğesi 2"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Markdown formatında içerik girin. Mobil uygulamada render edilecek.
          </p>
        </div>

        {/* Metadata (JSON) */}
        <div className="mb-4">
          <label
            htmlFor="metadata"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Metadata (JSON - Opsiyonel)
          </label>
          <textarea
            id="metadata"
            {...register("metadata")}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
            placeholder={`{&#10;  "icon": "🚌",&#10;  "color": "#3B82F6"&#10;}`}
          />
          {errors.metadata && (
            <p className="mt-1 text-sm text-red-600">
              {errors.metadata.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Geçerli JSON formatında ekstra veriler (ikon, renk vs.)
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
            Pasif hizmetler mobil uygulamada gösterilmez
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
