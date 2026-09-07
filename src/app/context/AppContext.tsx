import { createContext, useContext, useState, ReactNode } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: string;
  unitCount: number;
  status: string;
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
  status: string;
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
  readinessStatus: string;
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
  lifecycleStatus: string;
  role: string;
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
  category: string;
  priority: string;
  status: string;
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
  documentType: string;
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

export interface Lease {
  id: number;
  unitId: number;
  unitNumber: string;
  propertyId: number;
  propertyName: string;
  tenantIds: number[];
  tenantName: string;
  leaseType: string;
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
  status: string;
  method: string;
  note: string;
}

export interface InspectionFinding {
  id: number;
  item: string;
  condition: string;
  notes: string;
  maintenanceTicketId: number | null;
}

export interface Inspection {
  id: number;
  type: string;
  propertyId: number;
  propertyName: string;
  unitId: number | null;
  unitNumber: string | null;
  tenantId: number | null;
  tenantName: string | null;
  scheduledDate: string;
  inspectorName: string;
  status: string;
  notes: string;
  findings: InspectionFinding[];
  followUpRequired: boolean;
}

export interface ActivityEvent {
  id: number;
  type: string;
  description: string;
  entityType: string;
  entityId: number;
  entityName: string;
  date: string;
}

export interface MoveInParams {
  tenantId: number;
  unitId: number;
  propertyId: number;
  leaseType: string;
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
  unitNextStatus: string;
  securityDepositReturned: number;
  notes: string;
}

// ─── Utility functions ────────────────────────────────────────────────────────

