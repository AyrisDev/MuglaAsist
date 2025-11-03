"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { MenuItemForm } from "@/components/menu-items/MenuItemForm";

export default function NewMenuItemPage() {
  const handleSubmit = async (data: {
    name: string;
    venue_id: number;
    description: string | null;
    price: number;
    image_url: string | null;
    category: string | null;
    is_available: boolean;
    is_approved: boolean;
  }) => {
    const { error } = await supabase.from("menu_items").insert({
      name: data.name,
      venue_id: data.venue_id,
      description: data.description,
      price: data.price,
      image_url: data.image_url,
      category: data.category,
      is_available: data.is_available,
      is_approved: data.is_approved,
    });

    if (error) throw error;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Menü Ürünü</h1>
          <p className="text-gray-600 mt-2">Yeni bir menü ürünü ekleyin</p>
        </div>

        {/* Form */}
        <MenuItemForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
