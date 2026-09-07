import type { Notification } from "../../types";
import type { INotificationService } from "../interfaces";
import { MOCK_NOTIFICATIONS } from "./data";

let store: Notification[] = [...MOCK_NOTIFICATIONS];

export const mockNotificationService: INotificationService = {
  async getNotifications() {
    return [...store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getUnreadCount() {
    return store.filter((n) => !n.isRead).length;
  },

  async markAsRead(id) {
    store = store.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  },

  async markAllAsRead() {
    store = store.map((n) => ({ ...n, isRead: true }));
  },

  async deleteNotification(id) {
    store = store.filter((n) => n.id !== id);
  },
};