export function daysUntilExpiry(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysUntilDocExpiry(expirationDate: string): number {
  return daysUntilExpiry(expirationDate);
}

export function computeLeaseStatus(lease: Lease): string {
  if (lease.status === "Terminated" || lease.status === "Renewed" || lease.status === "Draft") {
    return lease.status;
  }
  if (!lease.endDate) return "Active";
  const days = daysUntilExpiry(lease.endDate);
  if (days < 0) return "Expired";
  if (days <= 60) return "Expiring Soon";
  return "Active";
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface AppContextType {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  maintenanceTickets: MaintenanceTicket[];
  documents: Document[];
  leases: Lease[];
  rentPayments: RentPayment[];
  inspections: Inspection[];
  activityEvents: ActivityEvent[];
  addProperty: (p: Omit<Property, "id" | "unitCount" | "isArchived" | "floors" | "amenities" | "parking" | "utilityResponsibility"> & { floors?: number | null; amenities?: string; parking?: string; utilityResponsibility?: string }) => void;
  addUnit: (u: Omit<Unit, "id" | "propertyName" | "tenantName" | "bedrooms" | "bathrooms" | "sqft" | "floor" | "furnished" | "securityDeposit" | "utilityResponsibility" | "availabilityDate" | "readinessStatus"> & { bedrooms?: number | null; bathrooms?: number | null; sqft?: number | null; floor?: number | null; furnished?: boolean; securityDeposit?: number | null; utilityResponsibility?: string; availabilityDate?: string | null; readinessStatus?: string }) => void;
  addTenant: (t: Omit<Tenant, "id" | "propertyName" | "unitNumber" | "lifecycleStatus" | "role"> & { lifecycleStatus?: string; role?: string }) => void;
  addMaintenanceTicket: (t: Omit<MaintenanceTicket, "id" | "propertyName" | "unitNumber" | "tenantName" | "createdDate" | "updatedDate" | "scheduledDate" | "completionDate" | "assignedTo" | "estimatedCost" | "actualCost" | "isRecurring" | "recurringFrequency"> & { scheduledDate?: string | null; completionDate?: string | null; assignedTo?: string; estimatedCost?: number | null; actualCost?: number | null; isRecurring?: boolean; recurringFrequency?: string | null }) => void;
  addDocument: (d: Omit<Document, "id" | "propertyName" | "unitNumber" | "tenantName" | "uploadDate" | "version" | "leaseId" | "inspectionId" | "expirationDate"> & { leaseId?: number | null; inspectionId?: number | null; expirationDate?: string | null }) => void;
  addLease: (l: Omit<Lease, "id" | "propertyName" | "unitNumber" | "tenantName">) => void;
  addRentPayment: (p: Omit<RentPayment, "id">) => void;
  addInspection: (i: Omit<Inspection, "id" | "propertyName" | "unitNumber" | "tenantName">) => void;
  addActivityEvent: (e: Omit<ActivityEvent, "id">) => void;
  updateProperty: (id: number, data: Partial<Omit<Property, "id">>) => void;
  updateUnit: (id: number, data: Partial<Omit<Unit, "id">>) => void;
  updateTenant: (id: number, data: Partial<Omit<Tenant, "id">>) => void;
  updateMaintenanceTicket: (id: number, data: Partial<Omit<MaintenanceTicket, "id">>) => void;
  updateDocument: (id: number, data: Partial<Omit<Document, "id">>) => void;
  updateLease: (id: number, data: Partial<Omit<Lease, "id">>) => void;
  updateRentPayment: (id: number, data: Partial<Omit<RentPayment, "id">>) => void;
  updateInspection: (id: number, data: Partial<Omit<Inspection, "id">>) => void;
  deleteProperty: (id: number) => void;
  deleteUnit: (id: number) => void;
  deleteTenant: (id: number) => void;
  deleteMaintenanceTicket: (id: number) => void;
  deleteDocument: (id: number) => void;
  deleteLease: (id: number) => void;
  deleteInspection: (id: number) => void;
  archiveProperty: (id: number) => void;
  completeMoveIn: (params: MoveInParams) => void;
  completeMoveOut: (params: MoveOutParams) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Sample data ──────────────────────────────────────────────────────────────
// Today = 2026-08-20

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1, name: "Maple Street Duplex", address: "1234 Maple Street",
    city: "Vancouver", province: "BC", postalCode: "V6B 1A1",
    propertyType: "Duplex", unitCount: 2, status: "Active",
    notes: "Recently renovated kitchen and bathrooms",
    isArchived: false, floors: 2, amenities: "Laundry in unit", parking: "1 stall per unit", utilityResponsibility: "Tenant pays utilities",
  },
  {
    id: 2, name: "Richmond Apartment", address: "5678 Garden City Road",
    city: "Richmond", province: "BC", postalCode: "V6Y 2L5",
    propertyType: "Apartment", unitCount: 8, status: "Active",
    notes: "4-story building with elevator",
    isArchived: false, floors: 4, amenities: "Elevator, gym, common laundry", parking: "Assigned underground", utilityResponsibility: "Landlord pays water, tenant pays hydro",
  },
  {
    id: 3, name: "Oakridge Rental Home", address: "910 Oak Street",
    city: "Vancouver", province: "BC", postalCode: "V5Z 3Y8",
    propertyType: "Single Family", unitCount: 1, status: "Active",
    notes: "Large backyard, pet-friendly",
    isArchived: false, floors: 2, amenities: "Large backyard, garage", parking: "2-car garage + driveway", utilityResponsibility: "Tenant pays all utilities",
  },
];

const INITIAL_UNITS: Unit[] = [
  {
    id: 1, unitNumber: "A", propertyId: 1, propertyName: "Maple Street Duplex",
    tenantId: 1, tenantName: "Sarah Thompson", rent: 2200, status: "Occupied",
    leaseStart: "2025-01-01", leaseEnd: "2026-09-30", notes: "Upper unit",
    bedrooms: 2, bathrooms: 1, sqft: 850, floor: 2, furnished: false,
    securityDeposit: 2200, utilityResponsibility: "Tenant", availabilityDate: null, readinessStatus: "Occupied",
  },
  {
    id: 2, unitNumber: "B", propertyId: 1, propertyName: "Maple Street Duplex",
    tenantId: 2, tenantName: "Daniel Reed", rent: 2100, status: "Occupied",
    leaseStart: "2025-03-01", leaseEnd: "2026-03-01", notes: "Lower unit",
    bedrooms: 2, bathrooms: 1, sqft: 820, floor: 1, furnished: false,
    securityDeposit: 2100, utilityResponsibility: "Tenant", availabilityDate: null, readinessStatus: "Occupied",
  },
  {
    id: 3, unitNumber: "101", propertyId: 2, propertyName: "Richmond Apartment",
    tenantId: 3, tenantName: "Maria Lopez", rent: 1800, status: "Occupied",
    leaseStart: "2024-06-01", leaseEnd: "2026-06-01", notes: "Ground floor",
    bedrooms: 1, bathrooms: 1, sqft: 620, floor: 1, furnished: false,
    securityDeposit: 1800, utilityResponsibility: "Tenant pays hydro", availabilityDate: null, readinessStatus: "Occupied",
  },
  {
    id: 4, unitNumber: "102", propertyId: 2, propertyName: "Richmond Apartment",
    tenantId: null, tenantName: null, rent: 1850, status: "Vacant",
    leaseStart: null, leaseEnd: null, notes: "Available now",
    bedrooms: 1, bathrooms: 1, sqft: 640, floor: 1, furnished: false,
    securityDeposit: null, utilityResponsibility: "Tenant pays hydro", availabilityDate: "2026-08-20", readinessStatus: "Ready",
  },
  {
    id: 5, unitNumber: "201", propertyId: 2, propertyName: "Richmond Apartment",
    tenantId: 4, tenantName: "James Chen", rent: 1900, status: "Occupied",
    leaseStart: "2025-01-15", leaseEnd: "2026-10-15", notes: "Second floor corner unit",
    bedrooms: 1, bathrooms: 1, sqft: 680, floor: 2, furnished: false,
    securityDeposit: 1900, utilityResponsibility: "Tenant pays hydro", availabilityDate: null, readinessStatus: "Occupied",
  },
  {
    id: 6, unitNumber: "Main", propertyId: 3, propertyName: "Oakridge Rental Home",
    tenantId: null, tenantName: null, rent: 3200, status: "Vacant",
    leaseStart: null, leaseEnd: null, notes: "Available immediately",
    bedrooms: 3, bathrooms: 2, sqft: 1800, floor: null, furnished: false,
    securityDeposit: null, utilityResponsibility: "Tenant pays all", availabilityDate: "2026-08-20", readinessStatus: "Needs Preparation",
  },
];

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 1, fullName: "Sarah Thompson", email: "sarah.thompson@email.com", phone: "(604) 555-0123",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 1, unitNumber: "A",
    leaseStart: "2025-01-01", leaseEnd: "2026-09-30", leaseStatus: "Active",
    notes: "Preferred contact via email",
    lifecycleStatus: "Active", role: "Primary",
  },
  {
    id: 2, fullName: "Daniel Reed", email: "daniel.reed@email.com", phone: "(604) 555-0124",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 2, unitNumber: "B",
    leaseStart: "2025-03-01", leaseEnd: "2026-03-01", leaseStatus: "Active",
    notes: "Works night shifts",
    lifecycleStatus: "Active", role: "Primary",
  },
  {
    id: 3, fullName: "Maria Lopez", email: "maria.lopez@email.com", phone: "(604) 555-0125",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 3, unitNumber: "101",
    leaseStart: "2024-06-01", leaseEnd: "2026-06-01", leaseStatus: "Active",
    notes: "Long-term tenant, always pays on time",
    lifecycleStatus: "Active", role: "Primary",
  },
  {
    id: 4, fullName: "James Chen", email: "james.chen@email.com", phone: "(604) 555-0126",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 5, unitNumber: "201",
    leaseStart: "2025-01-15", leaseEnd: "2026-10-15", leaseStatus: "Active",
    notes: "Has one cat",
    lifecycleStatus: "Active", role: "Primary",
  },
  {
    id: 5, fullName: "Emily Watson", email: "emily.watson@email.com", phone: "(604) 555-0127",
    propertyId: null, propertyName: null, unitId: null, unitNumber: null,
    leaseStart: null, leaseEnd: null, leaseStatus: "No Unit Assigned",
    notes: "Interested in Oakridge property",
    lifecycleStatus: "Applicant", role: "Primary",
  },
];

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 1, title: "Kitchen sink leaking",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 1, unitNumber: "A",
    tenantId: 1, tenantName: "Sarah Thompson",
    category: "Plumbing", priority: "High", status: "In Progress",
    description: "Water dripping from under the kitchen sink. Seems to be coming from the P-trap.",
    createdDate: "2026-05-08", updatedDate: "2026-05-09",
    scheduledDate: "2026-08-25", completionDate: null,
    assignedTo: "Mike's Plumbing Co.", estimatedCost: 250, actualCost: null,
    notes: "Plumber scheduled for Aug 25", isRecurring: false, recurringFrequency: null,
  },
  {
    id: 2, title: "Furnace not heating",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 3, unitNumber: "101",
    tenantId: 3, tenantName: "Maria Lopez",
    category: "HVAC", priority: "Urgent", status: "New",
    description: "Furnace is running but not producing heat. Tenant reports cold air coming from vents.",
    createdDate: "2026-08-18", updatedDate: "2026-08-18",
    scheduledDate: null, completionDate: null,
    assignedTo: "", estimatedCost: null, actualCost: null,
    notes: "HVAC technician contacted", isRecurring: false, recurringFrequency: null,
  },
  {
    id: 3, title: "Broken window lock",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 2, unitNumber: "B",
    tenantId: 2, tenantName: "Daniel Reed",
    category: "Security", priority: "Medium", status: "New",
    description: "Lock on bedroom window is broken and won't latch properly.",
    createdDate: "2026-08-12", updatedDate: "2026-08-12",
    scheduledDate: "2026-08-22", completionDate: null,
    assignedTo: "Self", estimatedCost: 80, actualCost: null,
    notes: "Will visit property this week", isRecurring: false, recurringFrequency: null,
  },
  {
    id: 4, title: "Dishwasher not draining",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 5, unitNumber: "201",
    tenantId: 4, tenantName: "James Chen",
    category: "Appliance", priority: "Low", status: "Completed",
    description: "Dishwasher fills but doesn't drain. Water remains at bottom after cycle.",
    createdDate: "2026-04-28", updatedDate: "2026-05-02",
    scheduledDate: "2026-05-02", completionDate: "2026-05-02",
    assignedTo: "Self", estimatedCost: 120, actualCost: 95,
    notes: "Replaced drain pump", isRecurring: false, recurringFrequency: null,
  },
  {
    id: 5, title: "Annual HVAC inspection",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 3, unitNumber: "101",
    tenantId: 3, tenantName: "Maria Lopez",
    category: "HVAC", priority: "Low", status: "New",
    description: "Annual furnace and AC inspection and filter replacement.",
    createdDate: "2026-07-15", updatedDate: "2026-07-15",
    scheduledDate: "2026-09-01", completionDate: null,
    assignedTo: "Comfort HVAC Ltd.", estimatedCost: 180, actualCost: null,
    notes: "Annual preventative", isRecurring: true, recurringFrequency: "Annual",
  },
];

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 1, name: "Lease Agreement - Sarah Thompson", documentType: "Lease",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 1, unitNumber: "A",
    tenantId: 1, tenantName: "Sarah Thompson", leaseId: 1, inspectionId: null,
    uploadDate: "2025-01-01", expirationDate: "2026-09-30",
    notes: "1-year lease starting Jan 2025", version: 1,
  },
  {
    id: 2, name: "Move-in Inspection - Unit A", documentType: "Inspection",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 1, unitNumber: "A",
    tenantId: 1, tenantName: "Sarah Thompson", leaseId: null, inspectionId: 1,
    uploadDate: "2025-01-01", expirationDate: null,
    notes: "Completed with tenant present", version: 1,
  },
  {
    id: 3, name: "Lease Agreement - Daniel Reed", documentType: "Lease",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 2, unitNumber: "B",
    tenantId: 2, tenantName: "Daniel Reed", leaseId: 2, inspectionId: null,
    uploadDate: "2025-02-15", expirationDate: "2026-03-01",
    notes: "1-year lease starting March 2025", version: 1,
  },
  {
    id: 4, name: "Lease Agreement - Maria Lopez", documentType: "Lease",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 3, unitNumber: "101",
    tenantId: 3, tenantName: "Maria Lopez", leaseId: 3, inspectionId: null,
    uploadDate: "2024-05-15", expirationDate: "2026-06-01",
    notes: "2-year lease", version: 1,
  },
  {
    id: 5, name: "Property Insurance - Maple St Duplex", documentType: "Insurance",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: null, unitNumber: null,
    tenantId: null, tenantName: null, leaseId: null, inspectionId: null,
    uploadDate: "2026-01-15", expirationDate: "2026-09-15",
    notes: "Annual landlord insurance policy", version: 1,
  },
  {
    id: 6, name: "Lease Agreement - James Chen", documentType: "Lease",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 5, unitNumber: "201",
    tenantId: 4, tenantName: "James Chen", leaseId: 4, inspectionId: null,
    uploadDate: "2025-01-10", expirationDate: "2026-10-15",
    notes: "Fixed term lease", version: 1,
  },
];

