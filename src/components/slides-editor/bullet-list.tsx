"use client";

import { type KeyboardEvent, useCallback } from "react";
import { ListItem } from "./list-item";
import { useSlideStore } from "@/store/use-slide-store";

interface BulletListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  className?: string;
  isEditable?: boolean;
}

export const BulletList = ({
  items,
  onChange,
  className,
  isEditable = true,
}: BulletListProps) => {
  const { currentTheme } = useSlideStore();

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!isEditable) return;

      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    },
    [items, onChange, isEditable]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (!isEditable) return;

      if (e.key === "Enter") {
        e.preventDefault();

        const newItems = [...items];
        newItems.splice(index + 1, 0, "");
        onChange(newItems);

        requestAnimationFrame(() => {
          const nextInput = document.querySelector<HTMLInputElement>(
            `input[data-index="${index + 1}"]`
          );
          nextInput?.focus();
        });
        return;
      }

      if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
        e.preventDefault();
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
      }
    },
    [items, onChange, isEditable]
  );

  return (
    <ul
      className={`list-disc pl-5 space-y-1 ${className ?? ""}`}
      style={{ color: currentTheme.fontColor }}
    >
      {items.map((item, index) => (
        <li key={index} className="pl-1 marker:text-current">
          <ListItem
            item={item}
            index={index}
            isEditable={isEditable}
            fontColor={currentTheme.fontColor}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            data-index={index}
          />
        </li>
      ))}
    </ul>
  );
};
