"use client";

import { useEffect, useRef } from "react";

export const useInputFocus = (open: boolean) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  return inputRef;
};
