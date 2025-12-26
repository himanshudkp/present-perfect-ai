import { useSlideStore } from "@/store/use-slide-store";
import { Slide } from "@/types";
import { cn } from "@/utils";
import { RecursiveComponent } from "./recursive-component";

interface ScaledPreviewProps {
  slide: Slide;
  isActive: boolean;
  index: number;
}

const ScaledPreview = ({ index, isActive, slide }: ScaledPreviewProps) => {
  const { currentTheme } = useSlideStore();
  return (
    <div
      className={cn(
        "w-full relative aspect-video rounded-lg overflow-hidden transition-all duration-200 p-2 ring-2 ring-primary-80 ring-offset-2",
        isActive
          ? "ring-2 ring-blue-500 ring-offset-2"
          : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
      )}
      style={{
        fontFamily: currentTheme.fontFamily,
        color: currentTheme.accentColor,
        backgroundColor: currentTheme.slideBgColor,
        backgroundImage: currentTheme.gradientBgColor,
      }}
    >
      <div className="scale-[0.5] origin-top-left w-[200%] h-[200%] overflow-hidden">
        <RecursiveComponent
          slideId={slide.id}
          content={slide.content}
          onContentChange={() => {}}
          isPreview={true}
        />
      </div>
    </div>
  );
};

export default ScaledPreview;
