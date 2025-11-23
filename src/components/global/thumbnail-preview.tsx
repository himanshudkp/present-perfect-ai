import { Slide, Theme } from "@/lib/types";
import Image from "next/image";
import React from "react";

type Props = {
  slides: Slide;
  theme: Theme;
};

const ThumbnailPreview = ({ slides, theme }: Props) => {
  return (
    <div
      className={
        "w-full relative rounded-lg overflow-hidden transition-all duration-200 p-2"
      }
      style={{
        fontFamily: theme.fontFamily,
        color: theme.accentColor,
        backgroundColor: theme.slideBgColor,
        backgroundImage: theme.gradientBgColor,
      }}
    >
      {slides ? (
        <div className="scale-[0.5] origin-top-left w-[200%] overflow-hidden">
          This is an slide
        </div>
      ) : (
        <div className="w-full h-full bg-gray-400 justify-center items-center">
          <Image
            className="w-6 h-6 text-gray-500"
            alt="image"
            width={0}
            height={0}
            src={""}
          />
        </div>
      )}
    </div>
  );
};

export default ThumbnailPreview;

// import { Slide, Theme } from "@/lib/types";
// import Image from "next/image";
// import React, { useMemo } from "react";
// import { cn } from "@/lib/utils";
// import { FileText, ImageIcon, Presentation } from "lucide-react";

// type Props = {
//   slides: Slide | Slide[];
//   theme: Theme;
//   className?: string;
//   showSlideCount?: boolean;
//   variant?: "default" | "compact" | "detailed";
// };

// const ThumbnailPreview = ({
//   slides,
//   theme,
//   className,
//   showSlideCount = false,
//   variant = "default",
// }: Props) => {
//   // Normalize slides to array
//   const slideArray = useMemo(() => {
//     return Array.isArray(slides) ? slides : [slides];
//   }, [slides]);

//   const firstSlide = slideArray[0];
//   const slideCount = slideArray.length;

//   // Check if slide has content
//   const hasContent = useMemo(() => {
//     if (!firstSlide) return false;
//     return (
//       firstSlide.title?.trim() ||
//       firstSlide.content?.trim() ||
//       firstSlide.bulletPoints?.length > 0
//     );
//   }, [firstSlide]);

//   // Render slide content based on variant
//   const renderSlideContent = () => {
//     if (!firstSlide || !hasContent) {
//       return (
//         <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-2">
//           <Presentation className="w-8 h-8 opacity-50" />
//           <p className="text-xs opacity-70">Empty Slide</p>
//         </div>
//       );
//     }

//     if (variant === "compact") {
//       return (
//         <div className="p-3 space-y-2 h-full flex flex-col">
//           {firstSlide.title && (
//             <h3 className="text-sm font-bold line-clamp-2 leading-tight">
//               {firstSlide.title}
//             </h3>
//           )}
//           {firstSlide.content && (
//             <p className="text-[10px] leading-tight line-clamp-2 opacity-80">
//               {firstSlide.content}
//             </p>
//           )}
//           {firstSlide.bulletPoints && firstSlide.bulletPoints.length > 0 && (
//             <ul className="text-[9px] space-y-0.5 list-disc list-inside line-clamp-3 opacity-70">
//               {firstSlide.bulletPoints.slice(0, 3).map((point, idx) => (
//                 <li key={idx} className="truncate">
//                   {point}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       );
//     }

