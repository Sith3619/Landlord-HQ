# Landlord HQ — Production Code Handoff & Developer Readiness

Prepare the existing Landlord HQ project for **developer handoff and continued implementation in a real codebase**.

This is NOT a request to build a backend.

This is NOT a request to simulate production authentication.

This is NOT a request to add fake API integrations.

The goal is to make the generated frontend codebase **clean, maintainable, logically structured, typed, documented, and ready for me to connect to a real backend and implement production logic myself.**

---

# 1. PRESERVE THE EXISTING PRODUCT

Do not rebuild Landlord HQ.

Do not remove existing pages.

Do not remove existing functionality.

Do not redesign the application unless necessary to correct an inconsistency.

Preserve the existing:

* Design system
* Layout
* Sidebar
* Header
* Dashboard
* Properties
* Units
* Tenants
* Maintenance
* Documents
* Leases
* Inspections
* Settings
* Authentication UI
* Search UI
* Notification UI
* Forms
* Dialogs
* Tables
* Empty states
* Loading states
* Error states
* Responsive behavior

The purpose of this pass is to make the existing application **developer-ready**.

---

# 2. CODE QUALITY FIRST

Audit the entire codebase for:

* Duplicate components
* Duplicate state
* Unused imports
* Unused variables
* Dead code
* Broken imports
* Incorrect component paths
* Inconsistent naming
* Inconsistent prop structures
* Hardcoded values that should be constants
* Repeated UI logic
* Excessively large components
* Components doing too many responsibilities
* Missing TypeScript types
* `any` usage where avoidable
* Incorrect React patterns
* Missing keys
* Incorrect state updates
* Fragile conditional rendering

Refactor where necessary.

The resulting code should be understandable to another developer opening the repository for the first time.

---

# 3. TYPESCRIPT

Use TypeScript properly throughout the application.

Create centralized domain types for the major entities.

At minimum define clear types/interfaces for:

* User
* Property
* Unit
* Tenant
* Occupant
* Lease
* RentRecord
* Payment
* MaintenanceTicket
* Inspection
* Document
* Notification
* Activity
* PropertyStatus
* UnitStatus
* TenantStatus
* LeaseStatus
* RentStatus
* MaintenanceStatus
* MaintenancePriority
* InspectionStatus

Do not duplicate slightly different versions of the same type throughout components.

Create a clear type/domain organization.

---

# 4. DOMAIN MODELS

The frontend should be designed around these relationships:

Property
→ Units

Unit
→ Occupants/Tenants
→ Lease
→ Rent
→ Maintenance
→ Inspections
→ Documents

Tenant
→ Unit
→ Lease
→ Rent
→ Maintenance
→ Documents

Lease
→ Property
→ Unit
→ Tenant/Occupants
→ Documents

Maintenance
→ Property
→ Unit
→ Tenant
→ Inspection where applicable

Inspection
→ Property
→ Unit
→ Tenant where applicable
→ Maintenance where applicable

Documents
→ Property
→ Unit
→ Tenant
→ Lease
→ Inspection
→ Maintenance where applicable

Make these relationships explicit in the TypeScript models.

---

# 5. SUPPORT MULTIPLE OCCUPANTS

Do not architect the application around:

`unit.tenant`

as the only relationship.

Use a structure capable of supporting:

* Primary tenant
* Co-tenant
* Additional occupant

A unit should be capable of having multiple occupants.

The frontend should remain compatible with both:

* One tenant
* Multiple tenants

---

# 6. SEPARATE UI FROM DATA ACCESS

This is one of the most important requirements.

Do not tightly couple components to mock data.

Create clear boundaries between:

### UI components

Responsible for:

* Rendering
* User interaction
* Forms
* Visual state

### Application/domain state

Responsible for:

* Current entities
* Relationships
* Local updates

### Data/service layer

Responsible for:

* Fetching data
* Creating data
* Updating data
* Deleting/archiving data

