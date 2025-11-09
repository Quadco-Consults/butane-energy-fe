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
  Truck,
  Star,
  DollarSign,
  Users,
  Plus,
  Eye,
  Edit,
  Download,
  Phone,
  Mail,
  Building,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

// Sample data for vendors
const vendorStats = [
  {
    title: "Total Vendors",
    value: "127",
    description: "Active suppliers",
    icon: <Truck className="h-8 w-8" />
  },
  {
    title: "Preferred Vendors",
    value: "23",
    description: "Top rated suppliers",
    icon: <Star className="h-8 w-8" />
  },
  {
    title: "Total Spend",
    value: "₦2.8M",
    description: "This quarter",
    trend: { value: "+12%", isPositive: true },
    icon: <DollarSign className="h-8 w-8" />
  },
  {
    title: "New This Month",
    value: "8",
    description: "Recently onboarded",
    trend: { value: "+3", isPositive: true },
    icon: <Users className="h-8 w-8" />
  }
];

const vendorsData = [
  {
    id: "VEN-001",
    vendorCode: "VEN-001",
    companyName: "TechCorp Nigeria Ltd",
    contactPerson: "Adamu Yakubu",
    email: "adamu@techcorp.ng",
    phone: "+234-803-123-4567",
    category: "Technology & Equipment",
    location: "Lagos, Nigeria",
    status: "active",
    rating: 4.8,
    totalSpend: 1250000.00,
    paymentTerms: "Net 30",
    dateRegistered: "2023-08-15",
    lastOrderDate: "2024-01-10",
    compliance: "verified"
  },
  {
    id: "VEN-002",
    vendorCode: "VEN-002",
    companyName: "BuildMaster Construction",
    contactPerson: "Kemi Adebayo",
    email: "kemi@buildmaster.ng",
    phone: "+234-806-987-6543",
    category: "Construction & Infrastructure",
    location: "Abuja, Nigeria",
    status: "active",
    rating: 4.5,
    totalSpend: 2100000.00,
    paymentTerms: "Net 45",
    dateRegistered: "2023-06-20",
    lastOrderDate: "2024-01-08",
    compliance: "verified"
  },
  {
    id: "VEN-003",
    vendorCode: "VEN-003",
    companyName: "SafeGuard Security Systems",
    contactPerson: "Ibrahim Mohammed",
    email: "ibrahim@safeguard.ng",
    phone: "+234-809-456-7890",
    category: "Security & Safety",
    location: "Kano, Nigeria",
    status: "active",
    rating: 4.2,
    totalSpend: 650000.00,
    paymentTerms: "Net 30",
    dateRegistered: "2023-11-05",
    lastOrderDate: "2023-12-20",
    compliance: "pending"
  },
  {
    id: "VEN-004",
    vendorCode: "VEN-004",
    companyName: "EnergyFlow Solutions",
    contactPerson: "Grace Okonkwo",
    email: "grace@energyflow.ng",
    phone: "+234-812-345-6789",
    category: "LPG Equipment & Services",
    location: "Port Harcourt, Nigeria",
    status: "active",
    rating: 4.9,
    totalSpend: 3200000.00,
    paymentTerms: "Net 60",
    dateRegistered: "2023-03-12",
    lastOrderDate: "2024-01-12",
    compliance: "verified"
  },
  {
    id: "VEN-005",
    vendorCode: "VEN-005",
    companyName: "Office Dynamics Ltd",
    contactPerson: "Musa Abdullahi",
    email: "musa@officedynamics.ng",
    phone: "+234-815-678-9012",
    category: "Office Supplies",
    location: "Lagos, Nigeria",
    status: "suspended",
    rating: 3.1,
    totalSpend: 180000.00,
    paymentTerms: "Net 15",
    dateRegistered: "2023-09-30",
    lastOrderDate: "2023-11-15",
    compliance: "expired"
  }
];

