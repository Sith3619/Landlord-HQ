# MOBILE-FIRST NAVIGATION AND SCROLLING EXPERIENCE — CRITICAL REQUIREMENT

Mobile users are a primary priority for Landlord HQ. The application must be intentionally designed for mobile use rather than simply adapting the desktop interface to a smaller screen.

## ELIMINATE UNNECESSARY SCROLLING

Avoid requiring users to interact with:

* Horizontal scroll bars
* Side-to-side scrolling to view content
* Nested scrolling containers
* Small internal scroll areas inside cards or panels
* Large data tables that extend beyond the screen width
* Carousels that require constant horizontal swiping to access important information

**Important information and primary actions must fit naturally within the mobile layout.**

The application may use normal vertical page scrolling when necessary, but users should not need to excessively scroll through unnecessary content before reaching important information.

---

# NO HORIZONTAL SCROLLING

The mobile application must never require horizontal page scrolling.

Every screen, component, card, form, table, and modal must fit within the device viewport.

Do not simply shrink desktop tables to fit on mobile.

Instead, transform complex desktop interfaces into mobile-friendly experiences.

### Example: Desktop Data Table

A desktop tenant table may contain:

* Name
* Property
* Unit
* Lease Status
* Lease End Date
* Actions

### Mobile Transformation

Convert this into an individual, tappable tenant card:

**John Smith**

123 Main Street · Unit 204

Lease Ending Soon

Ends October 31

[View Details]

This allows the user to immediately understand the information without needing to swipe left and right.

---

# PRIORITIZE INFORMATION

On mobile, do not display every piece of information at once.

Use progressive disclosure.

Display the most important information first and allow users to tap for additional details.

For example:

### Property Card

Initially display:

* Property name
* Address
* Occupancy status
* Important alerts

Additional information can be accessed by tapping the property.

Do not overload mobile cards with every available field.

---

# AVOID NESTED SCROLLING

Avoid placing scrollable lists inside a vertically scrolling page whenever possible.

For example, do not create:

* A vertically scrolling dashboard
* With a scrollable calendar
* Inside a scrollable card
* With another scrollable list underneath

This creates a frustrating and unpredictable mobile experience.

Instead:

* Allow the main page to control vertical scrolling.
* Keep individual components naturally sized based on their content.
* Use "View All" actions to navigate to dedicated pages.
* Use modals or bottom sheets for focused interactions.
* Break large amounts of information into separate screens when appropriate.

There should ideally be only **one primary vertical scrolling context at a time**.

---

# MOBILE DASHBOARD PRIORITY

The mobile dashboard should immediately surface the most important information.

Prioritize the screen in the following order:

## 1. Header

Keep the header compact.

Include:

* Greeting or page title
* Notifications
* Profile or menu access

Avoid oversized headers that consume valuable vertical space.

---

## 2. Needs Attention

Place the most urgent information near the top.

Display only the most important items initially.

For example:

**Needs Attention · 3**

🔴 Water leak — Unit 204

🟠 Lease ending in 14 days — Unit 301

[View All]

Do not display an excessively long list directly on the dashboard.

---

## 3. Upcoming

Show a concise summary of:

* Today
* Tomorrow
* This Week

Allow the user to tap **View Calendar** or **View All Upcoming Events** for more information.

The entire monthly calendar should not dominate the mobile dashboard.

---

## 4. Overview Metrics

Avoid forcing users to scroll through numerous large metric cards.

Use compact responsive cards.

For example, organize the most important metrics into a clean two-column grid:

| Properties | Units  |
| ---------- | ------ |
| Occupied   | Vacant |

Additional metrics can be accessed through an expandable section or dedicated analytics view.

---

## 5. Recent Activity

Display only a few recent activities.

Example:

**Recent Activity**

Tenant added — 2 hours ago

Maintenance ticket updated — Yesterday

[View Full Activity]

Do not place an unlimited activity feed directly on the mobile dashboard.

---

# MOBILE CALENDAR EXPERIENCE

Do not force a traditional desktop-style monthly calendar onto a small screen.

The mobile calendar should prioritize usability.

Create a mobile-specific calendar experience with:

### Compact Date Navigation

Allow users to easily move between:

* Today
* Tomorrow
* This Week
* Upcoming

