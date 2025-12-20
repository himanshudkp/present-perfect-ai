"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/env";
import type { ContentItem } from "@/types";

export type GenerationResult<T> = {
  status: number;
  data?: T;
  error?: string;
};

export type OutlineResponse = {
  outlines: string[];
  title?: string;
  description?: string;
};

export const GEMINI_CONFIG = {
  model: "gemini-2.0-flash",
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
  imageModel: "gemini-2.5-flash-image",
};

export const initializeGemini = () => {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables"
    );
  }

  return new GoogleGenerativeAI(apiKey);
};

export const parseGeminiResponse = <T>(text: string): T | null => {
  try {
    let cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON parsing error:", error);
    console.error("Raw text:", text);
    return null;
  }
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const backoffDelay = delay * Math.pow(2, i);
      console.info(`Retry ${i + 1}/${maxRetries} after ${backoffDelay}ms`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error("Max retries reached");
};

export const findImageComponent = async (
  node: ContentItem
): Promise<ContentItem[]> => {
  const images: ContentItem[] = [];
  if (!node) return images;

  if (node.type === "image") {
    images.push(node);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content)
      images.push(
        ...(await findImageComponent(child as unknown as ContentItem))
      );
    return images;
  }

  const c = node.content;
  if (c && typeof c === "object") {
    images.push(...(await findImageComponent(c)));
  }

  return images;
};
