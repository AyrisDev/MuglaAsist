"use client";

import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { ServiceForm } from "@/components/services/ServiceForm";

export default function NewServicePage() {
  const handleSubmit = async (data: {
    data_key: string;
    title: string;
    content: string;
    metadata: Record<string, any> | null;
    is_active: boolean;
  }) => {
    const { error } = await supabase.from("services_data").insert({
      data_key: data.data_key,
      title: data.title,
      content: data.content,
      metadata: data.metadata,
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
          <h1 className="text-3xl font-bold text-gray-900">Yeni Hizmet</h1>
          <p className="text-gray-600 mt-2">
            Yeni bir hizmet bilgisi oluşturun
          </p>
        </div>

        {/* Form */}
        <ServiceForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
