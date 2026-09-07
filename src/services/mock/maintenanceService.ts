import type { MaintenanceTicket } from "../../types";
import type {
  IMaintenanceService,
  CreateTicketInput,
  UpdateTicketInput,
} from "../interfaces";
import { MOCK_MAINTENANCE_TICKETS } from "./data";

const today = new Date().toISOString().split("T")[0];
let store: MaintenanceTicket[] = [...MOCK_MAINTENANCE_TICKETS];
let nextId = Math.max(...store.map((t) => t.id)) + 1;

export const mockMaintenanceService: IMaintenanceService = {
  async getTickets() {
    return [...store];
  },

  async getTicketsByProperty(propertyId) {
    return store.filter((t) => t.propertyId === propertyId);
  },

  async getTicketsByUnit(unitId) {
    return store.filter((t) => t.unitId === unitId);
  },

  async getTicketsByTenant(tenantId) {
    return store.filter((t) => t.tenantId === tenantId);
  },

  async getTicketById(id) {
    return store.find((t) => t.id === id) ?? null;
  },

  async createTicket(data: CreateTicketInput) {
    const ticket: MaintenanceTicket = {
      ...data,
      id: nextId++,
      createdDate: today,
      updatedDate: today,
    };
    store = [...store, ticket];
    return ticket;
  },

  async updateTicket(id, data: UpdateTicketInput) {
    store = store.map((t) =>
      t.id === id ? { ...t, ...data, updatedDate: today } : t
    );
    const updated = store.find((t) => t.id === id);
    if (!updated) throw new Error(`Ticket ${id} not found`);
    return updated;
  },

  async deleteTicket(id) {
    store = store.filter((t) => t.id !== id);
  },
};
