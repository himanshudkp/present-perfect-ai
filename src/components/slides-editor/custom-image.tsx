"use client";

import { memo, type SyntheticEvent, useCallback, useMemo } from "react";
import Image from "next/image";
import UploadImage from "./upload-image";

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  isPreview?: boolean;
  contentId: string;
  onContentChange: (contentId: string, newContent: any) => void;
  isEditable?: boolean;
}

export const CustomImage = memo(
  ({
    alt,
    contentId,
    onContentChange,
    src,
    className,
    isEditable = true,
    isPreview = false,
  }: CustomImageProps) => {
    const imageHeight = useMemo(() => {
      return isPreview ? 48 : 600;
    }, [isPreview]);

    const imageWidth = useMemo(() => {
      return isPreview ? 48 : 800;
    }, [isPreview]);

    const handleError = useCallback(
      (e: SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src =
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
      },
      []
    );

    return (
      <div className="relative group w-full h-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className={`object-cover w-full h-full transition-transform group-hover:scale-105 ${className}`}
          loading="lazy"
          onError={handleError}
        />
        {!isPreview && isEditable && (
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-all">
            <UploadImage
              contentId={contentId}
              onContentChange={onContentChange}
            />
          </div>
        )}
      </div>
    );
  }
);
