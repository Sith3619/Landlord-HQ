# Landlord HQ - Design System

## Color Palette

### Primary Colors
- **Primary Green**: `bg-green-600` / `hover:bg-green-700` - Primary actions
- **Success Green**: `bg-green-100 text-green-700` - Success states, occupied status
- **Foreground**: `text-foreground` - Primary text
- **Muted**: `text-muted-foreground` - Secondary text

### Status Colors
- **Active/Occupied**: Green (`bg-green-100 text-green-700`)
- **Vacant/Inactive**: Gray (`bg-gray-100 text-gray-700`)
- **Warning**: Yellow (`bg-yellow-100 text-yellow-700`)
- **Error/High Priority**: Red (`bg-red-100 text-red-700`)
- **Info**: Blue (`bg-blue-100 text-blue-700`)

### Backgrounds
- **Page Background**: `bg-gray-50`
- **Card Background**: `bg-white`
- **Input Background**: `bg-input-background`
- **Input Focus**: `bg-gray-50`
- **Table Hover**: `hover:bg-gray-50`
- **Border**: `border-gray-200` / `border-border`

## Typography

### Font Sizes
- **Page Title**: `text-2xl font-semibold`
- **Section Title**: `text-lg font-semibold`
- **Card Title**: `text-sm font-medium`
- **Body**: `text-sm`
- **Caption**: `text-xs text-muted-foreground`

### Font Weights
- **Semibold**: Page titles, section headers
- **Medium**: Card titles, labels, table data
- **Normal**: Body text, descriptions

## Spacing

### Page Layout
- **Page Padding**: `py-8 px-6 lg:px-8`
- **Max Width**: `max-w-[1600px]`
- **Section Gap**: `space-y-6`

### Card Spacing
- **Card Padding**: `p-6`
- **Card Gap**: `gap-4` or `gap-6`
- **Card Border Radius**: `rounded-xl`

### Form Spacing
- **Form Gap**: `gap-5 py-4`
- **Field Gap**: `space-y-2`
- **Input Height**: `h-10`
- **Label to Input**: `space-y-2`

### Sidebar
- **Width**: `w-72`
- **Padding**: `px-4 py-6`
- **Nav Item Gap**: `space-y-1`
- **Nav Item Padding**: `px-4 py-3`

## Components

### Buttons

#### Primary Button
```tsx
className="bg-green-600 hover:bg-green-700 shadow-sm h-10 px-4"
```

#### Secondary Button
```tsx
className="variant='outline' h-10 px-4"
```

#### Icon Button
```tsx
className="variant='ghost' size='icon' h-8 w-8"
```

### Badges

#### Status Badge
- **Active/Occupied**: `bg-green-100 text-green-700 hover:bg-green-100`
- **Vacant**: `variant='secondary'`
- **Default**: `variant='outline'`

#### Priority Badge
- **High**: `bg-red-100 text-red-700 hover:bg-red-100`
- **Medium**: `bg-yellow-100 text-yellow-700 hover:bg-yellow-100`
- **Low**: `bg-blue-100 text-blue-700 hover:bg-blue-100`

### Tables

#### Table Structure
- **Border**: `rounded-lg border border-border overflow-hidden`
- **Header**: `bg-gray-50 hover:bg-gray-50`
- **Row**: `hover:bg-gray-50`
- **Cell Padding**: `p-2`
- **Font**: `text-sm`

### Forms

#### Input Fields
- **Height**: `h-10`
- **Padding**: `px-3`
- **Border**: `border border-gray-200`
- **Focus**: `focus-visible:ring-[3px] focus-visible:ring-ring/50`

#### Labels
- **Font**: `text-sm leading-none`
- **Required Indicator**: Asterisk in label text

#### Dialog
- **Max Width**: `sm:max-w-[560px]`
- **Content Padding**: `p-6`
- **Form Gap**: `gap-5 py-4`

### Cards

#### Metric Card
- **Padding**: `p-6`
- **Title Font**: `text-sm font-medium`
- **Value Font**: `text-2xl font-semibold`
- **Caption Font**: `text-xs text-muted-foreground`

#### Data Card
- **Padding**: `p-6`
- **Border**: `border-0 shadow-sm`
- **Radius**: `rounded-xl`

### Empty States
- **Container**: `text-center py-16`
- **Icon**: `w-16 h-16 rounded-full bg-gray-100`
- **Icon Size**: `h-8 w-8 text-gray-400`
- **Title**: `text-lg font-semibold mb-2`
- **Description**: `text-sm text-muted-foreground mb-6`

## Responsive Breakpoints

- **Mobile**: Default
- **Tablet**: `md:` (768px)
- **Desktop**: `lg:` (1024px)

### Responsive Patterns
- **Sidebar**: Hidden on mobile (`hidden md:flex`)
- **Grid Columns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Flex Direction**: `flex-col sm:flex-row`
- **Max Width**: `max-w-md` for search inputs

## Component Patterns

### Page Header
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
  <div>
    <p className="text-sm text-muted-foreground mt-1">
      Description • Count
    </p>
  </div>
  <Button>Primary Action</Button>
</div>
```

### Search + Filter Row
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input className="pl-10 h-10 bg-gray-50 border-gray-200" />
  </div>
  <Select className="w-full sm:w-[200px] h-10" />
</div>
```

### Metric Grid
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>{/* Metric */}</Card>
</div>
```

### Detail Page Layout
```tsx
<div className="space-y-6">
  {/* Back Button + Title */}
  <div className="flex items-center gap-4">
    <Button variant="ghost" size="icon">
      <ArrowLeft />
    </Button>
    <div className="flex-1">
      <h2 className="text-2xl font-semibold">Title</h2>
      <p className="text-muted-foreground">Subtitle</p>
    </div>
    <Badge>Status</Badge>
  </div>
  
  {/* Metrics */}
  <div className="grid gap-4 md:grid-cols-4">
    {/* Metric Cards */}
  </div>
  
  {/* Info Cards */}
  <div className="grid gap-6 md:grid-cols-2">
    {/* Info Cards */}
  </div>
  
  {/* Related Data Tables */}
  <Card>{/* Table */}</Card>
</div>
```

## Accessibility

- All interactive elements must have focus states
- Form inputs require labels
- Icon-only buttons need `aria-label`
- Tables should have proper semantic structure
- Color is not the only indicator of status (use icons + text)

## Performance

- Use React.memo for expensive list items
- Virtualize long tables (>100 rows)
- Lazy load detail pages
- Debounce search inputs
- Use skeleton loaders for async data
