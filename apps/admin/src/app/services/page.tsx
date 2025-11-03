"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import type { ServiceData } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceData | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("services_data")
        .select("*")
        .order("data_key", { ascending: true });

      if (fetchError) throw fetchError;

      setServices(data || []);
    } catch (err: any) {
      console.error("Error loading services:", err);
      setError(err.message || "Hizmetler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service: ServiceData) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setDeletingId(serviceToDelete.id);
    try {
      const { error: deleteError } = await supabase
        .from("services_data")
        .delete()
        .eq("id", serviceToDelete.id);

      if (deleteError) throw deleteError;

      setShowDeleteModal(false);
      setServiceToDelete(null);
      await loadServices();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Hizmet silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = {
    total: services.length,
    active: services.filter((s) => s.is_active).length,
    inactive: services.filter((s) => !s.is_active).length,
  };

  if (loading && services.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Hizmetler</h1>
            <p className="text-gray-600 mt-2">
              Ulaşım ve kampüs hizmetlerini yönetin
            </p>
          </div>
          <Link
            href="/services/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Hizmet
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Toplam Hizmet
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Aktif Hizmetler
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
                  Pasif Hizmetler
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.inactive}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">⏸️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">Henüz hizmet eklenmemiş</p>
            <Link
              href="/services/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              İlk Hizmeti Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Anahtar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İçerik
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
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-medium text-gray-900">
                        {service.data_key}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                        {service.content.substring(0, 100)}
                        {service.content.length > 100 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/services/${service.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        disabled={deletingId === service.id}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deletingId === service.id ? "Siliniyor..." : "Sil"}
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
      {showDeleteModal && serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hizmeti Sil
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{serviceToDelete.title}</strong> hizmetini silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
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
