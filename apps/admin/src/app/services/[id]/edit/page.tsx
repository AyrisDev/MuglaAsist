"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { ServiceForm } from "@/components/services/ServiceForm";
import type { ServiceData } from "@/lib/types";

export default function EditServicePage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("services_data")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setService(data);
    } catch (err: any) {
      console.error("Error loading service:", err);
      setError(err.message || "Hizmet yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    data_key: string;
    title: string;
    content: string;
    metadata: Record<string, any> | null;
    is_active: boolean;
  }) => {
    const { error: updateError } = await supabase
      .from("services_data")
      .update({
        title: data.title,
        content: data.content,
        metadata: data.metadata,
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

  if (error || !service) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Hata Oluştu
            </h2>
            <p className="text-red-700">{error || "Hizmet bulunamadı"}</p>
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
            Hizmeti Düzenle
          </h1>
          <p className="text-gray-600 mt-2">
            {service.title} hizmetini düzenleyin
          </p>
        </div>

        {/* Form */}
        <ServiceForm service={service} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
