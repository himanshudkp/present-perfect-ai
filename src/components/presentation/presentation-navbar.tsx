"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Home, Play, Share } from "lucide-react";
import { Button } from "../ui/button";
import { showSuccess } from "../toast-message";
import { useSlideStore } from "@/store/use-slide-store";

interface PresentationNavbarProps {
  presentationId: string;
  onPresentClick?: () => void;
}

const PresentationNavbar = memo(
  ({ presentationId, onPresentClick }: PresentationNavbarProps) => {
    const { currentTheme } = useSlideStore();

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/share/${presentationId}`
        );
        showSuccess("Success", "Link copied to clipboard");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [presentationId]);

    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center px-4 py-2 border-b"
        style={{
          backgroundColor: currentTheme.navbarColor || currentTheme.bgColor,
          color: currentTheme.accentColor,
        }}
      >
        <Link href="/dashboard" passHref>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            style={{ backgroundColor: currentTheme.bgColor }}
            aria-label="Return to dashboard"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Dashboard</span>
          </Button>
        </Link>

        <h1 className="text-lg font-semibold hidden sm:block">
          Presentation Editor
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            style={{ backgroundColor: currentTheme.bgColor }}
            onClick={handleCopy}
            aria-label="Share presentation"
          >
            <Share className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Share</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={onPresentClick}
            aria-label="Start presentation"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Present</span>
          </Button>
          {}
        </div>
      </nav>
    );
  }
);

export default PresentationNavbar;
