"use client";

import { useCreativeAiStore } from "@/store/use-creative-ai-store";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/utils/constants";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Loader2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Wand2,
  Plus,
  FileText,
  ListPlus,
  Save,
  CheckCircle,
  Info,
} from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CardList from "./card-list";
import { usePromptStore } from "@/store/use-prompt-store";
import RecentPrompts from "./recent-prompts";
import { toast } from "sonner";
import { generateCreativePrompt, regenerateSlide } from "@/actions/gemini";
import { cn } from "@/utils/utils";
import { OutlineCard } from "@/types";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/use-slide-store";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  onBack: () => void;
};

const CreateWithAI = ({ onBack }: Props) => {
  const router = useRouter();

  // State management
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [noOfCards, setNoOfCards] = useState("6");
  const [isCreating, setIsCreating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [manualSlideTitle, setManualSlideTitle] = useState("");
  const [presentationTitle, setPresentationTitle] = useState("");
  const [presentationDescription, setPresentationDescription] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkSlides, setBulkSlides] = useState("");

  // Store hooks
  const {
    currentAIPrompt,
    setCurrentAIPrompt,
    outlines,
    resetOutlines,
    addMultipleOutlines,
    updateOutline,
    addOutline,
  } = useCreativeAiStore();

  const { prompts, addPrompt } = usePromptStore();
  const { setProject, setSlides, slides } = useSlideStore();

  // Computed values
  const cardCount = outlines.length;
  const isReady = cardCount > 0 && presentationTitle.trim().length > 0;
  const canAddManualSlide = manualSlideTitle.trim().length > 0;
  const hasGeneratedSlides = cardCount > 0 && currentAIPrompt.trim().length > 0;

  // Handler: Back navigation with confirmation
  const handleBack = useCallback(() => {
    if (
      outlines.length > 0 ||
      presentationTitle.trim() ||
      currentAIPrompt.trim()
    ) {
      const confirmed = window.confirm(
        "You have unsaved slides. Are you sure you want to go back?"
      );
      if (!confirmed) return;
    }
    resetOutlines();
    setCurrentAIPrompt("");
    setManualSlideTitle("");
    setPresentationTitle("");
    setPresentationDescription("");
    onBack();
  }, [
    onBack,
    outlines.length,
    resetOutlines,
    setCurrentAIPrompt,
    presentationTitle,
    currentAIPrompt,
  ]);

  // Handler: Reset all slides with confirmation
  const resetCards = useCallback(() => {
    if (showResetConfirm) {
      setEditingCard(null);
      setSelectedCard(null);
      setEditText("");
      setCurrentAIPrompt("");
      setManualSlideTitle("");
      setPresentationTitle("");
      setPresentationDescription("");
      resetOutlines();
      setNoOfCards("6");
      setShowResetConfirm(false);
      toast.success("All data cleared");
    } else {
      if (
        outlines.length > 0 ||
        currentAIPrompt.trim() ||
        presentationTitle.trim()
      ) {
        setShowResetConfirm(true);
        setTimeout(() => setShowResetConfirm(false), 3000);
      }
    }
  }, [
    setCurrentAIPrompt,
    resetOutlines,
    outlines.length,
    showResetConfirm,
    currentAIPrompt,
    presentationTitle,
  ]);

  // Handler: Generate outline with AI
  const generateOutline = useCallback(async () => {
    if (!currentAIPrompt.trim()) {
      toast.error("Please enter a prompt", {
        description: "Describe what you'd like to create",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      setGenerationProgress(20);

      const result = await generateCreativePrompt(
        currentAIPrompt,
        parseInt(noOfCards)
      );

      setGenerationProgress(60);

      if (result.status === 200 && result.data?.outlines) {
        const cards: OutlineCard[] = result.data.outlines.map(
          (title: string, index: number) => ({
            id: crypto.randomUUID(),
            title: title.trim(),
            order: index + 1,
          })
        );

        setGenerationProgress(90);
        addMultipleOutlines(cards);
        setNoOfCards(cards.length.toString());
        setGenerationProgress(100);

        toast.success("Outline generated!", {
          description: `Created ${cards.length} slides`,
        });

        // Auto-set presentation title from AI response
        if (result.data.title && !presentationTitle.trim()) {
          setPresentationTitle(result.data.title);
        }

        setTimeout(() => setGenerationProgress(0), 500);
      } else {
        toast.error("Generation failed", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Something went wrong", {
        description: "Failed to generate outline. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [currentAIPrompt, noOfCards, addMultipleOutlines, presentationTitle]);

  // Handler: Add manual slide
  const handleAddManualSlide = useCallback(() => {
    if (!canAddManualSlide) {
      toast.error("Please enter a slide title");
      return;
    }

    const newCard: OutlineCard = {
      id: crypto.randomUUID(),
      title: manualSlideTitle.trim(),
      order: outlines.length + 1,
    };

    addOutline(newCard);
    setManualSlideTitle("");
    toast.success(`"${newCard.title}" added successfully`);
  }, [canAddManualSlide, manualSlideTitle, outlines.length, addOutline]);

  // Handler: Bulk add slides
  const handleBulkAdd = useCallback(() => {
    if (!bulkSlides.trim()) {
      toast.error("Please enter slide titles");
      return;
    }

    const lines = bulkSlides
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      toast.error("No valid slide titles found");
      return;
    }

    const newCards: OutlineCard[] = lines.map((title, index) => ({
      id: crypto.randomUUID(),
      title,
      order: outlines.length + index + 1,
    }));

    const updatedCards = [...outlines, ...newCards].map((card, idx) => ({
      ...card,
      order: idx + 1,
    }));

    addMultipleOutlines(updatedCards);
    setBulkSlides("");
    setShowBulkAdd(false);
    toast.success(`Added ${newCards.length} slides`);
  }, [bulkSlides, outlines, addMultipleOutlines]);

  // Handler: Regenerate specific slide
  const handleRegenerateSlide = useCallback(
    async (slideId: string) => {
      const slide = outlines.find((s) => s.id === slideId);
      if (!slide) return;

      setRegeneratingId(slideId);

      try {
        const previousTitles = outlines
          .filter((s) => s.id !== slideId)
          .map((s) => s.title);

        const result = await regenerateSlide(
          slide.title,
          currentAIPrompt || presentationTitle || "Presentation slides",
          previousTitles
        );

        if (result.status === 200 && result.data?.title) {
          updateOutline(slideId, { title: result.data.title });
          toast.success("Slide regenerated!", {
            description: "Try regenerating again for more options",
          });
        } else {
          toast.error("Regeneration failed", {
            description: result.error || "Please try again",
          });
        }
      } catch (error) {
        console.error("Regeneration error:", error);
        toast.error("Failed to regenerate slide");
      } finally {
        setRegeneratingId(null);
      }
    },
    [outlines, currentAIPrompt, updateOutline, presentationTitle]
  );

  // Handler: Create presentation
  const handleCreatePresentation = useCallback(async () => {
    if (!isReady) {
      if (!presentationTitle.trim()) {
        console.log("presentationTitle");
        toast.error("Please enter a presentation title");
        return;
      }
      if (outlines.length === 0) {
        console.log("outlines.length");
        toast.error("Please generate or add slides");
        return;
      }
      return;
    }

    console.log("Outer");

    setIsCreating(true);

    try {
      const res = await createProject(presentationTitle.trim(), outlines);

      if (res.status !== 200 || !res.data) {
        toast.error("Failed to create presentation", {
          description: res.error || "Please try again",
        });
        return;
      }

      setProject(res.data);

      // if (res.data.outlines) {
      //   setSlides(JSON.parse(JSON.stringify(res.data.outlines)));
      //   console.log({ slides });
      // }

      // Save to prompt history
      addPrompt({
        id: crypto.randomUUID(),
        title: presentationTitle,
        outlines: outlines.map(({ id, title, order }) => ({
          id,
          title,
          order,
        })),
        createdAt: new Date().toISOString(),
      });

      resetOutlines();
      setCurrentAIPrompt("");
      setManualSlideTitle("");
      setPresentationTitle("");
      setPresentationDescription("");

      toast.success("Presentation created!", {
        description: "Redirecting to theme selection...",
      });

      router.push(`/presentation/${res.data.id}/select-theme`);
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Failed to create presentation", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsCreating(false);
    }
  }, [
    isReady,
    outlines,
    presentationTitle,
    router,
    setProject,
    setSlides,
    addPrompt,
    resetOutlines,
    setCurrentAIPrompt,
  ]);

  // Handler: Card selection
  const handleCardSelect = useCallback((id: string) => {
    setSelectedCard(id);
  }, []);

  // Handler: Card double-click (edit)
  const handleCardDoubleClick = useCallback((id: string, title: string) => {
    setEditingCard(id);
    setEditText(title);
    setSelectedCard(id);
  }, []);

  // Handler: Quick example selection
  const handleQuickExample = useCallback((example: string) => {
    setManualSlideTitle(example);
  }, []);

  // Handler: Save draft
  const handleSaveDraft = useCallback(() => {
    if (!cardCount && !presentationTitle.trim() && !currentAIPrompt.trim()) {
      toast.error("Nothing to save");
      return;
    }
    toast.success("Draft saved locally");
  }, [cardCount, presentationTitle, currentAIPrompt]);

  return (
    <motion.div
      className="space-y-6 w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.button
        variants={ITEM_VARIANTS}
        onClick={handleBack}
        disabled={isGenerating || isCreating}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm font-medium text-muted-foreground hover:text-foreground",
          "hover:bg-muted transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </motion.button>

      {/* Header */}
      <motion.div variants={ITEM_VARIANTS} className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            AI-Powered Creation
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Generate with{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Creative AI
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Let AI generate your outline, then customize with manual edits and
          refinements
        </p>
      </motion.div>

      {/* Presentation Details Section */}
      <motion.div variants={ITEM_VARIANTS}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Presentation Details
            </CardTitle>
            <CardDescription>
              Set your presentation title and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Presentation Title *
              </label>
              <Input
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                placeholder="E.g., Digital Marketing Strategy 2025"
                className="text-base"
                disabled={isGenerating || isCreating}
              />
              <p className="text-xs text-muted-foreground">
                AI can auto-fill this from your prompt
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Description (Optional)
              </label>
              <Textarea
                value={presentationDescription}
                onChange={(e) => setPresentationDescription(e.target.value)}
                placeholder="Brief description of your presentation..."
                className="text-sm resize-none"
                rows={2}
                disabled={isGenerating || isCreating}
              />
            </div>

            {presentationTitle.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Title set</span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Generation Section */}
      <motion.div
        className={cn(
          "p-6 rounded-xl border-2 transition-all duration-200",
          currentAIPrompt.trim()
            ? "border-primary/50 bg-primary/5"
            : "border-border/50 bg-muted/30 hover:border-border"
        )}
        variants={ITEM_VARIANTS}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              AI Generation
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Describe Your Presentation
            </label>
            <Input
              value={currentAIPrompt || ""}
              onChange={(e) => setCurrentAIPrompt(e.target.value)}
              placeholder="E.g., Create a presentation about digital marketing trends for Q1 2025..."
              className={cn(
                "text-base border-0 focus-visible:ring-2",
                "focus-visible:ring-primary rounded-lg",
                "bg-background",
                "placeholder:text-muted-foreground/60"
              )}
              disabled={isGenerating || isCreating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateOutline();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your topic, audience, and key points. Press
              Enter to generate.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-semibold text-foreground block">
                Number of Slides
              </label>
              <Select
                value={noOfCards}
                onValueChange={setNoOfCards}
                disabled={isGenerating || isCreating}
              >
                <SelectTrigger className="w-full sm:w-32 rounded-lg">
                  <SelectValue placeholder="Select slides" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {[3, 5, 6, 7, 10, 15, 20].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Slide" : "Slides"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={generateOutline}
                disabled={!currentAIPrompt.trim() || isGenerating || isCreating}
                className={cn(
                  "flex-1 sm:flex-none gap-2 font-semibold",
                  "bg-primary hover:bg-primary/90"
                )}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>

              <Button
                onClick={resetCards}
                disabled={
                  isGenerating ||
                  isCreating ||
                  (!currentAIPrompt.trim() &&
                    cardCount === 0 &&
                    !presentationTitle.trim())
                }
                variant="outline"
                size="lg"
                className={cn(
                  "rounded-lg",
                  showResetConfirm && "border-destructive text-destructive"
                )}
                title={
                  showResetConfirm ? "Click again to confirm" : "Clear all"
                }
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isGenerating && generationProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Generating your outline...
                  </span>
                  <span className="font-semibold text-primary">
                    {generationProgress}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Manual Slide Addition Section */}
      <motion.div
        className={cn(
          "p-6 rounded-xl border-2 transition-all duration-200",
          manualSlideTitle.trim()
            ? "border-primary/50 bg-primary/5"
            : "border-border/50 bg-muted/30 hover:border-border"
        )}
        variants={ITEM_VARIANTS}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Add Slides Manually
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Slide Title
            </label>
            <Input
              value={manualSlideTitle}
              onChange={(e) => setManualSlideTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && canAddManualSlide) {
                  e.preventDefault();
                  handleAddManualSlide();
                }
              }}
              placeholder="E.g., Introduction, Key Features, Conclusion..."
              className={cn(
                "text-base border-0 focus-visible:ring-2",
                "focus-visible:ring-primary rounded-lg",
                "bg-background",
                "placeholder:text-muted-foreground/60"
              )}
              disabled={isGenerating || isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter to quickly add • Total slides: {cardCount}
            </p>
          </div>

          {/* Quick Examples */}
          {!manualSlideTitle.trim() && cardCount < 5 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Introduction",
                  "Overview",
                  "Key Features",
                  "Benefits",
                  "Timeline",
                  "Conclusion",
                ].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleQuickExample(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddManualSlide}
              disabled={!canAddManualSlide || isGenerating || isCreating}
              className="flex-1 sm:flex-none gap-2 font-semibold"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </Button>

            <Button
              onClick={() => setShowBulkAdd(!showBulkAdd)}
              disabled={isGenerating || isCreating}
              variant="outline"
              size="lg"
              className="sm:w-auto"
            >
              <ListPlus className="h-4 w-4" />
              Bulk Add
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bulk Add Section */}
      <AnimatePresence>
        {showBulkAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            variants={ITEM_VARIANTS}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" />
                  Bulk Add Slides
                </CardTitle>
                <CardDescription>
                  Enter multiple slide titles, one per line
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={bulkSlides}
                  onChange={(e) => setBulkSlides(e.target.value)}
                  placeholder={`Introduction
Overview
Problem Statement
Solution
Benefits
Implementation
Timeline
Conclusion`}
                  className="font-mono text-sm"
                  rows={8}
                  disabled={isGenerating || isCreating}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleBulkAdd}
                    disabled={!bulkSlides.trim() || isGenerating || isCreating}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add All Slides
                  </Button>
                  <Button
                    onClick={() => {
                      setShowBulkAdd(false);
                      setBulkSlides("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message */}
      {(cardCount > 0 || presentationTitle.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-lg border",
            isReady
              ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
              : hasGeneratedSlides
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isReady ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">
                  {presentationTitle.trim()
                    ? `"${presentationTitle}"`
                    : "Untitled Presentation"}
                </p>
                <p className="text-sm opacity-75">
                  {cardCount > 0 ? (
                    <>
                      {hasGeneratedSlides ? "✨" : "📝"} {cardCount} slide
                      {cardCount !== 1 ? "s" : ""}{" "}
                      {hasGeneratedSlides ? "generated" : "added"}
                      {isReady
                        ? " • Ready to create"
                        : " • Add title to continue"}
                    </>
                  ) : (
                    "Generate slides with AI or add manually"
                  )}
                </p>
              </div>
            </div>
            {(cardCount > 0 || presentationTitle.trim()) && (
              <Button
                onClick={handleSaveDraft}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Empty State Hint */}
      {!cardCount &&
        !currentAIPrompt.trim() &&
        !manualSlideTitle.trim() &&
        !presentationTitle.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-lg border-2 border-dashed",
              "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
              "flex items-start gap-3"
            )}
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">
                Get started with AI or manual creation
              </p>
              <p className="text-xs opacity-75 mt-1">
                1. Set a presentation title
                <br />
                2. Use AI to generate slides automatically, OR add them manually
                <br />
                3. Edit, reorder, and refine your outline
              </p>
            </div>
          </motion.div>
        )}

      {/* Card List with Regeneration */}
      <motion.div variants={ITEM_VARIANTS}>
        <AnimatePresence mode="wait">
          {cardCount > 0 ? (
            <motion.div
              key="card-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CardList
                outlines={outlines}
                addOutline={addOutline}
                addMultipleOutlines={addMultipleOutlines}
                editingCard={editingCard}
                selectedCard={selectedCard}
                editText={editText}
                onEditChange={setEditText}
                onCardSelect={handleCardSelect}
                setEditText={setEditText}
                setEditingCard={setEditingCard}
                setSelectedCard={setSelectedCard}
                onCardDoubleClick={handleCardDoubleClick}
              />

              {/* Regenerate Button */}
              {selectedCard && !editingCard && hasGeneratedSlides && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-center"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateSlide(selectedCard)}
                    disabled={regeneratingId === selectedCard}
                    className="gap-2"
                  >
                    {regeneratingId === selectedCard ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Regenerate Selected Slide with AI
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20"
            >
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No slides yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate slides with AI or add them manually above
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recent Prompts */}
      {prompts.length > 0 && (
        <motion.div variants={ITEM_VARIANTS}>
          <RecentPrompts />
        </motion.div>
      )}

      {/* Fixed Bottom Create Button */}
      <AnimatePresence>
        {(cardCount > 0 || presentationTitle.trim()) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-4 sm:px-6 lg:px-8 z-40 border-t"
          >
            <div className="max-w-7xl mx-auto">
              <Button
                onClick={handleCreatePresentation}
                disabled={!isReady || isCreating}
                className={cn(
                  "w-full font-semibold text-base gap-2",
                  "bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90",
                  "transition-all duration-200 shadow-lg hover:shadow-xl",
                  "h-12 sm:h-14"
                )}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Presentation...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Presentation
                    {!isReady &&
                      (!presentationTitle.trim()
                        ? " (Add title first)"
                        : " (Add slides)")}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card p-8 rounded-xl shadow-2xl border text-center max-w-md"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Creating Your Presentation
              </h3>
              <p className="text-sm text-muted-foreground">
                "{presentationTitle}"
                <br />
                Setting up {cardCount} slide{cardCount !== 1 ? "s" : ""}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateWithAI;
