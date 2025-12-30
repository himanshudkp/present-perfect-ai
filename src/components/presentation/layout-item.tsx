import { useSlideStore } from "@/store/use-slide-store";
import type { Layout } from "@/types";
import { RefAttributes } from "react";
import { useDrag, useDrop } from "react-dnd";
import PreviewItem from "./preview-item";

const LayoutItem = ({ component, icon, layoutType, name, type }: Layout) => {
  const { currentTheme } = useSlideStore();
  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: "layout",
      item: { type, layoutType, component },
      collect(monitor) {
        return { isDragging: !!monitor.isDragging };
      },
    };
  });
  return (
    <div
      ref={drag as unknown as RefAttributes<HTMLDivElement>["ref"]}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: currentTheme.slideBgColor,
      }}
      className="border rounded-lg"
    >
      <PreviewItem name={name} Icon={icon} type={type} component={component} />
    </div>
  );
};

export default LayoutItem;
