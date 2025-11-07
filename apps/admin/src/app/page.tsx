"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isAdmin } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import type { AdminStats } from "@/lib/types";
import {
  Tag,
  Store,
  CheckCircle,
  Star,
  UtensilsCrossed,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      // Check if user is admin
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        router.push("/login");
        return;
      }

      // Fetch admin stats
      const { data, error } = await supabase
        .from("admin_stats")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching admin stats:", error);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error("Error:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Toplam Kategori",
      value: stats?.total_categories || 0,
      icon: Tag,
      color: "bg-blue-500",
    },
    {
      label: "Toplam Mekan",
      value: stats?.total_venues || 0,
      icon: Store,
      color: "bg-green-500",
    },
    {
      label: "Aktif Mekanlar",
      value: stats?.active_venues || 0,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      label: "Öne Çıkan Mekanlar",
      value: stats?.featured_venues || 0,
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "Toplam Menü Ürünleri",
      value: stats?.total_menu_items || 0,
      icon: UtensilsCrossed,
      color: "bg-purple-500",
    },
    {
      label: "Onay Bekleyenler",
      value: stats?.pending_approvals || 0,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Muğla Asist yönetim paneline hoş geldiniz
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/categories"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <Tag className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Kategoriler</h3>
              <p className="text-sm text-gray-600 mt-1">
                Kategori ekle ve düzenle
              </p>
            </a>

            <a
              href="/venues"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
            >
              <Store className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Mekanlar</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mekan ekle ve düzenle
              </p>
            </a>

            <a
              href="/menu-items"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
            >
              <UtensilsCrossed className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Menü Ürünleri</h3>
              <p className="text-sm text-gray-600 mt-1">
                Menü ürünlerini yönet
              </p>
            </a>

            <a
              href="/services"
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
            >
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Hizmetler</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ring, yemekhane bilgileri
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
