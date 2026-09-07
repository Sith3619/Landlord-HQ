import type { Document } from "../../types";
import type {
  IDocumentService,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "../interfaces";
import { MOCK_DOCUMENTS } from "./data";

const today = new Date().toISOString().split("T")[0];
let store: Document[] = [...MOCK_DOCUMENTS];
let nextId = Math.max(...store.map((d) => d.id)) + 1;

export const mockDocumentService: IDocumentService = {
  async getDocuments() {
    return [...store];
  },

  async getDocumentsByProperty(propertyId) {
    return store.filter((d) => d.propertyId === propertyId);
  },

  async getDocumentsByUnit(unitId) {
    return store.filter((d) => d.unitId === unitId);
  },

  async getDocumentsByTenant(tenantId) {
    return store.filter((d) => d.tenantId === tenantId);
  },

  async getDocumentsByLease(leaseId) {
    return store.filter((d) => d.leaseId === leaseId);
  },

  async getDocumentById(id) {
    return store.find((d) => d.id === id) ?? null;
  },

  async createDocument(data: CreateDocumentInput) {
    const document: Document = {
      ...data,
      id: nextId++,
      uploadDate: today,
      version: 1,
    };
    store = [...store, document];
    return document;
  },

  async updateDocument(id, data: UpdateDocumentInput) {
    store = store.map((d) => (d.id === id ? { ...d, ...data } : d));
    const updated = store.find((d) => d.id === id);
    if (!updated) throw new Error(`Document ${id} not found`);
    return updated;
  },

  async deleteDocument(id) {
    store = store.filter((d) => d.id !== id);
  },
};