The service layer can currently use mock/local implementations.

The purpose is to allow me to replace the mock implementation with real API/database calls later without rewriting the UI.

---

# 7. CREATE SERVICE INTERFACES

Create clear service boundaries for:

* Auth
* Properties
* Units
* Tenants
* Leases
* Rent/Payments
* Maintenance
* Inspections
* Documents
* Notifications
* Activity

Example conceptual structure:

`propertyService`

with methods such as:

* getProperties()
* getPropertyById()
* createProperty()
* updateProperty()
* archiveProperty()

Do the same for the other domains.

These do not need to connect to a backend yet.

The important requirement is that UI components should not directly manipulate mock arrays everywhere.

---

# 8. MOCK IMPLEMENTATIONS

Keep mock data so the application continues to work without a backend.

However, place mock data behind the service/state abstraction.

Do not scatter mock objects throughout pages.

Create realistic sample data demonstrating:

* Multiple properties
* Multiple units
* Occupied units
* Vacant units
* Units under maintenance
* Multiple tenants
* Active leases
* Expiring leases
* Overdue rent
* Paid rent
* Maintenance tickets
* Inspections
* Documents
* Notifications
* Activity

This should demonstrate the complete UI.

---

# 9. BACKEND-READY AUTHENTICATION

Keep the existing Login and Signup UI.

Do not attempt to implement production authentication.

Instead create a clean authentication abstraction.

Conceptually:

`authService`

with operations such as:

* login()
* signup()
* logout()
* getCurrentUser()
* getSession()

The current implementation can use mock/local behavior.

Clearly isolate this so I can later replace it with:

* Firebase
* Supabase
* custom API
* Auth0
* another authentication provider

without rebuilding the authentication UI.

Do not store real passwords insecurely as if this were production authentication.

---

# 10. BACKEND-READY API STRUCTURE

Create a clear location for API/service logic.

For example:

`services/`

or an equivalent architecture appropriate to the existing project.

Organize it by domain.

Do not create fake API endpoints.

Do not pretend mock functions are real HTTP calls.

Clearly distinguish:

**mock implementation**

from:

**future production implementation**

---

# 11. ROUTING

Audit all application routes.

Ensure:

* Every page has a defined route
* Detail pages use IDs
* Navigation uses the router
* No hardcoded page switching
* No duplicate routes
* No broken links
* Back navigation works where appropriate
* Unknown routes have a proper fallback
* Protected application routes are structurally separated from public routes

Use the existing React Router architecture.

---

# 12. DETAIL ROUTES

Use scalable routes such as:

`/properties/:propertyId`

`/units/:unitId`

`/tenants/:tenantId`

`/leases/:leaseId`

`/maintenance/:ticketId`

`/inspections/:inspectionId`

`/documents/:documentId`

Do not create separate duplicated pages for each record.

---

# 13. FORM ARCHITECTURE

Audit all forms.

Forms should have:

* Proper TypeScript types
* React Hook Form integration where appropriate
* Validation
* Reusable field components where useful
* Clear submission handlers
* Loading state
* Error state
* Success handling
* Cancel behavior
* Reset behavior

Forms should not contain large amounts of business logic.

---

# 14. VALIDATION

Centralize reusable validation rules where practical.

Examples:

* Email
* Required fields
* Dates
* Rent amounts
* Security deposits
* Lease dates
* Monthly rent
* Unit relationships

Do not duplicate validation logic across every form.

---

# 15. STATE MANAGEMENT

Audit the existing global state architecture.

Ensure there is a clear source of truth.

Do not maintain separate copies of the same entity in:

* Dashboard
* Properties
* Units
* Tenants
* Maintenance
* Documents

For example, updating a tenant should not require manually updating five unrelated arrays.

Derived dashboard values should be calculated from the underlying state.

Prepare the state structure so it can later be replaced or synchronized with backend data.

---

# 16. SEARCH ARCHITECTURE

