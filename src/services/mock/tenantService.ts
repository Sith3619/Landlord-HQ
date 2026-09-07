import type { Tenant } from "../../types";
import type { ITenantService, CreateTenantInput, UpdateTenantInput } from "../interfaces";
import { MOCK_TENANTS } from "./data";

let store: Tenant[] = [...MOCK_TENANTS];
let nextId = Math.max(...store.map((t) => t.id)) + 1;

export const mockTenantService: ITenantService = {
  async getTenants() {
    return [...store];
  },

  async getTenantsByUnit(unitId) {
    return store.filter((t) => t.unitId === unitId);
  },

  async getTenantsByProperty(propertyId) {
    return store.filter((t) => t.propertyId === propertyId);
  },

  async getTenantById(id) {
    return store.find((t) => t.id === id) ?? null;
  },

  async createTenant(data: CreateTenantInput) {
    const tenant: Tenant = { ...data, id: nextId++ };
    store = [...store, tenant];
    return tenant;
  },

  async updateTenant(id, data: UpdateTenantInput) {
    store = store.map((t) => (t.id === id ? { ...t, ...data } : t));
    const updated = store.find((t) => t.id === id);
    if (!updated) throw new Error(`Tenant ${id} not found`);
    return updated;
  },

  async deleteTenant(id) {
    store = store.filter((t) => t.id !== id);
  },
};
