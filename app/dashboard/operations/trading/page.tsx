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
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  Plus,
  Eye,
  Edit,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building
} from "lucide-react";

// Sample data for trading operations
const tradingStats = [
  {
    title: "Monthly Revenue",
    value: "₦125.6M",
    description: "January 2024",
    trend: { value: "+18%", isPositive: true },
    icon: <DollarSign className="h-8 w-8" />
  },
  {
    title: "Active Contracts",
    value: "47",
    description: "In progress",
    icon: <BarChart3 className="h-8 w-8" />
  },
  {
    title: "LPG Volume Traded",
    value: "2,840",
    description: "Metric tons (MTD)",
    trend: { value: "+12%", isPositive: true },
    icon: <TrendingUp className="h-8 w-8" />
  },
  {
    title: "Active Customers",
    value: "178",
    description: "This month",
    icon: <Users className="h-8 w-8" />
  }
];

const tradingData = [
  {
    id: "TRD-2024-001",
    contractNumber: "TRD-2024-001",
    customerName: "Delta Gas Distribution Ltd",
    contractType: "Bulk Supply",
    volume: 500,
    unitPrice: 950000,
    totalValue: 475000000,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    deliveryLocation: "Warri, Delta State",
    paymentTerms: "Net 30",
    salesRep: "Ahmed Mohammed",
    lastDelivery: "2024-01-12"
  },
  {
    id: "TRD-2024-002",
    contractNumber: "TRD-2024-002",
    customerName: "Northern Energy Solutions",
    contractType: "Retail Supply",
    volume: 200,
    unitPrice: 980000,
    totalValue: 196000000,
    status: "pending",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    deliveryLocation: "Kaduna, Kaduna State",
    paymentTerms: "Net 15",
    salesRep: "Kemi Adebayo",
    lastDelivery: null
  },
  {
    id: "TRD-2024-003",
    contractNumber: "TRD-2024-003",
    customerName: "Lagos Industrial Gas Co",
    contractType: "Industrial Supply",
    volume: 1000,
    unitPrice: 920000,
    totalValue: 920000000,
    status: "active",
    startDate: "2023-10-01",
    endDate: "2024-09-30",
    deliveryLocation: "Ikeja, Lagos State",
    paymentTerms: "Net 45",
    salesRep: "Grace Okonkwo",
    lastDelivery: "2024-01-10"
  },
  {
    id: "TRD-2024-004",
    contractNumber: "TRD-2024-004",
    customerName: "Abuja Gas Hub",
    contractType: "Distribution Partnership",
    volume: 300,
    unitPrice: 960000,
    totalValue: 288000000,
    status: "negotiation",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    deliveryLocation: "Abuja, FCT",
    paymentTerms: "Net 30",
    salesRep: "Ibrahim Mohammed",
    lastDelivery: null
  },
  {
    id: "TRD-2024-005",
    contractNumber: "TRD-2024-005",
    customerName: "Southeast Gas Networks",
    contractType: "Bulk Supply",
    volume: 750,
    unitPrice: 940000,
    totalValue: 705000000,
    status: "completed",
    startDate: "2023-07-01",
    endDate: "2023-12-31",
    deliveryLocation: "Owerri, Imo State",
    paymentTerms: "Net 30",
    salesRep: "Musa Abdullahi",
    lastDelivery: "2023-12-28"
  }
];

const contractTypes = [
  "Bulk Supply",
  "Retail Supply",
  "Industrial Supply",
  "Distribution Partnership",
  "Spot Sale",
  "Long-term Contract"
];

const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "COD", "Advance Payment"];
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const tableColumns: TableColumn[] = [
  {
    id: "contractNumber",
    header: "Contract #",
    accessorKey: "contractNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.contractNumber}
      </div>
    )
  },
  {
    id: "customerName",
    header: "Customer Details",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.customerName}</div>
        <div className="text-sm text-gray-500">{row.contractType}</div>
      </div>
    )
  },
  {
    id: "volume",
    header: "Volume & Value",
    cell: (row) => (
      <div className="text-sm">
        <div className="font-medium">{row.volume.toLocaleString()} MT</div>
        <div className="text-gray-500">₦{(row.totalValue / 1000000).toFixed(1)}M</div>
      </div>
    )
  },
  {
    id: "deliveryLocation",
    header: "Location",
    accessorKey: "deliveryLocation",
    sortable: true,
    cell: (row) => (
      <div className="text-sm">{row.deliveryLocation}</div>
    )
  },
  {
    id: "salesRep",
    header: "Sales Rep",
    accessorKey: "salesRep",
    sortable: true,
    cell: (row) => (
      <div className="text-sm">{row.salesRep}</div>
    )
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'active' ? 'default' :
          row.status === 'pending' ? 'secondary' :
          row.status === 'negotiation' ? 'outline' :
          row.status === 'completed' ? 'default' : 'destructive'
        }
      />
    )
  },
  {
    id: "endDate",
    header: "End Date",
    cell: (row) => <DateCell date={row.endDate} />
  }
];

