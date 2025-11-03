import { supabase } from "./supabase";

export interface UploadImageResult {
  url: string;
  path: string;
}

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name (default: 'venue_assets')
 * @param folder - Optional folder path
 * @returns Public URL and storage path
 */
export async function uploadImage(
  file: File,
  bucket: string = "venue_assets",
  folder?: string
): Promise<UploadImageResult> {
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split(".").pop();
  const fileName = `${timestamp}_${randomString}.${extension}`;

  // Construct full path
  const path = folder ? `${folder}/${fileName}` : fileName;

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Dosya yüklenirken hata oluştu: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

/**
 * Delete image from Supabase Storage
 * @param path - Storage path to delete
 * @param bucket - Storage bucket name
 */
export async function deleteImage(
  path: string,
  bucket: string = "venue_assets"
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Dosya silinirken hata oluştu: ${error.message}`);
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): void {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Geçersiz dosya türü. Sadece JPG, PNG ve WebP dosyaları yüklenebilir."
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(
      `Dosya boyutu çok büyük. Maksimum ${maxSizeMB}MB olmalıdır.`
    );
  }
}
