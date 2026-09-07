import type { Lease, Unit, Tenant } from "../../types";
import type { ILeaseService, CreateLeaseInput, UpdateLeaseInput } from "../interfaces";
import type { MoveInParams, MoveOutParams } from "../../types";
import { MOCK_LEASES } from "./data";
import { mockUnitService } from "./unitService";
import { mockTenantService } from "./tenantService";

let store: Lease[] = [...MOCK_LEASES];
let nextId = Math.max(...store.map((l) => l.id)) + 1;

export const mockLeaseService: ILeaseService = {
  async getLeases() {
    return [...store];
  },

  async getLeasesByUnit(unitId) {
    return store.filter((l) => l.unitId === unitId);
  },

  async getLeasesByTenant(tenantId) {
    return store.filter((l) => l.tenantIds.includes(tenantId));
  },

  async getLeaseById(id) {
    return store.find((l) => l.id === id) ?? null;
  },

  async createLease(data: CreateLeaseInput) {
    const lease: Lease = { ...data, id: nextId++ };
    store = [...store, lease];
    return lease;
  },

  async updateLease(id, data: UpdateLeaseInput) {
    store = store.map((l) => (l.id === id ? { ...l, ...data } : l));
    const updated = store.find((l) => l.id === id);
    if (!updated) throw new Error(`Lease ${id} not found`);
    return updated;
  },

  async deleteLease(id) {
    store = store.filter((l) => l.id !== id);
  },

  async completeMoveIn(params: MoveInParams) {
    const { leaseId, tenantId, unitId, moveInDate } = params;

    const lease = await mockLeaseService.updateLease(leaseId, { status: "Active" });
    const unit = await mockUnitService.updateUnit(unitId, {
      status: "Occupied",
      tenantId,
      leaseStart: moveInDate,
    });
    const tenant = await mockTenantService.updateTenant(tenantId, {
      lifecycleStatus: "Active",
      leaseStart: moveInDate,
    });

    return { lease, unit, tenant };
  },

  async completeMoveOut(params: MoveOutParams) {
    const { leaseId, tenantId, unitId, moveOutDate } = params;

    await mockLeaseService.updateLease(leaseId, {
      status: "Terminated",
      endDate: moveOutDate,
    });
    const unit = await mockUnitService.updateUnit(unitId, {
      status: "Vacant",
      tenantId: null,
      tenantName: null,
      leaseEnd: moveOutDate,
    });
    const tenant = await mockTenantService.updateTenant(tenantId, {
      lifecycleStatus: "Former Tenant",
    });

    return { unit, tenant };
  },
};
