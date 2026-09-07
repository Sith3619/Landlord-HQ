# Landlord HQ — V1 Comprehensive Functionality Expansion

Continue from the **existing Landlord HQ application exactly as it currently exists**.

This is an **expansion and refinement pass**, NOT a rebuild.

The existing application, design system, navigation, components, state management, CRUD functionality, forms, dialogs, validation, notifications, responsive layouts, and existing pages must remain intact.

**Do not remove, replace, simplify, or redesign existing functionality unless necessary to support the additions below.**

The goal is to make the existing Landlord HQ MVP significantly more **realistic, detailed, comprehensive, and capable of handling real-world landlord scenarios**, while still keeping it within a practical V1 scope.

Do not add enterprise-level features such as full accounting, online payment processing, banking integrations, AI, or complex property-management automation.

---

# 1. CORE DATA MODEL — STRENGTHEN EXISTING RELATIONSHIPS

The application should be organized around this relationship:

**Property → Unit → Occupant/Tenant → Lease → Rent**

with related:

**Property → Documents**

**Unit → Maintenance → Inspections**

**Tenant → Documents**

**Lease → Documents**

The existing sections should no longer feel like isolated CRUD modules.

Every related record should be accessible from the relevant parent record.

For example:

**Property**

→ Units

→ Property Documents

→ Property Maintenance

→ Property Inspections

→ Property Activity

**Unit**

→ Current Occupants

→ Lease

→ Rent

→ Maintenance

→ Inspections

→ Documents

→ Activity

**Tenant**

→ Unit

→ Lease

→ Rent

→ Maintenance

→ Documents

→ Activity

---

# 2. SUPPORT MULTIPLE OCCUPANTS / TENANTS PER UNIT

This is an important structural improvement.

Do NOT assume:

**1 Unit = 1 Tenant**

A rental unit may have:

* One tenant
* Multiple tenants
* Primary tenant
* Co-tenant
* Additional occupant

The UI and frontend data model should support multiple people associated with the same unit.

Each tenant/occupant relationship should identify:

* Primary tenant
* Co-tenant
* Occupant

The Tenant Detail page should clearly show:

**Current Residence**

Property
Unit
Other occupants

When adding a tenant, allow the landlord to:

* Assign an existing vacant unit
* Assign an occupied unit as a co-tenant/occupant where appropriate
* Create a new lease relationship

Do not break existing single-tenant workflows.

---

# 3. TENANT LIFECYCLE

Expand tenant statuses beyond simply existing/deleted.

Support:

* Applicant
* Approved
* Active
* Notice Given
* Former Tenant
* Archived

Do not build a full tenant application/background-check system.

These statuses simply allow Landlord HQ to accurately represent the tenant lifecycle.

A tenant should not need to be deleted just because they moved out.

Instead:

**Active → Notice Given → Former Tenant → Archived**

Preserve historical:

* Lease
* Maintenance
* Documents
* Rent records
* Activity

---

# 4. UNIT LIFECYCLE

Expand Unit status.

Support:

* Vacant
* Occupied
* Coming Soon
* Under Maintenance
* Unavailable

Make a distinction between:

**Vacant**

The unit is available.

and:

**Under Maintenance**

The unit is vacant because work is being performed.

and:

**Coming Soon**

The unit will become available at a future date.

Each status should have appropriate visual treatment.

---

# 5. UNIT DETAILS

Expand Unit Detail pages.

Include:

### Basic information

* Unit number
* Floor
* Bedrooms
* Bathrooms
* Square footage
* Property
* Unit status
* Furnished/unfurnished
* Notes

### Rental information

* Monthly rent
* Security deposit
* Rent due date
* Utilities included
* Availability date

### Occupants

Show all current occupants.

Clearly identify:

* Primary tenant
* Co-tenant
* Additional occupant

### Lease

Show:

* Lease status
* Lease start
* Lease end
* Lease type
* Rent
* Security deposit

### Maintenance

Show:

* Open issues
* In-progress issues
* Completed issues

### Inspections

Show previous and upcoming inspections.

### Documents

Show unit-related documents.

### Activity

Show recent changes.

---

# 6. LEASE MANAGEMENT

Introduce structured lease records while keeping the existing Documents system.

A lease should contain:

* Lease status
* Lease type
* Start date
* End date
* Monthly rent
* Rent due day
* Security deposit
* Notice period
* Renewal status
* Associated property
* Associated unit
* Associated tenants/occupants
* Associated lease document

Lease statuses:

* Draft
* Active
* Expiring Soon
* Expired
* Terminated
* Renewed

Lease types can include:

* Fixed Term
* Month-to-Month

Do not create a complicated legal lease-generation system.

The purpose is to track the relationship and important dates.

---

# 7. LEASE EXPIRATION

