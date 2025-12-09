"use client";

import { KeyboardEvent, memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import CardList from "../slide-outlines/slide-card-list";
import RecentPromptsList from "../recent-prompts-list";
import { CreatePresentation } from "./create-presentation";
import CreateSLideHeader from "./create-slide-header";
import GoBackButton from "./go-back-button";
import AiPromptSection from "./ai-prompt-section";
import { EmptySlideState } from "./empty-slide-state";
import { showError, showSuccess } from "../toast-message";
import { generateCreativePrompt } from "@/actions/gemini";
import { usePromptStore } from "@/store/use-prompt-store";
import { useCreativeAiStore } from "@/store/use-creative-ai-store";
import { useCreatePresentation } from "@/hooks/presentation/use-create-presentation";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/lib/constants";
import type { OutlineCard } from "@/lib/types";

const CreateWithAI = ({ onBack }: { onBack: () => void }) => {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [noOfCards, setNoOfCards] = useState("6");
  const [presentationTitle, setPresentationTitle] = useState("");

  const currentAIPrompt = useCreativeAiStore((s) => s.currentAIPrompt);
  const setCurrentAIPrompt = useCreativeAiStore((s) => s.setCurrentAIPrompt);
  const outlines = useCreativeAiStore((s) => s.outlines);
  const resetOutlines = useCreativeAiStore((s) => s.resetOutlines);
  const addMultipleOutlines = useCreativeAiStore((s) => s.addMultipleOutlines);
  const addOutline = useCreativeAiStore((s) => s.addOutline);

  const prompts = usePromptStore((s) => s.prompts);
  const addPrompt = usePromptStore((s) => s.addPrompt);

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
        setPresentationTitle("");
      },
    });

  const cardCount = outlines.length;

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
      showError("Error", "Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateCreativePrompt(
        currentAIPrompt,
        parseInt(noOfCards)
      );

      if (result.status === 200 && result.data?.outlines) {
        const cards: OutlineCard[] = result.data.outlines.map(
          (title: string, index: number) => ({
            id: crypto.randomUUID(),
            title: title.trim(),
            order: index + 1,
          })
        );

        addMultipleOutlines(cards);
        setNoOfCards(cards.length.toString());

        showSuccess("Success", "Outline generated successfully!");

        if (result.data.title && !presentationTitle.trim()) {
          setPresentationTitle(result.data.title);
        }
      } else {
        showError("Error", "Outline Generation failed");
      }
    } catch (error) {
      console.error("Generation error:", error);
      showError("Error", "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [currentAIPrompt, noOfCards, addMultipleOutlines, presentationTitle]);

  const onCardDoubleClick = useCallback((id: string, title: string) => {
    setEditingCard(id);
    setEditText(title);
    setSelectedCard(id);
  }, []);

  const onEditChange = useCallback((v: string) => setEditText(v), []);
  const onCardSelect = useCallback((v: string) => setSelectedCard(v), []);

  const handlePromptKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateOutline();
      }
    },
    [generateOutline]
  );

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

      <AiPromptSection
        currentAIPrompt={currentAIPrompt}
        isGenerating={isGenerating}
        isCreating={isCreating}
        noOfCards={noOfCards}
        setNoOfCards={setNoOfCards}
        generateOutline={generateOutline}
        setCurrentAIPrompt={setCurrentAIPrompt}
        onKeyDown={handlePromptKeyDown}
      />

      <motion.div variants={ITEM_VARIANTS}>
        <AnimatePresence mode="wait">
          {cardCount > 0 ? (
            <>
              <CardList
                outlines={outlines}
                addOutline={addOutline}
                addMultipleOutlines={addMultipleOutlines}
                editingCard={editingCard}
                selectedCard={selectedCard}
                editText={editText}
                onEditChange={onEditChange}
                onCardSelect={onCardSelect}
                setEditText={setEditText}
                setEditingCard={setEditingCard}
                setSelectedCard={setSelectedCard}
                onCardDoubleClick={onCardDoubleClick}
              />
              <CreatePresentation
                isVisible={cardCount > 0}
                isReady={isReady}
                isCreating={isCreating}
                onCreateClick={handleCreatePresentation}
              />
            </>
          ) : (
            <EmptySlideState />
          )}
        </AnimatePresence>
      </motion.div>

      {prompts.length > 0 && (
        <motion.div variants={ITEM_VARIANTS}>
          <RecentPromptsList />
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(CreateWithAI);
