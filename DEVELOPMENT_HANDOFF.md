# Landlord HQ - Development Handoff Guide

## Overview

This is a property management SaaS application built with React + Vite + TypeScript + Tailwind CSS + shadcn/ui.

## Tech Stack

- **Framework**: React 18.3 + Vite 6.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Routing**: React Router v7 (Data mode)
- **State Management**: React Context API

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── DetailPageHeader.tsx
│   │   │   └── MetricCard.tsx
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── context/             # React Context
│   │   └── AppContext.tsx   # Global state
│   ├── pages/               # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── Units.tsx
│   │   ├── UnitDetail.tsx
│   │   ├── Tenants.tsx
│   │   ├── TenantDetail.tsx
│   │   ├── Maintenance.tsx
│   │   ├── MaintenanceDetail.tsx
│   │   ├── Documents.tsx
│   │   ├── DocumentDetail.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── routes.tsx           # Route configuration
│   └── App.tsx              # Root component
└── styles/
    ├── fonts.css
    └── theme.css            # Tailwind theme tokens
```

## Core Features

### 1. Dashboard
- Overview metrics (properties, units, tenants, revenue)
- Quick actions
- Recent activity
- Upcoming lease expirations

### 2. Properties
- List view with search/filter
- Add/Edit/Delete properties
- Property detail page with units, tenants, maintenance, documents
- Property metrics

### 3. Units
- List view with search/filter by status
- Add/Edit/Delete units
- Unit detail page with tenant, lease info, maintenance, documents
- Unit assignment to properties

### 4. Tenants
- List view with search/filter by lease status
- Add/Edit/Delete tenants
- Tenant detail page with contact info, lease details, maintenance, documents
- Unit assignment

### 5. Maintenance
- Ticket list with search/filter by status/priority
- Create/Edit maintenance tickets
- Maintenance detail page with full ticket info
- Priority levels (High, Medium, Low)
- Status tracking (New, In Progress, Completed)

### 6. Documents
- Document list with search/filter by type
- Upload/Edit/Delete documents
- Document detail page with associated entities
- Link documents to properties, units, tenants

### 7. Settings
- User profile
- Notification preferences
- Account settings

## State Management

### AppContext

The application uses a centralized Context API for state management with the following entities:

- **Properties**: Property listings with address, type, unit count
- **Units**: Individual rental units with tenant assignments, rent, lease dates
- **Tenants**: Tenant information with contact details, lease status
- **Maintenance Tickets**: Service requests with priority, status, descriptions
- **Documents**: File metadata with associations to other entities

### Data Relationships

- Properties → Units (one-to-many)
- Units → Tenants (one-to-one)
- Properties → Maintenance Tickets (one-to-many)
- Units → Maintenance Tickets (one-to-many)
- Properties/Units/Tenants → Documents (many-to-many)

### Denormalized Data

The context maintains denormalized data (e.g., `propertyName` in units) for performance. Update functions cascade changes to maintain consistency across all related entities.

## Routing

Uses React Router v7 Data mode with `RouterProvider`:

```tsx
// src/app/routes.tsx
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/properties", element: <Properties /> },
  { path: "/properties/:id", element: <PropertyDetail /> },
  // ... more routes
]);

// src/app/App.tsx
<AppProvider>
  <RouterProvider router={router} />
</AppProvider>
```

## Component Patterns

### 1. List Pages

All list pages follow this pattern:

```tsx
<MainLayout title="Page Title">
  <div className="space-y-6">
    <PageHeader
      description="Description • count"
      action={<Button>Add New</Button>}
    />

    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <SearchFilter
          searchValue={query}
          onSearchChange={setQuery}
          filters={/* Filters */}
        />

        {items.length === 0 ? (
          <EmptyState icon={Icon} title="Title" description="Description" />
        ) : (
          <Table>{/* Data */}</Table>
        )}
      </CardContent>
    </Card>
  </div>
</MainLayout>
```

### 2. Detail Pages

All detail pages follow this pattern:

```tsx
<MainLayout title={item.name}>
  <div className="space-y-6">
    <DetailPageHeader
      onBack={() => navigate("/items")}
      title={item.name}
      subtitle="Subtitle"
      badge={<StatusBadge status={item.status} />}
    />

    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard title="Metric" value="100" />
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>{/* Info */}</Card>
    </div>

    <Card>{/* Related data table */}</Card>
  </div>
</MainLayout>
```

### 3. Forms

All forms use Dialog component:

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[560px]">
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Form Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogHeader>

      <div className="grid gap-5 py-4">
        <div className="space-y-2">
          <Label htmlFor="field">Label *</Label>
          <Input id="field" className="h-10" required />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Submit
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

## Design Tokens

### Colors

- **Primary**: `bg-green-600` / `hover:bg-green-700`
- **Background**: `bg-gray-50` (page), `bg-white` (cards)
- **Border**: `border-gray-200` / `border-border`
- **Text**: `text-foreground` (primary), `text-muted-foreground` (secondary)

### Status Colors

- **Success/Active**: `bg-green-100 text-green-700`
- **Warning/Medium**: `bg-yellow-100 text-yellow-700`
- **Error/High**: `bg-red-100 text-red-700`
- **Info/Low**: `bg-blue-100 text-blue-700`
- **Neutral**: `bg-gray-100 text-gray-700`

### Spacing

- **Page**: `py-8 px-6 lg:px-8`, `max-w-[1600px]`
- **Section**: `space-y-6`
- **Card**: `p-6`
- **Form**: `gap-5 py-4`
- **Field**: `space-y-2`

### Typography

- **Page Title**: Handled by `MainLayout`
- **Section**: `text-lg font-semibold`
- **Card Title**: `text-sm font-medium`
- **Body**: `text-sm`
- **Caption**: `text-xs text-muted-foreground`

## Responsive Design

### Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

### Responsive Patterns

```tsx
// Grid: 1 col mobile, 2 tablet, 4 desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Flex: stack mobile, row desktop
<div className="flex flex-col sm:flex-row gap-4">

