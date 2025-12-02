"use client";

import React, { memo, useMemo } from "react";
import { Slide, Theme } from "@/types";
import Image from "next/image";

type ThumbnailPreviewProps = {
  slides: Slide[];
  theme: Theme;
};

const ThumbnailPreview = ({ slides, theme }: ThumbnailPreviewProps) => {
  const hasSlides = Boolean(slides && slides.length > 0);

  const bgStyle = useMemo(
    () => ({
      fontFamily: theme.fontFamily,
      color: theme.accentColor,
      backgroundColor: theme.slideBgColor,
      backgroundImage: theme.gradientBgColor,
    }),
    [theme]
  );

  return (
    <div
      className="w-full h-full relative rounded-lg overflow-hidden transition-all duration-200 p-2"
      style={bgStyle}
    >
      {hasSlides ? (
        <div className="scale-[0.5] origin-top-left w-[200%] overflow-hidden flex justify-center items-center">
          <div className="flex flex-col items-center text-center max-w-[60%] space-y-4">
            <h1 className="text-red-500 text-4xl font-bold">
              The Future of Web Development
            </h1>

            <h2 className="text-blue-700 text-2xl font-semibold">
              Modern Tools • Better DX • Faster Apps
            </h2>

            <h3 className="text-teal-500 text-xl">
              Key Insights & Trends You Should Know
            </h3>

            <p className="text-base leading-relaxed text-black/80">
              Web development is evolving rapidly with frameworks like Next.js,
              server components, AI-assisted tooling, and edge-based
              architectures. Understanding these trends helps developers build
              faster, more scalable, and more engaging user experiences.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-400 flex justify-center items-center">
          <Image
            className="w-6 h-6 text-gray-500"
            alt="image"
            width={0}
            height={0}
            src={"/logo.png"}
          />
        </div>
      )}
    </div>
  );
};

export default memo(ThumbnailPreview);
