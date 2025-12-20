import { z } from "zod";
import type { ContentItem } from "@/types";

const ContentItemSchema: z.ZodType<ContentItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum([
      "heading1",
      "heading2",
      "heading3",
      "title",
      "heading4",
      "table",
      "blockquote",
      "numberedList",
      "divider",
      "calloutBox",
      "todoList",
      "bulletList",
      "codeBlock",
      "tableOfContents",
      "resizable-column",
      "column",
      "paragraph",
      "image",
    ]),
    name: z.string(),
    content: z.union([
      ContentItemSchema,
      z.string(),
      z.array(z.string()),
      z.array(z.array(z.string())),
      z.array(ContentItemSchema),
    ]),
    initialRows: z.number().optional(),
    initialColumns: z.number().optional(),
    restrictToDrop: z.boolean().optional(),
    columns: z.number().optional(),
    placeholder: z.string().optional(),
    className: z.string().optional(),
    alt: z.string().optional(),
    callOutType: z
      .union([
        z.literal("success"),
        z.literal("warning"),
        z.literal("info"),
        z.literal("question"),
        z.literal("caution"),
      ])
      .optional(),
    link: z.string().optional(),
    code: z.string().optional(),
    language: z.string().optional(),
    bgColor: z.string().optional(),
    isTransparent: z.boolean().optional(),
  })
);

const SlideSchema = z.object({
  id: z.string(),
  slideName: z.string(),
  type: z.string(),
  content: ContentItemSchema,
  slideOrder: z.number(),
  className: z.string().optional(),
});

export const SlidesArraySchema = z.array(SlideSchema);
