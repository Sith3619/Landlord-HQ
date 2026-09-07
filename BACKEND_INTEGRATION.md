# Landlord HQ — Backend Integration Guide

This document is a checklist for integrating a real backend. The app currently runs entirely on in-memory mock state. No actual APIs, databases, or auth providers are wired up.

---

## Architecture Overview

The service layer (`src/services/`) defines typed interfaces for every domain. Swap from mock → real without changing any page component by replacing the exports in `src/services/index.ts`.

```
pages / context
    ↓ (reads state via useApp())
AppContext (React useState)
    ↓ (currently: no service calls)
src/services/index.ts   ← swap here
    ↓
mock/     OR     supabase/     OR     rest/
```

---

## Recommended Stack

| Concern | Recommendation |
|---|---|
| Auth | Supabase Auth (email/password + social) |
| Database | Supabase (Postgres) |
| File Storage | Supabase Storage |
| API layer | Supabase client (realtime, RLS) or tRPC if custom API needed |
| Data fetching | React Query (TanStack Query) v5 |
| Real-time | Supabase Realtime channels |

---

## Step-by-Step Integration

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

### 2. Configure Environment Variables

Create `.env.local` at the project root:

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AUTH_PROVIDER=supabase
VITE_STORAGE_URL=https://yourproject.supabase.co/storage/v1
```

These are read by `src/lib/config.ts`. The feature flag `IS_MOCK` will automatically become `false`.

### 3. Create Supabase Client

Create `src/lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 4. Implement Auth Service

Create `src/services/supabase/authService.ts` implementing `IAuthService`:

```ts
import { supabase } from "../../lib/supabase";
import type { IAuthService } from "../interfaces";

export const supabaseAuthService: IAuthService = {
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return mapUserFromSupabase(data.user);
  },
  // ... logout, signup, getSession, getCurrentUser
};
```

### 5. Implement Domain Services

Create one file per domain in `src/services/supabase/`:

```ts
// src/services/supabase/propertyService.ts
import { supabase } from "../../lib/supabase";
import type { IPropertyService } from "../interfaces";

export const supabasePropertyService: IPropertyService = {
  async getProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },
  // ... createProperty, updateProperty, archiveProperty, deleteProperty
};
```

### 6. Swap Service Registry

Update `src/services/index.ts` to use real implementations:

```ts
// Before
export { mockPropertyService as propertyService } from "./mock/propertyService";

// After
export { supabasePropertyService as propertyService } from "./supabase/propertyService";
```

### 7. Migrate AppContext to Use Services

Currently AppContext holds all state in `useState`. Migrate to React Query:

```tsx
// Before (AppContext)
const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

// After (with React Query)
const { data: properties = [] } = useQuery({
  queryKey: ["properties"],
  queryFn: () => propertyService.getProperties(),
});

const addPropertyMutation = useMutation({
  mutationFn: (data: CreatePropertyInput) => propertyService.createProperty(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
});
```

### 8. Add Auth Guard

Create `src/app/components/AuthGuard.tsx`:

```tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    authService.getSession().then((session) => {
      if (!session) navigate("/login");
    });
  }, [navigate]);
  return <>{children}</>;
}
```

Wrap protected routes in `routes.tsx` with `<AuthGuard>`.

---

## Database Schema

Suggested Postgres tables. Add RLS policies so users only access their own data.

