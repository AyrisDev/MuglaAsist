"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { DealForm } from "@/components/deals/DealForm";

export default function NewDealPage() {
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
    const { error } = await supabase.from("deals").insert({
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
    });

    if (error) throw error;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Fırsat</h1>
          <p className="text-gray-600 mt-2">Yeni bir fırsat oluşturun</p>
        </div>

        {/* Form */}
        <DealForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
