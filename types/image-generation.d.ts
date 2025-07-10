export interface ImageGeneration {
  uuid: string;
  user_uuid: string;
  original_image_url?: string;
  generated_image_url: string;
  theme: string;
  elements?: string;
  status: string;
  credits_used: number;
  created_at: string;
  updated_at: string;
}