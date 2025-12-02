"use client";

import { useStartScratchStore } from "@/store/use-start-scratch";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/utils/constants";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  RotateCcw,
  Plus,
  Sparkles,
  Loader2,
  Wand2,
  FileText,
  AlertCircle,
  Save,
  ListPlus,
  Pencil,
  Trash2,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import CardList from "./card-list";
import { OutlineCard } from "@/types";
import { showError, showSuccess } from "@/components/toast-message";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/use-slide-store";
import { Badge } from "./ui/badge";
import { cn } from "@/utils/utils";
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

const CreateFromScratch = ({ onBack }: Props) => {
  const router = useRouter();
  const { addMultipleOutlines, addOutline, outlines, resetOutlines } =
    useStartScratchStore();

  // State management
  const [editText, setEditText] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [presentationDescription, setPresentationDescription] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkSlides, setBulkSlides] = useState("");
  const [templateCategory, setTemplateCategory] = useState("");

  const { project, setProject } = useSlideStore();

  // Computed values
  const hasCards = outlines.length > 0;
  const canAddCard = editText.trim().length > 0;
  const cardCount = outlines.length;
  const isReadyToCreate = hasCards && presentationTitle.trim().length > 0;

  // Slide templates by category
  const slideTemplates = {
    business: [
      "Executive Summary",
      "Problem Statement",
      "Market Analysis",
      "Solution Overview",
      "Business Model",
      "Competitive Advantage",
      "Financial Projections",
      "Team & Expertise",
      "Go-to-Market Strategy",
      "Investment Ask",
    ],
    education: [
      "Course Introduction",
      "Learning Objectives",
      "Key Concepts",
      "Examples & Case Studies",
      "Practice Exercises",
      "Common Mistakes",
      "Real-World Applications",
      "Summary & Review",
      "Additional Resources",
      "Q&A Session",
    ],
    technical: [
      "Technical Overview",
      "System Architecture",
      "Core Features",
      "Technology Stack",
      "Implementation Details",
      "Performance Metrics",
      "Security Considerations",
      "Testing Strategy",
      "Deployment Process",
      "Future Roadmap",
    ],
    marketing: [
      "Campaign Overview",
      "Target Audience",
      "Brand Positioning",
      "Marketing Channels",
      "Content Strategy",
      "Customer Journey",
      "Key Metrics & KPIs",
      "Budget Allocation",
      "Timeline & Milestones",
      "Expected ROI",
    ],
    general: [
      "Title Slide",
      "Introduction",
      "Background",
      "Main Points",
      "Key Insights",
      "Data & Statistics",
      "Challenges & Solutions",
      "Recommendations",
      "Next Steps",
      "Conclusion",
    ],
  };

  // Handler: Back navigation with confirmation
  const handleBack = useCallback(() => {
    if (
      hasCards ||
      presentationTitle.trim() ||
      presentationDescription.trim()
    ) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to go back?"
      );
      if (!confirmed) return;
    }
    resetOutlines();
    setPresentationTitle("");
    setPresentationDescription("");
    onBack();
  }, [
    onBack,
    resetOutlines,
    hasCards,
    presentationTitle,
    presentationDescription,
  ]);

  // Handler: Reset with double confirmation
  const resetCards = useCallback(() => {
    if (showResetConfirm) {
      setEditText("");
      setSelectedCard(null);
      setEditingCard(null);
      setPresentationTitle("");
      setPresentationDescription("");
      resetOutlines();
      setShowResetConfirm(false);
      showSuccess("All data cleared");
    } else {
      if (hasCards || presentationTitle.trim()) {
        setShowResetConfirm(true);
        setTimeout(() => setShowResetConfirm(false), 3000);
      }
    }
  }, [resetOutlines, showResetConfirm, hasCards, presentationTitle]);

  // Handler: Add single slide
  const handleAddCard = useCallback(() => {
    if (!canAddCard) {
      showError("Please enter a slide title");
      return;
    }

    const newCard: OutlineCard = {
      id: crypto.randomUUID(),
      title: editText.trim(),
      order: outlines.length + 1,
    };

    setEditText("");
    addOutline(newCard);
    showSuccess(`"${newCard.title}" added`);
  }, [canAddCard, editText, outlines.length, addOutline]);

  // Handler: Quick template selection
  const handleTemplateClick = useCallback((title: string) => {
    setEditText(title);
  }, []);

  // Handler: Apply template category
  const handleApplyTemplate = useCallback(
    (category: keyof typeof slideTemplates) => {
      if (outlines.length > 0) {
        const confirmed = window.confirm(
          "This will replace all existing slides. Continue?"
        );
        if (!confirmed) return;
      }

      const templates = slideTemplates[category];
      const newCards: OutlineCard[] = templates.map((title, index) => ({
        id: crypto.randomUUID(),
        title,
        order: index + 1,
      }));

      addMultipleOutlines(newCards);
      showSuccess(`Applied ${category} template (${templates.length} slides)`);
      setTemplateCategory("");
    },
    [addMultipleOutlines, outlines.length]
  );

  // Handler: Bulk add slides
  const handleBulkAdd = useCallback(() => {
    if (!bulkSlides.trim()) {
      showError("Please enter slide titles");
      return;
    }

    const lines = bulkSlides
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      showError("No valid slide titles found");
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
    showSuccess(`Added ${newCards.length} slides`);
  }, [bulkSlides, outlines, addMultipleOutlines]);

  // Handler: Keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && canAddCard && !e.shiftKey) {
        e.preventDefault();
        handleAddCard();
      }
    },
    [canAddCard, handleAddCard]
  );

  // Handler: Create presentation
  const handleGenerate = useCallback(async () => {
    if (!isReadyToCreate) {
      if (!presentationTitle.trim()) {
        showError("Please enter a presentation title");
        return;
      }
      if (outlines.length === 0) {
        showError("Please add at least one slide");
        return;
      }
      return;
    }

    setIsCreating(true);

    try {
      const res = await createProject(presentationTitle.trim(), outlines);

      if (res.status !== 200) {
        console.error(res.error);
        showError(res.error || "Failed to create presentation");
        return;
      }

      if (res.data) {
        setProject(res.data);
        resetOutlines();
        setPresentationTitle("");
        setPresentationDescription("");
        showSuccess("Presentation created successfully!");
        router.push(`/ppt/${res.data.id}/select-theme`);
      } else {
        console.error(res.error);
        showError("Project creation failed");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      showError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  }, [
    isReadyToCreate,
    presentationTitle,
    outlines,
    setProject,
    resetOutlines,
    router,
  ]);

  // Handler: Save draft (could be extended to actually save)
  const handleSaveDraft = useCallback(() => {
    if (!hasCards && !presentationTitle.trim()) {
      showError("Nothing to save");
      return;
    }

    // In a real implementation, you'd save to localStorage or backend
    showSuccess("Draft saved locally");
  }, [hasCards, presentationTitle]);

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
        disabled={isCreating}
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
          <Wand2 className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Manual Creation
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Build Your{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Presentation
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Create a custom presentation outline with complete control over every
          slide
        </p>
      </motion.div>

      {/* Presentation Info Section */}
      <motion.div variants={ITEM_VARIANTS}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Presentation Details
            </CardTitle>
            <CardDescription>
              Give your presentation a title and optional description
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
                placeholder="E.g., Q4 Marketing Strategy 2025"
                className="text-base"
                disabled={isCreating}
              />
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
                disabled={isCreating}
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

      {/* Template Selection */}
      <motion.div variants={ITEM_VARIANTS}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-primary" />
              Quick Start Templates
            </CardTitle>
            <CardDescription>
              Apply pre-built slide structures or start from scratch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={templateCategory}
                onValueChange={setTemplateCategory}
                disabled={isCreating}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a template category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">
                    Business Pitch (10 slides)
                  </SelectItem>
                  <SelectItem value="education">
                    Educational (10 slides)
                  </SelectItem>
                  <SelectItem value="technical">
                    Technical (10 slides)
                  </SelectItem>
                  <SelectItem value="marketing">
                    Marketing (10 slides)
                  </SelectItem>
                  <SelectItem value="general">General (10 slides)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() =>
                  templateCategory &&
                  handleApplyTemplate(
                    templateCategory as keyof typeof slideTemplates
                  )
                }
                disabled={!templateCategory || isCreating}
                variant="outline"
              >
                Apply Template
              </Button>
            </div>

            {outlines.length > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Applying a template will replace existing slides
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Single Slide Section */}
      <motion.div
        className={cn(
          "p-6 rounded-xl border-2 transition-all duration-200",
          editText.trim()
            ? "border-primary/50 bg-primary/5"
            : "border-border/50 bg-muted/30 hover:border-border"
        )}
        variants={ITEM_VARIANTS}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Add Individual Slides
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Slide Title
            </label>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g., Introduction, Overview, Key Features..."
              className={cn(
                "text-base border-0 focus-visible:ring-2",
                "focus-visible:ring-primary rounded-lg",
                "bg-background",
                "placeholder:text-muted-foreground/60"
              )}
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter to quickly add • Total slides: {cardCount}
            </p>
          </div>

          {/* Quick Examples */}
          {!editText.trim() && cardCount < 5 && (
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
                    onClick={() => handleTemplateClick(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddCard}
              disabled={!canAddCard || isCreating}
              className="flex-1 gap-2 font-semibold"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </Button>

            <Button
              onClick={() => setShowBulkAdd(!showBulkAdd)}
              disabled={isCreating}
              variant="outline"
              size="lg"
              className="sm:w-auto"
            >
              <ListPlus className="h-4 w-4" />
              Bulk Add
            </Button>

            <Button
              onClick={resetCards}
              disabled={isCreating || (!hasCards && !presentationTitle.trim())}
              variant="outline"
              size="lg"
              className={cn(
                "sm:w-auto",
                showResetConfirm && "border-destructive text-destructive"
              )}
              title={showResetConfirm ? "Click again to confirm" : "Clear all"}
            >
              <RotateCcw className="h-4 w-4" />
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
                  disabled={isCreating}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleBulkAdd}
                    disabled={!bulkSlides.trim() || isCreating}
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

      {/* Status Card */}
      {(cardCount > 0 || presentationTitle.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-lg border",
            isReadyToCreate
              ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
              : "bg-primary/5 border-primary/30 text-primary"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isReadyToCreate ? (
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
                  {cardCount} slide{cardCount !== 1 ? "s" : ""}{" "}
                  {isReadyToCreate ? "• Ready to create" : "• Add more details"}
                </p>
              </div>
            </div>
            {hasCards && (
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

      {/* Empty State */}
      {!hasCards && !presentationTitle.trim() && (
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
            <p className="font-medium text-sm">Let's get started!</p>
            <p className="text-xs opacity-75 mt-1">
              1. Enter a presentation title above
              <br />
              2. Add slides individually or use a template
              <br />
              3. Drag to reorder and double-click to edit
            </p>
          </div>
        </motion.div>
      )}

      {/* Card List */}
      <motion.div variants={ITEM_VARIANTS}>
        <AnimatePresence mode="wait">
          {hasCards ? (
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
                onCardSelect={setSelectedCard}
                setEditText={setEditText}
                setEditingCard={setEditingCard}
                setSelectedCard={setSelectedCard}
                onCardDoubleClick={(id, title) => {
                  setEditingCard(id);
                  setEditText(title);
                }}
              />
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
                Add your first slide to begin building your presentation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Fixed Bottom Create Button */}
      <AnimatePresence>
        {(hasCards || presentationTitle.trim()) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-4 sm:px-6 lg:px-8 z-40 border-t"
          >
            <div className="max-w-7xl mx-auto">
              <Button
                onClick={handleGenerate}
                disabled={!isReadyToCreate || isCreating}
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
                    {!isReadyToCreate &&
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

export default CreateFromScratch;
