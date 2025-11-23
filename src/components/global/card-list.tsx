"use client";

import { OutlineCard } from "@/lib/types";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Card from "./card";
import AddCardButton from "./add-card-button";

type Props = {
  outlines: OutlineCard[];
  addOutline: (card: OutlineCard) => void;
  addMultipleOutlines: (cards: OutlineCard[]) => void;
  editingCard: string | null;
  selectedCard: string | null;
  editText: string;
  onEditChange: (value: string) => void;
  onCardSelect: (id: string) => void;
  setEditText: (text: string) => void;
  setEditingCard: (id: string | null) => void;
  setSelectedCard: (id: string | null) => void;
  onCardDoubleClick: (id: string, title: string) => void;
};

const CardList = ({
  addMultipleOutlines,
  addOutline,
  outlines,
  editingCard,
  editText,
  onCardDoubleClick,
  onCardSelect,
  onEditChange,
  selectedCard,
  setEditText,
  setEditingCard,
  setSelectedCard,
}: Props) => {
  const [draggedItem, setDraggedItem] = useState<OutlineCard | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffSetY = useRef<number>(0);

  const dragOverStylesMap = useMemo(() => {
    const styles: Record<number, React.CSSProperties> = {};

    if (dragOverIndex !== null && draggedItem !== null) {
      outlines.forEach((_, cardIndex) => {
        if (cardIndex === dragOverIndex) {
          styles[cardIndex] = {
            borderTop: "2px solid hsl(var(--primary))",
            marginTop: "0.5rem",
            transition: "margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          };
        } else if (cardIndex === dragOverIndex - 1) {
          styles[cardIndex] = {
            borderBottom: "2px solid hsl(var(--primary))",
            marginBottom: "0.5rem",
            transition: "margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          };
        }
      });
    }

    return styles;
  }, [dragOverIndex, draggedItem, outlines.length]);

  const onDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (!draggedItem) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const threshold = rect.height / 2;

      setDragOverIndex(y < threshold ? index : index + 1);
    },
    [draggedItem]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (!draggedItem || dragOverIndex === null) {
        setDraggedItem(null);
        setDragOverIndex(null);
        setIsDragging(false);
        return;
      }

      try {
        const updatedCards = [...outlines];
        const draggedIndex = updatedCards.findIndex(
          (card) => card.id === draggedItem.id
        );

        if (draggedIndex === -1 || draggedIndex === dragOverIndex) {
          return;
        }

        const [removedCard] = updatedCards.splice(draggedIndex, 1);
        const targetIndex =
          dragOverIndex > draggedIndex ? dragOverIndex - 1 : dragOverIndex;

        updatedCards.splice(targetIndex, 0, removedCard);

        const reorderedCards = updatedCards.map((card, index) => ({
          ...card,
          order: index + 1,
        }));

        addMultipleOutlines(reorderedCards);
        toast.success("Slide reordered successfully");
      } catch (error) {
        console.error("Failed to reorder cards:", error);
        toast.error("Failed to reorder slides");
      } finally {
        setDraggedItem(null);
        setDragOverIndex(null);
        setIsDragging(false);
      }
    },
    [draggedItem, dragOverIndex, outlines, addMultipleOutlines]
  );

  const onCardUpdate = useCallback(
    (id: string, newTitle: string) => {
      if (!newTitle.trim()) {
        toast.error("Slide title cannot be empty");
        setEditText("");
        setEditingCard(null);
        return;
      }

      const updatedCards = outlines.map((card) =>
        card.id === id ? { ...card, title: newTitle.trim() } : card
      );

      addMultipleOutlines(updatedCards);
      setEditText("");
      setEditingCard(null);
      setSelectedCard(null);
      toast.success("Slide updated");
    },
    [
      outlines,
      addMultipleOutlines,
      setEditText,
      setEditingCard,
      setSelectedCard,
    ]
  );

  const onCardDelete = useCallback(
    (id: string, title: string) => {
      try {
        const filteredCards = outlines.filter((card) => card.id !== id);
        const reorderedCards = filteredCards.map((card, index) => ({
          ...card,
          order: index + 1,
        }));

        addMultipleOutlines(reorderedCards);

        if (selectedCard === id) setSelectedCard(null);
        if (editingCard === id) {
          setEditingCard(null);
          setEditText("");
        }

        toast.success(`Deleted "${title}"`);
      } catch (error) {
        console.error("Failed to delete card:", error);
        toast.error("Failed to delete slide");
      }
    },
    [
      outlines,
      addMultipleOutlines,
      selectedCard,
      editingCard,
      setSelectedCard,
      setEditingCard,
      setEditText,
    ]
  );

  const onDragStart = useCallback(
    (e: React.DragEvent, card: OutlineCard) => {
      setDraggedItem(card);
      setIsDragging(true);
      e.dataTransfer.effectAllowed = "move";

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      dragOffSetY.current = e.clientY - rect.top;

      const draggedEle = e.currentTarget.cloneNode(true) as HTMLElement;
      draggedEle.style.position = "absolute";
      draggedEle.style.top = "-1000px";
      draggedEle.style.opacity = "0.7";
      draggedEle.style.width = `${
        (e.currentTarget as HTMLElement).offsetWidth
      }px`;
      draggedEle.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";

      document.body.appendChild(draggedEle);
      e.dataTransfer.setDragImage(draggedEle, 0, dragOffSetY.current);

      setTimeout(() => {
        setDragOverIndex(outlines.findIndex((c) => c.id === card.id));
        if (document.body.contains(draggedEle)) {
          document.body.removeChild(draggedEle);
        }
      }, 0);
    },
    [outlines]
  );

  const onDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDragging(false);
  }, []);

  const onAddCard = useCallback(
    (index?: number) => {
      const newCard: OutlineCard = {
        id: crypto.randomUUID(),
        title: "New Slide",
        order: index !== undefined ? index + 2 : outlines.length + 1,
      };

      let updatedCards: OutlineCard[];

      if (index !== undefined) {
        updatedCards = [
          ...outlines.slice(0, index + 1),
          newCard,
          ...outlines.slice(index + 1),
        ];
      } else {
        updatedCards = [...outlines, newCard];
      }

      const reorderedCards = updatedCards.map((card, idx) => ({
        ...card,
        order: idx + 1,
      }));

      addMultipleOutlines(reorderedCards);

      setSelectedCard(newCard.id);
      setEditingCard(newCard.id);
      setEditText(newCard.title);

      toast.success("New slide added");
    },
    [
      outlines,
      addMultipleOutlines,
      setSelectedCard,
      setEditingCard,
      setEditText,
    ]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-3">
      {outlines.length > 0 && (
        <motion.div
          className="flex items-center justify-between px-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Slides ({outlines.length})
          </p>
          {isDragging && (
            <motion.span
              className="text-xs text-primary font-medium flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GripVertical className="h-3 w-3" />
              Reordering...
            </motion.span>
          )}
        </motion.div>
      )}

      <motion.div
        className={cn(
          "space-y-2 rounded-lg p-2 transition-colors duration-200",
          isDragging && "bg-primary/5 border-2 border-dashed border-primary/30"
        )}
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onDragOver={(e) => {
          e.preventDefault();
          if (
            outlines.length === 0 ||
            e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20
          ) {
            onDragOver(e, outlines.length);
          }
        }}
        onDrop={onDrop}
        onDragLeave={() => {
          if (outlines.length === 0) {
            setDragOverIndex(null);
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {outlines.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/20"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Plus className="h-12 w-12 text-muted-foreground/30 mb-3" />
              </motion.div>
              <p className="text-base font-medium text-muted-foreground mb-1">
                No slides yet
              </p>
              <p className="text-sm text-muted-foreground/60">
                Add your first slide to get started
              </p>
            </motion.div>
          ) : (
            outlines.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Card
                  onDragOver={(e) => onDragOver(e, index)}
                  card={card}
                  isEditing={editingCard === card.id}
                  isSelected={selectedCard === card.id}
                  isDragging={draggedItem?.id === card.id}
                  isFirst={index === 0}
                  isLast={index === outlines.length - 1}
                  editText={editText}
                  onEditChange={onEditChange}
                  onEditBlur={() => {
                    if (editingCard === card.id) {
                      onCardUpdate(card.id, editText);
                    }
                  }}
                  onEditKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onCardUpdate(card.id, editText);
                    } else if (e.key === "Escape") {
                      setEditingCard(null);
                      setEditText("");
                      setSelectedCard(null);
                    }
                  }}
                  onCardClick={() => {
                    if (!editingCard) {
                      onCardSelect(card.id);
                    }
                  }}
                  onCardDoubleClick={() => {
                    if (!editingCard) {
                      onCardDoubleClick(card.id, card.title);
                    }
                  }}
                  onDeleteClick={() => onCardDelete(card.id, card.title)}
                  dragHandlers={{
                    onDragStart: (e) => onDragStart(e, card),
                    onDragEnd: onDragEnd,
                  }}
                  dragOverStyles={dragOverStylesMap[index] || {}}
                />

                {index < outlines.length - 1 && (
                  <AddCardButton
                    onAddCard={() => onAddCard(index)}
                    label="Add slide here"
                    variant="minimal"
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {outlines.length > 0 && (
        <AddCardButton
          onAddCard={() => onAddCard()}
          label="Add slide at end"
          variant="default"
        />
      )}

      {outlines.length === 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onAddCard()}
          className={cn(
            "w-full py-4 rounded-xl border-2 border-dashed",
            "hover:border-primary hover:bg-primary/5 transition-all duration-200",
            "text-sm font-medium text-muted-foreground hover:text-primary",
            "flex items-center justify-center gap-2"
          )}
        >
          <Plus className="h-5 w-5" />
          Add Your First Slide
        </motion.button>
      )}
    </div>
  );
};

export default CardList;