const vendorCategories = [
  "LPG Equipment & Services",
  "Technology & Equipment",
  "Construction & Infrastructure",
  "Security & Safety",
  "Office Supplies",
  "Professional Services",
  "Transportation & Logistics",
  "Maintenance Services"
];

const complianceStatuses = ["verified", "pending", "expired", "rejected"];
const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "Net 90", "COD"];
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const tableColumns: TableColumn[] = [
  {
    id: "vendorCode",
    header: "Vendor Code",
    accessorKey: "vendorCode",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.vendorCode}
      </div>
    )
  },
  {
    id: "companyName",
    header: "Company Name",
    accessorKey: "companyName",
    sortable: true,
    cell: (row) => (
      <div>
        <div className="font-medium">{row.companyName}</div>
        <div className="text-sm text-gray-500">{row.contactPerson}</div>
      </div>
    )
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    sortable: true,
    cell: (row) => (
      <div className="text-sm text-gray-600">
        {row.category}
      </div>
    )
  },
  {
    id: "location",
    header: "Location",
    accessorKey: "location",
    sortable: true,
    cell: (row) => (
      <div className="flex items-center text-sm">
        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
        {row.location}
      </div>
    )
  },
  {
    id: "rating",
    header: "Rating",
    cell: (row) => (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-400 mr-1" />
        <span className="text-sm font-medium">{row.rating}</span>
      </div>
    )
  },
  {
    id: "compliance",
    header: "Compliance",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.compliance === 'verified' ? 'approved' :
        row.compliance === 'pending' ? 'pending' : 'rejected'
      )}>
        {row.compliance}
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
          row.status === 'active' ? 'default' :
          row.status === 'pending' ? 'secondary' : 'destructive'
        }
      />
    )
  },
  {
    id: "totalSpend",
    header: "Total Spend",
    cell: (row) => (
      <div className="text-sm font-medium">
        ₦{row.totalSpend.toLocaleString()}
      </div>
    )
  }
];

