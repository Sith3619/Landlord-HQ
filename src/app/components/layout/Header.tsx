import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";
import { CommandPalette } from "../common/CommandPalette";
import { NotificationPanel } from "../common/NotificationPanel";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search trigger — desktop */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 w-60 h-9 px-3 rounded-lg bg-muted/60 hover:bg-muted border border-border text-muted-foreground text-sm transition-colors"
                aria-label="Open search"
              >
                <Search className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 text-[10px] font-medium">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

              {/* Search trigger — mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setCmdOpen(true)}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              <NotificationPanel />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2 rounded-lg hover:bg-accent">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold">
                        JL
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium text-foreground">John Landlord</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">John Landlord</p>
                      <p className="text-xs text-muted-foreground font-normal">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
