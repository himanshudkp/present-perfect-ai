"use client";

import { useSlideStore } from "@/store/use-slide-store";
import { KeyboardEvent, useCallback } from "react";
import { ListItem } from "./list-item";

interface TodoListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  className?: string;
  isEditable?: boolean;
}

const UNCHECKED = "[ ] ";
const CHECKED = "[x] ";

const stripPrefix = (item: string) => item.replace(/^\[[ x]\] /, "");
const isChecked = (item: string) => item.startsWith(CHECKED);

export const TodoList = ({
  items,
  onChange,
  className,
  isEditable = false,
}: TodoListProps) => {
  const { currentTheme } = useSlideStore();

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!isEditable) return;

      const newItems = [...items];
      const prefix = isChecked(items[index]) ? CHECKED : UNCHECKED;

      newItems[index] = value.startsWith("[") ? value : `${prefix}${value}`;

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
        newItems.splice(index + 1, 0, UNCHECKED);
        onChange(newItems);

        requestAnimationFrame(() => {
          const nextInput = document.querySelector<HTMLInputElement>(
            `input[data-index="${index + 1}"]`
          );
          nextInput?.focus();
        });
      }

      if (
        e.key === "Backspace" &&
        items[index] === UNCHECKED &&
        items.length > 1
      ) {
        e.preventDefault();
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
      }
    },
    [items, onChange, isEditable]
  );

  const toggleCheckbox = useCallback(
    (index: number) => {
      if (!isEditable) return;

      const newItems = [...items];
      newItems[index] = isChecked(items[index])
        ? items[index].replace(CHECKED, UNCHECKED)
        : items[index].replace(UNCHECKED, CHECKED);

      onChange(newItems);
    },
    [items, onChange, isEditable]
  );

  return (
    <ul
      className={`space-y-1 ${className ?? ""}`}
      style={{ color: currentTheme.fontColor }}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isChecked(item)}
            onChange={() => toggleCheckbox(index)}
            disabled={!isEditable}
            className="form-checkbox"
          />

          <ListItem
            item={stripPrefix(item)}
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
