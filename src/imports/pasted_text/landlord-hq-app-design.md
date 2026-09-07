Design a modern, highly professional, landlord-first property management web application called **Landlord HQ**.

The application should function as a centralized operating system where landlords can manage their properties, units, tenants, lease dates, maintenance tickets, documents, reminders, and upcoming tasks from one organized platform.

## Overall Design Direction

Create a clean, premium SaaS interface inspired by modern productivity and management platforms.

The design should feel:

* Professional and trustworthy
* Modern and minimal
* Highly organized
* Fast and intuitive
* Information-dense without feeling cluttered
* Suitable for both small independent landlords and landlords managing multiple properties

Use strong visual hierarchy, generous spacing, clean typography, subtle borders, rounded cards, and polished interactive elements.

Avoid making the application feel overly corporate, outdated, or like a traditional spreadsheet-based property management system.

The primary goal is to help landlords quickly answer three questions:

1. **What is happening right now?**
2. **What needs my attention?**
3. **What is coming up?**

---

# RESPONSIVE DESIGN — EXTREMELY IMPORTANT

The **entire application must be fully responsive**, not just the dashboard.

Design every page and component with desktop, tablet, and mobile usability in mind.

### Desktop

* Persistent collapsible sidebar
* Multi-column layouts where appropriate
* Data tables with advanced filtering and sorting
* Dashboard widgets arranged efficiently
* Full calendar views
* Comfortable information density

### Tablet

* Collapsible or icon-based sidebar
* Adaptive two-column layouts
* Responsive tables that simplify when necessary
* Cards and sections resize naturally

### Mobile

The mobile experience must feel intentionally designed and must not simply be a compressed desktop website.

Include:

* Mobile navigation or a compact sidebar/drawer
* Stacked dashboard sections
* Horizontally scrollable areas only when absolutely necessary
* Cards optimized for narrow screens
* Responsive tables transformed into mobile-friendly cards or simplified lists
* Large touch targets
* Sticky or easily accessible primary actions
* Mobile-friendly forms
* Bottom sheets or modals where appropriate
* Easy access to important information without excessive scrolling

Prioritize the most important information and actions on smaller screens.

Every page should have dedicated responsive behavior.

---

# DARK MODE — EXTREMELY IMPORTANT

Design a complete and polished **Dark Mode** alongside the Light Mode.

Dark Mode should not simply invert the colors.

Create a premium dark interface using:

* Deep charcoal and dark gray backgrounds
* Slightly lighter surface cards
* Clear contrast between page backgrounds and elevated elements
* Soft borders
* Comfortable, readable text contrast
* Muted secondary text
* Accessible status and alert colors

The application should allow users to switch between:

* Light Mode
* Dark Mode
* System Preference

Ensure all components, pages, charts, tables, modals, dropdowns, forms, and calendar views work beautifully in both themes.

---

# APPLICATION NAVIGATION

Create a clean sidebar navigation.

### Main Navigation

* Dashboard
* Properties
* Units
* Tenants
* Maintenance
* Documents
* Calendar
* Settings

The sidebar should include:

* Landlord HQ logo and branding
* Clear navigation icons
* Active page indicator
* Collapsible desktop state
* Fully responsive mobile navigation
* User profile section near the bottom
* Dark mode toggle or easy access to appearance settings

---

# GLOBAL QUALITY-OF-LIFE FEATURES

## Universal Search and Command Center

Include a global search bar accessible throughout the application.

Allow the landlord to quickly search:

* Properties
* Units
* Tenants
* Maintenance tickets
* Documents

Also include quick actions.

Example:

**Search anything or run a command...**

Results could include:

* John Smith — Tenant
* Unit 204
* 123 Main Street — Property
* Plumbing Issue — Maintenance Ticket

Quick actions:

* Add Property
* Add Unit
* Add Tenant
* Create Maintenance Ticket
* Upload Document
* Create Reminder

On desktop, allow keyboard shortcut access such as `Ctrl + K`.

On mobile, provide an easily accessible search button.

---

# DASHBOARD

The dashboard should act as the landlord's daily control center.

Use the following overall structure:

## 1. Welcome and Header Area

Include:

* Personalized greeting
* Current date
* Global search access
* Notifications
* Profile menu
* Quick actions

Example:

**Good afternoon, Nisith 👋**
Here is what is happening across your properties.

Include a prominent **Quick Actions** button.

Quick actions:

* Add Property
* Add Unit
* Add Tenant
* Create Maintenance Ticket
* Upload Document
* Create Reminder

---

# 2. Overview Metrics

Create professional dashboard cards showing:

* Total Properties
* Total Units
* Occupied Units
* Vacant Units
* Active Tenants
* Open Maintenance Tickets
* Leases Ending Soon
* Documents

