Create a modern SaaS web application UI for a property management platform called “Landlord HQ”.

The app is a landlord-first dashboard for managing rental properties, units, tenants, lease documents, and maintenance tickets. It should feel clean, professional, premium, organized, and easy to use. The design should look like a real production dashboard, not a generic template.

Build the frontend UI only. Do not build backend functionality.

Use a modern React-style layout that can later be built with:
React + Vite + TypeScript + Tailwind CSS + shadcn/ui + lucide-react + react-router-dom + React Hook Form.

Visual Style:
- Clean SaaS dashboard
- Light mode by default
- Optional dark mode friendly colors
- Professional property management feel
- White and soft gray backgrounds
- Dark text
- Subtle green accent color
- Rounded cards
- Soft shadows
- Lots of spacing
- Modern sidebar navigation
- Responsive desktop-first layout with mobile considerations
- Avoid clutter
- Avoid overly colorful design
- Avoid cartoonish visuals

Main App Name:
Landlord HQ

Main Sidebar Navigation:
1. Dashboard
2. Properties
3. Units
4. Tenants
5. Maintenance
6. Documents
7. Settings

Do NOT include these in the first version:
- Tenant Portal
- Vendors
- Payments
- AI Assistant
- Reports
- Automations
- Messages

Create the following screens:

1. Login Page
- Centered login card
- App name: Landlord HQ
- Email field
- Password field
- Login button
- Link to signup
- Clean professional design

2. Signup Page
- Centered signup card
- Full name field
- Email field
- Password field
- Confirm password field
- Create account button
- Link back to login

3. Main Dashboard
Layout:
- Fixed left sidebar
- Top header with page title, search bar, and user profile area
- Main content area with dashboard cards

Dashboard cards:
- Total Properties
- Total Units
- Occupied Units
- Vacant Units
- Active Tenants
- Open Maintenance Tickets
- Leases Ending Soon
- Documents Uploaded

Dashboard sections:
- Recent Activity
- Attention Needed
- Quick Actions

Quick Action buttons:
- Add Property
- Add Unit
- Add Tenant
- Create Maintenance Ticket
- Upload Document

Attention Needed examples:
- Lease ending soon
- Unit marked vacant
- Open high priority maintenance ticket
- Tenant missing unit assignment
- Missing lease document

4. Properties Page
Create a list/table page for properties.
Include:
- Page title: Properties
- Add Property button
- Search input
- Filter dropdown
- Table or card list with:
  - Property Name
  - Address
  - City
  - Province
  - Property Type
  - Number of Units
  - Status
  - Actions

Also create an Add/Edit Property form with:
- Property Name
- Address
- City
- Province
- Postal Code
- Property Type
- Notes
- Save button
- Cancel button

5. Property Detail Page
Include:
- Property name and address
- Overview cards:
  - Units
  - Tenants
  - Open Tickets
  - Documents
- Tabs or sections:
  - Units
  - Tenants
  - Maintenance
  - Documents
  - Notes

6. Units Page
Create a list/table page for units.
Include:
- Page title: Units
- Add Unit button
- Search input
- Filters for Occupied, Vacant, Lease Ending Soon
- Table with:
  - Unit Number
  - Property
  - Tenant
  - Rent Amount
  - Status
  - Lease Start
  - Lease End
  - Actions

Add/Edit Unit form fields:
- Unit Number
- Property
- Tenant
- Rent Amount
- Status: Occupied or Vacant
- Lease Start
- Lease End
- Notes

7. Tenants Page
Create a list/table page for tenants.
Include:
- Page title: Tenants
- Add Tenant button
- Search input
- Filters for Active, No Assigned Unit, Lease Ending Soon
- Table with:
  - Full Name
  - Email
  - Phone
  - Property
  - Unit
  - Lease Status
  - Actions

Add/Edit Tenant form fields:
- Full Name
- Email
- Phone
- Assigned Unit
- Lease Start
- Lease End
- Lease Status
- Notes

8. Maintenance Page
Create a maintenance ticket page.
Include:
- Page title: Maintenance
- Create Ticket button
- Search input
- Filters for New, In Progress, Completed, High Priority
- Ticket cards or table with:
  - Ticket Title
  - Property
  - Unit
  - Tenant
  - Category
  - Priority
  - Status
  - Created Date
  - Actions

Ticket categories:
- Plumbing
- Electrical
- HVAC
- Appliance
- Pest Control
- Cleaning
- Security
- General

Statuses:
- New
- In Progress
- Completed

Priorities:
- Low
- Medium
- High

Create Ticket form fields:
- Ticket Title
- Property
- Unit
- Tenant
- Category
- Description
- Priority
- Status
- Image upload placeholder
- Notes
- Save button

9. Documents Page
Create a documents management page.
Include:
- Page title: Documents
- Upload Document button
- Search input
- Filters for Lease, Notice, Inspection, Other
- Table or card list with:
  - Document Name
  - Document Type
  - Linked Property
  - Linked Unit
  - Linked Tenant
  - Upload Date
  - Actions

Upload Document form fields:
- Document Name
- Document Type
- Property
- Unit
- Tenant
- File upload area
- Notes
- Save button

10. Settings Page
Create a simple settings page.
Include:
- Account Information
- Full Name
- Email
- Business or Landlord Name
- Password section
- Save Changes button

Component Requirements:
- Use reusable cards
- Use clean forms
- Use tables with actions
- Use badges for statuses
- Use empty states for pages with no data
- Use loading skeleton placeholders where appropriate
- Use professional icons from lucide-react style
- Use a consistent spacing system
- Use a consistent button style
- Use a consistent form style

Data:
Use realistic sample data for all screens.
Example properties:
- Maple Street Duplex
- Richmond Apartment
- Oakridge Rental Home

Example tenants:
- Sarah Thompson
- Daniel Reed
- Maria Lopez

Example maintenance tickets:
- Kitchen sink leaking
- Furnace not heating
- Broken window lock

Responsive Design:
- Desktop layout should have a full sidebar
- Tablet layout should collapse spacing
- Mobile layout should use a collapsible sidebar or bottom navigation
- Forms should stack vertically on mobile
- Tables should become cards on mobile

Important:
This is the first MVP version. Keep it focused on landlord-side management only.
Do not add tenant portal, AI assistant, payments, vendors, reports, or advanced automation.
The goal is to create a clean visual frontend prototype that can later be converted into a real React + Supabase production app.