import { SupabaseClient } from "@supabase/supabase-js";

// Helper functions (add these to your utility files)
export function getMediaType(filePath: string): 'image' | 'pdf' | 'video' | 'other' {
  if (!filePath) return 'other';

  const extension = filePath.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
    return 'image';
  }

  if (extension === 'pdf') {
    return 'pdf';
  }

  if (['mp4', 'webm', 'mov'].includes(extension || '')) {
    return 'video';
  }

  return 'other';
}

export async function getFileUrl(supabase: SupabaseClient, filePath: string): Promise<string> {
  try {
    const path = filePath.substring(9);

    const { data, error } = await supabase.storage
      .from('evidence')
      .createSignedUrl(path, 60 * 60); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return '';
  }
}