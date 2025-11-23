"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Template = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

const templates: Template[] = [
  {
    id: "slide-deck",
    title: "Slide Deck Outline",
    description:
      "Generate a structured presentation outline for business or education.",
    tags: ["presentation", "education", "business"],
  },
  {
    id: "blog-post",
    title: "Blog Post Generator",
    description: "Create SEO-friendly blog structures with key talking points.",
    tags: ["content", "writing", "seo"],
  },
  {
    id: "marketing-email",
    title: "Marketing Email",
    description: "Generate high-converting email copy for campaigns.",
    tags: ["marketing", "email", "copywriting"],
  },
  {
    id: "project-plan",
    title: "Project Plan",
    description: "Generate a structured project plan with tasks and timeline.",
    tags: ["management", "planning"],
  },
  {
    id: "business-idea",
    title: "Business Idea Generator",
    description: "Get startup ideas, validation, and business model outlines.",
    tags: ["startup", "entrepreneur"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-8">Templates</h1>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Card
            key={t.id}
            className="hover:shadow-lg transition cursor-pointer group"
          >
            <CardHeader>
              <CardTitle className="group-hover:text-blue-600 transition">
                {t.title}
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>

              <div className="flex flex-wrap gap-2 mt-3">
                {t.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button className="mt-4 w-full">Use Template</Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
