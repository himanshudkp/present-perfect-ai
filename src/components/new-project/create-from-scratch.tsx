"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText } from "lucide-react";
import CreateSLideHeader from "./create-slide-header";
import GoBackButton from "./go-back-button";
import { ProjectTitleCard } from "./project-title-card";
import { showError, showSuccess } from "../toast-message";
import CardList from "../slide-outlines/slide-card-list";
import { CreatePresentation } from "./create-presentation";
import { AddSlideSection } from "./add-slide-section";
import { EmptySlideState } from "./empty-slide-state";
import { useCreatePresentation } from "@/hooks/use-create-presentation";
import { useResetState } from "@/hooks/use-reset-state";
import { useStartScratchStore } from "@/store/use-start-scratch";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/constants";
import type { OutlineCard } from "@/types";

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

  const hasCards = useMemo(() => outlines.length > 0, [outlines.length]);
  const canAddCard = useMemo(() => editText.trim().length > 0, [editText]);
  const cardCount = outlines.length;

  const addIcon = useMemo(() => {
    return <Plus className="h-3.5 w-3.5 text-primary" />;
  }, []);

  const fileIcon = useMemo(() => {
    return FileText;
  }, []);

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
      showError("Error", "Please enter a slide title");
      return;
    }

    const newCard: OutlineCard = {
      id: crypto.randomUUID(),
      title: editText.trim(),
      order: outlines.length + 1,
    };

    setEditText("");
    addOutline(newCard);
    showSuccess("Success", `"${newCard.title}" added`);
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

  const handleCardDoubleClick = useCallback((id: string, title: string) => {
    setEditingCard(id);
    setEditText(title);
    setSelectedCard(id);
  }, []);

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
        description="Create a custom presentation outline with complete control"
        icon={fileIcon}
      />

      <motion.div variants={ITEM_VARIANTS}>
        <ProjectTitleCard
          title={presentationTitle}
          onChange={setPresentationTitle}
          disabled={isCreating}
          placeholder="E.g., Q4 Marketing Strategy 2025"
        />
      </motion.div>

      <motion.div variants={ITEM_VARIANTS}>
        <AddSlideSection
          title={editText}
          onTitleChange={setEditText}
          onAddClick={handleAddCard}
          onResetClick={resetCards}
          onKeyDown={handleKeyPress}
          canAdd={canAddCard}
          disabled={isCreating}
          cardCount={cardCount}
          showResetConfirm={showResetConfirm}
          placeholder="E.g., Introduction, Overview, Key Features..."
          label="Add Individual Slides"
          icon={addIcon}
          isManual={true}
        />
      </motion.div>

      <motion.div variants={ITEM_VARIANTS}>
        <AnimatePresence mode="wait">
          {cardCount > 0 ? (
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
              onCardDoubleClick={handleCardDoubleClick}
            />
          ) : (
            <EmptySlideState />
          )}
        </AnimatePresence>
      </motion.div>

      <CreatePresentation
        isVisible={cardCount > 0 || presentationTitle.trim().length > 0}
        isReady={isReady}
        isCreating={isCreating}
        onCreateClick={handleCreatePresentation}
      />
    </motion.div>
  );
};

export default memo(CreateFromScratch);