The search UI should remain.

Do not build a backend search engine.

Instead isolate search logic into a reusable search abstraction.

The frontend should be able to search the current loaded data.

Create a clear place where I can later replace:

**local search**

with:

**server-side search/API search**

without redesigning the search UI.

---

# 17. NOTIFICATIONS ARCHITECTURE

Keep the notification UI and preferences.

Do not attempt real push/email notifications.

Create a notification model and service boundary.

The frontend should be capable of displaying:

* Unread notifications
* Read notifications
* Notification type
* Timestamp
* Related entity
* Navigation target

The backend can later generate and deliver actual notifications.

---

# 18. ACTIVITY / AUDIT ARCHITECTURE

Keep the activity feed.

Separate:

### User-facing activity

Examples:

"Tenant added"

"Maintenance completed"

from the concept of:

### Production audit logging

The frontend should be structured so a backend can eventually provide a real audit trail.

Do not pretend the frontend activity list is a secure audit log.

---

# 19. ERROR HANDLING

Create consistent application-level error handling.

Support:

* API error placeholder
* Form errors
* Loading errors
* Empty data
* Missing record
* Unauthorized state
* Network error placeholder

The UI should be prepared to receive backend errors later.

Do not hide errors with silent failures.

---

# 20. LOADING STATES

All asynchronous-looking operations should have appropriate loading states.

Examples:

* Loading properties
* Loading tenant
* Saving tenant
* Saving maintenance ticket
* Uploading document
* Loading dashboard
* Logging in

The loading state should be easy to replace with actual API loading states later.

---

# 21. FILE UPLOAD ARCHITECTURE

Keep the existing document upload UI.

Do not implement real cloud storage.

Create a clean upload boundary so I can later connect:

* AWS S3
* Firebase Storage
* Supabase Storage
* Cloudinary
* Another storage service

The UI should handle:

* Selecting file
* File name
* File type
* Upload state
* Success
* Failure
* Progress placeholder

Do not encode large files directly into application state.

---

# 22. DATE / CURRENCY HANDLING

Centralize formatting utilities for:

* Currency
* Dates
* Relative dates
* Percentages

Do not manually format these values differently across pages.

Use consistent formatting throughout Landlord HQ.

---

# 23. CONSTANTS / ENUMS

Centralize reusable values such as:

* Statuses
* Priorities
* Document types
* Property types
* Maintenance categories
* Inspection types

Avoid repeated string literals throughout components.

---

# 24. COMPONENT ARCHITECTURE

Audit components and split large components where appropriate.

Maintain a logical structure separating:

### UI primitives

Buttons
Inputs
Dialogs
Cards
Tables
Badges

### Shared application components

Search
Notifications
Empty states
Loading states
Error states

### Domain components

Property components
Unit components
Tenant components
Lease components
Maintenance components
Inspection components
Document components

### Pages

Dashboard
Properties
Units
Tenants
Maintenance
Documents
Leases
Inspections
Settings

Do not over-componentize trivial one-off elements.

---

# 25. NO BUSINESS LOGIC INSIDE PRESENTATIONAL COMPONENTS

For example:

A PropertyCard should display a property.

It should not contain complex logic for:

* Fetching properties
* Updating global state
* Calculating unrelated dashboard metrics
* Authentication

Keep responsibilities clear.

---

# 26. DASHBOARD

The dashboard should consume derived data rather than maintaining its own duplicate data.

Metrics should be derived from:

* Properties
* Units
* Tenants
* Leases
* Rent
* Maintenance
* Inspections

The dashboard should remain functional with mock data and be easy to connect to backend endpoints later.

---

# 27. DATA RELATIONSHIPS

Ensure the frontend gracefully handles:

* Missing tenant
* Missing lease
* Missing document
* Vacant unit
* Multiple occupants
* Archived property
* Expired lease
* Deleted/archived related record

Do not assume every relationship always exists.

