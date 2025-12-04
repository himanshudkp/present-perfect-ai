import { Home, LayoutTemplate, Settings2, Trash2 } from "lucide-react";
import type { ActionCategory, Slide, Theme } from "../types";

export const DATA = {
  user: {
    name: "Himanshu",
    email: "himanshudkp@gmail.com",
    avatar: "/globe.png",
  },
  navigation: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: LayoutTemplate,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

export const ITEM_VARIANTS = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
} as const;

export const THEMES: Theme[] = [
  {
    name: "Ocean Breeze",
    fontFamily: "'Inter', sans-serif",
    fontColor: "#012a36",
    bgColor: "#e0f7fa",
    slideBgColor: "#b2ebf2",
    accentColor: "#0288d1",
    navbarColor: "#b2ebf2",
    sidebarColor: "#e0f7fa",
    type: "light",
  },
  {
    name: "Forest Calm",
    fontFamily: "'Roboto', sans-serif",
    fontColor: "#0b3d0b",
    bgColor: "#e8f5e9",
    slideBgColor: "#c8e6c9",
    accentColor: "#2e7d32",
    navbarColor: "#c8e6c9",
    sidebarColor: "#e8f5e9",
    type: "light",
  },
  {
    name: "Sakura Bloom",
    fontFamily: "'Poppins', sans-serif",
    fontColor: "#3d0027",
    bgColor: "#ffe4ec",
    slideBgColor: "#ffd1e1",
    accentColor: "#ff5b99",
    navbarColor: "#ffd1e1",
    sidebarColor: "#ffe4ec",
    type: "light",
  },
  {
    name: "Midnight Purple",
    fontFamily: "'Playfair Display', serif",
    fontColor: "#ffffff",
    bgColor: "#1a1528",
    slideBgColor: "#241b36",
    accentColor: "#a855f7",
    navbarColor: "#241b36",
    sidebarColor: "#1a1528",
    type: "dark",
  },
  {
    name: "Sunset Ember",
    fontFamily: "'Raleway', sans-serif",
    fontColor: "#ffffff",
    bgColor: "#2a0f0f",
    slideBgColor: "#3a1414",
    accentColor: "#ff6f3c",
    gradientBgColor: "linear-gradient(135deg, #3a1414 0%, #ff6f3c 100%)",
    navbarColor: "#3a1414",
    sidebarColor: "#2a0f0f",
    type: "dark",
  },
  {
    name: "Arctic White",
    fontFamily: "'Inter', sans-serif",
    fontColor: "#0f172a",
    bgColor: "#ffffff",
    slideBgColor: "#f1f5f9",
    accentColor: "#3b82f6",
    navbarColor: "#f1f5f9",
    sidebarColor: "#ffffff",
    type: "light",
  },
  {
    name: "Autumn Vintage",
    fontFamily: "'Merriweather', serif",
    fontColor: "#3d2a1a",
    bgColor: "#f6efe7",
    slideBgColor: "#f2e6d8",
    accentColor: "#d2691e",
    navbarColor: "#f2e6d8",
    sidebarColor: "#f6efe7",
    type: "light",
  },
  {
    name: "Neon Ice",
    fontFamily: "'Sora', sans-serif",
    fontColor: "#e0f7ff",
    bgColor: "#0a0f1f",
    slideBgColor: "#11182b",
    accentColor: "#00e5ff",
    navbarColor: "#11182b",
    sidebarColor: "#0a0f1f",
    type: "dark",
  },
  {
    name: "Coffee Cream",
    fontFamily: "'Nunito', sans-serif",
    fontColor: "#3c2f2f",
    bgColor: "#faf3e0",
    slideBgColor: "#f2e8cf",
    accentColor: "#c08552",
    navbarColor: "#f2e8cf",
    sidebarColor: "#faf3e0",
    type: "light",
  },
];

export const DEFAULT_THEME: Theme = {
  name: "Sunset Ember",
  fontFamily: "'Raleway', sans-serif",
  fontColor: "#ffffff",
  bgColor: "#2a0f0f",
  slideBgColor: "#3a1414",
  accentColor: "#ff6f3c",
  gradientBgColor: "linear-gradient(135deg, #3a1414 0%, #ff6f3c 100%)",
  navbarColor: "#3a1414",
  sidebarColor: "#2a0f0f",
  type: "dark",
};

