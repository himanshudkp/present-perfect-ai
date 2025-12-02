"use client";
import { getProjectById } from "@/actions/project";
import { Project } from "@/generated/prisma/client";
import { THEMES } from "@/utils/constants";
import { showError } from "@/components/toast-message";
import { useSlideStore } from "@/store/use-slide-store";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { DndProvider } from "react-dnd";
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
  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-black">{project?.title}</h1>

        <div className="space-y-10">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="w-full aspect-video rounded-lg border shadow bg-white p-6"
              style={{
                fontFamily: currentTheme?.fontFamily || "sans-serif",
                color: currentTheme?.accentColor || currentTheme?.accentColor,
                backgroundColor: currentTheme?.slideBgColor,
                backgroundImage: currentTheme?.gradientBgColor,
              }}
            >
              <h1 className="text-xl font-semibold mb-3 text-red-600">
                Slide - {i}
              </h1>
              <h2 className="text-xl font-semibold mb-3">Slide Title - {i}</h2>

              {[...Array(6)].map(() => (
                <p className="text-sm leading-relaxed mb-3 text-teal-500">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae
                  autem, amet assumenda, totam explicabo incidunt dolores eos
                  necessitatibus neque pariatur odio quibusdam illum. At porro
                  dolores, provident consectetur reprehenderit a?
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Presentation;
