"use client";

import { memo } from "react";
import SearchBar from "./command-palette";
import ThemeSwitcher from "./theme-switcher";
import NewProjectButton from "./new-project-button";
import ImportButton from "./import-button";
import ToggleSidebar from "./toggle-sidebar";
import type { User } from "@/generated/prisma/client";

const UpperInfoBar = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-background/95 backdrop-blur-md p-3 sm:p-4 justify-between transition-all duration-200 shadow-sm">
      <ToggleSidebar />

      <div className="flex-1 max-w-xl mx-2 sm:mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-5 ml-auto flex-wrap justify-end">
        <ThemeSwitcher />

        <ImportButton />

        <NewProjectButton user={user} />
      </div>
    </header>
  );
};

export default memo(UpperInfoBar);
