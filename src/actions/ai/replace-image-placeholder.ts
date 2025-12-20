"use server";

import type { Slide } from "@/types";
import { findImageComponent } from "./generative-ai-config";

export const replaceImagePlaceholders = async (
  slide: Slide,
  generateImageUrlFn: (prompt: string) => Promise<string>
) => {
  const images = await findImageComponent(slide.content as any);
  if (!images.length) return;

  await Promise.all(
    images.map(async (img) => {
      try {
        const prompt =
          img.alt || `Professional presentation image for ${slide.slideName}`;
        const url = await generateImageUrlFn(prompt);
        if (url) {
          (img as any).content = url;
        } else {
          (img as any).content =
            (img as any).content || "https://via.placeholder.com/1024";
        }
      } catch (err) {
        console.error("Image generation failed", err);
        (img as any).content =
          (img as any).content || "https://via.placeholder.com/1024";
      }
    })
  );
};
