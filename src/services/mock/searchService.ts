import type { ISearchService, SearchResult } from "../interfaces";
import { MOCK_PROPERTIES } from "./data";
import { MOCK_UNITS } from "./data";
import { MOCK_TENANTS } from "./data";
import { MOCK_LEASES } from "./data";
import { MOCK_MAINTENANCE_TICKETS } from "./data";
import { MOCK_INSPECTIONS } from "./data";
import { MOCK_DOCUMENTS } from "./data";

// TODO: Replace with server-side full-text search (Postgres FTS, Algolia, Typesense, etc.)
export const mockSearchService: ISearchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const p of MOCK_PROPERTIES) {
      if (p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)) {
        results.push({
          type: "property",
          id: p.id,
          title: p.name,
          subtitle: p.address + ", " + p.city,
          navigateTo: `/properties/${p.id}`,
        });
      }
    }

    for (const u of MOCK_UNITS) {
      if (u.unitNumber.toLowerCase().includes(q) || u.propertyName.toLowerCase().includes(q)) {
        results.push({
          type: "unit",
          id: u.id,
          title: `Unit ${u.unitNumber} — ${u.propertyName}`,
          subtitle: u.status + (u.tenantName ? ` · ${u.tenantName}` : ""),
          navigateTo: `/units/${u.id}`,
        });
      }
    }

    for (const t of MOCK_TENANTS) {
      if (
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        (t.phone && t.phone.includes(q))
      ) {
        results.push({
          type: "tenant",
          id: t.id,
          title: t.fullName,
          subtitle: t.email + (t.unitNumber ? ` · Unit ${t.unitNumber}` : ""),
          navigateTo: `/tenants/${t.id}`,
        });
      }
    }

    for (const l of MOCK_LEASES) {
      if (l.tenantName.toLowerCase().includes(q) || l.unitNumber.toLowerCase().includes(q)) {
        results.push({
          type: "lease",
          id: l.id,
          title: `Lease — ${l.tenantName}`,
          subtitle: `Unit ${l.unitNumber} · ${l.propertyName}`,
          navigateTo: `/leases/${l.id}`,
        });
      }
    }

    for (const t of MOCK_MAINTENANCE_TICKETS) {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
        results.push({
          type: "ticket",
          id: t.id,
          title: t.title,
          subtitle: `Unit ${t.unitNumber} · ${t.priority} · ${t.status}`,
          navigateTo: `/maintenance/${t.id}`,
        });
      }
    }

    for (const i of MOCK_INSPECTIONS) {
      if (
        i.type.toLowerCase().includes(q) ||
        i.inspectorName.toLowerCase().includes(q) ||
        i.unitNumber.toLowerCase().includes(q)
      ) {
        results.push({
          type: "inspection",
          id: i.id,
          title: `${i.type} Inspection — Unit ${i.unitNumber}`,
          subtitle: `${i.propertyName} · ${i.status}`,
          navigateTo: `/inspections/${i.id}`,
        });
      }
    }

    for (const d of MOCK_DOCUMENTS) {
      if (d.name.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q)) {
        results.push({
          type: "document",
          id: d.id,
          title: d.name,
          subtitle: d.documentType + (d.propertyName ? ` · ${d.propertyName}` : ""),
          navigateTo: `/documents/${d.id}`,
        });
      }
    }

    return results.slice(0, 20);
  },
};
