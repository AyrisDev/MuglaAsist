"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import type { Event } from "@/lib/types";
import Image from "next/image";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (fetchError) throw fetchError;

      setEvents(data || []);
    } catch (err: any) {
      console.error("Error loading events:", err);
      setError(err.message || "Etkinlikler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setDeletingId(eventToDelete.id);
    try {
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventToDelete.id);

      if (deleteError) throw deleteError;

      setShowDeleteModal(false);
      setEventToDelete(null);
      await loadEvents();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Etkinlik silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  const now = new Date();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  const stats = {
    total: events.length,
    active: events.filter((e) => e.is_active).length,
    upcoming: events.filter((e) => new Date(e.event_date) >= now).length,
    past: events.filter((e) => new Date(e.event_date) < now).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && events.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Etkinlikler</h1>
            <p className="text-gray-600 mt-2">Kampüs etkinliklerini yönetin</p>
          </div>
          <Link
            href="/events/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Etkinlik
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
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "upcoming" | "past")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Tüm Etkinlikler</option>
            <option value="upcoming">Yaklaşan Etkinlikler</option>
            <option value="past">Geçmiş Etkinlikler</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Toplam Etkinlik
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Aktif Etkinlikler
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Yaklaşan
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.upcoming}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">🔜</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geçmiş</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.past}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">
              {filter === "all"
                ? "Henüz etkinlik eklenmemiş"
                : filter === "upcoming"
                ? "Yaklaşan etkinlik bulunamadı"
                : "Geçmiş etkinlik bulunamadı"}
            </p>
            <Link
              href="/events/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              İlk Etkinliği Ekle
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
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Konum
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
                {filteredEvents.map((event) => {
                  const isPast = new Date(event.event_date) < now;
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.image_url ? (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={event.image_url}
                              alt={event.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📅</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {event.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(event.event_date)}
                        </div>
                        {isPast && (
                          <span className="text-xs text-gray-500">Geçmiş</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {event.location || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          disabled={deletingId === event.id}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === event.id ? "Siliniyor..." : "Sil"}
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
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Etkinliği Sil
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{eventToDelete.title}</strong> etkinliğini silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEventToDelete(null);
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