Automatically identify leases approaching expiration.

Use:

**60 days**

as the default "Expiring Soon" threshold.

Display:

**Lease expires in 42 days**

or:

**Lease expired 12 days ago**

The dashboard should show:

**Leases Expiring Soon**

Clicking the item should take the landlord directly to the relevant lease/tenant/unit.

Allow the landlord to mark a lease:

**Renewed**

without deleting the previous lease information.

Preserve lease history.

---

# 8. BASIC RENT TRACKING

Add lightweight rent tracking.

This is NOT full accounting.

Each active lease should support:

* Monthly rent
* Rent due day
* Current amount due
* Current status

Rent statuses:

* Paid
* Due
* Overdue
* Partially Paid

Support basic payment records.

A payment record should include:

* Amount
* Date
* Status
* Method
* Note

Methods can include:

* Cash
* Bank Transfer
* Cheque
* Other

Do NOT implement actual payment processing.

The system is only recording landlord-entered payment information.

---

# 9. PAYMENT HISTORY

Each tenant/unit should have a simple rent history.

Example:

| Date  | Amount | Status         |
| ----- | -----: | -------------- |
| Aug 1 | $1,850 | Paid           |
| Jul 1 | $1,850 | Paid           |
| Jun 1 | $1,850 | Partially Paid |

Show:

* Current balance
* Last payment
* Payment history
* Overdue amount

Allow the landlord to manually record a payment.

When a payment is recorded:

* Update balance
* Update rent status
* Update dashboard
* Update activity
* Show success notification

---

# 10. MOVE-IN WORKFLOW

Add a structured Move-In workflow.

When moving a tenant into a unit, support:

1. Select tenant/occupant
2. Select property
3. Select unit
4. Confirm lease
5. Enter lease dates
6. Enter monthly rent
7. Enter security deposit
8. Record move-in date
9. Optionally record meter readings
10. Optionally attach move-in inspection
11. Optionally attach lease document

When completed:

* Unit becomes Occupied
* Tenant becomes Active
* Lease becomes Active
* Rent information becomes active
* Property occupancy updates
* Dashboard updates
* Activity event is created

---

# 11. MOVE-OUT WORKFLOW

Do NOT simply delete tenants.

Add a structured Move-Out workflow.

Support:

* Notice received date
* Move-out date
* Reason
* Final inspection
* Final rent status
* Outstanding balance
* Security deposit
* Deposit deductions
* Deposit returned
* Notes

When the move-out is completed:

* Tenant becomes Former Tenant
* Unit becomes Vacant or Under Maintenance
* Active lease ends
* Dashboard updates
* Property occupancy updates
* Activity is recorded

Preserve historical records.

---

# 12. INSPECTIONS

Add an Inspection system.

Inspections should be associated with:

* Property
* Unit
* Tenant where applicable

Inspection types:

* Move-In
* Move-Out
* Routine
* Annual
* Safety
* Maintenance

Each inspection should support:

* Inspection date
* Inspector
* Status
* Notes
* Findings
* Photos/attachments
* Follow-up required
* Related maintenance ticket

Statuses:

* Scheduled
* In Progress
* Completed
* Follow-Up Required

---

# 13. INSPECTION DETAIL PAGE

Create a useful Inspection Detail view.

Show:

### Inspection information

* Type
* Property
* Unit
* Date
* Inspector
* Status

### Findings

Allow structured findings such as:

* Item
* Condition
* Notes

Conditions:

* Good
* Fair
* Poor
* Damaged

### Follow-up

If an issue requires attention:

**Create Maintenance Ticket**

This should automatically link the maintenance ticket to the inspection and unit.

---

# 14. MAINTENANCE EXPANSION

Keep the existing Maintenance system.

Expand each ticket to support:

* Title
* Description
* Category
* Priority
* Property
* Unit
* Tenant/reporter
* Status
* Created date
* Updated date
* Scheduled date
* Completion date
* Assigned person/vendor
* Estimated cost
* Actual cost
* Notes
* Attachments/photos

Categories:

* Plumbing
* Electrical
* HVAC
* Appliance
* Structural
* Pest
* Cleaning
* General
* Other

Priorities:

* Low
* Medium
* High
* Urgent

Statuses:

* Open
* Scheduled
* In Progress
* Completed
* Cancelled

---

# 15. MAINTENANCE SCHEDULING

Allow maintenance tickets to have:

* Scheduled date
* Optional time
* Completion date
* Assigned person

Show scheduled maintenance clearly.

The maintenance page should support filters:

* Status
* Priority
* Property
* Unit
* Date
* Category

---

# 16. PREVENTATIVE MAINTENANCE

Add lightweight support for recurring/preventative maintenance.

Examples:

