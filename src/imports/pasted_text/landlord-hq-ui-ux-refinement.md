# Landlord HQ — Final Production UI & UX Refinement

Continue working on the existing **Landlord HQ** property management application.

The application is already built as a functional frontend prototype with connected navigation, shared state, CRUD interactions, forms, dialogs, notifications, validation, responsive layouts, and realistic sample data.

**Do not rebuild the application from scratch. Do not remove existing functionality. Do not introduce features outside the landlord-focused MVP.**

Your job is to perform a final **production-quality UI/UX audit and refinement** across the entire application.

## Product

Landlord HQ is a landlord-first SaaS platform for managing:

* Properties
* Units
* Tenants
* Lease documents
* Maintenance tickets

The product should feel like a real modern SaaS product that a landlord could use every day.

Visual direction:

* Premium
* Minimal
* Professional
* Calm
* Organized
* Trustworthy
* Highly usable
* Modern SaaS
* Not overly decorative
* Not like a generic admin template

Use the existing green accent system and neutral gray/white interface.

---

# 1. GLOBAL DESIGN SYSTEM

Create a highly consistent visual system across every page.

### Typography

Use a modern sans-serif hierarchy with:

* Strong page titles
* Clear section headings
* Medium-weight labels
* Highly readable body text
* Small muted metadata

Avoid excessive font weights.

### Spacing

Use consistent spacing throughout:

* Generous page padding
* Consistent card padding
* Consistent gaps between form fields
* Consistent vertical rhythm
* Avoid cramped layouts

### Colors

Maintain the existing green brand accent.

Use:

* Green for primary actions and positive states
* Red only for destructive actions/errors
* Amber for warnings
* Blue/neutral colors for informational states
* Gray for secondary information

Avoid using too many accent colors.

### Surfaces

Use:

* White cards
* Very light gray page backgrounds
* Subtle borders
* Extremely subtle shadows
* Rounded corners

Avoid excessive shadows, gradients, glassmorphism, or decorative effects.

---

# 2. APP SHELL

Refine the global application shell.

### Sidebar

The sidebar should feel premium and intentional.

Include:

* Landlord HQ logo/brand
* Dashboard
* Properties
* Units
* Tenants
* Maintenance
* Documents
* Settings

Requirements:

* Clear active navigation state
* Hover state
* Icons aligned consistently
* Consistent spacing
* Clear section hierarchy
* Responsive/mobile behavior
* Sidebar should never feel visually crowded

The active navigation item should clearly communicate the current location without being overly bright.

### Header

Improve:

* Search
* Page context
* User avatar
* User dropdown
* Responsive behavior

The header should remain visually quiet and not compete with page content.

---

# 3. DASHBOARD

The dashboard should immediately communicate the landlord's current situation.

Prioritize the most useful information.

### Primary metrics

Display:

* Total Properties
* Total Units
* Occupied Units
* Vacant Units
* Open Maintenance
* Overdue Rent
* Expiring Leases

Do not overcrowd the dashboard.

Cards should have:

* Clear metric
* Descriptive label
* Optional supporting information
* Appropriate icon
* Subtle visual differentiation
* Consistent dimensions

### Attention section

Create a strong hierarchy for items requiring landlord attention.

Examples:

* Overdue rent
* Open maintenance tickets
* Expiring leases
* Vacant units

These should be clickable and navigate to the appropriate page/detail view.

### Activity

Show recent activity in a clean timeline/list.

Use realistic sample activity such as:

* Tenant added
* Maintenance ticket created
* Document uploaded
* Unit occupied
* Maintenance completed

### Quick actions

Include only useful MVP actions:

* Add Property
* Add Unit
* Add Tenant
* Create Maintenance Ticket
* Upload Document

Every action must connect to the appropriate workflow.

---

# 4. PROPERTIES

Create a polished property management experience.

The property list should include:

* Property name
* Address
* Number of units
* Occupancy
* Property status
* Relevant actions

Include:

* Search
* Useful filtering
* Add Property
* Property details
* Edit
* Delete with confirmation

### Property details

The property detail page should provide a clear overview of:

* Property information
* Units
* Tenants
* Maintenance
* Documents

Use tabs where appropriate.

Every related record should link to its actual detail page.

Do not add unnecessary analytics or financial features outside the MVP.

---

# 5. UNITS

Units should clearly communicate their relationship to properties.

Show:

* Unit number
* Property
* Tenant
* Status
* Relevant actions

Statuses should be immediately understandable:

* Occupied
* Vacant

Adding a unit should require selecting an existing property.

When a unit is occupied, the relationship to its tenant should be visible.

When a tenant is deleted or removed, the unit state should update correctly.

---

# 6. TENANTS

The tenant experience should prioritize clarity.

Show:

* Tenant name
* Contact information
* Property
* Unit
* Lease information
* Status

Adding a tenant should allow selecting a vacant unit.

The property/unit relationship should update automatically.

Avoid exposing unnecessary personal information in list views.

Tenant detail pages should clearly show their associated:

* Property
* Unit
* Documents
* Maintenance requests

---

# 7. MAINTENANCE

Maintenance should be one of the most actionable sections.

Use clear ticket cards or a polished table.

Show:

* Issue
* Property
* Unit
* Tenant
* Priority
* Status
* Created date

Statuses:

* Open
* In Progress
* Completed

Priorities:

* Low
* Medium
* High
* Urgent

Provide:

* Create ticket
* Search
* Filter
* View details
* Complete ticket
* Delete if appropriate

Use strong visual hierarchy for urgent/high-priority issues.

The "Complete" action should be obvious but not visually overwhelming.

