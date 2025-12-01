"use client";

import { Search } from "lucide-react";
import { memo } from "react";

export const EmptySearchResult = memo(() => (
  <div className="py-12 text-center text-sm text-muted-foreground">
    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
    <p>No results found</p>
    <p className="text-xs mt-1">Try a different search term</p>
  </div>
));
