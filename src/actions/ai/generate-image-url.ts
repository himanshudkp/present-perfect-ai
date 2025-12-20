"use server";

import {
  GenerateContentCandidate,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  GEMINI_CONFIG,
  initializeGemini,
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

export const generateImageUrl = async (prompt: string): Promise<string> => {
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
