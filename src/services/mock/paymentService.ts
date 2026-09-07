import type { RentPayment } from "../../types";
import type { IPaymentService, CreatePaymentInput, UpdatePaymentInput } from "../interfaces";
import { MOCK_RENT_PAYMENTS } from "./data";

let store: RentPayment[] = [...MOCK_RENT_PAYMENTS];
let nextId = Math.max(...store.map((p) => p.id)) + 1;

export const mockPaymentService: IPaymentService = {
  async getPayments() {
    return [...store];
  },

  async getPaymentsByLease(leaseId) {
    return store.filter((p) => p.leaseId === leaseId);
  },

  async getPaymentsByUnit(unitId) {
    return store.filter((p) => p.unitId === unitId);
  },

  async getPaymentsByTenant(tenantId) {
    return store.filter((p) => p.tenantId === tenantId);
  },

  async createPayment(data: CreatePaymentInput) {
    const payment: RentPayment = { ...data, id: nextId++ };
    store = [...store, payment];
    return payment;
  },

  async updatePayment(id, data: UpdatePaymentInput) {
    store = store.map((p) => (p.id === id ? { ...p, ...data } : p));
    const updated = store.find((p) => p.id === id);
    if (!updated) throw new Error(`Payment ${id} not found`);
    return updated;
  },
};
