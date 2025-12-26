import { useSlideStore } from "@/store/use-slide-store";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

type Props = {};
// WIP
const LayoutChooser = (props: Props) => {
  const { currentTheme } = useSlideStore();
  return (
    <ScrollArea
      className="h-[480px]"
      style={{
        backgroundColor: currentTheme.slideBgColor,
      }}
    >
      <div className="p-4"></div>
    </ScrollArea>
  );
};

export default LayoutChooser;
