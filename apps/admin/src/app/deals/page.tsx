"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import type { Deal, Venue } from "@/lib/types";
import Image from "next/image";

interface DealWithVenue extends Deal {
  venues?: {
    id: number;
    name: string;
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithVenue[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<DealWithVenue | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    loadDeals();
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

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("deals")
        .select("*, venues(id, name)")
        .order("valid_from", { ascending: false });

      if (selectedVenue) {
        query = query.eq("venue_id", selectedVenue);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDeals(data || []);
    } catch (err: any) {
      console.error("Error loading deals:", err);
      setError(err.message || "Fırsatlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (deal: DealWithVenue) => {
    setDealToDelete(deal);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!dealToDelete) return;

    setDeletingId(dealToDelete.id);
    try {
      const { error: deleteError } = await supabase
        .from("deals")
        .delete()
        .eq("id", dealToDelete.id);

      if (deleteError) throw deleteError;

      setShowDeleteModal(false);
      setDealToDelete(null);
      await loadDeals();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Fırsat silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  const now = new Date();
  const filteredDeals = deals.filter((deal) => {
    const startDate = new Date(deal.valid_from);
    const endDate = new Date(deal.valid_until);

    if (filter === "active") {
      return deal.is_active && startDate <= now && endDate >= now;
    }
    if (filter === "expired") {
      return endDate < now;
    }
    return true;
  });

  const stats = {
    total: deals.length,
    active: deals.filter((d) => d.is_active).length,
    current: deals.filter((d) => {
      const startDate = new Date(d.valid_from);
      const endDate = new Date(d.valid_until);
      return d.is_active && startDate <= now && endDate >= now;
    }).length,
    expired: deals.filter((d) => new Date(d.valid_until) < now).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDealStatus = (deal: Deal) => {
    const startDate = new Date(deal.valid_from);
    const endDate = new Date(deal.valid_until);

    if (endDate < now) {
      return { label: "Süresi Bitti", color: "bg-gray-100 text-gray-800" };
    }
    if (startDate > now) {
      return { label: "Yakında", color: "bg-blue-100 text-blue-800" };
    }
    if (deal.is_active) {
      return { label: "Aktif", color: "bg-green-100 text-green-800" };
    }
    return { label: "Pasif", color: "bg-gray-100 text-gray-800" };
  };

  if (loading && deals.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Fırsatlar</h1>
            <p className="text-gray-600 mt-2">
              Mekan fırsatlarını ve indirimlerini yönetin
            </p>
          </div>
          <Link
            href="/deals/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Fırsat
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filters */}
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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "expired")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Tüm Fırsatlar</option>
            <option value="active">Geçerli Fırsatlar</option>
            <option value="expired">Süresi Bitenler</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {selectedVenue ? "Filtrelenmiş" : "Toplam"} Fırsat
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.active}
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
                <p className="text-sm font-medium text-gray-600">Geçerli</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.current}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Süresi Biten
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.expired}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">
              {selectedVenue
                ? "Bu mekana ait fırsat bulunamadı"
                : filter === "all"
                ? "Henüz fırsat eklenmemiş"
                : filter === "active"
                ? "Geçerli fırsat bulunamadı"
                : "Süresi biten fırsat bulunamadı"}
            </p>
            <Link
              href="/deals/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              İlk Fırsatı Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Görsel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mekan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İndirim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tarih Aralığı
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
                {filteredDeals.map((deal) => {
                  const status = getDealStatus(deal);
                  return (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {deal.image_url ? (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={deal.image_url}
                              alt={deal.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {deal.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {deal.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {deal.venues?.name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          {deal.discount_percentage ? `%${deal.discount_percentage}` : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(deal.valid_from)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(deal.valid_until)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/deals/${deal.id}/edit`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(deal)}
                          disabled={deletingId === deal.id}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === deal.id ? "Siliniyor..." : "Sil"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {showDeleteModal && dealToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fırsatı Sil
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{dealToDelete.title}</strong> fırsatını silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDealToDelete(null);
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
