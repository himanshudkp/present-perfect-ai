import type { LucideIcon } from "lucide-react";

export interface Slide {
  id: string;
  slideName: string;
  type: string;
  content: ContentItem;
  slideOrder: number;
  className?: string;
}

export type ContentType =
  | "blank"
  | "imageAndText"
  | "heading1"
  | "heading2"
  | "heading3"
  | "title"
  | "heading4"
  | "table"
  | "blockquote"
  | "numberedList"
  | "bulletedList"
  | "code"
  | "link"
  | "quote"
  | "divider"
  | "calloutBox"
  | "todoList"
  | "bulletList"
  | "codeBlock"
  | "customButton"
  | "table"
  | "tableOfContents"
  | "image";

export interface ContentItem {
  id: string;
  type: ContentType;
  name: string;
  content:
    | ContentItem
    | string
    | string[]
    | string[][]
    | ContentItem[]
    | (string | ContentItem)[];
  initialRows?: number;
  initialColumns?: number;
  restrictToDrop?: boolean;
  columns?: number;
  placeholder?: string;
  className?: string;
  alt?: string;
  callOutType?: "success" | "warning" | "info" | "question" | "caution";
  link?: string;
  code?: string;
  language?: string;
  bgColor?: string;
  isTransparent?: boolean;
}

export interface Theme {
  name: string;
  fontFamily: string;
  fontColor: string;
  bgColor: string;
  slideBgColor: string;
  accentColor: string;
  gradientBgColor?: string;
  sidebarColor?: string;
  navbarColor?: string;
  type: "light" | "dark";
}

export interface OutlineCard {
  id: string;
  title: string;
  order: number;
}

export type Page =
  | "create"
  | "creative-ai"
  | "create-from-scratch"
  | "templates";

export type PromptHistory = {
  id: string;
  createdAt: string;
  title: string;
  outlines: OutlineCard[];
};

export type ActionCategory = "navigation" | "create" | "settings";

export interface Action {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  action: () => void;
  category: ActionCategory;
  keywords: string[];
  shortcut?: string;
}

export interface ProjectFilters {
  showDeleted: boolean;
  showPurchased: boolean;
  showSellable: boolean;
  showActive: boolean;
}

export interface ProjectsState {
  searchQuery: string;
  sortBy: SortOption;
  viewMode: ViewMode;
  activeTab: TabView;
  filters: ProjectFilters;
}

export type SortOption =
  | "recent"
  | "oldest"
  | "updated"
  | "name-asc"
  | "name-desc"
  | "slides";

export type ViewMode = "grid" | "compact" | "list";

export type TabView = "all" | "active" | "deleted" | "favorites";

export interface SlidesLayout {
  slideName: string;
  content: ContentItem;
  className?: string;
  type: string;
}

export interface DropItem {
  type: string;
  layoutType: string;
  component: SlidesLayout;
  index?: number;
}

export interface CreateOption {
  title: string;
  highlightedText: string;
  description: string;
  type: Page;
  highlight?: boolean;
}
