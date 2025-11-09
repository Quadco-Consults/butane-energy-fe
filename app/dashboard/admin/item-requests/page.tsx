"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  Users,
  Building,
  Search,
  FileText
} from "lucide-react";

// Sample data for item requests
const itemRequestStats = [
  {
    title: "Total Requests",
    value: "342",
    description: "All time",
    icon: <Package className="h-8 w-8" />
  },
  {
    title: "Pending Approval",
    value: "28",
    description: "Awaiting review",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved Today",
    value: "12",
    description: "Today's approvals",
    trend: { value: "+8", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "High Priority",
    value: "6",
    description: "Urgent requests",
    icon: <AlertTriangle className="h-8 w-8" />
  }
];

const itemRequestsData = [
  {
    id: "IR-2024-001",
    requestNumber: "IR-2024-001",
    requestedBy: "Adamu Yakubu",
    department: "Operations",
    itemName: "LPG Storage Tank Pressure Gauge",
    category: "LPG Equipment",
    quantity: 5,
    estimatedCost: 125000.00,
    urgency: "high",
    status: "pending",
    dateRequested: "2024-01-15",
    requiredBy: "2024-01-20",
    justification: "Critical safety equipment for Tank Bay 2 operations",
    supplier: "EnergyFlow Solutions"
  },
  {
    id: "IR-2024-002",
    requestNumber: "IR-2024-002",
    requestedBy: "Kemi Adebayo",
    department: "IT",
    itemName: "Network Security Cameras",
    category: "Security Equipment",
    quantity: 8,
    estimatedCost: 280000.00,
    urgency: "medium",
    status: "approved",
    dateRequested: "2024-01-12",
    requiredBy: "2024-01-25",
    justification: "Enhance facility security monitoring",
    supplier: "SafeGuard Security Systems",
    approvedBy: "Musa Garba"
  },
  {
    id: "IR-2024-003",
    requestNumber: "IR-2024-003",
    requestedBy: "Ibrahim Mohammed",
    department: "Maintenance",
    itemName: "Industrial Welding Equipment",
    category: "Maintenance Tools",
    quantity: 2,
    estimatedCost: 450000.00,
    urgency: "high",
    status: "approved",
    dateRequested: "2024-01-10",
    requiredBy: "2024-01-18",
    justification: "Repair LPG transfer pipelines",
    supplier: "TechCorp Nigeria Ltd",
    approvedBy: "Musa Garba"
  },
  {
    id: "IR-2024-004",
    requestNumber: "IR-2024-004",
    requestedBy: "Grace Okonkwo",
    department: "Admin",
    itemName: "Office Furniture Set",
    category: "Office Equipment",
    quantity: 10,
    estimatedCost: 180000.00,
    urgency: "low",
    status: "draft",
    dateRequested: "2024-01-08",
    requiredBy: "2024-02-01",
    justification: "New employee workstations",
    supplier: "Office Dynamics Ltd"
  },
  {
    id: "IR-2024-005",
    requestNumber: "IR-2024-005",
    requestedBy: "Musa Abdullahi",
    department: "Logistics",
    itemName: "Fleet Management Software License",
    category: "Software & Licenses",
    quantity: 1,
    estimatedCost: 320000.00,
    urgency: "medium",
    status: "rejected",
    dateRequested: "2024-01-05",
    requiredBy: "2024-01-30",
    justification: "Optimize vehicle routing and maintenance",
    rejectedBy: "Musa Garba",
    rejectionReason: "Budget constraints - defer to Q2"
  }
];

const itemCategories = [
  "LPG Equipment",
  "Safety Equipment",
  "Security Equipment",
  "Maintenance Tools",
  "Office Equipment",
  "IT Hardware",
  "Software & Licenses",
  "Medical Supplies",
  "Consumables",
  "Spare Parts"
];

const departments = [
  "Operations", "IT", "Maintenance", "Admin", "Logistics",
  "Finance", "HR", "Trading", "Quality Control", "Security"
];

const urgencyLevels = ["low", "medium", "high", "urgent"];

const tableColumns: TableColumn[] = [
  {
    id: "requestNumber",
    header: "Request #",
    accessorKey: "requestNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.requestNumber}
      </div>
    )
  },
  {
    id: "itemName",
    header: "Item Details",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.itemName}</div>
        <div className="text-sm text-gray-500">Qty: {row.quantity} • {row.category}</div>
      </div>
    )
  },
  {
    id: "requestedBy",
    header: "Requested By",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.requestedBy}</div>
        <div className="text-sm text-gray-500">{row.department}</div>
      </div>
    )
  },
  {
    id: "estimatedCost",
    header: "Est. Cost",
    cell: (row) => (
      <div className="text-sm font-medium">
        ₦{row.estimatedCost.toLocaleString()}
      </div>
    )
  },
  {
    id: "urgency",
    header: "Priority",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.urgency === 'urgent' || row.urgency === 'high' ? 'rejected' :
        row.urgency === 'medium' ? 'pending' : 'approved'
      )}>
        {row.urgency}
      </span>
    )
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'approved' ? 'default' :
          row.status === 'pending' ? 'secondary' :
          row.status === 'rejected' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "requiredBy",
    header: "Required By",
    cell: (row) => <DateCell date={row.requiredBy} />
  }
];

