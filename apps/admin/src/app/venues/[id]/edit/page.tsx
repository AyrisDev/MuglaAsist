"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { VenueForm } from "@/components/venues/VenueForm";
import type { Venue } from "@/lib/types";

export default function EditVenuePage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVenue();
  }, [id]);

  const loadVenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("venues")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setVenue(data);
    } catch (err: any) {
      console.error("Error loading venue:", err);
      setError(err.message || "Mekan yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    category_id: number;
    description: string | null;
    logo_url: string | null;
    cover_url: string | null;
    phone: string | null;
    location: string | null;
    hours: any;
    is_featured: boolean;
    is_active: boolean;
  }) => {
    const { error: updateError } = await supabase
      .from("venues")
      .update({
        name: data.name,
        category_id: data.category_id,
        description: data.description,
        logo_url: data.logo_url,
        cover_url: data.cover_url,
        phone: data.phone,
        location: data.location,
        hours: data.hours,
        is_featured: data.is_featured,
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

  if (error || !venue) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">{error || "Mekan bulunamadı"}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Mekanı Düzenle</h1>
          <p className="text-gray-600 mt-2">{venue.name} mekanını düzenleyin</p>
        </div>

        {/* Form */}
        <VenueForm venue={venue} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
