import type { Unit } from "../../types";
import type { IUnitService, CreateUnitInput, UpdateUnitInput } from "../interfaces";
import { MOCK_UNITS } from "./data";

let store: Unit[] = [...MOCK_UNITS];
let nextId = Math.max(...store.map((u) => u.id)) + 1;

export const mockUnitService: IUnitService = {
  async getUnits() {
    return [...store];
  },

  async getUnitsByProperty(propertyId) {
    return store.filter((u) => u.propertyId === propertyId);
  },

  async getUnitById(id) {
    return store.find((u) => u.id === id) ?? null;
  },

  async createUnit(data: CreateUnitInput) {
    const unit: Unit = { ...data, id: nextId++ };
    store = [...store, unit];
    return unit;
  },

  async updateUnit(id, data: UpdateUnitInput) {
    store = store.map((u) => (u.id === id ? { ...u, ...data } : u));
    const updated = store.find((u) => u.id === id);
    if (!updated) throw new Error(`Unit ${id} not found`);
    return updated;
  },

  async deleteUnit(id) {
    store = store.filter((u) => u.id !== id);
  },
};
