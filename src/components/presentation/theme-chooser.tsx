import { THEMES } from "@/constants";
import { useSlideStore } from "@/store/use-slide-store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "../ui/button";
import { Theme } from "@/types";
import { showError, showSuccess } from "../toast-message";
import { updateProjectTheme } from "@/actions/projects/update-theme";

type Props = {};

const ThemeChooser = (props: Props) => {
  const { currentTheme, setCurrentTheme, project } = useSlideStore();
  const { setTheme } = useTheme();

  const handleThemeChange = async (theme: Theme) => {
    if (!project) {
      showError("Failed to update theme.");
      return;
    }
    setTheme(theme.type);
    setCurrentTheme(theme);
    try {
      const res = await updateProjectTheme(project.id, theme.name);
      if (res.status !== 200) {
        showError("Failed to update theme.");
        throw Error("Failed to update theme.");
      }

      showSuccess("Theme updated successfully.");
    } catch (error) {
      console.error(error);
      showError("Failed to update theme.");
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="mb-4 text-center font-bold">
        <div className="flex flex-col space-y-4">
          {THEMES.map((theme) => {
            return (
              <Button
                key={theme.name}
                variant={
                  currentTheme.name === theme.name ? "default" : "outline"
                }
                className="flex flex-col items-center justify-start px-4 w-full h-auto"
                style={{
                  fontFamily: theme.fontFamily,
                  color: theme.fontColor,
                  background: theme.gradientBgColor || theme.bgColor,
                }}
                onClick={() => handleThemeChange(theme)}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xl font-bold">{theme.name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
                <div className="space-y-1 w-full">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: theme.accentColor }}
                  >
                    Title
                  </div>
                  <div className="text-base opacity-80">
                    Body &{" "}
                    <span style={{ color: theme.accentColor }}>link</span>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ThemeChooser;
