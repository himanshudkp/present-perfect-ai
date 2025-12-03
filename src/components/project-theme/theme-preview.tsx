"use client";
import { useSlideStore } from "@/store/use-slide-store";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAnimation } from "framer-motion";
import { Theme } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ThemeCard from "./theme-card";

type Props = {};

const ThemePreview = (props: Props) => {
  const router = useRouter();
  const { presentationId } = useParams();
  const { currentTheme, setCurrentTheme, project } = useSlideStore();
  const controls = useAnimation();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    if (!project?.slides) {
      // redirect(`/presentation/${presentationId}`);
    }
  }, [project]);

  useEffect(() => {
    controls.start("visible");
  }, [controls, selectedTheme]);

  const leftCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: selectedTheme.accentColor }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{ backgroundColor: selectedTheme.accentColor }}
        >
          Quick Start Guide
        </h3>
        <ol
          style={{ color: selectedTheme.accentColor }}
          className="list-decimal list-inside space-y-2"
        >
          <li>Choose a theme</li>
          <li>Customize colors and fonts</li>
          <li> Add your content</li>
          <li> Preview and publish</li>
        </ol>
      </div>
      <Button
        className="w-full h-12 font-medium"
        style={{
          backgroundColor: selectedTheme.accentColor,
          color: selectedTheme.accentColor,
        }}
      >
        Get Started
      </Button>
    </div>
  );

  const mainCardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: selectedTheme.accentColor + "10" }}
        >
          <p style={{ color: selectedTheme.accentColor }}>
            This is a smart layout , it acts as a text box.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: selectedTheme.accentColor + "10" }}
        >
          <p style={{ color: selectedTheme.accentColor }}>
            You get these by typing /smart
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="h-12 px-6 text-lg font-medium"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.fontColor,
          }}
        >
          Primary button
        </Button>
        <Button
          variant={"outline"}
          className="h-12 px-6 text-lg font-medium"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.fontColor,
          }}
        >
          Secondary button
        </Button>
      </div>
    </div>
  );

  const rightCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl px-6"
        style={{ backgroundColor: selectedTheme.accentColor + "10" }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: selectedTheme.accentColor }}
        >
          Theme features
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li> Responsive design</li>
          <li>Dark & light mode</li>
          <li>Custom color schema</li>
          <li>Accessibility optimized</li>
        </ul>
      </div>
      <Button
        variant={"outline"}
        className="h-12 px-6 text-lg font-medium"
        style={{
          backgroundColor: selectedTheme.accentColor,
          color: selectedTheme.fontColor,
        }}
      >
        Explore features
      </Button>
    </div>
  );

  return (
    <div
      className="h-screen w-full flex"
      style={{
        backgroundColor: selectedTheme.bgColor,
        color: selectedTheme.accentColor,
        fontFamily: selectedTheme.fontFamily,
      }}
    >
      <div className="grow overflow-y-auto">
        <div className="p-12 flex flex-col items-center min-h-screen">
          <Button
            variant={"outline"}
            className="mb-12 self-start"
            size={"lg"}
            style={{
              backgroundColor: selectedTheme.accentColor + "10",
              color: selectedTheme.accentColor,
              borderColor: selectedTheme.accentColor + "20",
            }}
            onClick={() => router.push("/new-project")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back</span>
          </Button>
          <div className="w-full flex justify-center relative grow">
            <ThemeCard
              content={leftCardContent}
              controls={controls}
              description="Get up and running in no time"
              theme={selectedTheme}
              title="Quick Start"
              variant="left"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
