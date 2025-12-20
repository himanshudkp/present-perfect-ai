"use client";

import { useEffect } from "react";

export const useCardEdit = (
  isEditing: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>
) => {
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, inputRef]);
};
