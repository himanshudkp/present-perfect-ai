import { useSlideStore } from "@/store/use-slide-store";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LayoutTemplate, Palette, Type } from "lucide-react";
import LayoutChooser from "./layout-chooser";
import { ScrollArea } from "../ui/scroll-area";
import { COMPONENTS } from "@/constants";
import PreviewCard from "./preview-card";
import ThemeChooser from "./theme-chooser";
// WIP

const EditorSidebar = () => {
  const { currentTheme } = useSlideStore();
  return (
    <div className="fixed top-1/2 right-0 transform -translate-1/2 z-10">
      <div className="rounded-xl border-r-0 border border-background-70 shadow-lg p-2 flex flex-col items-center space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="h-10 w-10 rounded-full"
            >
              <LayoutTemplate className="w-5 h-5" />
              <span className="sr-only">Choose Layout</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="center"
            className="w-[480px] p-0"
            style={{
              backgroundColor: currentTheme.bgColor,
              color: currentTheme.fontColor,
            }}
          >
            <LayoutChooser />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="h-10 w-10 rounded-full"
            >
              <Type className="w-5 h-5" />
              <span className="sr-only">Choose Layout</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="center"
            className="w-[480px] p-0"
            style={{
              backgroundColor: currentTheme.bgColor,
              color: currentTheme.fontColor,
            }}
          >
            <ScrollArea className="h-[400px]">
              <div className="p-4 flex flex-col space-y-6">
                {COMPONENTS.map((group, idx) => {
                  return (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-1">
                        {group.name}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {group.components.map((item, idx) => {
                          return <PreviewCard key={idx} item={item} />;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="h-10 w-10 rounded-full"
            >
              <Palette className="w-5 h-5" />
              <span className="sr-only">Change style</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="center"
            className="w-80 p-0"
            style={{
              backgroundColor: currentTheme.bgColor,
              color: currentTheme.fontColor,
            }}
          >
            <ThemeChooser />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EditorSidebar;
