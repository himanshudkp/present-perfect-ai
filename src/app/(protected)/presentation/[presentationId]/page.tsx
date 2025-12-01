"use client";
import { getProjectById } from "@/actions/project";
import { Project } from "@/generated/prisma/client";
import { THEMES } from "@/constants";
import { showError } from "@/components/toast";
import { useSlideStore } from "@/store/use-slide-store";
import { tr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
type Props = {};

const Presentation = (props: Props) => {
  const { setSlides, setProject, currentTheme, setCurrentTheme } =
    useSlideStore();
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

        console.log({ project });

        const presentationTheme = THEMES.find(
          (theme) => theme.name === project.theme
        );

        setTheme(presentationTheme?.type == "dark" ? "dark" : "light");
        setCurrentTheme(presentationTheme || THEMES[0]);

        setProject(project);

        setSlides(JSON.parse(JSON.stringify(project.slides)));
      } catch (error) {
        console.log("Error while fetching project: ", error);
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
  //<DndProvider></DndProvider>
  return <></>;
};

export default Presentation;
