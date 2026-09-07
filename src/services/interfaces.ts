// ─── Service Interface Definitions ────────────────────────────────────────────
// These interfaces define the contract that service implementations must fulfill.
// The mock implementations satisfy this contract with local in-memory state.
// Replace mock implementations with real API calls without changing the interface.

import type {
  User,
  Property,
  Unit,
  Tenant,
  Lease,
  RentPayment,
  Inspection,
  MaintenanceTicket,
  Document,
  ActivityEvent,
  Notification,
  MoveInParams,
  MoveOutParams,
} from "../types";

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  fullName: string;
}

export interface IAuthService {
  login(credentials: AuthCredentials): Promise<User>;
  signup(data: SignupData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<{ user: User } | null>;
}

// ── Properties ─────────────────────────────────────────────────────────────────

export type CreatePropertyInput = Omit<
  Property,
  "id" | "unitCount" | "isArchived" | "floors" | "amenities" | "parking" | "utilityResponsibility"
> & {
  floors?: number | null;
  amenities?: string;
  parking?: string;
  utilityResponsibility?: string;
};

export type UpdatePropertyInput = Partial<Omit<Property, "id">>;

export interface IPropertyService {
  getProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | null>;
  createProperty(data: CreatePropertyInput): Promise<Property>;
  updateProperty(id: number, data: UpdatePropertyInput): Promise<Property>;
  archiveProperty(id: number): Promise<Property>;
  deleteProperty(id: number): Promise<void>;
}

// ── Units ──────────────────────────────────────────────────────────────────────

export type CreateUnitInput = Omit<Unit, "id" | "propertyName" | "tenantName">;
export type UpdateUnitInput = Partial<Omit<Unit, "id">>;

export interface IUnitService {
  getUnits(): Promise<Unit[]>;
  getUnitsByProperty(propertyId: number): Promise<Unit[]>;
  getUnitById(id: number): Promise<Unit | null>;
  createUnit(data: CreateUnitInput): Promise<Unit>;
  updateUnit(id: number, data: UpdateUnitInput): Promise<Unit>;
  deleteUnit(id: number): Promise<void>;
}

// ── Tenants ────────────────────────────────────────────────────────────────────

export type CreateTenantInput = Omit<Tenant, "id" | "propertyName" | "unitNumber">;
export type UpdateTenantInput = Partial<Omit<Tenant, "id">>;

export interface ITenantService {
  getTenants(): Promise<Tenant[]>;
  getTenantsByUnit(unitId: number): Promise<Tenant[]>;
  getTenantsByProperty(propertyId: number): Promise<Tenant[]>;
  getTenantById(id: number): Promise<Tenant | null>;
  createTenant(data: CreateTenantInput): Promise<Tenant>;
  updateTenant(id: number, data: UpdateTenantInput): Promise<Tenant>;
  deleteTenant(id: number): Promise<void>;
}

// ── Leases ─────────────────────────────────────────────────────────────────────

export type CreateLeaseInput = Omit<Lease, "id" | "propertyName" | "unitNumber" | "tenantName">;
export type UpdateLeaseInput = Partial<Omit<Lease, "id">>;

export interface ILeaseService {
  getLeases(): Promise<Lease[]>;
  getLeasesByUnit(unitId: number): Promise<Lease[]>;
  getLeasesByTenant(tenantId: number): Promise<Lease[]>;
  getLeaseById(id: number): Promise<Lease | null>;
  createLease(data: CreateLeaseInput): Promise<Lease>;
  updateLease(id: number, data: UpdateLeaseInput): Promise<Lease>;
  deleteLease(id: number): Promise<void>;
  completeMoveIn(params: MoveInParams): Promise<{ lease: Lease; unit: Unit; tenant: Tenant }>;
  completeMoveOut(params: MoveOutParams): Promise<{ unit: Unit; tenant: Tenant }>;
}

// ── Rent / Payments ────────────────────────────────────────────────────────────

export type CreatePaymentInput = Omit<RentPayment, "id">;
export type UpdatePaymentInput = Partial<Omit<RentPayment, "id">>;

export interface IPaymentService {
  getPayments(): Promise<RentPayment[]>;
  getPaymentsByLease(leaseId: number): Promise<RentPayment[]>;
  getPaymentsByUnit(unitId: number): Promise<RentPayment[]>;
  getPaymentsByTenant(tenantId: number): Promise<RentPayment[]>;
  createPayment(data: CreatePaymentInput): Promise<RentPayment>;
  updatePayment(id: number, data: UpdatePaymentInput): Promise<RentPayment>;
}

// ── Maintenance ────────────────────────────────────────────────────────────────

export type CreateTicketInput = Omit<
  MaintenanceTicket,
  "id" | "propertyName" | "unitNumber" | "tenantName" | "createdDate" | "updatedDate"
>;
export type UpdateTicketInput = Partial<Omit<MaintenanceTicket, "id">>;

export interface IMaintenanceService {
  getTickets(): Promise<MaintenanceTicket[]>;
  getTicketsByProperty(propertyId: number): Promise<MaintenanceTicket[]>;
  getTicketsByUnit(unitId: number): Promise<MaintenanceTicket[]>;
  getTicketsByTenant(tenantId: number): Promise<MaintenanceTicket[]>;
  getTicketById(id: number): Promise<MaintenanceTicket | null>;
  createTicket(data: CreateTicketInput): Promise<MaintenanceTicket>;
  updateTicket(id: number, data: UpdateTicketInput): Promise<MaintenanceTicket>;
  deleteTicket(id: number): Promise<void>;
}

// ── Inspections ────────────────────────────────────────────────────────────────

export type CreateInspectionInput = Omit<Inspection, "id" | "propertyName" | "unitNumber" | "tenantName">;
export type UpdateInspectionInput = Partial<Omit<Inspection, "id">>;

export interface IInspectionService {
  getInspections(): Promise<Inspection[]>;
  getInspectionsByProperty(propertyId: number): Promise<Inspection[]>;
  getInspectionsByUnit(unitId: number): Promise<Inspection[]>;
  getInspectionById(id: number): Promise<Inspection | null>;
  createInspection(data: CreateInspectionInput): Promise<Inspection>;
  updateInspection(id: number, data: UpdateInspectionInput): Promise<Inspection>;
  deleteInspection(id: number): Promise<void>;
}

// ── Documents ──────────────────────────────────────────────────────────────────

export type CreateDocumentInput = Omit<Document, "id" | "propertyName" | "unitNumber" | "tenantName" | "uploadDate" | "version">;
export type UpdateDocumentInput = Partial<Omit<Document, "id">>;

export interface IDocumentService {
  getDocuments(): Promise<Document[]>;
  getDocumentsByProperty(propertyId: number): Promise<Document[]>;
  getDocumentsByUnit(unitId: number): Promise<Document[]>;
  getDocumentsByTenant(tenantId: number): Promise<Document[]>;
  getDocumentsByLease(leaseId: number): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | null>;
  createDocument(data: CreateDocumentInput): Promise<Document>;
  updateDocument(id: number, data: UpdateDocumentInput): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  // TODO: uploadFile(file: File): Promise<{ url: string; name: string }>
}

// ── Notifications ──────────────────────────────────────────────────────────────

export interface INotificationService {
  getNotifications(): Promise<Notification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: number): Promise<void>;
}

// ── Activity ───────────────────────────────────────────────────────────────────

export interface IActivityService {
  getActivity(): Promise<ActivityEvent[]>;
  getActivityForEntity(entityType: string, entityId: number): Promise<ActivityEvent[]>;
  logEvent(event: Omit<ActivityEvent, "id">): Promise<ActivityEvent>;
}

// ── Search ─────────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: "property" | "unit" | "tenant" | "lease" | "ticket" | "inspection" | "document";
  id: number;
  title: string;
  subtitle: string;
  navigateTo: string;
}

export interface ISearchService {
  // TODO: Replace with server-side search when backend is connected
  search(query: string): Promise<SearchResult[]>;
}
