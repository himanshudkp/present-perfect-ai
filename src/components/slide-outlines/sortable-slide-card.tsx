import { OutlineCard } from "@/types";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import SlideOutlineCard from "./slide-outline-card";
import AddOutlineButton from "./add-outline-btn";

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
} as const;

const EXIT_ANIM = { opacity: 0, scale: 0.95, x: -50 } as const;

interface SortableCardProps {
  card: OutlineCard;
  isEditing: boolean;
  isSelected: boolean;
  editText: string;
  onEditChange: (v: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
  onCardClick: () => void;
  onCardDoubleClick: () => void;
  onDeleteClick: () => void;
  onAddAfter?: () => void;
}

export const SortableSLideCard = ({
  card,
  isEditing,
  isSelected,
  editText,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onCardDoubleClick,
  onDeleteClick,
  onAddAfter,
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  } as React.CSSProperties;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      variants={ITEM_VARIANTS}
      initial="hidden"
      animate="visible"
      exit={EXIT_ANIM}
    >
      <SlideOutlineCard
        dragHandlers={{
          attributes,
          listeners,
        }}
        card={card}
        isEditing={isEditing}
        isSelected={isSelected}
        isDragging={isDragging}
        editText={editText}
        onEditChange={onEditChange}
        onEditBlur={onEditBlur}
        onEditKeyDown={onEditKeyDown}
        onCardDoubleClick={onCardDoubleClick}
        onDeleteClick={onDeleteClick}
      />

      {typeof onAddAfter === "function" && (
        <div className="mt-2">
          <AddOutlineButton
            onAddCard={onAddAfter}
            label="Add slide here"
            variant="minimal"
          />
        </div>
      )}
    </motion.div>
  );
};