export default function TradingPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedContracts, setSelectedContracts] = React.useState<string[]>([]);

  // Form validation for new trading contract
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      customerName: '',
      contractType: '',
      volume: '',
      unitPrice: '',
      deliveryLocation: '',
      deliveryState: '',
      paymentTerms: 'Net 30',
      startDate: '',
      endDate: '',
      salesRep: '',
      notes: ''
    },
    {
      customerName: validationRules.required,
      contractType: validationRules.required,
      volume: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      unitPrice: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      deliveryLocation: validationRules.required,
      deliveryState: validationRules.required,
      startDate: validationRules.required,
      endDate: validationRules.required,
      salesRep: validationRules.required
    }
  );

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Trading contract created successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkExport = () => {
    if (selectedContracts.length === 0) {
      error("Please select contracts to export");
      return;
    }
    success(`${selectedContracts.length} contract(s) exported`);
    setSelectedContracts([]);
  };

  const handleExport = () => {
    success("Trading report exported to Excel");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>LPG Trading Operations</h1>
          <p className={designSystem.getBody("small")}>
            Manage LPG sales contracts, customer relationships, and trading operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {tradingStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="Trading Contracts"
            description="Comprehensive LPG trading contract management system"
            searchPlaceholder="Search by contract number, customer, or sales rep..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Trading data refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedContracts.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected ({selectedContracts.length})
                    </Button>
                    <Button variant="outline" onClick={() => success("Invoices generated")}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Generate Invoices
                    </Button>
                  </div>
                )}
                <FormModal
                  title="New Trading Contract"
                  description="Create a new LPG trading contract"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Contract
                    </Button>
                  }
                  onSubmit={handleCreateContract}
                  submitLabel="Create Contract"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Customer Name" required error={errors.customerName}>
                      <Input
                        value={values.customerName}
                        onChange={(e) => setValue('customerName', e.target.value)}
                        placeholder="Enter customer company name"
                      />
                    </FormField>

                    <FormField label="Contract Type" required error={errors.contractType}>
                      <Select value={values.contractType} onValueChange={(value) => setValue('contractType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Volume (MT)" required error={errors.volume}>
                      <Input
                        type="number"
                        value={values.volume}
                        onChange={(e) => setValue('volume', e.target.value)}
                        placeholder="0"
                        min="1"
                      />
                    </FormField>

                    <FormField label="Unit Price (₦/MT)" required error={errors.unitPrice}>
                      <Input
                        type="number"
                        value={values.unitPrice}
                        onChange={(e) => setValue('unitPrice', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Delivery Location" required error={errors.deliveryLocation}>
                      <Input
                        value={values.deliveryLocation}
                        onChange={(e) => setValue('deliveryLocation', e.target.value)}
                        placeholder="City or specific location"
                      />
                    </FormField>

                    <FormField label="State" required error={errors.deliveryState}>
                      <Select value={values.deliveryState} onValueChange={(value) => setValue('deliveryState', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Contract Start Date" required error={errors.startDate}>
                      <Input
                        type="date"
                        value={values.startDate}
                        onChange={(e) => setValue('startDate', e.target.value)}
                      />
                    </FormField>

                    <FormField label="Contract End Date" required error={errors.endDate}>
                      <Input
                        type="date"
                        value={values.endDate}
                        onChange={(e) => setValue('endDate', e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Payment Terms" required>
                      <Select value={values.paymentTerms} onValueChange={(value) => setValue('paymentTerms', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTermsOptions.map((term) => (
                            <SelectItem key={term} value={term}>
                              {term}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Sales Representative" required error={errors.salesRep}>
                      <Input
                        value={values.salesRep}
                        onChange={(e) => setValue('salesRep', e.target.value)}
                        placeholder="Assigned sales rep"
                      />
                    </FormField>
                  </div>

                  <FormField label="Additional Notes">
                    <Textarea
                      value={values.notes}
                      onChange={(e) => setValue('notes', e.target.value)}
                      placeholder="Contract terms, delivery instructions, or special requirements"
                      rows={3}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Trading Contracts Table */}
          <DataTable
            data={tradingData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: tradingData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "startDate",
              direction: "desc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedContracts,
              onRowSelect: (id) => {
                setSelectedContracts(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedContracts(prev =>
                  prev.length === tradingData.length
                    ? []
                    : tradingData.map(contract => contract.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View Contract",
                      onClick: () => success(`Viewing ${row.contractNumber} details`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.contractNumber}`),
                      variant: "outline",
                      disabled: row.status === 'completed'
                    },
                    {
                      label: "Invoice",
                      onClick: () => success(`Generating invoice for ${row.contractNumber}`),
                      variant: "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedContracts.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Invoices generated")}>
                    <DollarSign className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No trading contracts found",
              action: (
                <Button onClick={() => success("Creating first contract...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Contract
                </Button>
              )
            }}
          />
        </section>

        {/* Trading Analytics and Recent Activity */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Trading Performance</h2>

          <ListCard
            title="Recent Trading Activity"
            items={[
              {
                id: "1",
                title: "TRD-2024-003 - Lagos Industrial Gas Co",
                description: "Industrial Supply • 1,000 MT • ₦920M • Sales Rep: Grace Okonkwo",
                status: { label: "Active", variant: "default" },
                metadata: [
                  { label: "Last Delivery", value: "Jan 10, 2024" },
                  { label: "Contract Ends", value: "Sep 30, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <TrendingUp className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "TRD-2024-002 - Northern Energy Solutions",
                description: "Retail Supply • 200 MT • ₦196M • Sales Rep: Kemi Adebayo",
                status: { label: "Pending", variant: "secondary" },
                metadata: [
                  { label: "Start Date", value: "Jan 15, 2024" },
                  { label: "Payment Terms", value: "Net 15" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "3",
                title: "TRD-2024-004 - Abuja Gas Hub",
                description: "Distribution Partnership • 300 MT • ₦288M • Sales Rep: Ibrahim Mohammed",
                status: { label: "Negotiation", variant: "outline" },
                metadata: [
                  { label: "Proposed Start", value: "Feb 01, 2024" },
                  { label: "Status", value: "Under Review" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Building className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No recent trading activity",
              action: {
                label: "Create Contract",
                onClick: () => success("Creating new trading contract...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}