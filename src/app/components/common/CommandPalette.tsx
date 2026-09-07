import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, Building2, DoorOpen, Users, Wrench, FileText, ScrollText, ClipboardCheck, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { cn } from "../../lib/utils";
import { mockSearchService } from "../../../services/mock/searchService";
import type { SearchResult } from "../../../services/interfaces";

const QUICK_ACTIONS = [
  { label: "Add Property", icon: Building2, href: "/properties", action: "add-property" },
  { label: "Add Unit", icon: DoorOpen, href: "/units", action: "add-unit" },
  { label: "Add Tenant", icon: Users, href: "/tenants", action: "add-tenant" },
  { label: "New Maintenance Ticket", icon: Wrench, href: "/maintenance", action: "add-ticket" },
  { label: "Upload Document", icon: FileText, href: "/documents", action: "add-document" },
  { label: "Schedule Inspection", icon: ClipboardCheck, href: "/inspections", action: "add-inspection" },
  { label: "Create Lease", icon: ScrollText, href: "/leases", action: "add-lease" },
];

const RESULT_ICONS: Record<string, typeof Building2> = {
  property: Building2,
  unit: DoorOpen,
  tenant: Users,
  ticket: Wrench,
  inspection: ClipboardCheck,
  document: FileText,
  lease: ScrollText,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = query.trim()
    ? results
    : QUICK_ACTIONS.map((a) => ({ type: "action" as const, id: 0, title: a.label, subtitle: "Quick action", navigateTo: a.href, _icon: a.icon }));

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const r = await mockSearchService.search(query);
        setResults(r);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((navigateTo: string) => {
    onOpenChange(false);
    navigate(navigateTo);
  }, [navigate, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && items[activeIndex]) { handleSelect(items[activeIndex].navigateTo); }
    if (e.key === "Escape") { onOpenChange(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 max-w-xl overflow-hidden border-border shadow-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Command palette — search or run a quick action</DialogTitle>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search properties, tenants, units..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 py-4 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {!query.trim() && (
            <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </p>
          )}
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Searching...</div>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          )}
          {!loading && items.map((item, i) => {
            const Icon = ("_icon" in item ? item._icon : RESULT_ICONS[item.type]) ?? Search;
            return (
              <button
                key={`${item.type}-${item.id}-${i}`}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  i === activeIndex
                    ? "bg-accent text-foreground"
                    : "text-foreground hover:bg-accent/50"
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(item.navigateTo)}
              >
                <div className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-md flex-shrink-0",
                  !query.trim() ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-3.5 w-3.5",
                    !query.trim() ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  )} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                </div>
                {!query.trim() && (
                  <Plus className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[11px] text-muted-foreground">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
