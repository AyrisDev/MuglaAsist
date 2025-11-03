"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { EventForm } from "@/components/events/EventForm";

export default function NewEventPage() {
  const handleSubmit = async (data: {
    title: string;
    description: string;
    location: string | null;
    event_date: string;
    image_url: string | null;
    is_active: boolean;
  }) => {
    const { error } = await supabase.from("events").insert({
      title: data.title,
      description: data.description,
      location: data.location,
      event_date: data.event_date,
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
          <h1 className="text-3xl font-bold text-gray-900">Yeni Etkinlik</h1>
          <p className="text-gray-600 mt-2">Yeni bir etkinlik oluşturun</p>
        </div>

        {/* Form */}
        <EventForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