* HVAC inspection
* Smoke detector inspection
* Filter replacement
* Pest control
* Annual property inspection

A maintenance item can optionally be:

**Recurring**

with:

* Frequency
* Next due date

Do not create an advanced automation engine.

Simply display upcoming preventative maintenance.

---

# 17. DOCUMENT EXPIRATION

Expand the existing Documents functionality.

Documents should optionally have:

* Expiration date
* Document status
* Related lease
* Related inspection
* Related maintenance ticket

Examples:

* Insurance expires in 30 days
* Lease expires in 45 days
* Inspection certificate expired

Dashboard should surface important document expirations.

---

# 18. DOCUMENT VERSIONING

Allow a document to have a simple version history.

Example:

**Lease Agreement**

Version 2
Uploaded Aug 10

Version 1
Uploaded Jan 5

Do not create complex document collaboration.

Simply preserve previous versions instead of destroying them when a document is replaced.

---

# 19. PROPERTY ENHANCEMENT

Expand Property records with:

* Property name
* Address
* Property type
* Number of units
* Floors
* Amenities
* Parking
* Utility responsibility
* Notes
* Photos
* Property documents
* Property maintenance
* Property inspections

Property types:

* Single Family
* Multi-Family
* Apartment
* Condo
* Townhouse
* Other

---

# 20. PROPERTY ARCHIVING

Do not permanently delete properties that have historical records.

Instead support:

**Active**

and

**Archived**

When archiving:

* Hide from active portfolio
* Preserve tenants
* Preserve leases
* Preserve documents
* Preserve maintenance
* Preserve financial/rent history
* Preserve activity

Show archived properties separately.

---

# 21. VACANCY MANAGEMENT

Expand vacancy functionality.

A vacant unit should show:

* Vacancy status
* Available date
* Target rent
* Reason for vacancy
* Maintenance status
* Readiness status

Readiness statuses:

* Needs Preparation
* Under Maintenance
* Ready
* Available

This allows the landlord to distinguish:

**Vacant but not ready**

from:

**Vacant and ready to rent**

---

# 22. DASHBOARD — OPERATIONAL PRIORITY

Keep the existing dashboard.

Strengthen the "What Needs Your Attention?" section.

Prioritize:

1. Urgent maintenance
2. Overdue rent
3. Expiring leases
4. Vacant units requiring attention
5. Upcoming inspections
6. Expiring documents

Every alert must be clickable.

Example:

**2 overdue rent payments**

Click → Rent records

**1 urgent maintenance issue**

Click → Maintenance

**3 leases expiring within 60 days**

Click → Lease/tenant records

**2 units under maintenance**

Click → Units

---

# 23. DASHBOARD PORTFOLIO METRICS

Continue using live application state.

Include:

* Properties
* Units
* Occupied
* Vacant
* Under Maintenance
* Occupancy Rate
* Monthly Rent
* Outstanding Rent
* Open Maintenance
* Expiring Leases

Do not create fake metrics disconnected from application data.

---

# 24. GLOBAL SEARCH

Add global search across:

* Properties
* Units
* Tenants
* Leases
* Maintenance
* Documents
* Inspections

Results should be grouped by category.

Example:

**John Smith**

Tenant
Unit 204 · 123 Main Street

Lease
Active · Ends June 30, 2027

Maintenance
Broken sink · Completed

Documents
Lease Agreement

Clicking a result navigates directly to the appropriate detail page.

---

# 25. ACTIVITY HISTORY

Maintain the existing activity system and expand it.

Record events such as:

* Property created
* Property archived
* Unit created
* Unit status changed
* Tenant added
* Tenant moved in
* Tenant gave notice
* Tenant moved out
* Lease created
* Lease renewed
* Rent payment recorded
* Rent became overdue
* Maintenance created
* Maintenance scheduled
* Maintenance completed
* Inspection completed
* Document uploaded
* Document replaced

Display activity contextually on relevant pages.

---

# 26. NOTIFICATIONS

Keep the notification system lightweight.

Notifications should identify:

* Overdue rent
* Lease expiration
* Document expiration
* Upcoming inspection
* Upcoming maintenance
* Urgent maintenance
* Vacant unit requiring attention

Clicking a notification must navigate to the relevant record.

---

# 27. HISTORY MUST BE PRESERVED

Avoid destructive workflows wherever historical information matters.

Prefer:

**Archive**

over:

**Delete**

for:

* Properties
* Units
* Tenants
* Leases
* Documents

Use deletion only where appropriate and safe.

For destructive actions, always provide confirmation.

---

# 28. RELATIONSHIP-AWARE FORMS

All forms must dynamically understand relationships.

Examples:

### Tenant form

Property → Unit → Lease

### Maintenance form

Property → Unit → Tenant

### Document form

Property → Unit → Tenant → Lease

