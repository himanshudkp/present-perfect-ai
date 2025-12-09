"use client";

import { getProjectById } from "@/actions/project";
import { Project } from "@/generated/prisma/client";
import { THEMES } from "@/lib/constants";
import { showError } from "@/components/toast-message";
import { useSlideStore } from "@/store/use-slide-store";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PresentationNavbar from "@/components/presentation/presentation-navbar";
import PresentationLayoutPreview from "@/components/presentation/presentation-layout-preview";
import PresentationEditor from "@/components/presentation/presentation-editor";
type Props = {};

const Presentation = (props: Props) => {
  const {
    setSlides,
    setProject,
    currentTheme,
    setCurrentTheme,
    slides,
    project,
  } = useSlideStore();
  const { presentationId } = useParams();
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProjectById(presentationId as string);
        if (res.status !== 200 || !res.data) {
          showError("Error", "Project Not Found.");
        }

        const project = res.data as Project;

        const presentationTheme = THEMES.find(
          (theme) => theme.name === project.theme
        );

        setTheme(presentationTheme?.type == "dark" ? "dark" : "light");
        setCurrentTheme(presentationTheme || THEMES[0]);

        setProject(project);

        const slideData =
          typeof project.slides === "string"
            ? JSON.parse(project.slides)
            : project.slides;

        setSlides(slideData);
      } catch (error) {
        console.error("Error while fetching project: ", error);
        showError("Error", "Unexpected error occurred, Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <PresentationNavbar presentationId={presentationId as string} />
      </div>
      <div
        className="flex-1 flex overflow-hidden pt-16 "
        style={{
          color: currentTheme.accentColor,
          fontFamily: currentTheme.fontFamily,
          backgroundColor: currentTheme.bgColor,
        }}
      >
        <PresentationLayoutPreview />
        <div className="flex-1 ml-64 pr-16">
          <PresentationEditor isEditable={true} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Presentation;
