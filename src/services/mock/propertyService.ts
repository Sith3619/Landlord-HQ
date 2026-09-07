import type { Property } from "../../types";
import type {
  IPropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../interfaces";
import { MOCK_PROPERTIES } from "./data";

let store: Property[] = [...MOCK_PROPERTIES];
let nextId = Math.max(...store.map((p) => p.id)) + 1;

export const mockPropertyService: IPropertyService = {
  async getProperties() {
    return [...store];
  },

  async getPropertyById(id) {
    return store.find((p) => p.id === id) ?? null;
  },

  async createProperty(data: CreatePropertyInput) {
    const property: Property = {
      floors: null,
      amenities: "",
      parking: "",
      utilityResponsibility: "",
      isArchived: false,
      ...data,
      id: nextId++,
      unitCount: 0,
    };
    store = [...store, property];
    return property;
  },

  async updateProperty(id, data: UpdatePropertyInput) {
    store = store.map((p) => (p.id === id ? { ...p, ...data } : p));
    const updated = store.find((p) => p.id === id);
    if (!updated) throw new Error(`Property ${id} not found`);
    return updated;
  },

  async archiveProperty(id) {
    return mockPropertyService.updateProperty(id, { isArchived: true });
  },

  async deleteProperty(id) {
    store = store.filter((p) => p.id !== id);
  },
};
