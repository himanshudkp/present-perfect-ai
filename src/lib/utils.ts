import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SlidesArraySchema } from "./schema";
import { CLEAN_JSON_PROMPT_SUFFIX, SLIDE_JSON_SCHEMA } from "./constants";
import type { Slide } from "@/lib/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getTimeAgo(
  dateInput: Date | string | number,
  withSuffix = true
) {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const suffix = withSuffix ? " ago" : "";

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1
        ? `${count} ${unit}${suffix}`
        : `${count} ${unit}s${suffix}`;
    }
  }

  return "just now";
}

export const stripCodeFences = (raw: string) =>
  (raw || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

export const extractFirstJsonBlock = (raw: string): string | null => {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = stripCodeFences(raw);
  const match = cleaned.match(/(\[[\s\S]*?\]|\{[\s\S]*?\})/);
  return match ? match[0] : null;
};

export const repairJsonString = (raw: string): string => {
  const firstBlock = extractFirstJsonBlock(raw);
  if (!firstBlock) return "";

  let s = firstBlock;

  s = s.replace(/\{\s*\{/g, "{").replace(/\[\s*\[/g, "[");

  s = s.replace(/,\s*([}\]])/g, "$1");

  s = s.replace(
    /"([A-Za-z0-9_]+)"\s*:\s*("[^"]*"|true|false|null|\d+)\s*,\s*"\1"\s*:/g,
    `"$1":`
  );

  const count = (ch: string) =>
    (s.match(new RegExp("\\" + ch, "g")) || []).length;
  const openCurly = count("{");
  const closeCurly = count("}");
  const openSquare = count("[");
  const closeSquare = count("]");

  if (openCurly > closeCurly) s += "}".repeat(openCurly - closeCurly);
  if (openSquare > closeSquare) s += "]".repeat(openSquare - closeSquare);

  return s;
};

export const safeParseJson = <T = any>(raw: string): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      const repaired = repairJsonString(raw);
      if (!repaired) return null;
      return JSON.parse(repaired) as T;
    } catch (err) {
      console.error("safeParseJson: failed after repair", err);
      return null;
    }
  }
};

export const parseGeminiResponse = <T = any>(text: string): T | null => {
  if (!text) return null;
  const first = extractFirstJsonBlock(text);
  if (!first) {
    return safeParseJson<T>(text);
  }
  try {
    return JSON.parse(first) as T;
  } catch {
    return safeParseJson<T>(first);
  }
};

export const validateSlidesWithZod = (candidate: unknown) => {
  const result = SlidesArraySchema.safeParse(candidate);
  if (!result.success) {
    return { ok: false, errors: result.error };
  }
  return { ok: true, data: result.data };
};

export const buildSlidePrompt = (
  outlineArray: string[],
  existingLayoutsSample: Slide[]
) => `
You are a JSON-only generator.

TASK:
Given the array of outline strings, produce EXACTLY ONE Slide object per outline.
Total slides must equal ${
  outlineArray.length
}. Slide at index i must correspond to the outline at index i.

DO NOT output anything other than the JSON array.

JSON SCHEMA (must follow):
${SLIDE_JSON_SCHEMA}

EXISTING LAYOUT EXAMPLES (use for style guidance):
${JSON.stringify(existingLayoutsSample, null, 2)}

OUTLINES:
${JSON.stringify(outlineArray, null, 2)}

${CLEAN_JSON_PROMPT_SUFFIX}
`;

export const autoFillMissingSlides = (
  slides: Slide[],
  outlineArray: string[]
): Slide[] => {
  const filled = slides ? [...slides] : [];
  while (filled.length < outlineArray.length) {
    const idx = filled.length;
    filled.push({
      id: crypto.randomUUID(),
      slideName: `Auto-generated: ${outlineArray[idx] || `Slide ${idx + 1}`}`,
      type: "title",
      slideOrder: idx + 1,
      content: {
        id: crypto.randomUUID(),
        type: "heading1",
        name: "Placeholder",
        content: `Auto-generated placeholder for outline: ${
          outlineArray[idx] || "missing"
        }`,
      } as any,
    });
  }
  return filled.slice(0, outlineArray.length);
};