---

# 8. DOCUMENTS

Documents should feel organized and trustworthy.

Show:

* Document name
* Type
* Related property
* Related unit
* Related tenant
* Upload date
* Actions

Support:

* Upload document
* Search
* Filter by type
* Delete

When selecting a property, the unit options should update accordingly.

Documents should clearly communicate what they are associated with.

Use realistic document types such as:

* Lease
* Inspection
* Insurance
* Property document
* Other

The upload UI should feel polished and simple.

---

# 9. FORMS

Audit every form.

All forms should have:

* Clear labels
* Appropriate placeholders
* Helpful descriptions where necessary
* Consistent field heights
* Proper spacing
* Required-field indicators
* Inline validation
* Disabled/loading states
* Clear submit/cancel actions

Forms should never feel unnecessarily long.

Group related fields logically.

Use appropriate controls:

* Selects for relationships/statuses
* Date inputs for dates
* Textareas for descriptions
* File upload areas for documents

---

# 10. DIALOGS

Audit every modal/dialog.

Dialogs should:

* Have clear titles
* Explain the purpose
* Have proper spacing
* Use consistent width
* Have clear primary/secondary actions
* Prevent accidental destructive actions

Destructive confirmations should clearly explain what will happen.

Do not make dialogs excessively large.

---

# 11. TABLES

Make all tables production-ready.

Requirements:

* Clear column hierarchy
* Comfortable row height
* Consistent alignment
* Subtle row hover
* Proper empty states
* Responsive behavior
* Action menus
* Status badges

Avoid displaying unnecessary columns.

On smaller screens, tables should gracefully adapt rather than become unusable.

---

# 12. EMPTY STATES

Every major section needs a useful empty state.

Empty states should include:

* Relevant icon
* Short explanation
* Primary CTA
* Optional supporting text

Examples:

"No properties yet."

"Add your first property to start managing units and tenants."

The CTA should immediately open the appropriate creation workflow.

Avoid generic empty-state illustrations that do not add value.

---

# 13. LOADING STATES

Every interactive workflow should have appropriate loading feedback.

Use:

* Button spinners
* Disabled states
* Skeletons where appropriate
* Dialog loading states

Never allow users to accidentally submit the same form multiple times.

---

# 14. ERROR STATES

Errors should be clear and actionable.

Use toast notifications for:

* Failed operations
* Validation errors
* Delete failures
* Save failures

Avoid technical error messages such as stack traces.

The interface should explain what went wrong in user-friendly language.

---

# 15. SUCCESS FEEDBACK

After successful operations, provide concise confirmation.

Examples:

* "Property added successfully."
* "Unit updated successfully."
* "Tenant added successfully."
* "Maintenance ticket completed."
* "Document uploaded successfully."

Do not overuse notifications.

---

# 16. NAVIGATION & DATA RELATIONSHIPS

Perform a complete interaction audit.

Every button, link, card, CTA, dropdown, tab, and action should either:

1. Perform its intended action,
2. Navigate to the correct page,
3. Open the correct dialog,
4. Update the correct shared state,
5. Or provide appropriate feedback.

Verify relationships:

Property → Units

Unit → Tenant

Tenant → Unit

Property → Maintenance

Unit → Maintenance

Property → Documents

Unit → Documents

Tenant → Documents

Dashboard → All relevant sections

Changing or deleting related records should update the rest of the interface consistently.

---

# 17. RESPONSIVE DESIGN

Audit desktop, tablet, and mobile layouts.

The application must remain usable at smaller widths.

Check:

* Sidebar behavior
* Header
* Tables
* Cards
* Forms
* Dialogs
* Filters
* Search
* Buttons
* Page spacing

Avoid horizontal overflow.

Primary actions should remain easy to access on mobile.

---

# 18. ACCESSIBILITY

Improve accessibility throughout the interface.

Ensure:

* Buttons have clear labels
* Icon-only buttons have accessible labels/tooltips
* Form fields have associated labels
* Focus states are visible
* Color is not the only indicator of status
* Text contrast is readable
* Interactive elements have appropriate hover/focus states

Do not sacrifice accessibility for visual appearance.

---

# 19. CONSISTENCY AUDIT

Review the entire application as one product.

Fix inconsistencies involving:

* Button sizes
* Button styles
* Border radius
* Card padding
* Typography
* Badge styles
* Icon sizes
* Form fields
* Dialog spacing
* Page headers
* Search inputs
* Filters
* Empty states
* Toasts
* Loading indicators

Every page should feel like it belongs to the same design system.

---

# 20. MVP SCOPE RULE

Do NOT add unnecessary features.

The MVP remains focused on:

* Dashboard
* Properties
* Units
* Tenants
* Maintenance
* Documents
* Settings
* Authentication

Do NOT introduce:

* Accounting systems
* Full rent payment processing
* Banking integrations
* Complex financial analytics
* AI features
* Messaging systems
* Tenant marketplace
* Marketing tools
* Advanced reporting
* Extra dashboards
* Features unrelated to the landlord MVP

The goal is **depth and polish, not feature bloat**.

---

# FINAL REQUIREMENT

Treat the existing Landlord HQ application as a real product being prepared for a developer handoff.

Do a complete final pass across every screen and interaction.

Prioritize:

1. Usability
2. Visual hierarchy
3. Consistency
4. Functional connections
5. Responsive behavior
6. Accessibility
7. Production-quality polish

Do not merely describe what should be changed.

Actually refine the existing UI and interactions while preserving the current functionality and MVP scope.

The final result should feel like a polished, credible SaaS property management product rather than an AI-generated dashboard template.