```sql
-- Users managed by Supabase Auth (auth.users)
-- Extend with a profiles table:
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  role text default 'owner',
  created_at timestamptz default now()
);

create table properties (
  id bigint generated always as identity primary key,
  owner_id uuid references profiles(id) not null,
  name text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text,
  property_type text,
  unit_count int default 0,
  status text default 'Active',
  is_archived boolean default false,
  floors int,
  amenities text,
  parking text,
  utility_responsibility text,
  notes text,
  created_at timestamptz default now()
);

create table units (
  id bigint generated always as identity primary key,
  property_id bigint references properties(id) on delete cascade,
  unit_number text not null,
  rent numeric,
  status text default 'Vacant',
  bedrooms int,
  bathrooms numeric,
  sqft int,
  floor int,
  furnished boolean default false,
  security_deposit numeric,
  utility_responsibility text,
  availability_date date,
  readiness_status text,
  notes text
);

create table tenants (
  id bigint generated always as identity primary key,
  property_id bigint references properties(id),
  unit_id bigint references units(id),
  full_name text not null,
  email text,
  phone text,
  lifecycle_status text default 'Applicant',
  role text default 'Primary',
  lease_start date,
  lease_end date,
  notes text
);

create table leases (
  id bigint generated always as identity primary key,
  unit_id bigint references units(id),
  property_id bigint references properties(id),
  lease_type text,
  status text default 'Draft',
  start_date date,
  end_date date,
  rent_amount numeric,
  rent_due_day int default 1,
  security_deposit numeric,
  notice_period_days int default 60,
  notes text
);

-- lease_tenants join table (supports multiple occupants per unit)
create table lease_tenants (
  lease_id bigint references leases(id) on delete cascade,
  tenant_id bigint references tenants(id) on delete cascade,
  primary key (lease_id, tenant_id)
);

create table rent_payments (
  id bigint generated always as identity primary key,
  lease_id bigint references leases(id),
  unit_id bigint references units(id),
  tenant_id bigint references tenants(id),
  amount_due numeric,
  amount_paid numeric default 0,
  due_date date,
  paid_date date,
  status text default 'Due',
  method text,
  note text
);

create table maintenance_tickets (
  id bigint generated always as identity primary key,
  property_id bigint references properties(id),
  unit_id bigint references units(id),
  tenant_id bigint references tenants(id),
  title text not null,
  description text,
  category text,
  priority text default 'Medium',
  status text default 'New',
  assigned_to text,
  estimated_cost numeric,
  actual_cost numeric,
  scheduled_date date,
  completion_date date,
  is_recurring boolean default false,
  recurring_frequency text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table inspections (
  id bigint generated always as identity primary key,
  property_id bigint references properties(id),
  unit_id bigint references units(id),
  tenant_id bigint references tenants(id),
  type text,
  scheduled_date date,
  inspector_name text,
  status text default 'Scheduled',
  notes text,
  follow_up_required boolean default false
);

create table inspection_findings (
  id bigint generated always as identity primary key,
  inspection_id bigint references inspections(id) on delete cascade,
  item text,
  condition text,
  notes text,
  maintenance_ticket_id bigint references maintenance_tickets(id)
);

create table documents (
  id bigint generated always as identity primary key,
  name text not null,
  document_type text,
  property_id bigint references properties(id),
  unit_id bigint references units(id),
  tenant_id bigint references tenants(id),
  lease_id bigint references leases(id),
  inspection_id bigint references inspections(id),
  file_url text,  -- Supabase Storage URL
  upload_date date default current_date,
  expiration_date date,
  notes text,
  version int default 1
);

create table activity_events (
  id bigint generated always as identity primary key,
  type text not null,
  description text,
  entity_type text,
  entity_id bigint,
  entity_name text,
  date date default current_date,
  created_by uuid references profiles(id)
);
```

---

## File Storage

For document uploads, use Supabase Storage:

```ts
// src/services/supabase/documentService.ts
async uploadFile(file: File) {
  const path = `documents/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("landlord-hq")
    .upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from("landlord-hq")
    .getPublicUrl(path);
  return { url: publicUrl, name: file.name };
}
```

Enable the `documentUpload` feature flag in `src/lib/config.ts` when ready.

---

## Real-Time Updates

Subscribe to database changes via Supabase Realtime:

```ts
// Example: listen for new maintenance tickets
supabase
  .channel("maintenance")
  .on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "maintenance_tickets",
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  })
  .subscribe();
```

Enable the `realTimeUpdates` feature flag in `src/lib/config.ts` when wired.

---

## Integration Checklist

- [ ] Set env vars in `.env.local`
- [ ] Create Supabase project and run schema migrations
- [ ] Implement `supabaseAuthService` and wire Login/Signup pages
- [ ] Add `AuthGuard` to protect routes
- [ ] Implement service files for each domain (property, unit, tenant, lease, payment, maintenance, inspection, document)
- [ ] Swap `src/services/index.ts` exports from mock → supabase
- [ ] Migrate AppContext to React Query (replace `useState` arrays)
- [ ] Add React Query `QueryClientProvider` to `App.tsx`
- [ ] Configure Supabase Storage bucket and CORS
- [ ] Add document upload UI (enable `FEATURES.documentUpload`)
- [ ] Add Supabase Realtime subscriptions (enable `FEATURES.realTimeUpdates`)
- [ ] Replace client-side search with Postgres full-text search or Algolia
- [ ] Add pagination to list endpoints
- [ ] Set up Row Level Security (RLS) policies so users only see their own data
- [ ] Add server-side input validation (Zod schemas recommended)
- [ ] Set up Supabase Edge Functions for complex workflows (move-in/move-out, notifications)
