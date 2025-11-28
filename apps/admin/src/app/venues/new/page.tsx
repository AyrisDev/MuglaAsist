"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { VenueForm } from "@/components/venues/VenueForm";
import { generateSlug } from "@/lib/utils";

export default function NewVenuePage() {
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
    const slug = generateSlug(data.name);

    const { error } = await supabase.from("venues").insert({
      name: data.name,
      slug: slug,
      category_id: data.category_id,
      description: data.description,
      logo_url: data.logo_url,
      cover_url: data.cover_url,
      phone: data.phone,
      location: data.location,
      hours: data.hours,
      is_featured: data.is_featured,
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
          <h1 className="text-3xl font-bold text-gray-900">Yeni Mekan</h1>
          <p className="text-gray-600 mt-2">Yeni bir mekan ekleyin</p>
        </div>

        {/* Form */}
        <VenueForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