### Inspection form

Property → Unit → Tenant

Selections should be filtered based on previous selections.

Never show irrelevant units or tenants.

---

# 29. DETAIL PAGE NAVIGATION

Every major detail page should provide contextual navigation.

For example:

Property:

**Property → Unit 101 → John Smith**

Tenant:

**John Smith → Unit 101 → 123 Main Street**

Maintenance:

**Broken Sink → Unit 101 → John Smith → 123 Main Street**

This makes navigating the interconnected system effortless.

---

# 30. REALISTIC EDGE CASES

Design the UI and frontend state to gracefully handle scenarios such as:

### Multiple tenants in one unit

Do not overwrite the existing tenant.

### Tenant moves out

Preserve historical information.

### Unit becomes vacant

Do not delete the unit.

### Unit is vacant because of repairs

Use "Under Maintenance."

### Lease expires

Preserve the lease and mark it expired.

### Lease is renewed

Create/preserve lease history.

### Tenant partially pays rent

Show remaining balance.

### Maintenance ticket is completed

Preserve the ticket history.

### Property is sold/retired

Archive instead of deleting.

### Document expires

Show an expiration warning.

### Inspection discovers an issue

Allow creation of linked maintenance.

### Unit is unavailable

Keep it out of normal vacancy availability.

---

# 31. EMPTY, LOADING, ERROR, AND SUCCESS STATES

Every new feature must have:

* Loading state
* Empty state
* Error state
* Success state
* Validation state
* Delete/archive confirmation
* Mobile state

Do not create new pages that only work in the ideal scenario.

---

# 32. FRONTEND-ONLY IMPLEMENTATION

Continue using the existing frontend architecture.

Use:

**React + Vite + TypeScript**

**Tailwind CSS**

**shadcn/ui**

**lucide-react**

**react-router-dom**

**React Hook Form**

Use the existing global state/context architecture.

Do not introduce a backend.

Simulate persistence through the existing frontend state/local data approach.

All relationships must work within the existing prototype.

---

# 33. DO NOT ADD THESE FEATURES

Do NOT expand into the following at this stage:

* Online rent payments
* Stripe/payment processing
* Bank integrations
* Accounting software
* Tax calculations
* Full expense accounting
* Mortgage management
* Vendor marketplace
* Full vendor management platform
* Tenant messaging platform
* AI assistant
* Background checks
* Tenant screening
* Property listing marketplace
* E-signature platform
* Advanced automation engine
* Advanced financial reporting
* Complex legal document generation

These are future phases.

The objective is to make the **existing Landlord HQ MVP substantially more complete**, not turn it into an enterprise platform.

---

# 34. FINAL UX PRINCIPLE

Landlord HQ should now support the complete basic rental lifecycle:

**Property**

↓

**Unit**

↓

**Tenant / Occupants**

↓

**Lease**

↓

**Rent**

↓

**Maintenance**

↓

**Inspection**

↓

**Documents**

↓

**Move-Out**

↓

**Historical Records**

The landlord should always be able to understand:

**What property is this?**

**Which unit?**

**Who lives there?**

**What lease are they on?**

**How much rent is owed?**

**Is anything overdue?**

**Does the unit need maintenance?**

**When was it inspected?**

**Which documents are associated with it?**

**What happened historically?**

---

# 35. FINAL CONSISTENCY AUDIT

After implementing the additions, perform a complete application-wide audit.

Verify:

* Navigation works
* All relationships work
* Property data updates units
* Unit data updates occupancy
* Tenant data updates units
* Lease data updates tenant/unit status
* Rent data updates dashboard
* Maintenance data updates dashboard
* Inspection data can create maintenance
* Documents can attach to relevant entities
* Move-in updates all related records
* Move-out updates all related records
* Archived records remain historically accessible
* Global search finds all major entities
* Activity updates after actions
* Notifications correspond to actual data
* Dashboard metrics are calculated from live state
* No orphaned records are created
* No unrelated selections appear in forms
* Empty states work
* Error states work
* Loading states work
* Mobile layouts work
* Accessibility remains intact

---

# FINAL PRODUCT STANDARD

The finished Landlord HQ prototype should feel like a **complete V1 landlord operating system**, not simply a collection of CRUD screens.

A landlord should be able to realistically manage:

**Properties → Units → Occupants → Leases → Rent → Maintenance → Inspections → Documents → Move-In → Move-Out → History**

while always having a clear view of:

**What needs my attention right now?**

Preserve everything already built.

Add the functionality above **on top of the existing application**.

Do not rebuild the product.

Do not remove existing functionality.

Do not introduce unrelated features.

Prioritize **realistic workflows, connected data, historical preservation, edge cases, and a cohesive landlord experience** over adding unnecessary screens.
