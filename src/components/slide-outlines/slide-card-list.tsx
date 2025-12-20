"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddOutlineButton from "./add-outline-btn";
import { cn } from "@/utils";
import type { OutlineCard } from "@/types";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SlideDragOverlay from "./slide-drag-overlay";
import EmptyOutline from "./empty-outline";
import { SortableSLideCard } from "./sortable-slide-card";
import { showError, showSuccess } from "../toast-message";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const reindexCards = (cards: OutlineCard[]) =>
  cards.map((c, i) => ({ ...c, order: i + 1 }));

interface CardListProps {
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
}

export default function CardList({
  outlines,
  addMultipleOutlines,
  editingCard,
  editText,
  onEditChange,
  onCardSelect,
  setEditText,
  setEditingCard,
  setSelectedCard,
  selectedCard,
  onCardDoubleClick,
}: CardListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCardRef = useRef<OutlineCard | null>(null);

  const [items, setItems] = useState<OutlineCard[]>(() =>
    reindexCards(outlines)
  );

  useEffect(() => {
    setItems(reindexCards(outlines));
  }, [outlines]);

  const findCard = useCallback(
    (id: string | null) => items.find((c) => c.id === id) ?? null,
    [items]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id as string;
      setActiveId(id);
      activeCardRef.current = findCard(id);
    },
    [findCard]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) {
        activeCardRef.current = null;
        return;
      }

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      if (activeIdStr !== overIdStr) {
        const oldIndex = items.findIndex((i) => i.id === activeIdStr);
        const newIndex = items.findIndex((i) => i.id === overIdStr);

        if (oldIndex !== -1 && newIndex !== -1) {
          const next = arrayMove(items, oldIndex, newIndex);
          setItems(next);

          const reordered = reindexCards(next);
          addMultipleOutlines(reordered);
          showSuccess("Success", "Slide reordered successfully");
        }
      }

      activeCardRef.current = null;
    },
    [items, addMultipleOutlines]
  );

  const onCardUpdate = useCallback(
    (id: string, newTitle: string) => {
      if (!newTitle.trim()) {
        showError("Error", "Slide title cannot be empty");
        setEditText("");
        setEditingCard(null);
        return;
      }

      const updated = items.map((c) =>
        c.id === id ? { ...c, title: newTitle.trim() } : c
      );
      addMultipleOutlines(reindexCards(updated));
      setEditText("");
      setEditingCard(null);
      setSelectedCard(null);
      showSuccess("Success", "Slide updated successfully");
    },
    [items, addMultipleOutlines, setEditText, setEditingCard, setSelectedCard]
  );

  const onCardDelete = useCallback(
    (id: string, title: string) => {
      try {
        const filtered = items.filter((c) => c.id !== id);
        const reordered = reindexCards(filtered);
        addMultipleOutlines(reordered);

        if (selectedCard === id) setSelectedCard(null);
        if (editingCard === id) {
          setEditingCard(null);
          setEditText("");
        }

        showSuccess("Success", `SLide "${title}" deleted successfully`);
      } catch (err) {
        console.error(err);
        showError("Error", "Failed to delete slide");
      }
    },
    [
      items,
      addMultipleOutlines,
      selectedCard,
      editingCard,
      setSelectedCard,
      setEditingCard,
      setEditText,
    ]
  );

  const onAddCard = useCallback(
    (index?: number) => {
      const newCard: OutlineCard = {
        id: crypto.randomUUID(),
        title: "New Slide",
        order: index !== undefined ? index + 2 : items.length + 1,
      };

      const next =
        index !== undefined
          ? [...items.slice(0, index + 1), newCard, ...items.slice(index + 1)]
          : [...items, newCard];
      const reordered = reindexCards(next);

      addMultipleOutlines(reordered);

      setItems(reordered);
      setSelectedCard(newCard.id);
      setEditingCard(newCard.id);
      setEditText(newCard.title);

      showSuccess("Success", "New slide added successfully");
    },
    [items, addMultipleOutlines, setSelectedCard, setEditingCard, setEditText]
  );

  const activeCard = activeCardRef.current;

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <motion.div
            className={cn(
              "space-y-2 rounded-lg p-2 transition-colors duration-200"
            )}
            layout
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <EmptyOutline onAddCard={onAddCard} />
              ) : (
                items.map((card, index) => (
                  <SortableSLideCard
                    key={card.id}
                    card={card}
                    isEditing={editingCard === card.id}
                    isSelected={selectedCard === card.id}
                    editText={editText}
                    onEditChange={onEditChange}
                    onEditBlur={() => {
                      if (editingCard === card.id)
                        onCardUpdate(card.id, editText);
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
                      if (!editingCard) onCardSelect(card.id);
                    }}
                    onCardDoubleClick={() => {
                      if (!editingCard) onCardDoubleClick(card.id, card.title);
                    }}
                    onDeleteClick={() => onCardDelete(card.id, card.title)}
                    onAddAfter={() => onAddCard(index)}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </SortableContext>

        {items.length > 0 && (
          <AddOutlineButton
            onAddCard={() => onAddCard()}
            label="Add slide at end"
            variant="default"
          />
        )}

        <SlideDragOverlay activeCard={activeCard} activeId={activeId} />
      </DndContext>
    </div>
  );
}
