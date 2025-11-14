# Butane Energy ERP - Quick Reference Guide

## Project Status: PRODUCTION READY

Shadcn/ui is **fully installed, configured, and operational**. No setup needed.

---

## KEY FACTS AT A GLANCE

| Item | Details |
|------|---------|
| **Framework** | Next.js 15.5.4 (App Router) |
| **UI Library** | Shadcn/ui (28 components ready) |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **Type Safety** | TypeScript v5 |
| **Form Validation** | React Hook Form + Zod |
| **Icons** | Lucide React (700+) |
| **State** | React Context API |
| **Deployed** | Vercel |
| **Status** | Production-ready |

---

## DIRECTORY GUIDE

```
/app                      Next.js pages & layout
/components/ui            28 Shadcn/ui components
/components               Feature components
/contexts                 React Context providers
/lib                      Utilities & design system
/hooks                    Custom React hooks
/public                   Static assets
/components.json          Shadcn configuration
/app/globals.css          Global styles & theme
```

---

## COMMONLY USED IMPORTS

```tsx
// UI Components (28 available)
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Utilities
import { cn } from "@/lib/utils"

// Forms
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Icons
import { ChevronDown, Plus, Trash2, Edit } from "lucide-react"
```

---

## 28 UI COMPONENTS AVAILABLE

### Layout (4)
- card.tsx - Cards with sections
- sheet.tsx - Side drawer/sheet
- separator.tsx - Dividers
- scroll-area.tsx - Scrollable regions

### Forms (7)
- form.tsx - React Hook Form wrapper
- input.tsx - Text input
- textarea.tsx - Multi-line input
- label.tsx - Form labels
- checkbox.tsx - Checkboxes
- select.tsx - Dropdowns
- form-components.tsx - Wrapped components

### Data Display (5)
- table.tsx - Data tables
- data-table.tsx - Advanced tables
- badge.tsx - Status badges
- avatar.tsx - User avatars
- skeleton.tsx - Loading state

### Navigation (5)
- button.tsx - Buttons (9 variants)
- dropdown-menu.tsx - Menu dropdowns
- navigation-menu.tsx - Navigation menu
- tabs.tsx - Tab interface
- collapsible.tsx - Expandable sections

### Modals & Notifications (4)
- dialog.tsx - Modal dialogs
- modal.tsx - Custom modals
- toast.tsx - Notifications
- tooltip.tsx - Hover tooltips

### Progress (2)
- progress.tsx - Progress bars
- layout-cards.tsx - Layout components

### Navigation (1)
- sidebar.tsx - Sidebar navigation

---

## COMMON PATTERNS

### Button Variants Available
```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">+</Button>
```

### Color System (Theme)
```css
--primary: #006738              /* Butane Green */
--secondary: #1e40af            /* Butane Blue */
--accent: #ea6a2a               /* Butane Orange */
--destructive: #dc2626          /* Red */
--muted: #f5f5f5                /* Light Gray */
```

### Conditional Styling
```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  condition && "conditional-class"
)}>
  Content
</div>
```

---

## FORM EXAMPLE (COMPLETE)

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name too short"),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "" },
  })

  async function onSubmit(data) {
    // Handle form submission
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## DATA TABLE EXAMPLE

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const data = [
  { id: "1", name: "ABC Trading", status: "active", amount: 5000 },
  { id: "2", name: "XYZ Retail", status: "inactive", amount: 3000 },
]

export function DataTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Badge variant={row.status === "active" ? "default" : "outline"}>
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>${row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

## COLOR UTILITIES

### Backgrounds
```tsx
className="bg-primary"           // Butane Green
className="bg-secondary"         // Butane Blue
className="bg-accent"            // Butane Orange
className="bg-destructive"       // Red
className="bg-muted"             // Light Gray
className="bg-background"        // Page background
className="bg-card"              // Card background
```

### Text Colors
```tsx
className="text-primary-foreground"    // Foreground on primary
className="text-muted-foreground"      // Muted text
className="text-destructive"           // Destructive text
```

### Borders & Rings
```tsx
className="border"                     // Default border
className="border-primary"             // Primary border
className="ring-primary ring-2"        // Focus ring
```

---

## RESPONSIVE GRID

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>

// Width utilities
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 100% mobile, 50% tablet, 33% desktop */}
</div>
```

---

## DARK MODE

Dark mode is **already configured** and automatically adapts.

To toggle:
```tsx
document.documentElement.classList.toggle("dark")
```

All colors are automatically adjusted in `/app/globals.css`.

---

## DESIGN SYSTEM CONSTANTS

Location: `/lib/design-system.ts`

```tsx
// Spacing (8px grid)
spacing.sm = "0.5rem"     // 8px
spacing.md = "1rem"       // 16px
spacing.lg = "1.5rem"     // 24px

// Enterprise spacing
spacing.enterprise.sidebarWidth = "280px"
spacing.enterprise.topbarHeight = "64px"
spacing.enterprise.cardPadding = "1.5rem"
```

---

## NPM SCRIPTS

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

---

## NEXT STEPS TO EXTEND

### Add More Shadcn Components
```bash
npx shadcn-ui@latest add [component-name]
```

Available: accordion, alert, calendar, carousel, chart, combobox, command, date-picker, drawer, menubar, pagination, popover, radio-group, resizable, slider, sonner, switch, toggle, toggle-group

### Create New Pages
1. Create `/app/dashboard/[module]/page.tsx`
2. Import UI components
3. Use DashboardLayout wrapper
4. Export default

### Add Custom Components
1. Create `/components/[Name].tsx`
2. Use UI components from `@/components/ui/`
3. Export component
4. Import in pages

---

## TROUBLESHOOTING

### Tailwind classes not working?
- Check `/app/globals.css` is imported in layout
- Ensure PostCSS is configured
- Check `postcss.config.mjs` exists

### TypeScript errors?
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` paths are correct

### Components not importing?
- Use full path: `from "@/components/ui/button"`
- Don't use relative paths

### Dark mode not working?
- Add `dark` class to `<html>` element
- Colors in `/app/globals.css` handle the rest

---

## FILE TO KNOW

| File | Purpose |
|------|---------|
| `/components.json` | Shadcn configuration |
| `/app/globals.css` | Theme colors & global styles |
| `/lib/utils.ts` | cn() utility function |
| `/lib/design-system.ts` | Design tokens |
| `/components/DashboardLayout.tsx` | Master layout |
| `/contexts/AuthContext.ts` | Authentication state |
| `/tsconfig.json` | Path aliases & TypeScript |

---

## HELPFUL LINKS

- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## KEY TAKEAWAY

Everything is already set up. Start building features using the 28 available Shadcn/ui components. No configuration needed.

