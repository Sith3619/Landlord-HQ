import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";
import { formatDate } from "../../lib/formatters";

type CalendarView = "month" | "week" | "day";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  type: "lease-start" | "lease-end" | "lease-expiring" | "maintenance" | "inspection" | "rent-due";
  navigateTo: string;
  urgent?: boolean;
}

const EVENT_STYLES: Record<CalendarEvent["type"], { bg: string; text: string; dot: string }> = {
  "lease-start":    { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  "lease-end":      { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  "lease-expiring": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  "maintenance":    { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-500" },
  "inspection":     { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  "rent-due":       { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s: string): Date {
  return new Date(s + "T00:00:00");
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function EventChip({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const style = EVENT_STYLES[event.type];
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "w-full text-left text-[11px] px-1.5 py-0.5 rounded truncate font-medium leading-tight",
        style.bg, style.text
      )}
    >
      {event.title}
    </button>
  );
}

export function Calendar() {
  const navigate = useNavigate();
  const { leases, maintenanceTickets, inspections } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [filter, setFilter] = useState<"all" | CalendarEvent["type"]>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();

  // Build events from real data
  const events = useMemo((): CalendarEvent[] => {
    const result: CalendarEvent[] = [];

    for (const lease of leases) {
      if (lease.startDate) {
        result.push({
          id: `lease-start-${lease.id}`,
          date: lease.startDate,
          title: `Lease Start — ${lease.tenantName}`,
          subtitle: `Unit ${lease.unitNumber} · ${lease.propertyName}`,
          type: "lease-start",
          navigateTo: `/leases/${lease.id}`,
        });
      }
      if (lease.endDate) {
        const daysLeft = Math.ceil((parseDate(lease.endDate).getTime() - today.getTime()) / 86400000);
        const isExpiring = daysLeft >= 0 && daysLeft <= 60;
        result.push({
          id: `lease-end-${lease.id}`,
          date: lease.endDate,
          title: `Lease End — ${lease.tenantName}`,
          subtitle: `Unit ${lease.unitNumber} · ${lease.propertyName}`,
          type: isExpiring ? "lease-expiring" : "lease-end",
          navigateTo: `/leases/${lease.id}`,
          urgent: daysLeft >= 0 && daysLeft <= 14,
        });
      }
    }

    for (const ticket of maintenanceTickets) {
      if (ticket.scheduledDate) {
        result.push({
          id: `ticket-${ticket.id}`,
          date: ticket.scheduledDate,
          title: ticket.title,
          subtitle: `Unit ${ticket.unitNumber} · ${ticket.priority}`,
          type: "maintenance",
          navigateTo: `/maintenance/${ticket.id}`,
          urgent: ticket.priority === "Urgent" || ticket.priority === "High",
        });
      }
    }

    for (const insp of inspections) {
      result.push({
        id: `inspection-${insp.id}`,
        date: insp.scheduledDate,
        title: `${insp.type} Inspection`,
        subtitle: `Unit ${insp.unitNumber} · ${insp.propertyName}`,
        type: "inspection",
        navigateTo: `/inspections/${insp.id}`,
      });
    }

    return result;
  }, [leases, maintenanceTickets, inspections]);

  const filteredEvents = useMemo(
    () => filter === "all" ? events : events.filter(e => e.type === filter),
    [events, filter]
  );

  const eventsForDate = (dateStr: string) =>
    filteredEvents.filter(e => e.date === dateStr);

  // Month grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const gridDays: Date[] = [];
  let cursor = new Date(gridStart);
  while (cursor <= monthEnd || gridDays.length % 7 !== 0) {
    gridDays.push(new Date(cursor));
    cursor = addDays(cursor, 1);
    if (gridDays.length > 42) break;
  }

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => { setCurrentDate(new Date()); setSelectedDate(toDateStr(new Date())); };

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  // Upcoming events (next 30 days)
  const upcomingEvents = useMemo(() => {
    const now = toDateStr(today);
    const limit = toDateStr(addDays(today, 30));
    return filteredEvents
      .filter(e => e.date >= now && e.date <= limit)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10);
  }, [filteredEvents, today]);

  // Group upcoming events by date label for agenda view
  const agendaGroups = useMemo(() => {
    const todayStr = toDateStr(today);
    const tomorrowStr = toDateStr(addDays(today, 1));
    const weekStr = toDateStr(addDays(today, 7));
    const limit = toDateStr(addDays(today, 30));

    const grouped: { label: string; dateStr: string; events: CalendarEvent[] }[] = [];
    const seen = new Set<string>();

    const futureSorted = filteredEvents
      .filter(e => e.date >= todayStr && e.date <= limit)
      .sort((a, b) => a.date.localeCompare(b.date));

    for (const ev of futureSorted) {
      if (!seen.has(ev.date)) {
        seen.add(ev.date);
        let label: string;
        if (ev.date === todayStr) label = "Today";
        else if (ev.date === tomorrowStr) label = "Tomorrow";
        else {
          const d = parseDate(ev.date);
          label = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
        }
        grouped.push({ label, dateStr: ev.date, events: [] });
      }
      grouped[grouped.length - 1].events.push(ev);
    }

    return grouped;
  }, [filteredEvents, today]);

  return (
    <MainLayout title="Calendar">
      <div className="space-y-6">

        {/* Mobile agenda view */}
        <div className="md:hidden space-y-4">
          {/* Filter chips — scrollable row */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(["all", "lease-expiring", "lease-end", "maintenance", "inspection"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  filter === f
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {f !== "all" && (
                  <span className={cn("h-2 w-2 rounded-full", EVENT_STYLES[f]?.dot ?? "bg-muted-foreground/40")} />
                )}
                {f === "all" ? "All" : f === "lease-expiring" ? "Expiring" : f === "lease-end" ? "Lease ends" : f === "maintenance" ? "Maintenance" : "Inspections"}
              </button>
            ))}
          </div>

          {/* Agenda list */}
          {agendaGroups.length === 0 ? (
            <div className="bg-card border border-border rounded-xl px-5 py-12 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No upcoming events</p>
              <p className="text-xs text-muted-foreground mt-1">Next 30 days are clear</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendaGroups.map((group) => (
                <div key={group.dateStr}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">
                    {group.label}
                  </p>
                  <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
                    {group.events.map((ev) => {
                      const style = EVENT_STYLES[ev.type];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => navigate(ev.navigateTo)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/50 transition-colors"
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", style.dot)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug truncate">{ev.title}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{ev.subtitle}</p>
                          </div>
                          {ev.urgent && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop calendar view */}
        <div className="hidden md:block space-y-6">
          {/* Header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth} aria-label="Previous month">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth} aria-label="Next month">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={goToday}>
                Today
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(["all", "lease-expiring", "lease-end", "maintenance", "inspection"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                    filter === f
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-background border-border text-muted-foreground hover:border-green-400 hover:text-foreground"
                  )}
                >
                  {f !== "all" && (
                    <span className={cn("h-2 w-2 rounded-full", EVENT_STYLES[f]?.dot ?? "bg-muted-foreground/40")} />
                  )}
                  {f === "all" ? "All events" : f === "lease-expiring" ? "Expiring" : f === "lease-end" ? "Lease ends" : f === "maintenance" ? "Maintenance" : "Inspections"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Calendar grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {DAY_NAMES.map(d => (
                  <div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {gridDays.map((day, i) => {
                  const dateStr = toDateStr(day);
                  const dayEvents = eventsForDate(dateStr);
                  const isToday = isSameDay(day, today);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={cn(
                        "min-h-[88px] p-1.5 border-b border-r border-border cursor-pointer transition-colors",
                        i % 7 === 6 && "border-r-0",
                        Math.floor(i / 7) === Math.floor((gridDays.length - 1) / 7) && "border-b-0",
                        !isCurrentMonth && "opacity-40",
                        isSelected && "bg-green-50 dark:bg-green-950/20",
                        !isSelected && "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "h-6 w-6 flex items-center justify-center rounded-full text-xs font-medium mb-1",
                        isToday ? "bg-green-600 text-white" : "text-foreground"
                      )}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map(ev => (
                          <EventChip key={ev.id} event={ev} onClick={() => navigate(ev.navigateTo)} />
                        ))}
                        {dayEvents.length > 3 && (
                          <p className="text-[10px] text-muted-foreground px-1">
                            +{dayEvents.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {selectedDate && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">{formatDate(selectedDate)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedEvents.length === 0 ? "No events" : `${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="divide-y divide-border">
                    {selectedEvents.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No events on this day
                      </div>
                    ) : selectedEvents.map(ev => {
                      const style = EVENT_STYLES[ev.type];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => navigate(ev.navigateTo)}
                          className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className={cn("mt-1.5 h-2 w-2 rounded-full flex-shrink-0", style.dot)} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{ev.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">Upcoming (30 days)</p>
                </div>
                <div className="divide-y divide-border">
                  {upcomingEvents.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No upcoming events
                    </div>
                  ) : upcomingEvents.map(ev => {
                    const style = EVENT_STYLES[ev.type];
                    return (
                      <button
                        key={ev.id}
                        onClick={() => navigate(ev.navigateTo)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className={cn("mt-1.5 h-2 w-2 rounded-full flex-shrink-0", style.dot)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(ev.date)}</p>
                        </div>
                        {ev.urgent && (
                          <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legend</p>
                {(Object.entries(EVENT_STYLES) as [CalendarEvent["type"], typeof EVENT_STYLES[keyof typeof EVENT_STYLES]][]).map(([type, style]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", style.dot)} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {type === "lease-start" ? "Lease Start" :
                       type === "lease-end" ? "Lease End" :
                       type === "lease-expiring" ? "Expiring (≤60 days)" :
                       type === "maintenance" ? "Maintenance" :
                       type === "inspection" ? "Inspection" : "Rent Due"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
