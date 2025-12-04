import { useSlideStore } from "@/store/use-slide-store";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Home, Play, Share } from "lucide-react";
import { showSuccess } from "../toast-message";

const PresentationNavbar = ({ presentationId }: { presentationId: string }) => {
  const { currentTheme } = useSlideStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationId}`
    );
    showSuccess("Success", "Link has been copied to your clipboard.");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center py-4 border-b"
      style={{
        backgroundColor: currentTheme.navbarColor || currentTheme.bgColor,
        color: currentTheme.accentColor,
      }}
    >
      <Link href={"/dashboard"} passHref>
        <Button
          variant={"outline"}
          className="flex items-center gap-2"
          style={{ backgroundColor: currentTheme.bgColor }}
        >
          <Home />
          <span className="hidden sm:inline">Return Home</span>
        </Button>
      </Link>
      <Link
        href={"/presentation/template-market"}
        passHref
        className="text-lg font-semibold hidden sm:block "
      >
        Presentation Editor
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          style={{ backgroundColor: currentTheme.bgColor }}
          onClick={handleCopy}
        >
          <Share className="w-4 h-4" />
        </Button>
        {/* TODO */}
        {/* <SellTemplates/> */}
        <Button
          variant={"default"}
          className="flex items-center gap-2"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>
      {/* TODO */}
      {/* {isPresentationMode && <PresentationMode />} */}
    </nav>
  );
};

export default PresentationNavbar;
