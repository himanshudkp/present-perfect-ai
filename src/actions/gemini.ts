"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentCandidate,
} from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import {
  autoFillMissingSlides,
  buildSlidePrompt,
  repairJsonString,
  safeParseJson,
  validateSlidesWithZod,
} from "@/lib/utils";
import { EXISTING_LAYOUTS } from "@/lib/constants";
import type { ContentItem, Slide } from "@/lib/types";

type GenerationResult<T> = {
  status: number;
  data?: T;
  error?: string;
};

type OutlineResponse = {
  outlines: string[];
  title?: string;
  description?: string;
};

const GEMINI_CONFIG = {
  model: "gemini-2.0-flash",
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
  imageModel: "gemini-2.5-flash-image",
};

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

const initializeGemini = () => {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables"
    );
  }

  return new GoogleGenerativeAI(apiKey);
};

const parseGeminiResponse = <T>(text: string): T | null => {
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

const retryWithBackoff = async <T>(
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

export const generateCreativePrompt = async (
  userPrompt: string,
  slideCount: number = 6
): Promise<GenerationResult<OutlineResponse>> => {
  try {
    if (!userPrompt?.trim()) {
      return {
        status: 400,
        error: "Prompt cannot be empty",
      };
    }

    if (slideCount < 3 || slideCount > 30) {
      return {
        status: 400,
        error: "Slide count must be between 3 and 30",
      };
    }

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

    const enhancedPrompt = `
You are an expert presentation designer. Create a professional presentation outline based on the following topic:

**Topic:** ${userPrompt}

**Requirements:**
- Generate exactly ${slideCount} slide titles
- Each title should be clear, concise, and engaging
- Follow a logical flow: Introduction → Main Content → Conclusion
- Make titles action-oriented and specific
- Ensure proper coverage of the topic
- Include a compelling opening and strong closing

**Output Format:**
Return ONLY valid JSON with this exact structure:
{
  "title": "Main presentation title",
  "description": "Brief 1-2 sentence description",
  "outlines": [
    "Point 1",
    "Point 2",
    ...
  ]
}

Do not include any markdown formatting, explanations, or additional text outside the JSON.
`;

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(enhancedPrompt);
    });

    const text = result.response.text();
    const parsed = parseGeminiResponse<OutlineResponse>(text);

    if (!parsed || !parsed.outlines || !Array.isArray(parsed.outlines)) {
      console.error("Invalid response structure:", text);
      return {
        status: 500,
        error: "AI returned invalid format. Please try again.",
      };
    }

    if (parsed.outlines.length < slideCount - 2) {
      return {
        status: 500,
        error: `Expected ${slideCount} slides but got ${parsed.outlines.length}`,
      };
    }

    return {
      status: 200,
      data: parsed,
    };
  } catch (error: any) {
    console.error("Error in generateCreativePrompt:", error);

    if (error.message?.includes("API key")) {
      return {
        status: 500,
        error: "API key configuration error",
      };
    }

    if (error.message?.includes("quota")) {
      return {
        status: 429,
        error: "API quota exceeded. Please try again later.",
      };
    }

    return {
      status: 500,
      error: error.message || "Failed to generate outline. Please try again.",
    };
  }
};

const generateImageUrl = async (prompt: string): Promise<string> => {
  try {
    const improvedPrompt = `
Create a highly realistic, professional image based on the
following description. The image should look as if captured in
real life, with attention to detail, lighting, and texture.

Description: ${prompt}

Important Notes:
- The image must be in a photorealistic style and visually
  compelling.
- Ensure all text, signs, or visible writing in the image are in
  English.
- Pay special attention to lighting, shadows, and textures to make
  the image as lifelike as possible.
- Avoid elements that appear abstract, cartoonish, or overly
  artistic. The image should be suitable for professional
  presentations.
- Focus on accurately depicting the concept described, including
  specific objects, environment, mood, and context. Maintain
  relevance to the description provided.

Example Use Cases: Business presentations, educational slides,
professional designs.
`;

    const genAI = initializeGemini();

    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.imageModel,
      generationConfig: {
        temperature: GEMINI_CONFIG.temperature,
        topK: GEMINI_CONFIG.topK,
        topP: GEMINI_CONFIG.topP,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
      },
      safetySettings,
    });
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(improvedPrompt);
    });

    const candidates = result.response.candidates as GenerateContentCandidate[];

    let imageDataUrl: string = "";

    for (const part of candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        imageDataUrl = `data:image/png;base64,${imageData}`;
        console.log("generateImageUrl - imageDataUrl ", imageDataUrl);
      }
    }

    return imageDataUrl || "https://via.placeholder.com/1024";
  } catch (error) {
    console.error("Failed to generate image: ", error);
    return "https://via.placeholder.com/1024";
  }
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

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const user = await currentUser();
    if (!user) return { status: 401, error: "User not authenticated" };

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return { status: 403, error: "User does not exist" };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return {
        status: 400,
        error: "Project does not have any outlines",
      };
    }

    const slides = await generateLayoutsJson(project.outlines, {
      existingLayoutsSample: EXISTING_LAYOUTS,
      generateImageUrlFn: generateImageUrl,
    });

    if (!slides || !slides.data) {
      return {
        status: 500,
        error: "Failed to generate slides",
      };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        slides: JSON.stringify(slides.data),
        theme: theme,
        updatedAt: new Date(),
      },
    });

    return {
      status: 200,
      data: updated.slides,
    };
  } catch (error) {
    console.error("Error in generateLayouts():", error);
    return { status: 500, error: "Unexpected server error", data: [] };
  }
};
