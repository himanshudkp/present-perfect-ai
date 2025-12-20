"use client";

import { useEffect, useState } from "react";

export const useDeleteConfirm = (isHovered: boolean) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isHovered) setShowDeleteConfirm(false);
  }, [isHovered]);

  return [showDeleteConfirm, setShowDeleteConfirm] as const;
};
