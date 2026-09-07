import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 bg-muted/50 border-border"
        />
      </div>
      {filters}
    </div>
  );
}
