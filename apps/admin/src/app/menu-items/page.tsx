"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { MenuItemTable } from "@/components/menu-items/MenuItemTable";
import type { MenuItem, Venue } from "@/lib/types";

interface MenuItemWithVenue extends MenuItem {
  venues?: {
    id: number;
    name: string;
  };
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItemWithVenue[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    loadMenuItems();
  }, [selectedVenue]);

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      setVenues(data || []);
    } catch (err: any) {
      console.error("Error loading venues:", err);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("menu_items")
        .select("*, venues(id, name)")
        .order("name", { ascending: true });

      if (selectedVenue) {
        query = query.eq("venue_id", selectedVenue);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setMenuItems(data || []);
    } catch (err: any) {
      console.error("Error loading menu items:", err);
      setError(err.message || "Menü ürünleri yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Reload menu items
    await loadMenuItems();
  };

  const filteredStats = {
    total: menuItems.length,
    available: menuItems.filter((item) => item.is_available).length,
    approved: menuItems.filter((item) => item.is_approved).length,
    pending: menuItems.filter((item) => !item.is_approved).length,
  };

  if (loading && menuItems.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Menü Ürünleri</h1>
            <p className="text-gray-600 mt-2">Tüm menü ürünlerini yönetin</p>
          </div>
          <Link
            href="/menu-items/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Ürün
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadMenuItems}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tekrar dene
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedVenue || ""}
            onChange={(e) =>
              setSelectedVenue(e.target.value ? parseInt(e.target.value) : null)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tüm Mekanlar</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedVenue ? "Filtrelenmiş" : "Toplam"} Ürün
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mevcut</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.available}
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
                <p className="text-sm font-medium text-gray-600">Onaylı</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.approved}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">👍</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onay Bekleyen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <MenuItemTable menuItems={menuItems} onDelete={handleDelete} />
      </main>
    </div>
  );
}