export default function ItemRequestsPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedRequests, setSelectedRequests] = React.useState<string[]>([]);

  // Form validation for new item request
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      itemName: '',
      category: '',
      quantity: '',
      estimatedCost: '',
      urgency: 'medium',
      requiredBy: '',
      justification: '',
      specifications: '',
      preferredSupplier: '',
      alternativeItems: ''
    },
    {
      itemName: validationRules.required,
      category: validationRules.required,
      quantity: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      estimatedCost: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      requiredBy: validationRules.required,
      justification: validationRules.required
    }
  );

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Item request submitted successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkApprove = () => {
    if (selectedRequests.length === 0) {
      error("Please select item requests to approve");
      return;
    }
    success(`${selectedRequests.length} item request(s) approved`);
    setSelectedRequests([]);
  };

  const handleBulkReject = () => {
    if (selectedRequests.length === 0) {
      error("Please select item requests to reject");
      return;
    }
    success(`${selectedRequests.length} item request(s) rejected`);
    setSelectedRequests([]);
  };

  const handleExport = () => {
    success("Item requests exported to Excel");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Item Requests</h1>
          <p className={designSystem.getBody("small")}>
            Manage inventory requests, approvals, and procurement workflow
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {itemRequestStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="All Item Requests"
            description="Comprehensive inventory request management and approval system"
            searchPlaceholder="Search by item name, request number, or requester..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Item requests refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedRequests.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkApprove}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Selected ({selectedRequests.length})
                    </Button>
                    <Button variant="outline" onClick={handleBulkReject}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reject Selected
                    </Button>
                  </div>
                )}
                <FormModal
                  title="New Item Request"
                  description="Submit a new item request for procurement approval"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  }
                  onSubmit={handleCreateRequest}
                  submitLabel="Submit Request"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Item Name" required error={errors.itemName}>
                      <Input
                        value={values.itemName}
                        onChange={(e) => setValue('itemName', e.target.value)}
                        placeholder="Enter item name or description"
                      />
                    </FormField>

                    <FormField label="Category" required error={errors.category}>
                      <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Quantity" required error={errors.quantity}>
                      <Input
                        type="number"
                        value={values.quantity}
                        onChange={(e) => setValue('quantity', e.target.value)}
                        placeholder="0"
                        min="1"
                      />
                    </FormField>

                    <FormField label="Estimated Cost (₦)" required error={errors.estimatedCost}>
                      <Input
                        type="number"
                        value={values.estimatedCost}
                        onChange={(e) => setValue('estimatedCost', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </FormField>

                    <FormField label="Priority" required>
                      <Select value={values.urgency} onValueChange={(value) => setValue('urgency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((urgency) => (
                            <SelectItem key={urgency} value={urgency}>
                              {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Required By Date" required error={errors.requiredBy}>
                    <Input
                      type="date"
                      value={values.requiredBy}
                      onChange={(e) => setValue('requiredBy', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Business Justification" required error={errors.justification}>
                    <Textarea
                      value={values.justification}
                      onChange={(e) => setValue('justification', e.target.value)}
                      placeholder="Explain why this item is needed for business operations"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Technical Specifications">
                    <Textarea
                      value={values.specifications}
                      onChange={(e) => setValue('specifications', e.target.value)}
                      placeholder="Detailed technical specifications, brand preferences, or quality requirements"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Preferred Supplier (Optional)">
                    <Input
                      value={values.preferredSupplier}
                      onChange={(e) => setValue('preferredSupplier', e.target.value)}
                      placeholder="Recommended supplier or vendor"
                    />
                  </FormField>

                  <FormField label="Alternative Items (Optional)">
                    <Textarea
                      value={values.alternativeItems}
                      onChange={(e) => setValue('alternativeItems', e.target.value)}
                      placeholder="List any acceptable alternative items or substitutes"
                      rows={2}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Item Requests Table */}
          <DataTable
            data={itemRequestsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: itemRequestsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "dateRequested",
              direction: "desc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedRequests,
              onRowSelect: (id) => {
                setSelectedRequests(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedRequests(prev =>
                  prev.length === itemRequestsData.length
                    ? []
                    : itemRequestsData.map(request => request.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View Details",
                      onClick: () => success(`Viewing ${row.requestNumber} details`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.requestNumber}`),
                      variant: "outline",
                      disabled: row.status === 'approved' || row.status === 'rejected'
                    },
                    {
                      label: row.status === 'pending' ? "Approve" : "View Status",
                      onClick: () => success(
                        row.status === 'pending'
                          ? `Approving ${row.requestNumber}`
                          : `Status: ${row.status}`
                      ),
                      variant: row.status === 'pending' ? "default" : "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedRequests.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkApprove}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkReject}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Bulk export started")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No item requests found",
              action: (
                <Button onClick={() => success("Creating first item request...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Request
                </Button>
              )
            }}
          />
        </section>

        {/* Recent Activity and Quick Stats */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Recent Request Activity</h2>

          <ListCard
            title="Latest Updates"
            items={[
              {
                id: "1",
                title: "IR-2024-003 - Industrial Welding Equipment",
                description: "Approved by Musa Garba • Maintenance Dept • ₦450,000",
                status: { label: "Approved", variant: "default" },
                metadata: [
                  { label: "Priority", value: "High" },
                  { label: "Required By", value: "Jan 18, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "IR-2024-001 - LPG Storage Tank Pressure Gauge",
                description: "Pending approval • Operations Dept • ₦125,000",
                status: { label: "Pending", variant: "secondary" },
                metadata: [
                  { label: "Priority", value: "High" },
                  { label: "Required By", value: "Jan 20, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "3",
                title: "IR-2024-005 - Fleet Management Software",
                description: "Rejected - Budget constraints • Logistics • ₦320,000",
                status: { label: "Rejected", variant: "destructive" },
                metadata: [
                  { label: "Priority", value: "Medium" },
                  { label: "Reason", value: "Budget constraints" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No recent activity",
              action: {
                label: "Create Request",
                onClick: () => success("Creating new item request...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}