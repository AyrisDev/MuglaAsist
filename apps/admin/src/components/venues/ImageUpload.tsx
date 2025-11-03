"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/uploadImage";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  disabled?: boolean;
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      // Validate file
      validateImageFile(file, 5);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      setUploading(true);
      const result = await uploadImage(file, "venue_assets", folder);

      // Update form value
      onChange(result.url);
      setPreview(result.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Dosya yüklenirken hata oluştu");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        // Preview
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Upload area
        <div
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${
            disabled || uploading
              ? "bg-gray-50 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 cursor-pointer"
          }`}
        >
          {uploading ? (
            <>
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-2"></div>
              <p className="text-sm text-gray-600">Yükleniyor...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Fotoğraf seçmek için tıklayın
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP (Max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
