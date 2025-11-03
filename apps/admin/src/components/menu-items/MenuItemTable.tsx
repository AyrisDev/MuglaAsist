"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface MenuItemWithVenue extends MenuItem {
  venues?: {
    id: number;
    name: string;
  };
}

interface MenuItemTableProps {
  menuItems: MenuItemWithVenue[];
  onDelete: (id: number) => Promise<void>;
}

export function MenuItemTable({ menuItems, onDelete }: MenuItemTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemWithVenue | null>(null);

  const handleDeleteClick = (item: MenuItemWithVenue) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    try {
      await onDelete(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Menü ürünü silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  };

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 mb-4">Henüz menü ürünü eklenmemiş</p>
        <Link
          href="/menu-items/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          İlk Menü Ürünü Ekle
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fotoğraf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mekan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.image_url ? (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Fotoğraf</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {item.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.venues?.name || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {item.category || "Diğer"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.is_available ? "Mevcut" : "Tükendi"}
                    </span>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_approved
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.is_approved ? "Onaylı" : "Bekliyor"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/menu-items/${item.id}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deletingId === item.id ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Menü Ürünü Sil
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{itemToDelete.name}</strong> ürünü silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
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
    </>
  );
}
