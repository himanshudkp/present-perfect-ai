"use client";

import { memo, useMemo } from "react";
import { useSlideStore } from "@/store/use-slide-store";

interface TableContentsProps {
  items: string[];
  onItemClick: (id: string) => void;
  className?: string;
}

const TableContents = memo(({ items, className }: TableContentsProps) => {
  const { currentTheme } = useSlideStore();

  const style = useMemo(() => {
    return {
      color: currentTheme.fontColor,
    };
  }, [currentTheme.fontColor]);

  return (
    <nav className={`space-y-2 ${className}`} style={style}>
      {items.map((item, index) => {
        return (
          <div key={index} className="cursor-pointer hover:underline">
            {item}
          </div>
        );
      })}
    </nav>
  );
});

export default TableContents;
