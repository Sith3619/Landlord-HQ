// ─── Domain Entity Types ──────────────────────────────────────────────────────
// Central source of truth for all Landlord HQ domain models.
// Import from here, never redefine inline.

// ── Status / Enum Types ────────────────────────────────────────────────────────

export type PropertyStatus = "Active" | "Archived";

export type UnitStatus = "Occupied" | "Vacant" | "Coming Soon" | "Under Maintenance" | "Unavailable";

export type UnitReadinessStatus =
  | "Ready"
  | "Occupied"
  | "Needs Preparation"
  | "Under Maintenance"
  | "Coming Soon";

export type TenantLifecycleStatus =
  | "Applicant"
  | "Approved"
  | "Active"
  | "Notice Given"
  | "Former Tenant"
  | "Archived";

export type TenantRole = "Primary" | "Co-tenant" | "Occupant";

export type LeaseType = "Fixed Term" | "Month-to-Month";

export type LeaseStatus =
  | "Draft"
  | "Active"
  | "Expiring Soon"
  | "Expired"
  | "Terminated"
  | "Renewed";

export type RentPaymentStatus = "Paid" | "Due" | "Overdue" | "Partially Paid";

export type PaymentMethod =
  | "e-Transfer"
  | "Bank Transfer"
  | "Cash"
  | "Cheque"
  | "Other";

export type MaintenancePriority = "Low" | "Medium" | "High" | "Urgent";

export type MaintenanceStatus =
  | "New"
  | "In Progress"
  | "Pending Parts"
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export type MaintenanceCategory =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Appliance"
  | "Structural"
  | "Pest Control"
  | "Cleaning"
  | "Security"
  | "Landscaping"
  | "General";

export type InspectionType =
  | "Move-In"
  | "Move-Out"
  | "Routine"
  | "Annual"
  | "Safety"
  | "Maintenance";

export type InspectionStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Follow-Up Required"
  | "Cancelled";

export type FindingCondition = "Good" | "Fair" | "Poor" | "Damaged";

export type DocumentType =
  | "Lease"
  | "Inspection"
  | "Insurance"
  | "Notice"
  | "Invoice"
  | "Receipt"
  | "Permit"
  | "Correspondence"
  | "Other";

export type ActivityEntityType =
  | "property"
  | "unit"
  | "tenant"
  | "lease"
  | "ticket"
  | "inspection"
  | "document"
  | "payment";

export type NotificationType =
  | "rent_overdue"
  | "lease_expiring"
  | "inspection_scheduled"
  | "maintenance_urgent"
  | "document_expiring"
  | "tenant_notice"
  | "general";

// ── Core Entity Interfaces ─────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "owner" | "manager" | "viewer";
  createdAt: string;
}

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: string;
  unitCount: number;
  status: PropertyStatus;
  notes: string;
  isArchived: boolean;
  floors: number | null;
  amenities: string;
  parking: string;
  utilityResponsibility: string;
}

export interface Unit {
  id: number;
  unitNumber: string;
  propertyId: number;
  propertyName: string;
  tenantId: number | null;
  tenantName: string | null;
  rent: number;
  status: UnitStatus;
  leaseStart: string | null;
  leaseEnd: string | null;
  notes: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  floor: number | null;
  furnished: boolean;
  securityDeposit: number | null;
  utilityResponsibility: string;
  availabilityDate: string | null;
  readinessStatus: UnitReadinessStatus;
}

export interface Tenant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  propertyId: number | null;
  propertyName: string | null;
  unitId: number | null;
  unitNumber: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  leaseStatus: string;
  notes: string;
  lifecycleStatus: TenantLifecycleStatus;
  role: TenantRole;
}

export interface Lease {
  id: number;
  unitId: number;
  unitNumber: string;
  propertyId: number;
  propertyName: string;
  tenantIds: number[];
  tenantName: string;
  leaseType: LeaseType;
  status: string;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  rentDueDay: number;
  securityDeposit: number;
  noticePeriodDays: number;
  notes: string;
}

export interface RentPayment {
  id: number;
  leaseId: number;
  unitId: number;
  tenantId: number;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  paidDate: string | null;
  status: RentPaymentStatus;
  method: PaymentMethod | string;
  note: string;
}

export interface InspectionFinding {
  id: number;
  item: string;
  condition: FindingCondition | string;
  notes: string;
  maintenanceTicketId: number | null;
}

export interface Inspection {
  id: number;
  type: InspectionType | string;
  propertyId: number;
  propertyName: string;
  unitId: number | null;
  unitNumber: string | null;
  tenantId: number | null;
  tenantName: string | null;
  scheduledDate: string;
  inspectorName: string;
  status: InspectionStatus | string;
  notes: string;
  findings: InspectionFinding[];
  followUpRequired: boolean;
}

export interface MaintenanceTicket {
  id: number;
  title: string;
  propertyId: number;
  propertyName: string;
  unitId: number;
  unitNumber: string;
  tenantId: number;
  tenantName: string;
  category: MaintenanceCategory | string;
  priority: MaintenancePriority;
  status: MaintenanceStatus | string;
  description: string;
  createdDate: string;
  updatedDate: string;
  scheduledDate: string | null;
  completionDate: string | null;
  assignedTo: string;
  estimatedCost: number | null;
  actualCost: number | null;
  notes: string;
  isRecurring: boolean;
  recurringFrequency: string | null;
}

export interface Document {
  id: number;
  name: string;
  documentType: DocumentType | string;
  propertyId: number | null;
  propertyName: string | null;
  unitId: number | null;
  unitNumber: string | null;
  tenantId: number | null;
  tenantName: string | null;
  leaseId: number | null;
  inspectionId: number | null;
  uploadDate: string;
  expirationDate: string | null;
  notes: string;
  version: number;
}

export interface ActivityEvent {
  id: number;
  type: string;
  description: string;
  entityType: ActivityEntityType | string;
  entityId: number;
  entityName: string;
  date: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  entityType: ActivityEntityType | string;
  entityId: number;
  navigateTo: string;
  isRead: boolean;
  createdAt: string;
}

// ── Workflow Parameter Types ───────────────────────────────────────────────────

export interface MoveInParams {
  tenantId: number;
  unitId: number;
  propertyId: number;
  leaseType: LeaseType;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  rentDueDay: number;
  securityDeposit: number;
  moveInDate: string;
  notes: string;
}

export interface MoveOutParams {
  tenantId: number;
  unitId: number;
  leaseId: number;
  moveOutDate: string;
  reason: string;
  unitNextStatus: UnitStatus;
  securityDepositReturned: number;
  notes: string;
}

// ── Derived / Computed Types ───────────────────────────────────────────────────

export interface LeaseWithStatus extends Lease {
  computedStatus: LeaseStatus;
  daysRemaining: number | null;
}

export interface DashboardMetrics {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  activeTenants: number;
  openTickets: number;
  overduePayments: number;
  expiringLeases: number;
}
