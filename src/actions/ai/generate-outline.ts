"use server";

import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  GEMINI_CONFIG,
  GenerationResult,
  initializeGemini,
  OutlineResponse,
  parseGeminiResponse,
  retryWithBackoff,
} from "./generative-ai-config";

export const safetySettings = [
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

export const generateOutline = async (
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