Use simple controls rather than requiring horizontal scrolling through a large calendar.

### Agenda View

Prioritize an agenda-style view on mobile.

For example:

**Today — September 1**

• Plumbing follow-up — Unit 204

• Lease review — Unit 301

**Tomorrow — September 2**

• Maintenance appointment — Unit 102

This is easier to navigate than forcing users to interact with a cramped month grid.

Users can still access:

* Day view
* Week view
* Month view

But the default mobile experience should prioritize an intuitive agenda or timeline.

---

# FORMS ON MOBILE

All forms must fit naturally within the mobile viewport.

Use:

* Full-width inputs
* Large touch targets
* Single-column layouts
* Logical field grouping
* Progressive multi-step forms when forms become too long

Avoid displaying large desktop-style forms with multiple columns.

For complex forms, use steps such as:

### Add Property

**Step 1 of 3 — Basic Information**

* Property Name
* Address
* Property Type

[Continue]

**Step 2 — Additional Information**

[...]

This prevents users from having to scroll through a massive form.

---

# MOBILE TABLE REPLACEMENT STRATEGY

Any desktop interface that depends on a wide table must have a dedicated mobile alternative.

Use:

* Cards
* List views
* Expandable rows
* Bottom sheets
* Detail pages

Never force the user to swipe horizontally to understand essential information.

If secondary information exists, hide it behind:

* Tap interactions
* Expandable sections
* Detail screens
* Context menus

---

# COMPACT FILTERS AND SEARCH

On mobile, do not display large rows of filters.

Use:

* Prominent search bar
* Filter button
* Sort button

When tapped, filters should open in a bottom sheet or full-screen mobile panel.

Example:

🔍 Search tenants

[Filter] [Sort]

This keeps the main interface clean and prevents horizontal overflow.

---

# MOBILE NAVIGATION

Create a navigation system specifically optimized for frequent mobile use.

The most frequently used sections should be accessible without opening multiple menus.

Consider a mobile bottom navigation with:

* Dashboard
* Properties
* Maintenance
* Calendar
* More

The **More** section can contain:

* Units
* Tenants
* Documents
* Settings

The mobile navigation must be easy to reach with one hand and should not consume excessive screen space.

---

# QUICK ACTIONS ON MOBILE

Important actions should always be easy to access.

Consider a prominent floating or sticky action button.

Example:

**+ Add**

When tapped:

* Add Property
* Add Unit
* Add Tenant
* Create Maintenance Ticket
* Upload Document
* Create Reminder

Avoid hiding essential actions several navigation levels deep.

---

# TOUCH-FIRST DESIGN

Every mobile interaction must be designed for fingers rather than a mouse cursor.

Ensure:

* Large tap targets
* Adequate spacing between interactive elements
* No tiny icons as the only way to perform critical actions
* Easy-to-use dropdowns
* Mobile-friendly date pickers
* Bottom sheets where appropriate
* Clear visual feedback after interactions

Hover states must never be required to access important functionality.

---

# CONTENT PRIORITIZATION RULE

Before placing content on a mobile screen, determine:

1. Is this information immediately important?
2. Does the user need to see this without taking action?
3. Can this information be viewed after tapping into the record?
4. Is this creating unnecessary scrolling or visual clutter?

If information is not immediately necessary, use progressive disclosure rather than displaying everything at once.

---

# FINAL MOBILE EXPERIENCE REQUIREMENT

The mobile application should feel like a purpose-built mobile product.

**Do not simply shrink or stack the desktop interface.**

Every major screen must be reviewed individually for mobile usability.

The final mobile experience should ensure:

* No horizontal page scrolling
* No unnecessary side-to-side navigation
* No desktop tables squeezed onto mobile screens
* No excessive nested scrolling
* Only one primary vertical scrolling context
* Important information appears before secondary information
* Important actions are quickly accessible
* Large content is broken into manageable views
* Complex information uses progressive disclosure
* Mobile-specific navigation is used where appropriate

The objective is not necessarily to eliminate all vertical scrolling, because some screens will naturally contain more content. The objective is to ensure that **every scroll has a purpose and that users never need to fight the interface to find information or complete a task**.

Mobile usability should take priority over preserving the exact desktop layout.