const INITIAL_LEASES: Lease[] = [
  {
    id: 1, unitId: 1, unitNumber: "A", propertyId: 1, propertyName: "Maple Street Duplex",
    tenantIds: [1], tenantName: "Sarah Thompson",
    leaseType: "Fixed Term", status: "Active",
    startDate: "2025-01-01", endDate: "2026-09-30",
    rentAmount: 2200, rentDueDay: 1, securityDeposit: 2200, noticePeriodDays: 60,
    notes: "Includes parking stall",
  },
  {
    id: 2, unitId: 2, unitNumber: "B", propertyId: 1, propertyName: "Maple Street Duplex",
    tenantIds: [2], tenantName: "Daniel Reed",
    leaseType: "Fixed Term", status: "Active",
    startDate: "2025-03-01", endDate: "2026-03-01",
    rentAmount: 2100, rentDueDay: 1, securityDeposit: 2100, noticePeriodDays: 60,
    notes: "",
  },
  {
    id: 3, unitId: 3, unitNumber: "101", propertyId: 2, propertyName: "Richmond Apartment",
    tenantIds: [3], tenantName: "Maria Lopez",
    leaseType: "Fixed Term", status: "Active",
    startDate: "2024-06-01", endDate: "2026-06-01",
    rentAmount: 1800, rentDueDay: 1, securityDeposit: 1800, noticePeriodDays: 60,
    notes: "Long-term tenant",
  },
  {
    id: 4, unitId: 5, unitNumber: "201", propertyId: 2, propertyName: "Richmond Apartment",
    tenantIds: [4], tenantName: "James Chen",
    leaseType: "Fixed Term", status: "Active",
    startDate: "2025-01-15", endDate: "2026-10-15",
    rentAmount: 1900, rentDueDay: 1, securityDeposit: 1900, noticePeriodDays: 60,
    notes: "Pet allowed (one cat)",
  },
];

