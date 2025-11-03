"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { CategoryForm } from "@/components/categories/CategoryForm";

export default function NewCategoryPage() {
  const handleSubmit = async (data: {
    name: string;
    icon_name: string;
    order_index: number;
    is_active: boolean;
  }) => {
    const { error } = await supabase.from("categories").insert({
      name: data.name,
      icon_name: data.icon_name,
      order_index: data.order_index,
      is_active: data.is_active,
    });

    if (error) throw error;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Kategori</h1>
          <p className="text-gray-600 mt-2">
            Yeni bir mekan kategorisi oluşturun
          </p>
        </div>

        {/* Form */}
        <CategoryForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
