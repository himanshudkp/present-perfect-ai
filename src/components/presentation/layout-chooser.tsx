import { useSlideStore } from "@/store/use-slide-store";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SLIDE_LAYOUTS } from "@/constants";
import LayoutItem from "./layout-item";

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
      <div className="p-4">
        {SLIDE_LAYOUTS.map((group) => {
          return (
            <div key={group.name} className="mb-b">
              <h3 className="text-sm font-medium my-4">{group.name}</h3>
              <div className="grid grid-cols-3 gap-2">
                {group.layouts.map((layout) => {
                  return <LayoutItem key={layout.layoutType} {...layout} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default LayoutChooser;