//     if (variant === "detailed") {
//       return (
//         <div className="p-4 space-y-3 h-full flex flex-col">
//           {/* Header with slide number */}
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               {firstSlide.title && (
//                 <h2 className="text-base font-bold line-clamp-2 leading-tight mb-2">
//                   {firstSlide.title}
//                 </h2>
//               )}
//               {firstSlide.content && (
//                 <p className="text-xs leading-relaxed line-clamp-3 opacity-90 mb-3">
//                   {firstSlide.content}
//                 </p>
//               )}
//             </div>
//             <div className="text-[10px] font-semibold opacity-50 ml-2">
//               {firstSlide.order || 1}
//             </div>
//           </div>

//           {/* Bullet points */}
//           {firstSlide.bulletPoints && firstSlide.bulletPoints.length > 0 && (
//             <ul className="text-xs space-y-1.5 flex-1">
//               {firstSlide.bulletPoints.slice(0, 4).map((point, idx) => (
//                 <li key={idx} className="flex items-start gap-2">
//                   <span className="text-[8px] mt-1">●</span>
//                   <span className="flex-1 line-clamp-1 leading-tight">
//                     {point}
//                   </span>
//                 </li>
//               ))}
//               {firstSlide.bulletPoints.length > 4 && (
//                 <li className="text-[10px] opacity-60 ml-4">
//                   +{firstSlide.bulletPoints.length - 4} more
//                 </li>
//               )}
//             </ul>
//           )}

//           {/* Footer with icons */}
//           <div className="flex items-center gap-3 pt-2 border-t border-current/10 text-[10px] opacity-50">
//             {firstSlide.title && <FileText className="w-3 h-3" />}
//             {firstSlide.imageUrl && <ImageIcon className="w-3 h-3" />}
//             {firstSlide.bulletPoints && firstSlide.bulletPoints.length > 0 && (
//               <span>{firstSlide.bulletPoints.length} points</span>
//             )}
//           </div>
//         </div>
//       );
//     }

//     // Default variant
//     return (
//       <div className="p-3 space-y-2 h-full flex flex-col">
//         {firstSlide.title && (
//           <h3 className="text-xs font-bold line-clamp-2 leading-tight">
//             {firstSlide.title}
//           </h3>
//         )}
//         {firstSlide.content && (
//           <p className="text-[10px] leading-tight line-clamp-3 opacity-80">
//             {firstSlide.content}
//           </p>
//         )}
//         {firstSlide.bulletPoints && firstSlide.bulletPoints.length > 0 && (
//           <ul className="text-[9px] space-y-0.5 list-disc list-inside line-clamp-2 opacity-70">
//             {firstSlide.bulletPoints.slice(0, 2).map((point, idx) => (
//               <li key={idx} className="truncate">
//                 {point}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div
//       className={cn(
//         "w-full aspect-video relative rounded-lg overflow-hidden transition-all duration-200",
//         "shadow-sm border border-black/10",
//         className
//       )}
//       style={{
//         fontFamily: theme.fontFamily,
//         color: theme.textColor || theme.accentColor,
//         backgroundColor: theme.slideBgColor,
//         backgroundImage: theme.gradientBgColor,
//       }}
//     >
//       {/* Slide content */}
//       <div className="relative w-full h-full">
//         {firstSlide ? (
//           renderSlideContent()
//         ) : (
//           <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
//             <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
//               <Presentation className="w-6 h-6 opacity-30" />
//             </div>
//             <p className="text-xs font-medium opacity-50">
//               No Preview Available
//             </p>
//             <p className="text-[10px] opacity-30">Slide data not found</p>
//           </div>
//         )}

//         {/* Slide count badge */}
//         {showSlideCount && slideCount > 1 && (
//           <div
//             className="absolute bottom-2 right-2 px-2 py-1 rounded text-[10px] font-semibold backdrop-blur-sm"
//             style={{
//               backgroundColor: `${theme.accentColor}20`,
//               color: theme.accentColor,
//               border: `1px solid ${theme.accentColor}40`,
//             }}
//           >
//             {slideCount} {slideCount === 1 ? "slide" : "slides"}
//           </div>
//         )}

//         {/* Theme accent indicator */}
//         <div
//           className="absolute top-0 left-0 w-full h-1"
//           style={{
//             background: `linear-gradient(to right, ${theme.accentColor}, transparent)`,
//           }}
//         />

//         {/* Corner fold effect */}
//         <div
//           className="absolute top-0 right-0 w-8 h-8 opacity-5"
//           style={{
//             background: `linear-gradient(135deg, transparent 0%, transparent 50%, ${theme.accentColor} 50%, ${theme.accentColor} 100%)`,
//           }}
//         />
//       </div>

//       {/* Hover overlay for interactivity */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
//     </div>
//   );
// };

// export default ThumbnailPreview;