export const CREATE_PAGE_CARD = [
  {
    title: "Use a ",
    highlightedText: "Template",
    description: "Write a prompt and leave everything else for us to handle.",
    type: "template",
  },
  {
    title: "Generate with ",
    highlightedText: "Creative AI",
    description: "Write a prompt and leave everything else for us to handle.",
    type: "creative-ai",
    highlight: true,
  },
  {
    title: "Start from ",
    highlightedText: "Scratch",
    description: "Write a prompt and leave everything else for us to handle.",
    type: "create-from-scratch",
  },
];

export const CATEGORY_LABELS: Record<ActionCategory, string> = {
  navigation: "Navigation",
  create: "Create New",
  settings: "Settings",
};

export const CATEGORY_ORDER: ActionCategory[] = [
  "create",
  "navigation",
  "settings",
];

export const GRID_CLASSES = {
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  compact:
    "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
  list: "flex flex-col gap-3",
} as const;

export const EXISTING_LAYOUTS: Slide[] = [
  {
    id: crypto.randomUUID(),
    slideName: "Image & Text Intro",
    type: "imageAndText",
    slideOrder: 1,
    className: "p-6 flex items-center gap-6",
    content: {
      id: crypto.randomUUID(),
      type: "imageAndText",
      name: "Root",
      content: [
        {
          id: crypto.randomUUID(),
          type: "image",
          name: "Hero Image",
          className: "rounded w-1/2",
          content:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          alt: "Hero",
        },
        {
          id: crypto.randomUUID(),
          type: "heading1",
          name: "Main Heading",
          content: "Welcome to the Layout System",
        },
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Simple Title",
    type: "title",
    slideOrder: 2,
    content: {
      id: crypto.randomUUID(),
      type: "title",
      name: "Title Block",
      className: "text-4xl font-bold",
      content: "Presentation Title",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Subtitle Slide",
    type: "heading2",
    slideOrder: 3,
    content: {
      id: crypto.randomUUID(),
      type: "heading2",
      name: "Subtitle",
      className: "text-2xl",
      content: "A modern slide system",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Table Example",
    type: "table",
    slideOrder: 4,
    content: {
      id: crypto.randomUUID(),
      type: "table",
      name: "Data Table",
      content: [
        ["Name", "Age", "Location"],
        ["John", "28", "New York"],
        ["Sarah", "32", "Berlin"],
        ["Kunal", "26", "Bangalore"],
      ],
      initialColumns: 3,
      initialRows: 4,
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Bullet List",
    type: "bulletedList",
    slideOrder: 5,
    content: {
      id: crypto.randomUUID(),
      type: "bulletedList",
      name: "List Items",
      content: [
        "High performance components",
        "Nested layout engine",
        "Drag-and-drop ready",
        "Fully typed",
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Numbered List",
    type: "numberedList",
    slideOrder: 6,
    content: {
      id: crypto.randomUUID(),
      type: "numberedList",
      name: "Steps",
      content: [
        "Define layout",
        "Add components",
        "Customize theme",
        "Export results",
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Blockquote",
    type: "blockquote",
    slideOrder: 7,
    content: {
      id: crypto.randomUUID(),
      type: "blockquote",
      name: "Quote",
      content: "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Code Snippet",
    type: "codeBlock",
    slideOrder: 8,
    content: {
      id: crypto.randomUUID(),
      type: "codeBlock",
      name: "Code",
      language: "ts",
      code: `function greet(name: string) { return "Hello " + name; }`,
      content: "",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Callout Warning",
    type: "calloutBox",
    slideOrder: 9,
    content: {
      id: crypto.randomUUID(),
      type: "calloutBox",
      name: "Warning",
      callOutType: "warning",
      content: "Make sure to save your work frequently.",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Callout Info",
    type: "calloutBox",
    slideOrder: 10,
    content: {
      id: crypto.randomUUID(),
      type: "calloutBox",
      name: "Information",
      callOutType: "info",
      content: "This layout system supports nested components.",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Deep Nested Example",
    type: "imageAndText",
    slideOrder: 11,
    content: {
      id: crypto.randomUUID(),
      type: "imageAndText",
      name: "Root",
      content: [
        {
          id: crypto.randomUUID(),
          type: "heading3",
          name: "Section",
          content: "Deep Nested Structure",
        },
        {
          id: crypto.randomUUID(),
          type: "blank",
          name: "Nested Wrapper",
          content: [
            {
              id: crypto.randomUUID(),
              type: "heading4",
              name: "Level 2",
              content: "Second Level Header",
            },
            {
              id: crypto.randomUUID(),
              type: "image",
              name: "Deep Image",
              content:
                "https://images.unsplash.com/photo-1557683304-673a23048d34",
              alt: "Nested Photo",
            },
            {
              id: crypto.randomUUID(),
              type: "blank",
              name: "Level 3 Wrapper",
              content: [
                {
                  id: crypto.randomUUID(),
                  type: "code",
                  name: "Code",
                  code: "console.log('Deep level');",
                  content: "",
                },
                {
                  id: crypto.randomUUID(),
                  type: "quote",
                  name: "Quote",
                  content: "Depth creates complexity.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Link Example",
    type: "link",
    slideOrder: 12,
    content: {
      id: crypto.randomUUID(),
      type: "link",
      name: "External Link",
      link: "https://example.com",
      content: "Visit Example.com",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Divider",
    type: "divider",
    slideOrder: 13,
    content: {
      id: crypto.randomUUID(),
      type: "divider",
      name: "Divider",
      content: "",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Transparent Image",
    type: "image",
    slideOrder: 14,
    content: {
      id: crypto.randomUUID(),
      type: "image",
      name: "Transparent Image",
      isTransparent: true,
      content: "https://images.unsplash.com/photo-1495326968368-684daeb2a94b",
      alt: "Transparent",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Custom Button",
    type: "customButton",
    slideOrder: 15,
    content: {
      id: crypto.randomUUID(),
      type: "customButton",
      name: "Button",
      content: "Click Me",
      bgColor: "#4f46e5",
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Todo List",
    type: "todoList",
    slideOrder: 16,
    content: {
      id: crypto.randomUUID(),
      type: "todoList",
      name: "Tasks",
      content: [
        "Create wireframes",
        "Build layout engine",
        "Test nested drops",
        "Deploy",
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Gallery Row",
    type: "imageAndText",
    slideOrder: 17,
    content: {
      id: crypto.randomUUID(),
      type: "imageAndText",
      name: "Gallery",
      content: [
        {
          id: crypto.randomUUID(),
          type: "image",
          name: "Pic1",
          content:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
          alt: "1",
        },
        {
          id: crypto.randomUUID(),
          type: "image",
          name: "Pic2",
          content:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
          alt: "2",
        },
        {
          id: crypto.randomUUID(),
          type: "image",
          name: "Pic3",
          content:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
          alt: "3",
        },
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Two Column Text",
    type: "blank",
    slideOrder: 18,
    content: {
      id: crypto.randomUUID(),
      type: "blank",
      name: "Two Columns",
      content: [
        {
          id: crypto.randomUUID(),
          type: "heading2",
          name: "Left Title",
          content: "Left Column",
        },
        {
          id: crypto.randomUUID(),
          type: "heading2",
          name: "Right Title",
          content: "Right Column",
        },
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Mixed Media",
    type: "blank",
    slideOrder: 19,
    content: {
      id: crypto.randomUUID(),
      type: "blank",
      name: "Mixed",
      content: [
        {
          id: crypto.randomUUID(),
          type: "table",
          name: "Paragraph",
          content: "A block of descriptive content...",
        },
        {
          id: crypto.randomUUID(),
          type: "image",
          name: "Inline Image",
          content:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
          alt: "Inline",
        },
        {
          id: crypto.randomUUID(),
          type: "numberedList",
          name: "Steps",
          content: ["Step 1", "Step 2", "Step 3"],
        },
      ],
    },
  },
  {
    id: crypto.randomUUID(),
    slideName: "Simple Paragraph",
    type: "quote",
    slideOrder: 20,
    content: {
      id: crypto.randomUUID(),
      type: "quote",
      name: "Quote",
      content:
        "The beginning of knowledge is the discovery of something we do not understand.",
    },
  },
];

export const SLIDE_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id","slideName","type","slideOrder","content"],
    "properties": {
      "id": {"type":"string"},
      "slideName": {"type":"string"},
      "type": {"type":"string"},
      "slideOrder": {"type":"number"},
      "className": {"type":"string"},
      "content": { "type": "object" }
    }
  }
}`;

export const CLEAN_JSON_PROMPT_SUFFIX = `
STRICT JSON RULES:
- OUTPUT MUST be ONLY valid JSON (no markdown, no backticks, no commentary).
- Output MUST be a JSON ARRAY and length MUST equal the number of outlines provided.
- The slides must follow the structure of the schema provided above.
`;