const INITIAL_RENT_PAYMENTS: RentPayment[] = [
  // Sarah — Aug overdue
  { id: 1, leaseId: 1, unitId: 1, tenantId: 1, amountDue: 2200, amountPaid: 0, dueDate: "2026-08-01", paidDate: null, status: "Overdue", method: "", note: "" },
  { id: 2, leaseId: 1, unitId: 1, tenantId: 1, amountDue: 2200, amountPaid: 2200, dueDate: "2026-07-01", paidDate: "2026-07-03", status: "Paid", method: "e-Transfer", note: "" },
  { id: 3, leaseId: 1, unitId: 1, tenantId: 1, amountDue: 2200, amountPaid: 2200, dueDate: "2026-06-01", paidDate: "2026-06-02", status: "Paid", method: "e-Transfer", note: "" },
  // James — Aug due
  { id: 4, leaseId: 4, unitId: 5, tenantId: 4, amountDue: 1900, amountPaid: 0, dueDate: "2026-08-01", paidDate: null, status: "Due", method: "", note: "" },
  { id: 5, leaseId: 4, unitId: 5, tenantId: 4, amountDue: 1900, amountPaid: 1900, dueDate: "2026-07-01", paidDate: "2026-07-01", status: "Paid", method: "e-Transfer", note: "" },
  // Maria — Jun partially paid
  { id: 6, leaseId: 3, unitId: 3, tenantId: 3, amountDue: 1800, amountPaid: 1800, dueDate: "2026-08-01", paidDate: "2026-08-02", status: "Paid", method: "Cheque", note: "" },
  { id: 7, leaseId: 3, unitId: 3, tenantId: 3, amountDue: 1800, amountPaid: 900, dueDate: "2026-07-01", paidDate: "2026-07-05", status: "Partially Paid", method: "Cheque", note: "Partial — remaining paid 2 weeks later" },
];

const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 1, type: "Move-In",
    propertyId: 1, propertyName: "Maple Street Duplex", unitId: 1, unitNumber: "A",
    tenantId: 1, tenantName: "Sarah Thompson",
    scheduledDate: "2025-01-01", inspectorName: "John Landlord",
    status: "Completed", notes: "Unit in good condition. Minor scuff on kitchen wall noted.",
    findings: [
      { id: 1, item: "Kitchen walls", condition: "Good", notes: "Minor scuff near doorway", maintenanceTicketId: null },
      { id: 2, item: "Bathroom fixtures", condition: "Good", notes: "All working", maintenanceTicketId: null },
      { id: 3, item: "Window locks", condition: "Good", notes: "All functioning", maintenanceTicketId: null },
    ],
    followUpRequired: false,
  },
  {
    id: 2, type: "Routine",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 3, unitNumber: "101",
    tenantId: 3, tenantName: "Maria Lopez",
    scheduledDate: "2026-09-10", inspectorName: "John Landlord",
    status: "Scheduled", notes: "Annual routine inspection",
    findings: [], followUpRequired: false,
  },
  {
    id: 3, type: "Safety",
    propertyId: 2, propertyName: "Richmond Apartment", unitId: 5, unitNumber: "201",
    tenantId: 4, tenantName: "James Chen",
    scheduledDate: "2026-08-28", inspectorName: "John Landlord",
    status: "Scheduled", notes: "Smoke and CO detector check",
    findings: [], followUpRequired: false,
  },
];

