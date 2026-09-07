import { useState } from "react";
import { Home, Building2, DoorOpen, Users, Wrench, FileText, Settings, ScrollText, ClipboardCheck, Calendar, MoreHorizontal, X, Plus, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Units", href: "/units", icon: DoorOpen },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Leases", href: "/leases", icon: ScrollText },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

const bottomNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Calendar", href: "/calendar", icon: Calendar },
];

const moreNavItems = [
  { name: "Units", href: "/units", icon: DoorOpen },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Leases", href: "/leases", icon: ScrollText },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

const fabActions = [
  { label: "Add Property", href: "/properties" },
  { label: "Add Unit", href: "/units" },
  { label: "Add Tenant", href: "/tenants" },
  { label: "New Maintenance Ticket", href: "/maintenance" },
  { label: "Upload Document", href: "/documents" },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 h-16 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 flex-shrink-0">
            <Building2 className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground leading-none">
            Landlord HQ
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-green-600/10 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">JL</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">John Landlord</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const isMoreActive = moreNavItems.some(
    (item) => location.pathname === item.href || location.pathname.startsWith(item.href)
  );

  return (
    <>
      {/* FAB overlay backdrop */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* FAB action menu */}
      {fabOpen && (
        <div className="fixed bottom-[88px] right-4 z-50 md:hidden flex flex-col gap-2 items-end">
          {fabActions.map((action) => (
            <button
              key={action.href}
              onClick={() => { navigate(action.href); setFabOpen(false); }}
              className="flex items-center gap-3 bg-card border border-border text-foreground text-sm font-medium px-4 py-3 rounded-xl shadow-lg min-w-[200px] hover:bg-accent transition-colors"
            >
              <span className="flex-1 text-left">{action.label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setFabOpen((o) => !o)}
        className={cn(
          "fixed bottom-[76px] right-4 z-50 md:hidden h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
          fabOpen
            ? "bg-foreground text-background rotate-45"
            : "bg-green-600 text-white"
        )}
        aria-label="Quick actions"
      >
        <Plus className="h-5 w-5" />
      </button>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-card border-t border-border safe-area-inset-bottom">
        <div className="flex items-stretch h-16">
          {bottomNavItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors min-h-0",
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
              isMoreActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className={cn("h-5 w-5", isMoreActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
            More
          </button>
        </div>
      </nav>

      {/* More sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="p-0 rounded-t-2xl bg-card max-h-[80vh]">
          <SheetDescription className="sr-only">Additional navigation sections</SheetDescription>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <SheetTitle className="text-base font-semibold text-foreground">More</SheetTitle>
            <button
              onClick={() => setMoreOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <nav className="px-3 py-3 space-y-0.5">
            {moreNavItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-600/10 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="pb-6" />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
      <div className="flex flex-col flex-grow border-r border-border bg-card overflow-y-auto">
        <NavContent />
      </div>
    </div>
  );
}
