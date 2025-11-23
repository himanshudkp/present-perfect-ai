"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Wand2,
  FileText,
  Edit3,
  Palette,
  Download,
  Users,
  Settings,
  HelpCircle,
  Book,
  Video,
  MessageCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Topics", icon: <Book className="w-4 h-4" /> },
    {
      id: "getting-started",
      label: "Getting Started",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "ai-generation",
      label: "AI Generation",
      icon: <Wand2 className="w-4 h-4" />,
    },
    { id: "editing", label: "Editing", icon: <Edit3 className="w-4 h-4" /> },
    {
      id: "themes",
      label: "Themes & Design",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "export",
      label: "Export & Share",
      icon: <Download className="w-4 h-4" />,
    },
    { id: "account", label: "Account", icon: <Settings className="w-4 h-4" /> },
  ];

  const guides = [
    {
      category: "getting-started",
      title: "How to Create Your First Presentation",
      description: "Step-by-step guide to creating your first presentation",
      icon: <Sparkles className="w-5 h-5" />,
      steps: [
        "Click 'New Project' from the dashboard",
        "Choose between AI generation or manual creation",
        "Enter your presentation topic or add slides manually",
        "Review and customize the generated outline",
        "Select a theme and start editing",
      ],
    },
    {
      category: "ai-generation",
      title: "Using AI to Generate Presentations",
      description: "Learn how to leverage AI for fast content creation",
      icon: <Wand2 className="w-5 h-5" />,
      steps: [
        "Select 'Generate with AI' from the create menu",
        "Enter a detailed description of your presentation topic",
        "Choose the number of slides you need",
        "Click 'Generate' and wait for AI to create your outline",
        "Edit individual slides or regenerate specific ones",
        "Finalize and select a theme",
      ],
    },
    {
      category: "getting-started",
      title: "Manual Slide Creation",
      description: "Build presentations from scratch with full control",
      icon: <FileText className="w-5 h-5" />,
      steps: [
        "Choose 'Create Manually' from the options",
        "Add slide titles one by one",
        "Use drag & drop to reorder slides",
        "Double-click any slide to edit its content",
        "Add or remove slides as needed",
      ],
    },
    {
      category: "editing",
      title: "Editing Slide Content",
      description: "How to modify and enhance your slides",
      icon: <Edit3 className="w-5 h-5" />,
      steps: [
        "Double-click any slide to enter edit mode",
        "Modify the title directly in the input field",
        "Press Enter to save or Escape to cancel",
        "Use the action menu (⋮) for more options",
        "Regenerate individual slides with AI",
      ],
    },
    {
      category: "editing",
      title: "Drag & Drop Reordering",
      description: "Rearrange slides in your presentation",
      icon: <Edit3 className="w-5 h-5" />,
      steps: [
        "Hover over any slide to see the drag handle",
        "Click and hold the drag handle",
        "Drag the slide to its new position",
        "Release to drop in place",
        "Slides automatically renumber",
      ],
    },
    {
      category: "themes",
      title: "Applying Themes",
      description: "Choose and customize presentation themes",
      icon: <Palette className="w-5 h-5" />,
      steps: [
        "After creating your outline, click 'Create Presentation'",
        "Browse available themes in the theme selector",
        "Preview themes by hovering over them",
        "Click to apply your chosen theme",
        "Customize colors and fonts in theme settings",
      ],
    },
    {
      category: "export",
      title: "Exporting Your Presentation",
      description: "Download and share your presentations",
      icon: <Download className="w-5 h-5" />,
      steps: [
        "Open your completed presentation",
        "Click the 'Export' button in the toolbar",
        "Choose your export format (PDF, PPTX, etc.)",
        "Select quality and options",
        "Download to your device",
      ],
    },
    {
      category: "account",
      title: "Managing Your Account",
      description: "Update settings and subscription",
      icon: <Settings className="w-5 h-5" />,
      steps: [
        "Click your profile picture in the sidebar",
        "Select 'Settings' from the menu",
        "Update your profile information",
        "Manage subscription and billing",
        "Configure preferences and notifications",
      ],
    },
  ];

  const faqs = [
    {
      question: "How does AI generation work?",
      answer:
        "Our AI analyzes your topic description and generates a structured outline with relevant slide titles. You can then edit, regenerate individual slides, or customize the content to match your needs perfectly.",
    },
    {
      question: "Can I edit AI-generated slides?",
      answer:
        "Absolutely! All AI-generated slides are fully editable. Double-click any slide to modify its content, or use the regenerate option to get alternative suggestions from the AI.",
    },
    {
      question: "How many presentations can I create?",
      answer:
        "Free users can create up to 3 presentations per month. Pro users have unlimited presentations. Check our pricing page for more details.",
    },
    {
      question: "What export formats are supported?",
      answer:
        "You can export your presentations as PDF, PowerPoint (PPTX), and Google Slides. Pro users also get access to additional formats and higher quality exports.",
    },
    {
      question: "Can I collaborate with my team?",
      answer:
        "Yes! Pro and Enterprise plans include team collaboration features, allowing multiple users to work on presentations together in real-time.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We take security seriously. All data is encrypted at rest and in transit. We comply with GDPR and other data protection regulations. Check our security page for details.",
    },
    {
      question: "How do I upgrade my subscription?",
      answer:
        "Click the 'Upgrade' button in your sidebar or go to Settings > Billing. You can upgrade, downgrade, or cancel your subscription at any time.",
    },
    {
      question: "What happens to my presentations if I cancel?",
      answer:
        "Your presentations remain accessible even after cancellation. However, AI generation and premium features will be disabled. You can always resubscribe to regain full access.",
    },
  ];

  const quickLinks = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: <Video className="w-6 h-6" />,
      href: "/help/videos",
      badge: "10+ videos",
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: <Users className="w-6 h-6" />,
      href: "/community",
      badge: "Active",
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "/support",
      badge: "24/7",
    },
    {
      title: "API Documentation",
      description: "Integrate with our API",
      icon: <Book className="w-6 h-6" />,
      href: "/api-docs",
      badge: "Developers",
    },
  ];

  const filteredGuides = guides.filter(
    (guide) =>
      (selectedCategory === "all" || guide.category === selectedCategory) &&
      (searchQuery === "" ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SlideAI Help</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-purple-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our docs, browse guides, or ask our community
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all bg-card group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {link.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase">
                  Categories
                </h3>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Guides */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Step-by-Step Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all bg-card"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {guide.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {guide.description}
                          </p>
                        </div>
                      </div>
                      <ol className="space-y-2">
                        {guide.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-sm">
                            <span className="font-semibold text-primary shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="text-muted-foreground">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-2 border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="w-5 h-5" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SlideAI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms
              </Link>
              <Link href="/status" className="hover:text-primary">
                Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpPage;
