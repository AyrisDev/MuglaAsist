"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { MenuItemForm } from "@/components/menu-items/MenuItemForm";
import type { MenuItem } from "@/lib/types";

export default function EditMenuItemPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setMenuItem(data);
    } catch (err: any) {
      console.error("Error loading menu item:", err);
      setError(err.message || "Menü ürünü yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

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
    const { error: updateError } = await supabase
      .from("menu_items")
      .update({
        name: data.name,
        venue_id: data.venue_id,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
        is_available: data.is_available,
        is_approved: data.is_approved,
      })
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

  if (error || !menuItem) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">{error || "Menü ürünü bulunamadı"}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Menü Ürünü Düzenle</h1>
          <p className="text-gray-600 mt-2">{menuItem.name} ürününü düzenleyin</p>
        </div>

        {/* Form */}
        <MenuItemForm menuItem={menuItem} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
