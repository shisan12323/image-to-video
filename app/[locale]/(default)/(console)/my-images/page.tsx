import { getImageGenerationsByUserUuid } from "@/models/image-generation";
import { getUserUuid } from "@/services/user";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Empty from "@/components/blocks/empty";
import { ImageGeneration } from "@/types/image-generation";
import ImageCard from "@/components/image-history/image-card";

export default async function MyImagesPage() {
  const t = await getTranslations();
  const user_uuid = await getUserUuid();

  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/my-images`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const imageGenerations = await getImageGenerationsByUserUuid(user_uuid);

  if (!imageGenerations || imageGenerations.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {t("my_images.title")}
        </h1>
        <Empty message={t("my_images.no_images")} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {t("my_images.title")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageGenerations.map((generation: ImageGeneration) => (
          <ImageCard key={generation.uuid} generation={generation} />
        ))}
      </div>
    </div>
  );
}