Avoid crashes from undefined nested objects.

---

# 28. ARCHIVING VS DELETION

Where historical data matters, prefer:

`archive`

over permanent deletion.

Support appropriate archived states for:

* Properties
* Tenants
* Leases
* Units
* Documents

Keep destructive deletion only where appropriate.

---

# 29. ENVIRONMENT CONFIGURATION

Prepare the project for environment-specific configuration.

Create a clear mechanism for future variables such as:

* API URL
* Storage URL
* Authentication configuration

Do not hardcode future backend URLs throughout components.

Do not include real credentials or secrets.

---

# 30. DOCUMENTATION

Update/create developer documentation.

Include:

## README

Explain:

* What Landlord HQ is
* Tech stack
* How to install
* How to run
* Project structure
* How mock data works
* How state works
* How routing works
* How to add a new domain

## DEVELOPMENT_HANDOFF.md

Document:

* Architecture
* Data models
* Service boundaries
* State management
* Authentication boundary
* API integration points
* File upload integration point
* Search integration point
* Notification integration point
* Known mock implementations
* Recommended next development steps

## COMPONENT_GUIDE.md

Document:

* Shared components
* Domain components
* Component responsibilities
* Form patterns
* Dialog patterns
* Table patterns
* Empty/loading/error states

## BACKEND_INTEGRATION.md

Explicitly document where backend logic should eventually be connected.

Include a checklist for:

* Authentication
* Database
* API
* File storage
* Notifications
* Search
* Payments
* Email
* Authorization

---

# 31. TODO MARKERS

Where production functionality is intentionally absent, leave clear developer-facing TODOs.

Examples:

`TODO: Replace mock auth service with production authentication provider.`

`TODO: Replace local property service with API implementation.`

`TODO: Connect document upload to cloud storage.`

`TODO: Implement server-side notification generation.`

Do not use TODOs as an excuse for incomplete frontend functionality.

The UI should still work with the mock implementation.

---

# 32. TESTABILITY

Structure functions and services so they can be tested independently.

Avoid putting all logic inside page components.

Core operations should be isolated enough to test:

* Create property
* Update property
* Archive property
* Assign tenant
* Create lease
* Record payment
* Create maintenance ticket
* Complete maintenance
* Create inspection
* Upload document
* Search entities

---

# 33. FINAL CODE AUDIT

Before considering the project ready for handoff, perform a complete audit.

Check:

### Code

* No broken imports
* No obvious runtime errors
* No unused imports
* No unnecessary `any`
* No duplicate types
* No duplicate state
* No dead components
* No broken routes

### UX

* All buttons have intended actions
* Forms submit correctly
* Dialogs open/close correctly
* Tables work
* Search UI works with mock data
* Notification UI works with mock data
* Authentication UI works with mock/local implementation

### Architecture

* UI separated from services
* Domain types centralized
* State has a clear source of truth
* Mock data is isolated
* Backend integration points are documented

### Handoff

A developer should be able to clone/open the project and immediately understand:

**Where the UI is**

**Where the state is**

**Where the domain types are**

**Where the mock data is**

**Where the services are**

**Where routing is defined**

**Where authentication will be connected**

**Where API calls will be connected**

**Where file storage will be connected**

**Where notifications will be connected**

---

# 34. FINAL REQUIREMENT

The final output should be treated as a **frontend codebase ready for developer handoff**, not as a fake production backend.

The application should currently run entirely using its mock/local implementation.

However, every major backend-dependent system must have a clean architectural boundary so that I can implement the backend myself later without rewriting the frontend.

The intended development path is:

**Current state**

Frontend + mock/local services

↓

**My next step**

Replace mock services with real backend/API implementations

↓

**Production**

Frontend + real authentication + database + API + storage + notifications

Do not attempt to build the production backend now.

Focus on producing **clean, maintainable, typed, modular, documented frontend code that is ready for me to take over.**
