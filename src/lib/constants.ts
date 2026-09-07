// ─── Application Constants ────────────────────────────────────────────────────
// Centralized string constants and option lists.
// Import from here instead of scattering string literals throughout components.

import type {
  PropertyStatus,
  UnitStatus,
  UnitReadinessStatus,
  TenantLifecycleStatus,
  TenantRole,
  LeaseType,
  RentPaymentStatus,
  PaymentMethod,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceCategory,
  InspectionType,
  InspectionStatus,
  FindingCondition,
  DocumentType,
} from "../types";

// ── Property ───────────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  "Single Family",
  "Duplex",
  "Triplex",
  "Fourplex",
  "Apartment",
  "Townhouse",
  "Condo",
  "Commercial",
  "Mixed Use",
] as const;

export const PROPERTY_STATUSES: PropertyStatus[] = ["Active", "Archived"];

export const CANADIAN_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
] as const;

// ── Unit ───────────────────────────────────────────────────────────────────────

export const UNIT_STATUSES: UnitStatus[] = [
  "Occupied",
  "Vacant",
  "Coming Soon",
  "Under Maintenance",
  "Unavailable",
];

export const UNIT_READINESS_STATUSES: UnitReadinessStatus[] = [
  "Ready",
  "Occupied",
  "Needs Preparation",
  "Under Maintenance",
  "Coming Soon",
];

export const UTILITY_RESPONSIBILITY_OPTIONS = [
  "Tenant pays all utilities",
  "Tenant pays hydro",
  "Tenant pays gas",
  "Tenant pays water",
  "Landlord pays water, tenant pays hydro",
  "Landlord pays all utilities",
  "Utilities included in rent",
] as const;

// ── Tenant ─────────────────────────────────────────────────────────────────────

export const TENANT_LIFECYCLE_STATUSES: TenantLifecycleStatus[] = [
  "Applicant",
  "Approved",
  "Active",
  "Notice Given",
  "Former Tenant",
  "Archived",
];

export const TENANT_ROLES: TenantRole[] = ["Primary", "Co-tenant", "Occupant"];

// ── Lease ──────────────────────────────────────────────────────────────────────

export const LEASE_TYPES: LeaseType[] = ["Fixed Term", "Month-to-Month"];

export const LEASE_EXPIRY_WARNING_DAYS = 60;

export const DEFAULT_NOTICE_PERIOD_DAYS = 60;

export const DEFAULT_RENT_DUE_DAY = 1;

// ── Rent / Payments ────────────────────────────────────────────────────────────

export const RENT_PAYMENT_STATUSES: RentPaymentStatus[] = [
  "Paid",
  "Due",
  "Overdue",
  "Partially Paid",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "e-Transfer",
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Other",
];

// ── Maintenance ────────────────────────────────────────────────────────────────

export const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Cleaning",
  "Security",
  "Landscaping",
  "General",
];

export const MAINTENANCE_PRIORITIES: MaintenancePriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const MAINTENANCE_STATUSES: MaintenanceStatus[] = [
  "New",
  "In Progress",
  "Pending Parts",
  "Scheduled",
  "Completed",
  "Cancelled",
];

export const RECURRING_FREQUENCIES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Semi-Annual",
  "Annual",
] as const;

// ── Inspection ─────────────────────────────────────────────────────────────────

export const INSPECTION_TYPES: InspectionType[] = [
  "Move-In",
  "Move-Out",
  "Routine",
  "Annual",
  "Safety",
  "Maintenance",
];

export const INSPECTION_STATUSES: InspectionStatus[] = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Follow-Up Required",
  "Cancelled",
];

export const FINDING_CONDITIONS: FindingCondition[] = [
  "Good",
  "Fair",
  "Poor",
  "Damaged",
];

// ── Documents ──────────────────────────────────────────────────────────────────

export const DOCUMENT_TYPES: DocumentType[] = [
  "Lease",
  "Inspection",
  "Insurance",
  "Notice",
  "Invoice",
  "Receipt",
  "Permit",
  "Correspondence",
  "Other",
];

export const DOCUMENT_EXPIRY_WARNING_DAYS = 60;

// ── App-wide ───────────────────────────────────────────────────────────────────

export const APP_NAME = "Landlord HQ";
