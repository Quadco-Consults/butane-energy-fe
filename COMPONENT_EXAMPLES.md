# Shadcn/UI Component Usage Examples

This guide provides practical examples for using the Shadcn/UI components already installed in the Butane Energy ERP.

## Quick Reference

### All Available Components (28 Total)

```
UI Components Location: /components/ui/
Import Path: @/components/ui
```

---

## COMMON USAGE PATTERNS

### 1. CARD COMPONENT

The most common layout component for dashboard content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">$45,231.89</p>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### 2. FORM WITH VALIDATION

Complete form handling with React Hook Form + Zod.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Schema definition
const formSchema = z.object({
  email: z.string().email("Invalid email"),
  productType: z.enum(["lpg", "cylinder", "accessory"]),
  quantity: z.number().min(1),
  urgent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function OrderForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      productType: "lpg",
      quantity: 1,
      urgent: false,
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Text Input Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="customer@butanenergy.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Field */}
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lpg">LPG</SelectItem>
                  <SelectItem value="cylinder">Cylinder</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox Field */}
        <FormField
          control={form.control}
          name="urgent"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Mark as urgent</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Order</Button>
      </form>
    </Form>
  );
}
```

---

### 3. DATA TABLE

Displaying structured data with tables.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "completed";
  amount: number;
  date: string;
}

const orders: Order[] = [
  { id: "ORD-001", customer: "ABC Trading", status: "completed", amount: 5000, date: "2024-11-10" },
  { id: "ORD-002", customer: "XYZ Retail", status: "processing", amount: 3000, date: "2024-11-11" },
];

export function OrdersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant={order.status === "completed" ? "default" : "outline"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">${order.amount.toLocaleString()}</TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

### 4. DIALOG / MODAL

For user interactions like confirmations or complex inputs.

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Customer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter customer details and we'll add them to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Customer Name" />
          <Input placeholder="Email Address" />
          <Input placeholder="Phone Number" />
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Add Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 5. DROPDOWN MENU

Context menus and action menus.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash, Download } from "lucide-react";

export function OrderActions({ orderId }: { orderId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit Order
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### 6. TABS

Organize content into multiple sections.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <Card className="p-6">
          <h2 className="font-semibold mb-2">Project Overview</h2>
          <p className="text-muted-foreground">
            This project manages the procurement of equipment for the new plant facility.
          </p>
        </Card>
      </TabsContent>
      
      <TabsContent value="details">
        <Card className="p-6">
          <h2 className="font-semibold mb-2">Project Details</h2>
          <p className="text-muted-foreground">
            Budget: $250,000 | Timeline: 6 months
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        <Card className="p-6">
          <h2 className="font-semibold mb-2">Timeline</h2>
          <p className="text-muted-foreground">
            Phase 1 (Planning): Oct - Nov 2024
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
```

---

### 7. TOOLTIPS

Add helpful hints to UI elements.

```tsx
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          This field represents the total revenue from all sales channels
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

---

### 8. BADGES & STATUS

Show status, tags, and labels.

```tsx
import { Badge } from "@/components/ui/badge";

export function StatusBadges() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge>Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  );
}
```

---

### 9. PROGRESS BAR

Show progress of operations.

```tsx
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectProgress() {
  const progress = 65;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### 10. COLLAPSIBLE SECTIONS

Expandable/collapsible content.

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  return (
    <div className="space-y-2">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="justify-between w-full">
            What are the payment terms?
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 py-2 text-sm text-muted-foreground">
          We offer 30-day payment terms for wholesale customers and net terms for qualified businesses.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="justify-between w-full">
            What is the minimum order quantity?
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 py-2 text-sm text-muted-foreground">
          Minimum order is 100 units for LPG products and 50 units for cylinders.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
```

---

### 11. BUTTON VARIANTS

All available button styles.

```tsx
import { Button } from "@/components/ui/button";

export function ButtonShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Variants */}
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">+</Button>

      {/* Disabled */}
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

---

### 12. AVATAR

User profile pictures.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarImage src="" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}
```

---

### 13. SCROLL AREA

Scrollable containers.

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotificationsList() {
  const notifications = Array.from({ length: 20 }, (_, i) => `Notification ${i + 1}`);

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-2">
        {notifications.map((notif, i) => (
          <div key={i} className="text-sm pb-2 border-b">
            {notif}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
```

---

### 14. SHEET (SIDE DRAWER)

Side panel for navigation or additional content.

```tsx
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SideDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate to different sections</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <Button variant="ghost" className="w-full justify-start">Procurement</Button>
          <Button variant="ghost" className="w-full justify-start">Finance</Button>
          <Button variant="ghost" className="w-full justify-start">Reports</Button>
          <Button variant="ghost" className="w-full justify-start">Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

## STYLING GUIDELINES

### Using the `cn()` Utility

The `cn()` utility merges Tailwind classes conditionally:

```tsx
import { cn } from "@/lib/utils";

export function ConditionalBox({ isHighlight }: { isHighlight: boolean }) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        isHighlight && "bg-primary text-primary-foreground"
      )}
    >
      Content
    </div>
  );
}
```

### Color Classes Available

```tsx
// Primary (Butane Green)
className="bg-primary text-primary-foreground"

// Secondary (Butane Blue)
className="bg-secondary text-secondary-foreground"

// Accent (Butane Orange)
className="bg-accent text-accent-foreground"

// Muted
className="bg-muted text-muted-foreground"

// Destructive
className="bg-destructive text-white"

// Custom status colors
className="bg-green-600"  // Success
className="bg-yellow-600" // Warning
className="bg-blue-600"   // Info
```

---

## RESPONSIVE DESIGN

All components work with Tailwind's responsive prefixes:

```tsx
<Card className="w-full md:w-1/2 lg:w-1/3">
  {/* 100% width on mobile, 50% on tablets, 33% on desktop */}
</Card>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column mobile, 2 columns tablet, 3 columns desktop */}
</div>
```

---

## ACCESSIBILITY

All components follow WCAG standards:

- Buttons have proper focus states
- Forms have associated labels
- Colors have sufficient contrast
- Icons have ARIA labels
- Dialogs are modal-focused
- Keyboard navigation is supported

---

## DARK MODE

Components automatically adapt to dark mode when the `dark` class is present on the `<html>` element.

```tsx
// Toggle dark mode
document.documentElement.classList.toggle("dark");
```

All color variables are adjusted in `/app/globals.css` for dark mode.

---

## Performance Tips

1. Use `"use client"` directive only where needed
2. Import components from `@/components/ui/` (tree-shakeable)
3. Use `<Image>` from Next.js for images
4. Lazy load heavy components with dynamic imports
5. Use React.memo for expensive re-renders

---

## Additional Resources

- Shadcn/UI Docs: https://ui.shadcn.com/
- Radix UI Docs: https://www.radix-ui.com/
- Tailwind CSS Docs: https://tailwindcss.com/
- Component Configuration: `/components.json`
- Global Styles: `/app/globals.css`
- Design System: `/lib/design-system.ts`

