"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { CategoryForm } from "@/components/categories/CategoryForm";
import type { Category } from "@/lib/types";

export default function EditCategoryPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategory();
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setCategory(data);
    } catch (err: any) {
      console.error("Error loading category:", err);
      setError(err.message || "Kategori yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    icon_name: string;
    order_index: number;
    is_active: boolean;
  }) => {
    // Only update slug if name changed
    const updates: any = {
      name: data.name,
      icon_name: data.icon_name,
      order_index: data.order_index,
      is_active: data.is_active,
    };

    // If name changed, regenerate slug
    if (category && category.name !== data.name) {
      const { generateSlug } = await import("@/lib/utils");
      updates.slug = generateSlug(data.name);
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id);

    if (updateError) throw updateError;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">
              {error || "Kategori bulunamadı"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Kategoriyi Düzenle
          </h1>
          <p className="text-gray-600 mt-2">
            {category.name} kategorisini düzenleyin
          </p>
        </div>

        {/* Form */}
        <CategoryForm category={category} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
