"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { EventForm } from "@/components/events/EventForm";
import type { Event } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setEvent(data);
    } catch (err: any) {
      console.error("Error loading event:", err);
      setError(err.message || "Etkinlik yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    title: string;
    description: string;
    location: string | null;
    event_date: string;
    image_url: string | null;
    is_active: boolean;
  }) => {
    const { error: updateError } = await supabase
      .from("events")
      .update({
        title: data.title,
        description: data.description,
        location: data.location,
        event_date: data.event_date,
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

  if (error || !event) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">{error || "Etkinlik bulunamadı"}</p>
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
            Etkinliği Düzenle
          </h1>
          <p className="text-gray-600 mt-2">
            {event.title} etkinliğini düzenleyin
          </p>
        </div>

        {/* Form */}
        <EventForm event={event} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
