import { useSlideStore } from "@/store/use-slide-store";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LayoutTemplate } from "lucide-react";
import LayoutChooser from "./layout-chooser";
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
          <PopoverContent side="left" align="center" className="w-[480px] p-0">
            <LayoutChooser />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EditorSidebar;
