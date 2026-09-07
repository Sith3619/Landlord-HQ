import type { Inspection } from "../../types";
import type {
  IInspectionService,
  CreateInspectionInput,
  UpdateInspectionInput,
} from "../interfaces";
import { MOCK_INSPECTIONS } from "./data";

let store: Inspection[] = [...MOCK_INSPECTIONS];
let nextId = Math.max(...store.map((i) => i.id)) + 1;

export const mockInspectionService: IInspectionService = {
  async getInspections() {
    return [...store];
  },

  async getInspectionsByProperty(propertyId) {
    return store.filter((i) => i.propertyId === propertyId);
  },

  async getInspectionsByUnit(unitId) {
    return store.filter((i) => i.unitId === unitId);
  },

  async getInspectionById(id) {
    return store.find((i) => i.id === id) ?? null;
  },

  async createInspection(data: CreateInspectionInput) {
    const inspection: Inspection = { ...data, id: nextId++ };
    store = [...store, inspection];
    return inspection;
  },

  async updateInspection(id, data: UpdateInspectionInput) {
    store = store.map((i) => (i.id === id ? { ...i, ...data } : i));
    const updated = store.find((i) => i.id === id);
    if (!updated) throw new Error(`Inspection ${id} not found`);
    return updated;
  },

  async deleteInspection(id) {
    store = store.filter((i) => i.id !== id);
  },
};
