"use client";

import { ImageGeneration } from "@/types/image-generation";
import { useTranslations } from "next-intl";
import moment from "moment";

interface ImageCardProps {
  generation: ImageGeneration;
}

export default function ImageCard({ generation }: ImageCardProps) {
  const t = useTranslations();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generation.generated_image_url;
    link.download = `garden-design-${generation.theme}-${generation.uuid}.png`;
    link.target = '_blank';
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generation.generated_image_url);
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy image URL:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={generation.generated_image_url}
          alt={`${generation.theme} garden design`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg capitalize">{generation.theme}</h3>
          <span className={`px-2 py-1 rounded text-xs ${
            generation.status === 'completed' ? 'bg-green-100 text-green-800' :
            generation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {generation.status}
          </span>
        </div>
        {generation.elements && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Elements:</strong> {generation.elements}
          </p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{moment(generation.created_at).format("YYYY-MM-DD HH:mm")}</span>
          <span>{generation.credits_used} credits</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            {t("my_images.download")}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            {t("my_images.copy")}
          </button>
        </div>
      </div>
    </div>
  );
}