"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import type { Venue, Category } from "@/lib/types";
import Image from "next/image";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadVenues();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error loading categories:", err);
    }
  };

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("venues")
        .select("*, categories(id, name, icon_name)")
        .order("name", { ascending: true });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setVenues(data || []);
    } catch (err: any) {
      console.error("Error loading venues:", err);
      setError(err.message || "Mekanlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!venueToDelete) return;

    setDeletingId(venueToDelete.id);
    try {
      const { error: deleteError } = await supabase
        .from("venues")
        .delete()
        .eq("id", venueToDelete.id);

      if (deleteError) throw deleteError;

      setShowDeleteModal(false);
      setVenueToDelete(null);
      await loadVenues();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Mekan silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStats = {
    total: venues.length,
    active: venues.filter((v) => v.is_active).length,
    featured: venues.filter((v) => v.is_featured).length,
  };

  if (loading && venues.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Mekanlar</h1>
            <p className="text-gray-600 mt-2">Tüm mekanları yönetin</p>
          </div>
          <Link
            href="/venues/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Mekan
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon_name} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedCategory ? "Filtrelenmiş" : "Toplam"} Mekan
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Mekanlar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.active}
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
                <p className="text-sm font-medium text-gray-600">Öne Çıkanlar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filteredStats.featured}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {venues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">
              {selectedCategory
                ? "Bu kategoride mekan bulunamadı"
                : "Henüz mekan eklenmemiş"}
            </p>
            <Link
              href="/venues/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              İlk Mekanı Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mekan Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {venue.logo_url ? (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={venue.logo_url}
                            alt={venue.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Logo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                      {venue.is_featured && (
                        <span className="text-xs text-yellow-600">⭐ Öne Çıkan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {venue.categories?.icon_name} {venue.categories?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {venue.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          venue.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {venue.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/venues/${venue.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(venue)}
                        disabled={deletingId === venue.id}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deletingId === venue.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {showDeleteModal && venueToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mekanı Sil
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{venueToDelete.name}</strong> mekanını silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVenueToDelete(null);
                }}
                disabled={deletingId !== null}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId !== null ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