const INITIAL_ACTIVITY: ActivityEvent[] = [
  { id: 1, type: "rent_overdue", description: "Rent overdue for Unit A — Sarah Thompson ($2,200)", entityType: "unit", entityId: 1, entityName: "Unit A", date: "2026-08-05" },
  { id: 2, type: "maintenance_created", description: "Maintenance ticket created: Furnace not heating — Unit 101", entityType: "ticket", entityId: 2, entityName: "Furnace not heating", date: "2026-08-18" },
  { id: 3, type: "maintenance_created", description: "Maintenance ticket created: Broken window lock — Unit B", entityType: "ticket", entityId: 3, entityName: "Broken window lock", date: "2026-08-12" },
  { id: 4, type: "rent_paid", description: "Rent payment recorded for Unit 101 — Maria Lopez ($1,800)", entityType: "unit", entityId: 3, entityName: "Unit 101", date: "2026-08-02" },
  { id: 5, type: "inspection_scheduled", description: "Routine inspection scheduled for Unit 101 on Sep 10", entityType: "inspection", entityId: 2, entityName: "Routine Inspection", date: "2026-08-01" },
  { id: 6, type: "inspection_scheduled", description: "Safety inspection scheduled for Unit 201 on Aug 28", entityType: "inspection", entityId: 3, entityName: "Safety Inspection", date: "2026-08-01" },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [leases, setLeases] = useState<Lease[]>(INITIAL_LEASES);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>(INITIAL_RENT_PAYMENTS);
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(INITIAL_ACTIVITY);

  const today = new Date().toISOString().split("T")[0];
  const nextId = (arr: { id: number }[]) => Math.max(...arr.map(x => x.id), 0) + 1;

  // ── Add functions ──────────────────────────────────────────────────────────

  const addActivityEvent = (e: Omit<ActivityEvent, "id">) => {
    setActivityEvents(prev => [{ ...e, id: nextId(prev) }, ...prev]);
  };

  const addProperty = (property: Omit<Property, "id" | "unitCount" | "isArchived" | "floors" | "amenities" | "parking" | "utilityResponsibility"> & { floors?: number | null; amenities?: string; parking?: string; utilityResponsibility?: string }) => {
    const newProp: Property = { ...property, id: nextId(properties), unitCount: 0, isArchived: false, floors: property.floors ?? null, amenities: property.amenities ?? "", parking: property.parking ?? "", utilityResponsibility: property.utilityResponsibility ?? "" };
    setProperties(prev => [...prev, newProp]);
    addActivityEvent({ type: "property_created", description: `Property added: ${property.name}`, entityType: "property", entityId: newProp.id, entityName: property.name, date: today });
  };

  const addUnit = (unit: Omit<Unit, "id" | "propertyName" | "tenantName" | "bedrooms" | "bathrooms" | "sqft" | "floor" | "furnished" | "securityDeposit" | "utilityResponsibility" | "availabilityDate" | "readinessStatus"> & { bedrooms?: number | null; bathrooms?: number | null; sqft?: number | null; floor?: number | null; furnished?: boolean; securityDeposit?: number | null; utilityResponsibility?: string; availabilityDate?: string | null; readinessStatus?: string }) => {
    const property = properties.find(p => p.id === unit.propertyId);
    const tenant = unit.tenantId ? tenants.find(t => t.id === unit.tenantId) : null;
    const newUnit: Unit = {
      ...unit, id: nextId(units), propertyName: property?.name || "", tenantName: tenant?.fullName || null,
      bedrooms: unit.bedrooms ?? null, bathrooms: unit.bathrooms ?? null, sqft: unit.sqft ?? null,
      floor: unit.floor ?? null, furnished: unit.furnished ?? false, securityDeposit: unit.securityDeposit ?? null,
      utilityResponsibility: unit.utilityResponsibility ?? "Tenant", availabilityDate: unit.availabilityDate ?? null,
      readinessStatus: unit.readinessStatus ?? (unit.status === "Occupied" ? "Occupied" : "Ready"),
    };
    setUnits(prev => [...prev, newUnit]);
    if (property) setProperties(prev => prev.map(p => p.id === property.id ? { ...p, unitCount: p.unitCount + 1 } : p));
  };

  const addTenant = (tenant: Omit<Tenant, "id" | "propertyName" | "unitNumber" | "lifecycleStatus" | "role"> & { lifecycleStatus?: string; role?: string }) => {
    const unit = tenant.unitId ? units.find(u => u.id === tenant.unitId) : null;
    const property = tenant.propertyId ? properties.find(p => p.id === tenant.propertyId) : null;
    const newTenant: Tenant = { ...tenant, id: nextId(tenants), propertyName: property?.name || null, unitNumber: unit?.unitNumber || null, lifecycleStatus: tenant.lifecycleStatus ?? (tenant.unitId ? "Active" : "Applicant"), role: tenant.role ?? "Primary" };
    setTenants(prev => [...prev, newTenant]);
  };

  const addMaintenanceTicket = (ticket: Omit<MaintenanceTicket, "id" | "propertyName" | "unitNumber" | "tenantName" | "createdDate" | "updatedDate" | "scheduledDate" | "completionDate" | "assignedTo" | "estimatedCost" | "actualCost" | "isRecurring" | "recurringFrequency"> & { scheduledDate?: string | null; completionDate?: string | null; assignedTo?: string; estimatedCost?: number | null; actualCost?: number | null; isRecurring?: boolean; recurringFrequency?: string | null }) => {
    const property = properties.find(p => p.id === ticket.propertyId);
    const unit = units.find(u => u.id === ticket.unitId);
    const tenant = tenants.find(t => t.id === ticket.tenantId);
    const newTicket: MaintenanceTicket = {
      ...ticket, id: nextId(maintenanceTickets),
      propertyName: property?.name || "", unitNumber: unit?.unitNumber || "", tenantName: tenant?.fullName || "",
      createdDate: today, updatedDate: today,
      scheduledDate: ticket.scheduledDate ?? null,
      completionDate: ticket.completionDate ?? null,
      assignedTo: ticket.assignedTo ?? "",
      estimatedCost: ticket.estimatedCost ?? null,
      actualCost: ticket.actualCost ?? null,
      isRecurring: ticket.isRecurring ?? false,
      recurringFrequency: ticket.recurringFrequency ?? null,
    };
    setMaintenanceTickets(prev => [...prev, newTicket]);
    addActivityEvent({ type: "maintenance_created", description: `Maintenance ticket created: ${ticket.title}`, entityType: "ticket", entityId: newTicket.id, entityName: ticket.title, date: today });
  };

  const addDocument = (doc: Omit<Document, "id" | "propertyName" | "unitNumber" | "tenantName" | "uploadDate" | "version" | "leaseId" | "inspectionId" | "expirationDate"> & { leaseId?: number | null; inspectionId?: number | null; expirationDate?: string | null }) => {
    const property = doc.propertyId ? properties.find(p => p.id === doc.propertyId) : null;
    const unit = doc.unitId ? units.find(u => u.id === doc.unitId) : null;
    const tenant = doc.tenantId ? tenants.find(t => t.id === doc.tenantId) : null;
    const newDoc: Document = { ...doc, id: nextId(documents), propertyName: property?.name || null, unitNumber: unit?.unitNumber || null, tenantName: tenant?.fullName || null, uploadDate: today, version: 1, leaseId: doc.leaseId ?? null, inspectionId: doc.inspectionId ?? null, expirationDate: doc.expirationDate ?? null };
    setDocuments(prev => [...prev, newDoc]);
  };

  const addLease = (lease: Omit<Lease, "id" | "propertyName" | "unitNumber" | "tenantName">) => {
    const property = properties.find(p => p.id === lease.propertyId);
    const unit = units.find(u => u.id === lease.unitId);
    const firstTenant = lease.tenantIds.length > 0 ? tenants.find(t => t.id === lease.tenantIds[0]) : null;
    const newLease = {
      ...lease, id: nextId(leases),
      propertyName: property?.name || "",
      unitNumber: unit?.unitNumber || "",
      tenantName: firstTenant?.fullName || "",
    };
    setLeases(prev => [...prev, newLease]);
    addActivityEvent({ type: "lease_created", description: `Lease created for Unit ${newLease.unitNumber} — ${newLease.tenantName}`, entityType: "lease", entityId: newLease.id, entityName: `Unit ${newLease.unitNumber}`, date: today });
  };

  const addRentPayment = (payment: Omit<RentPayment, "id">) => {
    const newPayment = { ...payment, id: nextId(rentPayments) };
    setRentPayments(prev => [...prev, newPayment]);
    addActivityEvent({ type: "rent_paid", description: `Rent payment recorded — ${payment.status} ($${payment.amountPaid})`, entityType: "unit", entityId: payment.unitId, entityName: `Unit`, date: today });
  };

  const addInspection = (inspection: Omit<Inspection, "id" | "propertyName" | "unitNumber" | "tenantName">) => {
    const property = properties.find(p => p.id === inspection.propertyId);
    const unit = inspection.unitId ? units.find(u => u.id === inspection.unitId) : null;
    const tenant = inspection.tenantId ? tenants.find(t => t.id === inspection.tenantId) : null;
    const newInspection = {
      ...inspection, id: nextId(inspections),
      propertyName: property?.name || "",
      unitNumber: unit?.unitNumber || null,
      tenantName: tenant?.fullName || null,
    };
    setInspections(prev => [...prev, newInspection]);
    addActivityEvent({ type: "inspection_scheduled", description: `${inspection.type} inspection scheduled for ${newInspection.propertyName}${newInspection.unitNumber ? ` Unit ${newInspection.unitNumber}` : ""}`, entityType: "inspection", entityId: newInspection.id, entityName: `${inspection.type} Inspection`, date: today });
  };

  // ── Update functions ───────────────────────────────────────────────────────

  const updateProperty = (id: number, data: Partial<Omit<Property, "id">>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    if (data.name) {
      setUnits(prev => prev.map(u => u.propertyId === id ? { ...u, propertyName: data.name! } : u));
      setTenants(prev => prev.map(t => t.propertyId === id ? { ...t, propertyName: data.name! } : t));
      setMaintenanceTickets(prev => prev.map(t => t.propertyId === id ? { ...t, propertyName: data.name! } : t));
      setDocuments(prev => prev.map(d => d.propertyId === id ? { ...d, propertyName: data.name! } : d));
      setLeases(prev => prev.map(l => l.propertyId === id ? { ...l, propertyName: data.name! } : l));
      setInspections(prev => prev.map(i => i.propertyId === id ? { ...i, propertyName: data.name! } : i));
    }
  };

  const updateUnit = (id: number, data: Partial<Omit<Unit, "id">>) => {
    const oldUnit = units.find(u => u.id === id);
    if (!oldUnit) return;
    const newPropertyId = data.propertyId ?? oldUnit.propertyId;
    const newTenantId = data.tenantId !== undefined ? data.tenantId : oldUnit.tenantId;
    const property = properties.find(p => p.id === newPropertyId);
    const tenant = newTenantId ? tenants.find(t => t.id === newTenantId) : null;
    const updatedUnit = { ...oldUnit, ...data, propertyName: property?.name || oldUnit.propertyName, tenantName: tenant?.fullName || null };
    setUnits(prev => prev.map(u => u.id === id ? updatedUnit : u));
    if (data.tenantId !== undefined && oldUnit.tenantId !== data.tenantId) {
      if (oldUnit.tenantId) {
        setTenants(prev => prev.map(t => t.id === oldUnit.tenantId ? { ...t, unitId: null, unitNumber: null, propertyId: null, propertyName: null, leaseStatus: "No Unit Assigned", lifecycleStatus: "Former Tenant" } : t));
      }
      if (data.tenantId) {
        setTenants(prev => prev.map(t => t.id === data.tenantId ? { ...t, unitId: id, unitNumber: updatedUnit.unitNumber, propertyId: newPropertyId, propertyName: property?.name || null, leaseStatus: "Active", lifecycleStatus: "Active" } : t));
      }
    }
    if (data.propertyId !== undefined && oldUnit.propertyId !== data.propertyId) {
      setProperties(prev => prev.map(p => {
        if (p.id === oldUnit.propertyId) return { ...p, unitCount: Math.max(0, p.unitCount - 1) };
        if (p.id === data.propertyId) return { ...p, unitCount: p.unitCount + 1 };
        return p;
      }));
    }
    if (data.unitNumber) {
      setMaintenanceTickets(prev => prev.map(t => t.unitId === id ? { ...t, unitNumber: data.unitNumber! } : t));
      setDocuments(prev => prev.map(d => d.unitId === id ? { ...d, unitNumber: data.unitNumber! } : d));
    }
  };

  const updateTenant = (id: number, data: Partial<Omit<Tenant, "id">>) => {
    const oldTenant = tenants.find(t => t.id === id);
    if (!oldTenant) return;
    const newUnitId = data.unitId !== undefined ? data.unitId : oldTenant.unitId;
    const newPropertyId = data.propertyId !== undefined ? data.propertyId : oldTenant.propertyId;
    const unit = newUnitId ? units.find(u => u.id === newUnitId) : null;
    const property = newPropertyId ? properties.find(p => p.id === newPropertyId) : null;
    const updatedTenant = { ...oldTenant, ...data, propertyName: property?.name || null, unitNumber: unit?.unitNumber || null };
    setTenants(prev => prev.map(t => t.id === id ? updatedTenant : t));
    if (data.unitId !== undefined && oldTenant.unitId !== data.unitId) {
      if (oldTenant.unitId) setUnits(prev => prev.map(u => u.id === oldTenant.unitId ? { ...u, tenantId: null, tenantName: null, status: "Vacant" } : u));
      if (data.unitId) setUnits(prev => prev.map(u => u.id === data.unitId ? { ...u, tenantId: id, tenantName: data.fullName || oldTenant.fullName, status: "Occupied" } : u));
    }
    if (data.fullName) {
      setUnits(prev => prev.map(u => u.tenantId === id ? { ...u, tenantName: data.fullName! } : u));
      setMaintenanceTickets(prev => prev.map(t => t.tenantId === id ? { ...t, tenantName: data.fullName! } : t));
      setDocuments(prev => prev.map(d => d.tenantId === id ? { ...d, tenantName: data.fullName! } : d));
    }
  };

  const updateMaintenanceTicket = (id: number, data: Partial<Omit<MaintenanceTicket, "id">>) => {
    let updates = { ...data, updatedDate: today };
    if (data.propertyId !== undefined) { const p = properties.find(x => x.id === data.propertyId); if (p) updates = { ...updates, propertyName: p.name }; }
    if (data.unitId !== undefined) { const u = units.find(x => x.id === data.unitId); if (u) updates = { ...updates, unitNumber: u.unitNumber }; }
    if (data.tenantId !== undefined) { const t = tenants.find(x => x.id === data.tenantId); if (t) updates = { ...updates, tenantName: t.fullName }; }
    setMaintenanceTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateDocument = (id: number, data: Partial<Omit<Document, "id">>) => {
    let updates = { ...data };
    if (data.propertyId !== undefined) { const p = data.propertyId ? properties.find(x => x.id === data.propertyId) : null; updates = { ...updates, propertyName: p?.name || null }; }
    if (data.unitId !== undefined) { const u = data.unitId ? units.find(x => x.id === data.unitId) : null; updates = { ...updates, unitNumber: u?.unitNumber || null }; }
    if (data.tenantId !== undefined) { const t = data.tenantId ? tenants.find(x => x.id === data.tenantId) : null; updates = { ...updates, tenantName: t?.fullName || null }; }
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const updateLease = (id: number, data: Partial<Omit<Lease, "id">>) => {
    setLeases(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const updateRentPayment = (id: number, data: Partial<Omit<RentPayment, "id">>) => {
    setRentPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const updateInspection = (id: number, data: Partial<Omit<Inspection, "id">>) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    if (data.status === "Completed") {
      const insp = inspections.find(i => i.id === id);
      if (insp) addActivityEvent({ type: "inspection_completed", description: `${insp.type} inspection completed at ${insp.propertyName}${insp.unitNumber ? ` Unit ${insp.unitNumber}` : ""}`, entityType: "inspection", entityId: id, entityName: `${insp.type} Inspection`, date: today });
    }
  };

  // ── Delete functions ───────────────────────────────────────────────────────

  const deleteProperty = (id: number) => setProperties(prev => prev.filter(p => p.id !== id));
  const deleteUnit = (id: number) => {
    const unit = units.find(u => u.id === id);
    setUnits(prev => prev.filter(u => u.id !== id));
    if (unit) setProperties(prev => prev.map(p => p.id === unit.propertyId ? { ...p, unitCount: Math.max(0, p.unitCount - 1) } : p));
  };
  const deleteTenant = (id: number) => setTenants(prev => prev.filter(t => t.id !== id));
  const deleteMaintenanceTicket = (id: number) => setMaintenanceTickets(prev => prev.filter(t => t.id !== id));
  const deleteDocument = (id: number) => setDocuments(prev => prev.filter(d => d.id !== id));
  const deleteLease = (id: number) => setLeases(prev => prev.filter(l => l.id !== id));
  const deleteInspection = (id: number) => setInspections(prev => prev.filter(i => i.id !== id));

  // ── Archive ────────────────────────────────────────────────────────────────

  const archiveProperty = (id: number) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    setProperties(prev => prev.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p));
    addActivityEvent({ type: prop.isArchived ? "property_restored" : "property_archived", description: `Property ${prop.isArchived ? "restored" : "archived"}: ${prop.name}`, entityType: "property", entityId: id, entityName: prop.name, date: today });
  };

  // ── Move-In / Move-Out ────────────────────────────────────────────────────

  const completeMoveIn = (params: MoveInParams) => {
    const tenant = tenants.find(t => t.id === params.tenantId);
    const unit = units.find(u => u.id === params.unitId);
    if (!tenant || !unit) return;

    const newLeaseId = nextId(leases);
    const newLease: Lease = {
      id: newLeaseId, unitId: params.unitId, unitNumber: unit.unitNumber,
      propertyId: params.propertyId, propertyName: unit.propertyName,
      tenantIds: [params.tenantId], tenantName: tenant.fullName,
      leaseType: params.leaseType, status: "Active",
      startDate: params.startDate, endDate: params.endDate,
      rentAmount: params.rentAmount, rentDueDay: params.rentDueDay,
      securityDeposit: params.securityDeposit, noticePeriodDays: 60,
      notes: params.notes,
    };
    setLeases(prev => [...prev, newLease]);
    setUnits(prev => prev.map(u => u.id === params.unitId ? {
      ...u, tenantId: params.tenantId, tenantName: tenant.fullName,
      status: "Occupied", leaseStart: params.startDate, leaseEnd: params.endDate,
      securityDeposit: params.securityDeposit, rent: params.rentAmount, readinessStatus: "Occupied",
    } : u));
    setTenants(prev => prev.map(t => t.id === params.tenantId ? {
      ...t, unitId: params.unitId, unitNumber: unit.unitNumber,
      propertyId: params.propertyId, propertyName: unit.propertyName,
      leaseStart: params.startDate, leaseEnd: params.endDate,
      leaseStatus: "Active", lifecycleStatus: "Active",
    } : t));
    addActivityEvent({ type: "tenant_moved_in", description: `${tenant.fullName} moved into Unit ${unit.unitNumber} at ${unit.propertyName}`, entityType: "unit", entityId: params.unitId, entityName: `Unit ${unit.unitNumber}`, date: today });
  };

  const completeMoveOut = (params: MoveOutParams) => {
    const tenant = tenants.find(t => t.id === params.tenantId);
    const unit = units.find(u => u.id === params.unitId);
    if (!tenant || !unit) return;

    setLeases(prev => prev.map(l => l.id === params.leaseId ? { ...l, status: "Terminated", endDate: params.moveOutDate } : l));
    setUnits(prev => prev.map(u => u.id === params.unitId ? {
      ...u, tenantId: null, tenantName: null,
      status: params.unitNextStatus, leaseStart: null, leaseEnd: null,
      readinessStatus: params.unitNextStatus === "Under Maintenance" ? "Under Maintenance" : "Needs Preparation",
    } : u));
    setTenants(prev => prev.map(t => t.id === params.tenantId ? {
      ...t, unitId: null, unitNumber: null, leaseStatus: "Ended",
      lifecycleStatus: "Former Tenant",
    } : t));
    addActivityEvent({ type: "tenant_moved_out", description: `${tenant.fullName} moved out of Unit ${unit.unitNumber} — ${params.reason}`, entityType: "unit", entityId: params.unitId, entityName: `Unit ${unit.unitNumber}`, date: today });
  };

  return (
    <AppContext.Provider value={{
      properties, units, tenants, maintenanceTickets, documents,
      leases, rentPayments, inspections, activityEvents,
      addProperty, addUnit, addTenant, addMaintenanceTicket, addDocument, addLease, addRentPayment, addInspection, addActivityEvent,
      updateProperty, updateUnit, updateTenant, updateMaintenanceTicket, updateDocument, updateLease, updateRentPayment, updateInspection,
      deleteProperty, deleteUnit, deleteTenant, deleteMaintenanceTicket, deleteDocument, deleteLease, deleteInspection,
      archiveProperty, completeMoveIn, completeMoveOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
}