export default function VendorsPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>([]);

  // Form validation for new vendor
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      category: '',
      paymentTerms: 'Net 30',
      taxId: '',
      bankName: '',
      accountNumber: '',
      description: ''
    },
    {
      companyName: validationRules.required,
      contactPerson: validationRules.required,
      email: (value) => validationRules.required(value) || validationRules.email(value),
      phone: validationRules.required,
      address: validationRules.required,
      city: validationRules.required,
      state: validationRules.required,
      category: validationRules.required
    }
  );

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Vendor registered successfully and sent for compliance verification!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedVendors.length === 0) {
      error("Please select vendors first");
      return;
    }
    success(`${action} applied to ${selectedVendors.length} vendor(s)`);
    setSelectedVendors([]);
  };

  const handleExport = () => {
    success("Vendor list exported to Excel");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Vendor Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage supplier relationships, compliance, and procurement partnerships
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {vendorStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="All Vendors"
            description="Comprehensive vendor database and management system"
            searchPlaceholder="Search by company name, vendor code, or contact person..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Vendor list refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedVendors.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleBulkAction("Compliance verification")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Selected ({selectedVendors.length})
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("Status update")}>
                      <Clock className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                  </div>
                )}
                <FormModal
                  title="Register New Vendor"
                  description="Add a new vendor to your supplier database"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Register Vendor
                    </Button>
                  }
                  onSubmit={handleCreateVendor}
                  submitLabel="Register Vendor"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Company Name" required error={errors.companyName}>
                      <Input
                        value={values.companyName}
                        onChange={(e) => setValue('companyName', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </FormField>

                    <FormField label="Contact Person" required error={errors.contactPerson}>
                      <Input
                        value={values.contactPerson}
                        onChange={(e) => setValue('contactPerson', e.target.value)}
                        placeholder="Primary contact person"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email Address" required error={errors.email}>
                      <Input
                        type="email"
                        value={values.email}
                        onChange={(e) => setValue('email', e.target.value)}
                        placeholder="company@domain.com"
                      />
                    </FormField>

                    <FormField label="Phone Number" required error={errors.phone}>
                      <Input
                        value={values.phone}
                        onChange={(e) => setValue('phone', e.target.value)}
                        placeholder="+234-XXX-XXX-XXXX"
                      />
                    </FormField>
                  </div>

                  <FormField label="Business Address" required error={errors.address}>
                    <Textarea
                      value={values.address}
                      onChange={(e) => setValue('address', e.target.value)}
                      placeholder="Complete business address"
                      rows={2}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="City" required error={errors.city}>
                      <Input
                        value={values.city}
                        onChange={(e) => setValue('city', e.target.value)}
                        placeholder="City"
                      />
                    </FormField>

                    <FormField label="State" required error={errors.state}>
                      <Select value={values.state} onValueChange={(value) => setValue('state', value)}>
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
                    <FormField label="Business Category" required error={errors.category}>
                      <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tax ID (Optional)">
                      <Input
                        value={values.taxId}
                        onChange={(e) => setValue('taxId', e.target.value)}
                        placeholder="Tax identification number"
                      />
                    </FormField>

                    <FormField label="Bank Name (Optional)">
                      <Input
                        value={values.bankName}
                        onChange={(e) => setValue('bankName', e.target.value)}
                        placeholder="Primary bank"
                      />
                    </FormField>
                  </div>

                  <FormField label="Account Number (Optional)">
                    <Input
                      value={values.accountNumber}
                      onChange={(e) => setValue('accountNumber', e.target.value)}
                      placeholder="Bank account number"
                    />
                  </FormField>

                  <FormField label="Business Description">
                    <Textarea
                      value={values.description}
                      onChange={(e) => setValue('description', e.target.value)}
                      placeholder="Brief description of business services and capabilities"
                      rows={3}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Vendors Table */}
          <DataTable
            data={vendorsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: vendorsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "companyName",
              direction: "asc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedVendors,
              onRowSelect: (id) => {
                setSelectedVendors(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedVendors(prev =>
                  prev.length === vendorsData.length
                    ? []
                    : vendorsData.map(vendor => vendor.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View Profile",
                      onClick: () => success(`Viewing ${row.companyName} profile`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.companyName}`),
                      variant: "outline"
                    },
                    {
                      label: "Contact",
                      onClick: () => success(`Contacting ${row.contactPerson}`),
                      variant: "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedVendors.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Verify compliance")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export details")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No vendors found",
              action: (
                <Button onClick={() => success("Registering first vendor...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Register First Vendor
                </Button>
              )
            }}
          />
        </section>

        {/* Quick Stats and Recent Activity */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Recent Vendor Activity</h2>

          <ListCard
            title="Latest Updates"
            items={[
              {
                id: "1",
                title: "EnergyFlow Solutions - Compliance Verified",
                description: "LPG Equipment & Services • Rating: 4.9/5 • Port Harcourt",
                status: { label: "Verified", variant: "default" },
                metadata: [
                  { label: "Total Spend", value: "₦3.2M" },
                  { label: "Last Order", value: "Jan 12, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "TechCorp Nigeria Ltd - New Order Placed",
                description: "Technology & Equipment • Rating: 4.8/5 • Lagos",
                status: { label: "Active", variant: "default" },
                metadata: [
                  { label: "Total Spend", value: "₦1.25M" },
                  { label: "Last Order", value: "Jan 10, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "3",
                title: "SafeGuard Security Systems - Compliance Pending",
                description: "Security & Safety • Rating: 4.2/5 • Kano",
                status: { label: "Pending", variant: "secondary" },
                metadata: [
                  { label: "Total Spend", value: "₦650K" },
                  { label: "Registration", value: "Nov 05, 2023" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <AlertTriangle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No recent vendor activity",
              action: {
                label: "Register Vendor",
                onClick: () => success("Starting vendor registration...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}