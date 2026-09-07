import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Building2, DoorOpen, Users, Wrench, FileText, Plus,
  CheckCircle2, ScrollText, ArrowRight, TrendingUp, Calendar, Bell,
} from "lucide-react";
import { useApp, computeLeaseStatus } from "../context/AppContext";
import { useNavigate } from "react-router";
import { formatDate, formatRelativeDate } from "../../lib/formatters";
import { cn } from "../lib/utils";


const METRIC_CONFIG = [
  { key: "properties", label: "Properties",     icon: Building2,    color: "text-blue-600",    bg: "bg-blue-500/10",    href: "/properties" },
  { key: "units",      label: "Total Units",    icon: DoorOpen,     color: "text-violet-600",  bg: "bg-violet-500/10", href: "/units" },
  { key: "occupied",   label: "Occupied Units", icon: CheckCircle2, color: "text-green-600",   bg: "bg-green-500/10",  href: "/units" },
  { key: "vacant",     label: "Vacant Units",   icon: DoorOpen,     color: "text-amber-600",   bg: "bg-amber-500/10",  href: "/units" },
  { key: "tenants",    label: "Active Tenants", icon: Users,        color: "text-indigo-600",  bg: "bg-indigo-500/10", href: "/tenants" },
  { key: "tickets",    label: "Open Tickets",   icon: Wrench,       color: "text-orange-600",  bg: "bg-orange-500/10", href: "/maintenance" },
];

type AttentionPriority = "critical" | "high" | "medium" | "info";

