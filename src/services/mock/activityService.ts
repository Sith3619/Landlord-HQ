import type { ActivityEvent } from "../../types";
import type { IActivityService } from "../interfaces";
import { MOCK_ACTIVITY } from "./data";

let store: ActivityEvent[] = [...MOCK_ACTIVITY];
let nextId = Math.max(...store.map((a) => a.id)) + 1;

export const mockActivityService: IActivityService = {
  async getActivity() {
    return [...store].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async getActivityForEntity(entityType, entityId) {
    return store
      .filter((a) => a.entityType === entityType && a.entityId === entityId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async logEvent(event: Omit<ActivityEvent, "id">) {
    const newEvent: ActivityEvent = { ...event, id: nextId++ };
    store = [newEvent, ...store];
    return newEvent;
  },
};
