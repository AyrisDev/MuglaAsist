"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { DealForm } from "@/components/deals/DealForm";
import type { Deal } from "@/lib/types";

export default function EditDealPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeal();
  }, [id]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setDeal(data);
    } catch (err: any) {
      console.error("Error loading deal:", err);
      setError(err.message || "Fırsat yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    venue_id: number;
    title: string;
    title_en: string | null;
    description: string;
    description_en: string | null;
    discount_percentage: number | null;
    terms: string | null;
    valid_from: string;
    valid_until: string;
    image_url: string | null;
    is_active: boolean;
  }) => {
    const { error: updateError } = await supabase
      .from("deals")
      .update({
        venue_id: data.venue_id,
        title: data.title,
        title_en: data.title_en || null,
        description: data.description,
        description_en: data.description_en || null,
        discount_percentage: data.discount_percentage || null,
        terms: data.terms || null,
        valid_from: data.valid_from,
        valid_until: data.valid_until,
        image_url: data.image_url,
        is_active: data.is_active,
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

  if (error || !deal) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">{error || "Fırsat bulunamadı"}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Fırsatı Düzenle
          </h1>
          <p className="text-gray-600 mt-2">
            {deal.title} fırsatını düzenleyin
          </p>
        </div>

        {/* Form */}
        <DealForm deal={deal} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
