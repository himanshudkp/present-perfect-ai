"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { OutlineCard } from "@/types";
import { env } from "@/lib/env";

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

type SlideContent = {
  title: string;
  content: string;
  bulletPoints?: string[];
  notes?: string;
};

const GEMINI_CONFIG = {
  model: "gemini-2.0-flash",
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
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

    // const result = await retryWithBackoff(async () => {
    //   return await model.generateContent(enhancedPrompt);
    // });
    const text: OutlineResponse = {
      outlines: [
        "MERN Unveiled: Why Choose This Powerful Stack?",
        "Building Blocks: Mastering MERN Components",
        "MERN's Future: Trends and Career Paths",
      ],
      title: "MERN DEVEloper slides",
    };
    // const text = result.response.text();
    // const parsed = parseGeminiResponse<OutlineResponse>(text);

    // if (!parsed || !parsed.outlines || !Array.isArray(parsed.outlines)) {
    //   console.error("Invalid response structure:", text);
    //   return {
    //     status: 500,
    //     error: "AI returned invalid format. Please try again.",
    //   };
    // }

    // if (parsed.outlines.length < slideCount - 2) {
    //   return {
    //     status: 500,
    //     error: `Expected ${slideCount} slides but got ${parsed.outlines.length}`,
    //   };
    // }

    return {
      status: 200,
      data: text,
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

export const generateSlideContent = async (
  slideTitle: string,
  presentationContext: string,
  slideIndex: number,
  totalSlides: number
): Promise<GenerationResult<SlideContent>> => {
  try {
    if (!slideTitle?.trim() || !presentationContext?.trim()) {
      return {
        status: 400,
        error: "Slide title and context are required",
      };
    }

    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG,
      safetySettings,
    });

    const prompt = `
You are creating detailed content for slide ${
      slideIndex + 1
    } of ${totalSlides} in a presentation.

**Presentation Context:** ${presentationContext}
**Current Slide Title:** ${slideTitle}

Generate comprehensive content for this slide including:
1. An engaging title (can be refined from the original)
2. Main content/description (2-3 sentences)
3. 3-5 key bullet points
4. Speaker notes (optional, 1-2 sentences)

Return ONLY valid JSON:
{
  "title": "Refined slide title",
  "content": "Main description of the slide",
  "bulletPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "notes": "Speaker notes for this slide"
}
`;

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });

    const text = result.response.text();
    const parsed = parseGeminiResponse<SlideContent>(text);

    if (!parsed) {
      return {
        status: 500,
        error: "Failed to generate slide content",
      };
    }

    return {
      status: 200,
      data: parsed,
    };
  } catch (error: any) {
    console.error("Error in generateSlideContent:", error);
    return {
      status: 500,
      error: error.message || "Failed to generate slide content",
    };
  }
};

export const regenerateSlide = async (
  originalTitle: string,
  presentationContext: string,
  previousAttempts: string[] = []
): Promise<GenerationResult<{ title: string; alternatives: string[] }>> => {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: { ...GEMINI_CONFIG, temperature: 0.9 }, // Higher creativity
      safetySettings,
    });

    const prompt = `
Create alternative slide titles for a presentation.

**Context:** ${presentationContext}
**Original Title:** ${originalTitle}
${
  previousAttempts.length > 0
    ? `**Previous Attempts:** ${previousAttempts.join(", ")}`
    : ""
}

Generate 3 creative alternatives that:
- Convey the same key message
- Are more engaging or clearer
- Avoid repetition with previous attempts
- Stay professional and relevant

Return ONLY valid JSON:
{
  "title": "Best alternative title",
  "alternatives": [
    "Alternative 1",
    "Alternative 2",
    "Alternative 3"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseGeminiResponse<{
      title: string;
      alternatives: string[];
    }>(text);

    if (!parsed) {
      return {
        status: 500,
        error: "Failed to regenerate slide",
      };
    }

    return {
      status: 200,
      data: parsed,
    };
  } catch (error: any) {
    console.error("Error in regenerateSlide:", error);
    return {
      status: 500,
      error: error.message || "Failed to regenerate slide",
    };
  }
};

export const refineOutline = async (
  currentOutlines: OutlineCard[],
  userFeedback: string
): Promise<GenerationResult<OutlineResponse>> => {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG,
      safetySettings,
    });

    const currentTitles = currentOutlines
      .map((o) => `${o.order}. ${o.title}`)
      .join("\n");

    const prompt = `
Improve the following presentation outline based on user feedback.

**Current Outline:**
${currentTitles}

**User Feedback:** ${userFeedback}

Apply the feedback and return an improved outline with the same number of slides.
Maintain logical flow and ensure all slides are relevant.

Return ONLY valid JSON:
{
  "outlines": [
    "Improved slide 1",
    "Improved slide 2",
    ...
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseGeminiResponse<OutlineResponse>(text);

    if (!parsed || !parsed.outlines) {
      return {
        status: 500,
        error: "Failed to refine outline",
      };
    }

    return {
      status: 200,
      data: parsed,
    };
  } catch (error: any) {
    console.error("Error in refineOutline:", error);
    return {
      status: 500,
      error: error.message || "Failed to refine outline",
    };
  }
};

export const generatePresentationTitle = async (
  outlines: string[]
): Promise<GenerationResult<{ title: string; alternatives: string[] }>> => {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG,
      safetySettings,
    });

    const prompt = `
Based on these slide titles, generate a compelling main presentation title:

${outlines.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Create:
1. One main title (professional, clear, engaging - max 8 words)
2. Three alternative titles

Return ONLY valid JSON:
{
  "title": "Main Presentation Title",
  "alternatives": [
    "Alternative 1",
    "Alternative 2", 
    "Alternative 3"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseGeminiResponse<{
      title: string;
      alternatives: string[];
    }>(text);

    if (!parsed) {
      return {
        status: 500,
        error: "Failed to generate title",
      };
    }

    return {
      status: 200,
      data: parsed,
    };
  } catch (error: any) {
    console.error("Error in generatePresentationTitle:", error);
    return {
      status: 500,
      error: error.message || "Failed to generate title",
    };
  }
};
