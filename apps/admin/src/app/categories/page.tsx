"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { CategoryTable } from "@/components/categories/CategoryTable";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err: any) {
      console.error("Error loading categories:", err);
      setError(err.message || "Kategoriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Reload categories
    await loadCategories();
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
            <p className="text-gray-600 mt-2">
              Mekan kategorilerini yönetin
            </p>
          </div>
          <Link
            href="/categories/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Kategori
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadCategories}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tekrar dene
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Toplam Kategori
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categories.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Aktif Kategoriler
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categories.filter((c) => c.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pasif Kategoriler
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categories.filter((c) => !c.is_active).length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">⏸️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <CategoryTable categories={categories} onDelete={handleDelete} />
      </main>
    </div>
  );
}