// Width: full mobile, fixed desktop
<Select className="w-full sm:w-[200px]">

// Sidebar: hidden mobile, visible desktop
<div className="hidden md:flex md:w-72">
```

## Key Implementation Details

### Ref Forwarding

All UI components use `React.forwardRef` for compatibility with Radix UI:

```tsx
const Component = React.forwardRef<HTMLElement, Props>(
  ({ className, ...props }, ref) => (
    <element ref={ref} className={cn(styles, className)} {...props} />
  )
);
Component.displayName = "Component";
```

### Cascading Updates

When updating entities, changes cascade to maintain data consistency:

- Updating a property name updates all units, tenants, tickets, documents
- Updating a unit number updates all tickets and documents
- Updating a tenant name updates all units, tickets, documents
- Reassigning units updates both tenant and unit status

See `AppContext.tsx` for full implementation.

### Form Validation

- Required fields marked with asterisk (*)
- Client-side validation using HTML5 attributes
- Alert dialogs for error messages
- Confirmation dialogs for destructive actions

## Development Setup

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

The Vite dev server is already running in the Figma Make environment.

### Build for Production

```bash
pnpm build
```

Note: This project uses Figma Make's custom build process. Do not run `vite build` directly.

## Testing Checklist

### Functionality

- [ ] All CRUD operations work correctly
- [ ] Search and filtering functions properly
- [ ] Navigation between pages works
- [ ] Forms validate correctly
- [ ] Cascading updates maintain data consistency
- [ ] Delete confirmations appear

### UI/UX

- [ ] All buttons have hover states
- [ ] Active nav items highlighted
- [ ] Status badges display correct colors
- [ ] Empty states show helpful messages
- [ ] Forms are easy to fill out
- [ ] Tables are readable
- [ ] Dialogs are properly sized

### Responsive

- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Sidebar hidden on mobile
- [ ] Tables scroll horizontally if needed
- [ ] Forms stack properly on mobile

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Labels are associated with inputs
- [ ] Color contrast meets WCAG AA
- [ ] Semantic HTML used correctly

## Known Limitations

### Current Implementation

- **No Authentication**: Login/signup are UI-only
- **No Persistence**: Data stored in memory (resets on refresh)
- **No File Upload**: Document upload is UI-only
- **No Pagination**: All data loads at once
- **No Real-time Updates**: Manual refresh required

### Future Enhancements

These are intentionally excluded from MVP:

- Backend API integration
- Database persistence
- File storage
- Real-time notifications
- Payment processing
- Reporting/analytics
- Tenant portal
- Automated workflows

## New in V1 Expansion

The following files were added during the V1 expansion and developer handoff:

### New Pages
- `src/app/pages/Leases.tsx` — Lease list + create form
- `src/app/pages/LeaseDetail.tsx` — Lease detail, payments, move-in/move-out workflows
- `src/app/pages/Inspections.tsx` — Inspection list + schedule form
- `src/app/pages/InspectionDetail.tsx` — Inspection detail + findings tracking
- `src/app/pages/NotFound.tsx` — 404 catch-all page

### Domain Type Layer
- `src/types/index.ts` — All entity interfaces and status union types (canonical source of truth)

### Utility Libraries
- `src/lib/constants.ts` — String constant arrays for all domain select options
- `src/lib/formatters.ts` — `formatCurrency`, `formatDate`, `formatRent`, `formatRelativeDate`, etc.
- `src/lib/config.ts` — Environment configuration + feature flags
- `src/lib/validation.ts` — Shared form validation: `required`, `email`, `phone`, `rentAmount`, etc.

### Service Layer
- `src/services/interfaces.ts` — TypeScript interfaces for all services (IPropertyService, ILeaseService, etc.)
- `src/services/index.ts` — Service registry: swap mock → real implementations here
- `src/services/mock/` — In-memory mock implementations backed by seed data

### Architecture Change Path
1. Create real service implementations (e.g., `src/services/supabase/`)
2. Swap exports in `src/services/index.ts`
3. Migrate AppContext CRUD operations to call services (use React Query or SWR for cache + loading state)

## Support & Documentation

- **Design System**: See `DESIGN_SYSTEM.md`
- **Component Guide**: See `COMPONENT_GUIDE.md`
- **Backend Integration**: See `BACKEND_INTEGRATION.md`
- **Code Comments**: Inline documentation in complex functions
- **Type Definitions**: `src/types/index.ts` (authoritative), also inline in `AppContext.tsx`

## Deployment Notes

### Environment Variables

Copy `.env.example` and fill in values. Required variables when connecting a backend:

```
VITE_API_URL=https://api.yourbackend.com
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AUTH_PROVIDER=supabase
VITE_STORAGE_URL=https://yourproject.supabase.co/storage/v1
```

For mock mode (default), no env vars are required.

### Build Output

Standard Vite build output in `dist/` directory.

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Contact

For questions about this implementation, refer to the code comments and documentation files included in this repository.
