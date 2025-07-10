import { ImageGeneration } from "@/types/image-generation";
import { getSupabaseClient } from "@/models/db";

export enum ImageGenerationStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

export async function insertImageGeneration(imageGeneration: ImageGeneration) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("image_generations")
    .insert(imageGeneration);

  if (error) {
    throw error;
  }

  return data;
}

export async function findImageGenerationByUuid(
  uuid: string
): Promise<ImageGeneration | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function getImageGenerationsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<ImageGeneration[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .eq("user_uuid", user_uuid)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return undefined;
  }

  return data;
}

export async function updateImageGenerationStatus(
  uuid: string,
  status: ImageGenerationStatus
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("image_generations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("uuid", uuid);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteImageGeneration(uuid: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("image_generations")
    .delete()
    .eq("uuid", uuid);

  if (error) {
    throw error;
  }

  return data;
}