const PRIORITY_STYLE: Record<AttentionPriority, { dot: string; badge: string }> = {
  critical: { dot: "bg-red-500",    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high:     { dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  medium:   { dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  info:     { dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export function Dashboard() {
  const {
    properties, units, tenants, maintenanceTickets, leases,
    rentPayments, activityEvents, documents,
  } = useApp();
  const navigate = useNavigate();

  const totalProperties = properties.filter(p => !p.isArchived).length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === "Occupied").length;
  const vacantUnits = units.filter(u => u.status === "Vacant").length;
  const activeTenants = tenants.filter(t => t.lifecycleStatus === "Active").length;
  const openTickets = maintenanceTickets.filter(t => t.status !== "Completed").length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const metrics: Record<string, { value: number; sub?: string }> = {
    properties: { value: totalProperties },
    units:      { value: totalUnits },
    occupied:   { value: occupiedUnits, sub: `${occupancyRate}% occupancy` },
    vacant:     { value: vacantUnits },
    tenants:    { value: activeTenants },
    tickets:    { value: openTickets },
  };

  const overduePayments = rentPayments.filter(p => p.status === "Overdue");
  const expiringLeases  = leases.filter(l => computeLeaseStatus(l) === "Expiring Soon");
  const urgentTickets   = maintenanceTickets.filter(
    t => t.status !== "Completed" && (t.priority === "Urgent" || t.priority === "High")
  );
  const unassignedTenants = tenants.filter(
    t => !t.unitId && t.lifecycleStatus !== "Former Tenant" && t.lifecycleStatus !== "Archived"
  );

  const attentionItems: { id: string; priority: AttentionPriority; label: string; title: string; detail: string; href: string }[] = [
    ...overduePayments.map(p => {
      const tenant = tenants.find(t => t.id === p.tenantId);
      const unit = units.find(u => u.id === p.unitId);
      return {
        id: `od-${p.id}`, priority: "critical" as AttentionPriority, label: "Overdue Rent",
        title: `${tenant?.fullName ?? "Tenant"} — $${p.amountDue.toLocaleString()}`,
        detail: `${unit?.propertyName ?? ""} · Unit ${unit?.unitNumber ?? ""} · Due ${formatDate(p.dueDate)}`,
        href: `/leases/${p.leaseId}`,
      };
    }),
    ...urgentTickets.map(t => ({
      id: `tk-${t.id}`,
      priority: (t.priority === "Urgent" ? "critical" : "high") as AttentionPriority,
      label: `${t.priority} Priority`, title: t.title,
      detail: `${t.propertyName} · Unit ${t.unitNumber}`, href: `/maintenance/${t.id}`,
    })),
    ...expiringLeases.map(l => ({
      id: `lx-${l.id}`, priority: "high" as AttentionPriority, label: "Lease Expiring",
      title: `${l.tenantName} — Unit ${l.unitNumber}`,
      detail: `${l.propertyName} · Ends ${formatDate(l.endDate)}`, href: `/leases/${l.id}`,
    })),
    ...units.filter(u => u.status === "Vacant").slice(0, 2).map(u => ({
      id: `vc-${u.id}`, priority: "medium" as AttentionPriority, label: "Vacant Unit",
      title: `Unit ${u.unitNumber}`,
      detail: `${u.propertyName} · $${u.rent?.toLocaleString()}/mo`, href: `/units/${u.id}`,
    })),
    ...unassignedTenants.slice(0, 2).map(t => ({
      id: `ut-${t.id}`, priority: "info" as AttentionPriority, label: "No Unit Assigned",
      title: t.fullName, detail: t.email, href: `/tenants/${t.id}`,
    })),
  ].slice(0, 8);

  function activityIcon(type: string) {
    if (type.startsWith("maintenance")) return Wrench;
    if (type.startsWith("document")) return FileText;
    if (type.startsWith("property")) return Building2;
    if (type.startsWith("lease") || type.startsWith("rent")) return ScrollText;
    return CheckCircle2;
  }

  const recentActivity = [...activityEvents]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const upcomingEvents = [
    ...leases
      .filter(l => l.endDate && l.endDate >= new Date().toISOString().split("T")[0])
      .map(l => ({
        date: l.endDate!, title: `Lease ends — ${l.tenantName}`,
        sub: `Unit ${l.unitNumber}`, type: "lease", href: `/leases/${l.id}`,
      })),
    ...maintenanceTickets
      .filter(t => t.scheduledDate && t.status !== "Completed")
      .map(t => ({
        date: t.scheduledDate!, title: t.title,
        sub: `Unit ${t.unitNumber}`, type: "maintenance", href: `/maintenance/${t.id}`,
      })),
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">

        {/* Quick actions — desktop only */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {[
            { label: "Add Property", href: "/properties" },
            { label: "Add Unit",     href: "/units" },
            { label: "Add Tenant",   href: "/tenants" },
            { label: "New Ticket",   href: "/maintenance" },
            { label: "Upload Doc",   href: "/documents" },
          ].map(({ label, href }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 border-border hover:border-green-400 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/20 dark:hover:text-green-400 transition-colors"
              onClick={() => navigate(href)}
            >
              <Plus className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {METRIC_CONFIG.map(({ key, label, icon: Icon, color, bg, href }) => {
            const m = metrics[key];
            return (
              <button
                key={key}
                onClick={() => navigate(href)}
                className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-card hover:bg-accent/40 hover:border-border/80 transition-all text-left"
              >
                <div className={cn("flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg", bg)}>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xl font-bold leading-none tabular-nums", color)}>{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{label}</p>
                  {m.sub && <p className="text-[10px] text-green-600 font-medium mt-0.5">{m.sub}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── MOBILE layout ── */}
        <div className="md:hidden space-y-3">

          {/* Attention — full width, capped at 3 */}
          <Card className="border border-border shadow-none bg-card">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10">
                  <Bell className="h-3.5 w-3.5 text-red-500" />
                </div>
                <CardTitle className="text-sm font-semibold">Needs Attention</CardTitle>
              </div>
              {attentionItems.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">
                  {attentionItems.length}
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {attentionItems.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {attentionItems.slice(0, 3).map((item) => {
                    const s = PRIORITY_STYLE[item.priority];
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.href)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/50 transition-all text-left group"
                      >
                        <span className={cn("flex-shrink-0 h-2 w-2 rounded-full", s.dot)} />
                        <div className="flex-1 min-w-0">
                          <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold mb-0.5", s.badge)}>
                            {item.label}
                          </span>
                          <p className="text-sm font-medium text-foreground leading-snug truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                      </button>
                    );
                  })}
                  {attentionItems.length > 3 && (
                    <button
                      onClick={() => navigate("/maintenance")}
                      className="w-full text-center text-xs font-medium text-green-600 dark:text-green-400 py-2 hover:underline"
                    >
                      View all {attentionItems.length} items
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming + Activity — stacked */}
          <div className="space-y-3">

            {/* Upcoming */}
            <Card className="border border-border shadow-none bg-card">
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0 px-3 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <CardTitle className="text-xs font-semibold">Upcoming</CardTitle>
                </div>
                <button onClick={() => navigate("/calendar")} className="text-[10px] text-muted-foreground hover:text-foreground">
                  All
                </button>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">Nothing upcoming</p>
                ) : (
                  <div className="space-y-2 mt-1">
                    {upcomingEvents.slice(0, 3).map((ev, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(ev.href)}
                        className="w-full text-left"
                      >
                        <p className="text-xs font-medium text-foreground truncate leading-snug">{ev.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{formatDate(ev.date)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-border shadow-none bg-card">
              <CardHeader className="pb-2 flex-row items-center space-y-0 px-3 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/10">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  <CardTitle className="text-xs font-semibold">Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">No recent activity</p>
                ) : (
                  <div className="space-y-2 mt-1">
                    {recentActivity.slice(0, 3).map((event) => {
                      const Icon = activityIcon(event.type);
                      return (
                        <div key={event.id} className="flex gap-2 items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                            <Icon className="h-2.5 w-2.5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{event.description}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeDate(event.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* ── DESKTOP layout (restored original) ── */}
        <div className="hidden md:grid gap-6 lg:grid-cols-5 items-start">

          <Card className="lg:col-span-3 border border-border shadow-none bg-card">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10">
                  <Bell className="h-3.5 w-3.5 text-red-500" />
                </div>
                <CardTitle className="text-sm font-semibold">Needs Your Attention</CardTitle>
              </div>
              {attentionItems.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">
                  {attentionItems.length}
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {attentionItems.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No items need your attention right now.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {attentionItems.map((item) => {
                    const s = PRIORITY_STYLE[item.priority];
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.href)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-green-300 dark:hover:border-green-700 hover:bg-accent/50 transition-all text-left group"
                      >
                        <span className={cn("flex-shrink-0 h-2 w-2 rounded-full", s.dot)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold", s.badge)}>
                              {item.label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground leading-snug truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border shadow-none bg-card">
              <CardHeader className="pb-3 flex-row items-center space-y-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  ) : recentActivity.map((event, i) => {
                    const Icon = activityIcon(event.type);
                    return (
                      <div key={event.id} className="flex gap-3 relative">
                        {i !== recentActivity.length - 1 && (
                          <div className="absolute left-[13px] top-6 bottom-0 w-px bg-border" />
                        )}
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center relative z-10">
                          <Icon className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <p className="text-xs font-medium text-foreground leading-snug">{event.description}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelativeDate(event.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {upcomingEvents.length > 0 && (
              <Card className="border border-border shadow-none bg-card">
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold">Upcoming</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => navigate("/calendar")}>
                    View all
                  </Button>
                </CardHeader>
                <CardContent className="pt-1 space-y-0.5">
                  {upcomingEvents.map((ev, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(ev.href)}
                      className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                    >
                      <span className={cn(
                        "flex-shrink-0 mt-1.5 h-2 w-2 rounded-full",
                        ev.type === "lease" ? "bg-orange-500" : "bg-yellow-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{ev.title}</p>
                        <p className="text-[11px] text-muted-foreground">{ev.sub} · {formatDate(ev.date)}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
