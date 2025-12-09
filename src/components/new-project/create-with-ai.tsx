"use client";

import { useCreativeAiStore } from "@/store/use-creative-ai-store";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/lib/constants";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  Wand2,
  FileText,
  Brain,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CardList from "../slide-outlines/slide-card-list";
import { usePromptStore } from "@/store/use-prompt-store";
import RecentPrompts from "../recent-prompts";
import { toast } from "sonner";
import { generateCreativePrompt } from "@/actions/gemini";
import { cn } from "@/lib/utils";
import { OutlineCard } from "@/lib/types";
import { useCreatePresentation } from "@/hooks/presentation/use-create-presentation";
import { useResetState } from "@/hooks/presentation/use-reset-state";
import { PresentationDetailsCard } from "./presentation-details-card";
import { AddSlideSection } from "./add-slide-section";
import { StatusBanner } from "./status-banner";
import { CreatePresentationFooter } from "./create-presentation-footer";
import { CreatingModal } from "./creating-model";
import CreateSLideHeader from "./create-slide-header";
import GoBackButton from "./go-back-button";
import AiPromptSection from "./ai-prompt-section";

const CreateWithAI = ({ onBack }: { onBack: () => void }) => {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [noOfCards, setNoOfCards] = useState("6");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [manualSlideTitle, setManualSlideTitle] = useState("");
  const [presentationTitle, setPresentationTitle] = useState("");

  const {
    currentAIPrompt,
    setCurrentAIPrompt,
    outlines,
    resetOutlines,
    addMultipleOutlines,
    addOutline,
  } = useCreativeAiStore();

  const { prompts, addPrompt } = usePromptStore();

  const { handleCreatePresentation, isCreating, isReady } =
    useCreatePresentation({
      outlines,
      presentationTitle,
      resetOutlines,
      onSuccess: () => {
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
        setCurrentAIPrompt("");
        setManualSlideTitle("");
        setPresentationTitle("");
      },
    });

  const { resetCards, showResetConfirm } = useResetState(
    {
      outlines,
      presentationTitle,
      currentAIPrompt,
      manualSlideTitle,
    },
    {
      onReset: () => {
        setEditingCard(null);
        setSelectedCard(null);
        setEditText("");
        setCurrentAIPrompt("");
        setManualSlideTitle("");
        setPresentationTitle("");
        resetOutlines();
        setNoOfCards("6");
      },
    }
  );

  const cardCount = outlines.length;
  const canAddManualSlide = manualSlideTitle.trim().length > 0;
  const hasGeneratedSlides = cardCount > 0 && currentAIPrompt.trim().length > 0;

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
    onBack();
  }, [
    onBack,
    outlines.length,
    resetOutlines,
    setCurrentAIPrompt,
    presentationTitle,
    currentAIPrompt,
  ]);

  const generateOutline = useCallback(async () => {
    if (!currentAIPrompt.trim()) {
      toast.error("Please enter a prompt");
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
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [currentAIPrompt, noOfCards, addMultipleOutlines, presentationTitle]);

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

  return (
    <motion.div
      className="space-y-6 w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      <GoBackButton isCreating={isCreating} handleBack={handleBack} />

      <CreateSLideHeader
        label="AI-Powered Creation"
        title1="Generate with"
        title2="Creative AI"
        description="Let AI generate your outline, then customize with manual edits"
        icon={Brain}
      />

      {/* <motion.div variants={ITEM_VARIANTS}>
        <PresentationDetailsCard
          title={presentationTitle}
          onChange={setPresentationTitle}
          disabled={isGenerating || isCreating}
        />
      </motion.div> */}

      <AiPromptSection
        currentAIPrompt={currentAIPrompt}
        isGenerating={isGenerating}
        isCreating={isCreating}
        noOfCards={noOfCards}
        generationProgress={generationProgress}
        setNoOfCards={setNoOfCards}
        generateOutline={generateOutline}
        setCurrentAIPrompt={setCurrentAIPrompt}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            generateOutline();
          }
        }}
      />

      {/* <motion.div variants={ITEM_VARIANTS}>
        <AddSlideSection
          title={manualSlideTitle}
          onTitleChange={setManualSlideTitle}
          onAddClick={handleAddManualSlide}
          onResetClick={resetCards}
          onKeyPress={(e) => {
            if (e.key === "Enter" && canAddManualSlide) {
              e.preventDefault();
              handleAddManualSlide();
            }
          }}
          canAdd={canAddManualSlide}
          disabled={isGenerating || isCreating}
          cardCount={cardCount}
          showResetConfirm={showResetConfirm}
          label="Add Slides Manually"
        />
      </motion.div> */}

      <motion.div variants={ITEM_VARIANTS}>
        <StatusBanner
          cardCount={cardCount}
          presentationTitle={presentationTitle}
          hasGeneratedSlides={hasGeneratedSlides}
          isReady={isReady}
        />
      </motion.div>

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
                onCardSelect={setSelectedCard}
                setEditText={setEditText}
                setEditingCard={setEditingCard}
                setSelectedCard={setSelectedCard}
                onCardDoubleClick={(id, title) => {
                  setEditingCard(id);
                  setEditText(title);
                  setSelectedCard(id);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/20"
            >
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-base font-semibold mb-1">No slides yet</h3>
              <p className="text-sm text-muted-foreground">
                Generate with AI or add manually above
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {prompts.length > 0 && (
        <motion.div variants={ITEM_VARIANTS}>
          <RecentPrompts />
        </motion.div>
      )}

      <CreatePresentationFooter
        isVisible={cardCount > 0 || presentationTitle.trim().length > 0}
        isReady={isReady}
        isCreating={isCreating}
        cardCount={cardCount}
        presentationTitle={presentationTitle}
        onCreateClick={handleCreatePresentation}
      />

      <CreatingModal
        isCreating={isCreating}
        presentationTitle={presentationTitle}
        cardCount={cardCount}
      />
    </motion.div>
  );
};

export default CreateWithAI;
