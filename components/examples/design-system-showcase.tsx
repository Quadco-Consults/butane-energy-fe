"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormContainer,
  FormModal,
  useFormValidation,
  validationRules
} from "@/components/ui/form-components";
import {
  StatsCard,
  ActionCard,
  ListCard,
  DataTableHeader,
  QuickActions,
  ComingSoonCard
} from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, CurrencyCell } from "@/components/ui/data-table";
import { useToast, Notification } from "@/components/ui/toast";
import { designSystem } from "@/lib/design-system";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Download,
  RefreshCw
} from "lucide-react";

// Sample data for demonstrations
const sampleData = [
  {
    id: "1",
    name: "Office Supplies",
    amount: 250.00,
    status: "approved",
    date: "2024-01-15",
    department: "Admin"
  },
  {
    id: "2",
    name: "Computer Equipment",
    amount: 1200.00,
    status: "pending",
    date: "2024-01-10",
    department: "IT"
  },
  {
    id: "3",
    name: "Marketing Materials",
    amount: 450.00,
    status: "rejected",
    date: "2024-01-08",
    department: "Marketing"
  }
];

const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "Item Name",
    accessorKey: "name",
    sortable: true
  },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    sortable: true
  },
  {
    id: "amount",
    header: "Amount",
    cell: (row) => <CurrencyCell amount={row.amount} />
  },
  {
    id: "date",
    header: "Date",
    cell: (row) => <DateCell date={row.date} />
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'approved' ? 'default' :
          row.status === 'pending' ? 'secondary' : 'destructive'
        }
      />
    )
  }
];

