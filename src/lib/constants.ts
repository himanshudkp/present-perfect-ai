import { Home, LayoutTemplate, Settings2, Trash2 } from "lucide-react";
import { Theme } from "./types";

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

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

export const itemVariants = {
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
    type: "create-scratch",
  },
];
