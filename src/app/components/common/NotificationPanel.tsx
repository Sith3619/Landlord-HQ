import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, X, CheckCheck, AlertCircle, Clock, FileText, Wrench } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import { mockNotificationService } from "../../../services/mock/notificationService";
import type { Notification } from "../../../types";
import { formatRelativeDate } from "../../../lib/formatters";

const TYPE_ICONS: Record<string, typeof Bell> = {
  rent_overdue: AlertCircle,
  maintenance_urgent: Wrench,
  lease_expiring: Clock,
  document_expiring: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  rent_overdue: "text-red-500 dark:text-red-400",
  maintenance_urgent: "text-orange-500 dark:text-orange-400",
  lease_expiring: "text-yellow-500 dark:text-yellow-400",
  document_expiring: "text-blue-500 dark:text-blue-400",
};

export function NotificationPanel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    const [notifs, count] = await Promise.all([
      mockNotificationService.getNotifications(),
      mockNotificationService.getUnreadCount(),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await mockNotificationService.markAllAsRead();
    await load();
  };

  const markRead = async (id: number) => {
    await mockNotificationService.markAsRead(id);
    await load();
  };

  const dismiss = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await mockNotificationService.deleteNotification(id);
    await load();
  };

  const handleClick = async (n: Notification) => {
    if (!n.isRead) await markRead(n.id);
    setOpen(false);
    if (n.navigateTo) navigate(n.navigateTo);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 shadow-xl border-border" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = TYPE_ICONS[n.type] ?? Bell;
              const iconColor = TYPE_COLORS[n.type] ?? "text-muted-foreground";
              return (
                <div
                  key={n.id}
                  className={cn(
                    "group relative flex items-start gap-3 px-4 py-3.5 border-b border-border last:border-0 transition-colors hover:bg-accent/50 cursor-pointer",
                    !n.isRead && "bg-green-50/50 dark:bg-green-950/10"
                  )}
                  onClick={() => handleClick(n)}
                >
                  <div className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-0.5",
                    !n.isRead ? "bg-white dark:bg-card shadow-sm ring-1 ring-border" : "bg-muted"
                  )}>
                    <Icon className={cn("h-4 w-4", iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={cn("text-sm leading-snug", !n.isRead ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {formatRelativeDate(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="flex-shrink-0 mt-2 h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
                  )}
                  <button
                    onClick={(e) => dismiss(n.id, e)}
                    className="absolute right-3 top-3 p-1 rounded text-muted-foreground/50 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