Each card should:

* Have a relevant icon
* Clearly display the primary metric
* Optionally show supporting information
* Be clickable where appropriate
* Work well on mobile screens

On desktop, use an organized grid.

On mobile, stack or use a compact horizontal scrolling layout only if necessary.

---

# 3. NEEDS ATTENTION

Create a prominent, intelligent priority section called:

## Needs Your Attention

This section should automatically surface important information based on urgency.

Use clear visual priority levels.

### High Priority

Examples:

* High-priority maintenance ticket
* Urgent property issue

### Upcoming

Examples:

* Lease ending in 14 days
* Important upcoming reminder

### Missing Information

Examples:

* Tenant without an assigned unit
* Missing lease document
* Unit missing important information

### Recent Updates

Examples:

* Maintenance ticket status changed
* Lease information updated

Each item should include:

* Relevant icon
* Clear title
* Supporting context
* Related property or unit
* Date or urgency indicator
* Quick action or direct navigation

The goal is for the landlord to immediately understand what requires attention without searching through multiple sections.

---

# 4. SMART CALENDAR

Create a dedicated and intelligent calendar system.

The calendar should automatically display important events generated from existing application data.

Events can include:

* Lease start dates
* Lease end dates
* Maintenance follow-ups
* Custom reminders
* Important deadlines

Future-ready events can include:

* Rent due dates
* Document expiration dates
* Inspections
* Vendor appointments

Include calendar views for:

* Day
* Week
* Month

Allow filtering events by category.

Use clear visual distinctions for different event types while maintaining a professional and accessible design.

Clicking an event should open a detailed preview or navigate to the related record.

For example:

**Lease Ending**
John Smith
Unit 204
123 Main Street

---

# 5. UPCOMING TIMELINE AND DATE RUNDOWN

Alongside or below the calendar, create a highly useful upcoming events section.

This should provide a summarized breakdown of upcoming events.

## Today

Display tasks and events happening today.

Example:

* Follow up on plumbing ticket — Unit 204
* Upload updated lease document

## Tomorrow

Display tomorrow's important events.

## This Week

Provide a concise overview of important events during the upcoming week.

Examples:

* 2 leases ending
* 3 maintenance follow-ups
* 1 custom reminder

## Next Week

Provide a preview of the following week.

## This Month

Provide a broader overview of upcoming events and deadlines.

This section should make it easy for a landlord to understand their upcoming workload without manually navigating through the calendar.

Include options to:

* View all
* Mark reminders as complete
* Dismiss non-critical items
* Create a new reminder

---

# 6. RECENT ACTIVITY

Create an activity feed showing recent actions throughout the system.

Examples:

* Property added
* Tenant added
* Tenant assigned to unit
* Maintenance ticket created
* Maintenance ticket completed
* Document uploaded
* Lease date updated

Each activity item should clearly communicate:

* What happened
* The related record
* When it happened

Example:

**Maintenance ticket completed**
Water leak at Unit 204 was marked as completed.
2 hours ago

---

# 7. QUICK ACCESS AND RECENTLY VIEWED

Create a lightweight section for:

## Recently Viewed

Show recently accessed:

* Properties
* Units
* Tenants
* Maintenance tickets

Example:

* Unit 204
* John Smith
* 123 Main Street
* Plumbing Ticket

Optionally include:

## Pinned Properties

Allow landlords to pin or favorite properties they access frequently.

---

# PROPERTIES PAGE

Create a professional property management page.

Include:

* Search
* Filters
* Sorting
* Grid and list views where appropriate
* Add Property button

Each property card or list item should display:

* Property name
* Address
* Number of units
* Occupancy information
* Open maintenance tickets
* Upcoming lease activity

The Property Detail page should act as a complete overview of the property.

Include sections for:

* Property information
* Units
* Tenants
* Documents
* Maintenance tickets
* Notes
* Recent activity
* Upcoming events

Ensure all sections are responsive and easy to navigate on mobile.

---

# UNITS PAGE

Create an organized Units page with:

* Search
* Filters
* Sorting

Allow filtering by:

* Property
* Occupancy status
* Lease status

Each unit should display:

* Unit number
* Associated property
* Assigned tenant
* Occupancy status
* Rent amount
* Lease dates
* Open maintenance tickets

The Unit Detail page should display all information related to that unit in one organized place.

---

# TENANTS PAGE

Create a professional tenant management page.

Include:

* Search
* Filters
* Sorting

Tenant information should include:

* Full name
* Email
* Phone number
* Assigned property
* Assigned unit
* Lease dates
* Lease status

The Tenant Detail page should include:

