// ─── Service Registry ─────────────────────────────────────────────────────────
// Exports the active service implementations.
// To switch from mock to real: replace mock imports with real implementations
// that satisfy the same interfaces from ./interfaces.ts.
//
// Example:
//   import { supabasePropertyService } from "./supabase/propertyService";
//   export const propertyService = supabasePropertyService;

export { mockAuthService as authService } from "./mock/authService";
export { mockPropertyService as propertyService } from "./mock/propertyService";
export { mockUnitService as unitService } from "./mock/unitService";
export { mockTenantService as tenantService } from "./mock/tenantService";
export { mockLeaseService as leaseService } from "./mock/leaseService";
export { mockPaymentService as paymentService } from "./mock/paymentService";
export { mockMaintenanceService as maintenanceService } from "./mock/maintenanceService";
export { mockInspectionService as inspectionService } from "./mock/inspectionService";
export { mockDocumentService as documentService } from "./mock/documentService";
export { mockNotificationService as notificationService } from "./mock/notificationService";
export { mockActivityService as activityService } from "./mock/activityService";
export { mockSearchService as searchService } from "./mock/searchService";

export type {
  IAuthService,
  IPropertyService,
  IUnitService,
  ITenantService,
  ILeaseService,
  IPaymentService,
  IMaintenanceService,
  IInspectionService,
  IDocumentService,
  INotificationService,
  IActivityService,
  ISearchService,
  SearchResult,
} from "./interfaces";
