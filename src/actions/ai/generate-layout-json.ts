"use server";

import type { Slide } from "@/types";
import {
  autoFillMissingSlides,
  buildSlidePrompt,
  repairJsonString,
  safeParseJson,
  validateSlidesWithZod,
} from "@/utils";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  GEMINI_CONFIG,
  initializeGemini,
  parseGeminiResponse,
  retryWithBackoff,
} from "./generative-ai-config";
import { replaceImagePlaceholders } from "./replace-image-placeholder";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const generateLayoutsJson = async (
  outlineArray: string[],
  {
    existingLayoutsSample,
    generateImageUrlFn,
  }: {
    existingLayoutsSample: Slide[];
    generateImageUrlFn: (prompt: string) => Promise<string>;
  }
) => {
  const prompt = buildSlidePrompt(outlineArray, existingLayoutsSample);

  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: {
        temperature: GEMINI_CONFIG.temperature,
        topK: GEMINI_CONFIG.topK,
        topP: GEMINI_CONFIG.topP,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
      },
      safetySettings,
    });

    const result = await retryWithBackoff(() => model.generateContent(prompt));
    const raw = result?.response?.text?.() ?? "";

    let parsed = parseGeminiResponse<Slide[]>(raw);

    if (!parsed || !Array.isArray(parsed)) {
      const repaired = repairJsonString(raw);
      parsed = safeParseJson<Slide[]>(repaired) ?? [];
    }

    const slidesCandidate = Array.isArray(parsed) ? (parsed as Slide[]) : [];
    const slidesFilled = autoFillMissingSlides(
      slidesCandidate as Slide[],
      outlineArray
    );

    const validation = validateSlidesWithZod(slidesFilled);
    if (!validation.ok) {
      console.error("Slide schema validation failed:", validation.errors);
      return {
        status: 500,
        error: "Invalid slide schema",
        details: validation.errors,
      };
    }

    const slides = validation.data as Slide[];

    try {
      await Promise.all(
        slides.map((s) => replaceImagePlaceholders(s, generateImageUrlFn))
      );
    } catch (err) {
      console.error(
        "Image replacement had errors (continuing with placeholders):",
        err
      );
    }

    if (slides.length !== outlineArray.length) {
      const final = autoFillMissingSlides(slides, outlineArray);
      return { status: 200, data: final };
    }

    return { status: 200, data: slides };
  } catch (err) {
    console.error("generateLayoutsJson error:", err);
    return { status: 500, error: "Unexpected error", details: err };
  }
};