* Contact information
* Property
* Unit
* Lease information
* Related documents
* Related maintenance tickets
* Notes
* Activity history
* Upcoming events

---

# MAINTENANCE PAGE

Create a maintenance management system focused on clarity and speed.

Include:

* Search
* Filters
* Sorting

Allow filtering by:

* Status
* Priority
* Property
* Category

Each ticket should clearly display:

* Ticket title
* Property
* Unit
* Priority
* Status
* Category
* Created date
* Last updated

The Maintenance Detail page should include:

* Full issue description
* Related property
* Unit
* Tenant
* Images
* Notes
* Activity history
* Status updates

Use strong visual hierarchy for priority levels.

---

# DOCUMENTS PAGE

Create an organized document management interface.

Include:

* Search
* Filters
* Sorting
* Upload Document button

Allow users to organize and filter documents by:

* Document type
* Property
* Unit
* Tenant

Each document should display:

* Document name
* Type
* Related property or tenant
* Upload date

Use a clean, professional document list.

---

# CONTEXTUAL RELATED INFORMATION

Throughout the application, emphasize relationships between records.

Whenever a user views a record, clearly surface related information.

For example:

### Unit 204

* Tenant: John Smith
* Property: 123 Main Street
* Lease ends: October 31
* Documents: 3
* Open Maintenance: 1

Users should not need to manually search for information that is directly related to the current page.

Create clear, clickable relationships between:

* Properties
* Units
* Tenants
* Documents
* Maintenance tickets
* Calendar events

---

# NOTES AND HISTORY

Allow lightweight notes to be attached to:

* Properties
* Units
* Tenants
* Maintenance tickets

Example:

**September 1**
Called plumber regarding Unit 203. Waiting for confirmation.

Create an organized history or activity timeline where appropriate.

---

# NOTIFICATION CENTER

Include a notification center accessible from the global header.

Notifications should be actionable rather than simply informational.

Example:

**Lease Ending Soon**
John Smith's lease ends in 30 days.
Unit 204 • 123 Main Street

Actions:

* View Tenant
* View Lease
* Dismiss

Include:

* Unread indicators
* Mark all as read
* Notification preferences in Settings

---

# SETTINGS

Create a clean and organized Settings page.

Include:

## Account

* Name
* Email
* Password

## Landlord Profile

* Landlord or business name

## Appearance

* Light Mode
* Dark Mode
* System Preference

## Notifications

Allow users to manage notification preferences for:

* Lease reminders
* Maintenance updates
* Important deadlines
* Upcoming events

---

# EMPTY STATES

Create polished and helpful empty states throughout the application.

Avoid generic messages such as:

**No properties found.**

Instead, provide helpful guidance.

Example:

**Let's add your first property**
Properties are the foundation of your workspace. Once you add a property, you can create units and assign tenants.

[Add Your First Property]

Every major module should have an intentional empty state.

---

# LOADING AND ERROR STATES

Design professional:

* Loading skeletons
* Empty states
* Error states
* Success messages
* Confirmation dialogs

Do not leave users wondering whether an action was successful.

Use subtle toast notifications and clear feedback.

---

# COMPONENT DESIGN SYSTEM

Create a consistent design system including:

* Buttons
* Inputs
* Dropdowns
* Search fields
* Filter controls
* Cards
* Tables
* Status badges
* Priority indicators
* Modals
* Drawers
* Bottom sheets
* Tooltips
* Tabs
* Pagination
* Calendar components
* Notification components
* Empty states
* Loading skeletons

Every component must support both Light Mode and Dark Mode.

Every component must also have responsive behavior.

---

# MOBILE-SPECIFIC DESIGN PRINCIPLES

The mobile version should feel like a premium application rather than a shrunken desktop website.

Prioritize:

* Fast access to Needs Attention
* Upcoming events
* Properties
* Maintenance
* Quick actions

Use:

* Compact headers
* Mobile navigation drawer or bottom navigation
* Floating action buttons where appropriate
* Bottom sheets for secondary actions
* Full-width forms
* Stacked cards instead of overly compressed tables

Ensure users can comfortably manage their rental operation from a phone.

---

# FINAL PRODUCT VISION

Landlord HQ should feel like a modern operating system for independent landlords.

The application should eliminate the need to constantly jump between spreadsheets, folders, notes, messages, and calendars.

The dashboard should proactively surface relevant information and help the landlord immediately understand:

* What is happening
* What requires attention
* What is coming up
* Where to take action

Prioritize usability, professional styling, responsiveness, information clarity, and workflow efficiency.

Build the interface so that future features such as AI assistance, tenant portals, vendor management, payments, automation, and advanced reporting can integrate naturally without requiring a complete redesign.
