# DESIGN HANDOFF AND MANUAL CONTINUATION — EXTREMELY IMPORTANT

This Figma project must be designed for a proper developer handoff and for future manual continuation of the application.

Do not create a design that only works as a visual prototype. The entire system should be organized so that another designer or developer can easily understand, continue, modify, and expand the application without needing to redesign existing functionality.

## Organized Figma Structure

Organize the Figma file clearly and logically.

Create clearly labeled pages or sections for:

* Design System
* Components
* Light Mode
* Dark Mode
* Desktop Screens
* Tablet Screens
* Mobile Screens
* User Flows
* Future Features and Expansion

Use clear and descriptive naming conventions for:

* Pages
* Frames
* Components
* Component variants
* Layers
* Sections

Avoid vague or automatically generated names.

For example, use names such as:

* Dashboard / Desktop
* Dashboard / Mobile
* Property Detail / Desktop
* Property Detail / Mobile
* Maintenance Ticket / Open
* Button / Primary / Default
* Button / Primary / Hover
* Input / Default
* Input / Error

The structure should allow someone unfamiliar with the project to quickly understand how the application is organized.

---

# REUSABLE COMPONENT SYSTEM

Build the interface using reusable components rather than individually designing every element from scratch.

Create reusable components for:

* Buttons
* Inputs
* Search bars
* Dropdowns
* Navigation items
* Sidebar
* Mobile navigation
* Metric cards
* Property cards
* Tenant cards
* Maintenance cards
* Status badges
* Priority badges
* Tables
* Filters
* Tabs
* Modals
* Drawers
* Bottom sheets
* Notifications
* Calendar events
* Empty states
* Loading states
* Error states

Use component variants whenever appropriate.

Examples:

### Button Variants

* Primary
* Secondary
* Outline
* Ghost
* Destructive
* Disabled
* Loading

### Status Variants

* Active
* Occupied
* Vacant
* New
* In Progress
* Completed
* Ending Soon
* Expired

The goal is to ensure that future pages can be built using the existing component system instead of requiring completely new designs.

---

# DESIGN TOKENS AND CONSISTENCY

Establish a clear and reusable design system.

Define consistent tokens for:

## Colors

Include semantic colors for:

* Primary actions
* Backgrounds
* Surfaces
* Borders
* Primary text
* Secondary text
* Success
* Warning
* Error
* Information

Create corresponding values for both Light Mode and Dark Mode.

Avoid manually assigning slightly different colors throughout individual screens.

Use a centralized system that allows the application's theme to be changed or expanded easily.

## Typography

Define a consistent typography scale for:

* Page titles
* Section titles
* Card titles
* Body text
* Small text
* Labels
* Buttons
* Table content

## Spacing

Create a consistent spacing system that is used throughout the entire application.

## Border Radius

Define standard radius values for:

* Cards
* Buttons
* Inputs
* Modals
* Badges

## Shadows and Elevation

Create a consistent elevation system that works appropriately in both Light Mode and Dark Mode.

---

# RESPONSIVE HANDOFF

Clearly demonstrate how every major page and component should behave across different screen sizes.

For important screens, include designs for:

* Desktop
* Tablet
* Mobile

Do not leave responsive behavior open to interpretation.

Clearly demonstrate:

* When sidebars collapse
* How navigation changes on mobile
* How multi-column layouts stack
* How tables transform into mobile layouts
* How dashboard grids resize
* How modals and drawers behave
* How forms adapt
* Which content is prioritized or simplified on smaller screens

The goal is for a developer to be able to implement responsive behavior confidently without having to guess the intended design.

---

# LIGHT AND DARK MODE HANDOFF

Clearly define how every component behaves in both themes.

Do not create only a few Dark Mode example screens.

The component system should support Dark Mode throughout the entire application, including:

* Navigation
* Dashboard
* Cards
* Tables
* Forms
* Modals
* Dropdowns
* Calendar
* Notifications
* Empty states
* Loading states

Ensure that a developer can clearly identify which colors and styles should automatically change when switching themes.

---

# INTERACTION AND USER FLOW DOCUMENTATION

Where functionality may not be visually obvious, include clear annotations or prototype connections.

Document important interactions such as:

* Navigation between pages
* Opening and closing modals
* Creating records
* Editing records
* Deleting records
* Applying filters
* Searching
* Calendar interactions
* Notification actions
* Quick actions
* Mobile navigation

Clearly distinguish between:

* Existing functionality
* Planned functionality
* Future functionality

Do not make developers guess whether a feature is intended for the current version or a future update.

---

# MANUAL CONTINUATION AND EXPANDABILITY

The application should be designed as a system that can continuously grow.

Future developers and designers should be able to add features such as:

* Tenant Portal
* AI Assistant
* Vendor Management
* Rent Tracking
* Payments
* Automations
* Reporting
* Advanced Analytics
* Mobile Application

without needing to redesign the application's foundation.

Maintain consistent patterns for:

* New navigation sections
* New dashboard widgets
* New tables
* New detail pages
* New settings sections
* New notification types
* New calendar event types

When designing the current application, consider how these future features could integrate into the existing system while keeping them visually separate from the current MVP.

---

# DESIGN ANNOTATIONS FOR DEVELOPERS

Where necessary, provide concise annotations explaining:

* The purpose of complex components
* Expected interactions
* Responsive behavior
* Conditional states
* Empty states
* Error states
* Loading states

For example:

**Lease Ending Soon Card**

Display automatically when a tenant's lease end date is within the selected reminder period.

**Mobile Behavior**

On screens below the mobile breakpoint, move from the dashboard grid into a full-width stacked layout.

These annotations should provide useful implementation context without cluttering the main designs.

---

# AUTO LAYOUT AND SCALABILITY

Use Figma Auto Layout wherever appropriate.

Design components so they naturally adapt when:

* Text length changes
* Additional items are added
* Cards contain more or less information
* Screens change size
* New features are introduced

Avoid rigid designs that only work with the exact placeholder content shown in the prototype.

Use realistic variations in:

* Property names
* Tenant names
* Addresses
* Maintenance descriptions

This will help developers understand how the interface behaves with real data.

---

# FINAL HANDOFF REQUIREMENT

The completed Figma design should feel like a **production-ready product design system**, not simply a collection of attractive screens.

A developer receiving this project should be able to:

1. Understand the overall application structure.
2. Identify all major pages and user flows.
3. Reuse existing components.
4. Understand responsive behavior.
5. Implement both Light and Dark Modes.
6. Understand different component states.
7. Continue building new screens using the established design system.
8. Add future functionality without breaking visual consistency.
9. Identify which features belong to the current MVP versus future development phases.

The final Figma file must be clean, organized, scalable, reusable, and intentionally structured for long-term development and manual continuation by future designers and developers.

**Do not prioritize visual appearance at the expense of implementation clarity. The final design should balance a premium, professional appearance with a practical structure that can be realistically handed off, developed, maintained, and expanded over time.**
