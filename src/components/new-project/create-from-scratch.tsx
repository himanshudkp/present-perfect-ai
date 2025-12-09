"use client";

import { useCallback, useState } from "react";
import { useStartScratchStore } from "@/store/use-start-scratch";
import { motion, AnimatePresence } from "framer-motion";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/lib/constants";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  Plus,
  Wand2,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Input } from "../ui/input";
import CardList from "../slide-outlines/slide-card-list";
import { OutlineCard } from "@/lib/types";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCreatePresentation } from "@/hooks/presentation/use-create-presentation";
import { useResetState } from "@/hooks/presentation/use-reset-state";
import { PresentationDetailsCard } from "./presentation-details-card";
import { AddSlideSection } from "./add-slide-section";
import { StatusBanner } from "./status-banner";
import { CreatePresentationFooter } from "./create-presentation-footer";
import { CreatingModal } from "./creating-model";
import CreateSLideHeader from "./create-slide-header";
import GoBackButton from "./go-back-button";

const CreateFromScratch = ({ onBack }: { onBack: () => void }) => {
  const { addMultipleOutlines, addOutline, outlines, resetOutlines } =
    useStartScratchStore();

  const [editText, setEditText] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [presentationTitle, setPresentationTitle] = useState("");

  const { handleCreatePresentation, isCreating, isReady } =
    useCreatePresentation({
      outlines,
      presentationTitle,
      resetOutlines,
      onSuccess: () => {
        setPresentationTitle("");
        setEditText("");
      },
    });

  const { resetCards, showResetConfirm } = useResetState(
    {
      outlines,
      presentationTitle,
    },
    {
      onReset: () => {
        setEditText("");
        setSelectedCard(null);
        setEditingCard(null);
        setPresentationTitle("");
        resetOutlines();
      },
    }
  );

  const hasCards = outlines.length > 0;
  const canAddCard = editText.trim().length > 0;
  const cardCount = outlines.length;

  const handleBack = useCallback(() => {
    if (hasCards || presentationTitle.trim()) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to go back?"
      );
      if (!confirmed) return;
    }
    resetOutlines();
    setPresentationTitle("");
    onBack();
  }, [onBack, resetOutlines, hasCards, presentationTitle]);

  const handleAddCard = useCallback(() => {
    if (!canAddCard) {
      toast.error("Please enter a slide title");
      return;
    }

    const newCard: OutlineCard = {
      id: crypto.randomUUID(),
      title: editText.trim(),
      order: outlines.length + 1,
    };

    setEditText("");
    addOutline(newCard);
    toast.success(`"${newCard.title}" added`);
  }, [canAddCard, editText, outlines.length, addOutline]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && canAddCard && !e.shiftKey) {
        e.preventDefault();
        handleAddCard();
      }
    },
    [canAddCard, handleAddCard]
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
        label="Manual Creation"
        title1="Build Your"
        title2="Presentation"
        description="Create a custom presentation outline with complete control over every
          slide"
        icon={FileText}
      />

      <motion.div variants={ITEM_VARIANTS}>
        <PresentationDetailsCard
          title={presentationTitle}
          onChange={setPresentationTitle}
          disabled={isCreating}
          description="Give your presentation a title"
          placeholder="E.g., Q4 Marketing Strategy 2025"
        />
      </motion.div>

      <motion.div variants={ITEM_VARIANTS}>
        <AddSlideSection
          title={editText}
          onTitleChange={setEditText}
          onAddClick={handleAddCard}
          onResetClick={resetCards}
          onKeyPress={handleKeyPress}
          canAdd={canAddCard}
          disabled={isCreating}
          cardCount={cardCount}
          showResetConfirm={showResetConfirm}
          placeholder="E.g., Introduction, Overview, Key Features..."
          label="Add Individual Slides"
          icon={<Plus className="h-3.5 w-3.5 text-primary" />}
          isManual={true}
        />
      </motion.div>

      <motion.div variants={ITEM_VARIANTS}>
        <StatusBanner
          cardCount={cardCount}
          presentationTitle={presentationTitle}
          hasGeneratedSlides={false}
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
                Add slides above to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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

export default CreateFromScratch;