export default function DesignSystemShowcase() {
  const { success, error, warning, info } = useToast();
  const [showNotification, setShowNotification] = React.useState(false);

  // Form validation example
  const { values, errors, setValue, validate, reset } = useFormValidation(
    { name: '', email: '', description: '' },
    {
      name: validationRules.required,
      email: (value) => validationRules.required(value) || validationRules.email(value),
      description: validationRules.required
    }
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Form submitted successfully!");
      reset();
    } else {
      error("Please fix the form errors");
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Typography Examples */}
      <section className="space-y-4">
        <h1 className={designSystem.getHeading("h1")}>Design System Showcase</h1>
        <p className={designSystem.getBody("base")}>
          This page demonstrates all the reusable components and design patterns available in our system.
        </p>

        <div className="space-y-2">
          <h1 className={designSystem.getHeading("h1")}>Heading 1</h1>
          <h2 className={designSystem.getHeading("h2")}>Heading 2</h2>
          <h3 className={designSystem.getHeading("h3")}>Heading 3</h3>
          <h4 className={designSystem.getHeading("h4")}>Heading 4</h4>
          <p className={designSystem.getBody("large")}>Large body text</p>
          <p className={designSystem.getBody("base")}>Regular body text</p>
          <p className={designSystem.getBody("small")}>Small body text</p>
          <p className={designSystem.getBody("tiny")}>Tiny text for metadata</p>
        </div>
      </section>

      {/* Button Examples */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Button Variants</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus className="h-4 w-4" /></Button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Stats Cards</h2>
        <div className={designSystem.getGrid("cols4")}>
          <StatsCard
            title="Total Revenue"
            value="$45,231"
            description="Last 30 days"
            trend={{ value: "+12%", isPositive: true }}
            icon={<DollarSign className="h-8 w-8" />}
          />
          <StatsCard
            title="Active Users"
            value="1,234"
            description="Currently online"
            trend={{ value: "-2%", isPositive: false }}
            icon={<Users className="h-8 w-8" />}
          />
          <StatsCard
            title="Pending Requests"
            value="23"
            description="Awaiting approval"
            icon={<ShoppingCart className="h-8 w-8" />}
          />
          <StatsCard
            title="Inventory Items"
            value="456"
            description="In stock"
            icon={<Package className="h-8 w-8" />}
          />
        </div>
      </section>

      {/* Action Cards */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Action Cards</h2>
        <div className={designSystem.getGrid("cols3")}>
          <ActionCard
            title="Create Purchase Request"
            description="Submit new purchase requests for approval"
            icon={<ShoppingCart className="h-6 w-6" />}
            actions={[
              {
                label: "New Request",
                onClick: () => success("Creating new request..."),
                icon: <Plus className="h-4 w-4" />
              },
              {
                label: "View Templates",
                onClick: () => info("Showing templates..."),
                variant: "outline"
              }
            ]}
          />
          <ActionCard
            title="Manage Inventory"
            description="View and update inventory items"
            icon={<Package className="h-6 w-6" />}
            actions={[
              {
                label: "Add Item",
                onClick: () => success("Adding new item..."),
                icon: <Plus className="h-4 w-4" />
              },
              {
                label: "View Reports",
                onClick: () => info("Loading reports..."),
                variant: "outline"
              }
            ]}
          />
          <ActionCard
            title="User Management"
            description="Manage users and permissions"
            icon={<Users className="h-6 w-6" />}
            actions={[
              {
                label: "Add User",
                onClick: () => success("Creating user..."),
                icon: <Plus className="h-4 w-4" />
              }
            ]}
          />
        </div>
      </section>

      {/* Toast Examples */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Notifications</h2>

        <div className="space-y-4">
          <div>
            <h3 className={designSystem.getHeading("h4")}>Toast Notifications</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="success" onClick={() => success("Operation completed successfully!")}>
                Success Toast
              </Button>
              <Button variant="destructive" onClick={() => error("Something went wrong!")}>
                Error Toast
              </Button>
              <Button variant="warning" onClick={() => warning("Please review your changes")}>
                Warning Toast
              </Button>
              <Button variant="info" onClick={() => info("New update available")}>
                Info Toast
              </Button>
            </div>
          </div>

          <div>
            <h3 className={designSystem.getHeading("h4")}>Inline Notifications</h3>
            <div className="space-y-2 mt-2">
              <Button onClick={() => setShowNotification(!showNotification)}>
                Toggle Notification
              </Button>
              {showNotification && (
                <Notification
                  type="info"
                  title="Information"
                  message="This is an inline notification that stays visible until dismissed."
                  onClose={() => setShowNotification(false)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Form Examples */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Form Components</h2>

        <div className="max-w-md">
          <FormContainer
            title="Sample Form"
            description="Demonstrates form validation and styling"
            onSubmit={handleFormSubmit}
            footer={
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={reset}>
                  Reset
                </Button>
                <Button type="submit">
                  Submit
                </Button>
              </div>
            }
          >
            <FormField label="Name" required error={errors.name}>
              <Input
                value={values.name}
                onChange={(e) => setValue('name', e.target.value)}
                placeholder="Enter your name"
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                placeholder="Enter your email"
              />
            </FormField>

            <FormField label="Description" required error={errors.description}>
              <Textarea
                value={values.description}
                onChange={(e) => setValue('description', e.target.value)}
                placeholder="Enter a description"
                rows={3}
              />
            </FormField>
          </FormContainer>
        </div>

        <div>
          <FormModal
            title="Modal Form Example"
            description="This form opens in a modal dialog"
            trigger={<Button variant="outline">Open Modal Form</Button>}
            onSubmit={(e) => {
              e.preventDefault();
              success("Modal form submitted!");
            }}
          >
            <FormField label="Item Name" required>
              <Input placeholder="Enter item name" />
            </FormField>
            <FormField label="Description">
              <Textarea placeholder="Enter description" rows={2} />
            </FormField>
          </FormModal>
        </div>
      </section>

      {/* Data Table Example */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Data Table</h2>

        <DataTableHeader
          title="Sample Data"
          description="Demonstrates table functionality"
          searchPlaceholder="Search items..."
          onSearch={(value) => console.log("Search:", value)}
          onRefresh={() => success("Data refreshed!")}
          onExport={() => info("Exporting data...")}
          actions={
            <QuickActions
              actions={[
                {
                  label: "Add Item",
                  icon: <Plus className="h-4 w-4" />,
                  onClick: () => success("Adding new item...")
                },
                {
                  label: "Bulk Edit",
                  icon: <Edit className="h-4 w-4" />,
                  onClick: () => info("Opening bulk edit..."),
                  variant: "outline"
                }
              ]}
            />
          }
        />

        <DataTable
          data={sampleData}
          columns={tableColumns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: sampleData.length,
            onPageChange: (page) => console.log("Page:", page),
            onPageSizeChange: (size) => console.log("Page size:", size)
          }}
          actions={{
            row: (row) => (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => info(`Editing ${row.name}`)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => warning(`Deleting ${row.name}`)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )
          }}
          emptyState={{
            message: "No data found",
            action: <Button>Add First Item</Button>
          }}
        />
      </section>

      {/* Coming Soon Example */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Coming Soon Cards</h2>

        <div className={designSystem.getGrid("cols2")}>
          <ComingSoonCard
            title="Analytics Dashboard"
            description="Comprehensive analytics and reporting system"
            icon={<DollarSign className="h-5 w-5" />}
            features={[
              "Real-time metrics",
              "Custom report builder",
              "Data visualization",
              "Export capabilities",
              "Automated insights"
            ]}
            estimatedLaunch="Q2 2024"
          />
          <ComingSoonCard
            title="Mobile Application"
            description="Native mobile app for iOS and Android"
            icon={<Package className="h-5 w-5" />}
            features={[
              "Offline functionality",
              "Push notifications",
              "Biometric authentication",
              "Camera integration"
            ]}
            estimatedLaunch="Q3 2024"
          />
        </div>
      </section>

      {/* Badge Examples */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h2")}>Status Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className={designSystem.getBadge("pending")}>Pending</span>
          <span className={designSystem.getBadge("approved")}>Approved</span>
          <span className={designSystem.getBadge("rejected")}>Rejected</span>
          <span className={designSystem.getBadge("draft")}>Draft</span>
          <span className={designSystem.getBadge("active")}>Active</span>
          <span className={designSystem.getBadge("inactive")}>Inactive</span>
        </div>
      </section>
    </div>
  );
}