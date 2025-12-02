"use client";

import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { memo, useCallback } from "react";

interface SearchProjectsProps {
  searchQuery: string;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
}

const SearchProjects = ({
  searchQuery,
  setSearchQuery,
}: SearchProjectsProps) => {
  const handleClear = useCallback(() => setSearchQuery(""), [setSearchQuery]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );

  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      <Input
        placeholder="Search by title, theme, or content..."
        value={searchQuery}
        onChange={handleChange}
        className="pl-9 pr-9"
      />

      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default memo(SearchProjects);
