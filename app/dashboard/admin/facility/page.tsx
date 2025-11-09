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
  Building,
  Thermometer,
  Gauge,
  Shield,
  Wrench,
  Plus,
  Eye,
  Edit,
  Download,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

// Sample data for facility management
const facilityStats = [
  {
    title: "Total Facilities",
    value: "7",
    description: "Active locations",
    icon: <Building className="h-8 w-8" />
  },
  {
    title: "LPG Storage Capacity",
    value: "15,000",
    description: "Metric tons",
    icon: <Gauge className="h-8 w-8" />
  },
  {
    title: "Safety Incidents",
    value: "0",
    description: "This month",
    trend: { value: "0%", isPositive: true },
    icon: <Shield className="h-8 w-8" />
  },
  {
    title: "Maintenance Due",
    value: "3",
    description: "This week",
    icon: <Wrench className="h-8 w-8" />
  }
];

const facilitiesData = [
  {
    id: "FAC-001",
    facilityCode: "FAC-001",
    facilityName: "Lagos Main Terminal",
    location: "Apapa, Lagos State",
    facilityType: "Storage Terminal",
    capacity: 5000,
    currentStock: 4200,
    status: "operational",
    lastInspection: "2024-01-10",
    nextMaintenance: "2024-02-01",
    manager: "Adamu Yakubu",
    safetyRating: "A",
    operatingHours: "24/7",
    emergencyContact: "+234-803-123-4567"
  },
  {
    id: "FAC-002",
    facilityCode: "FAC-002",
    facilityName: "Kano Distribution Center",
    location: "Bompai, Kano State",
    facilityType: "Distribution Hub",
    capacity: 2500,
    currentStock: 1800,
    status: "operational",
    lastInspection: "2024-01-08",
    nextMaintenance: "2024-01-25",
    manager: "Kemi Adebayo",
    safetyRating: "A",
    operatingHours: "6:00 AM - 10:00 PM",
    emergencyContact: "+234-806-987-6543"
  },
  {
    id: "FAC-003",
    facilityCode: "FAC-003",
    facilityName: "Port Harcourt Depot",
    location: "Trans Amadi, Port Harcourt",
    facilityType: "Storage Depot",
    capacity: 3500,
    currentStock: 2900,
    status: "operational",
    lastInspection: "2024-01-12",
    nextMaintenance: "2024-02-10",
    manager: "Ibrahim Mohammed",
    safetyRating: "B+",
    operatingHours: "24/7",
    emergencyContact: "+234-809-456-7890"
  },
  {
    id: "FAC-004",
    facilityCode: "FAC-004",
    facilityName: "Abuja Regional Office",
    location: "Garki, FCT Abuja",
    facilityType: "Administrative",
    capacity: 0,
    currentStock: 0,
    status: "operational",
    lastInspection: "2024-01-05",
    nextMaintenance: "2024-01-30",
    manager: "Grace Okonkwo",
    safetyRating: "A",
    operatingHours: "8:00 AM - 6:00 PM",
    emergencyContact: "+234-812-345-6789"
  },
  {
    id: "FAC-005",
    facilityCode: "FAC-005",
    facilityName: "Kaduna Storage Facility",
    location: "Rigasa, Kaduna State",
    facilityType: "Storage Terminal",
    capacity: 2000,
    currentStock: 1200,
    status: "maintenance",
    lastInspection: "2024-01-15",
    nextMaintenance: "2024-01-20",
    manager: "Musa Abdullahi",
    safetyRating: "B",
    operatingHours: "Closed for maintenance",
    emergencyContact: "+234-815-678-9012"
  }
];

const facilityTypes = [
  "Storage Terminal",
  "Distribution Hub",
  "Storage Depot",
  "Administrative",
  "Retail Outlet",
  "Service Center"
];

const safetyRatings = ["A+", "A", "A-", "B+", "B", "B-", "C", "D"];
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const tableColumns: TableColumn[] = [
  {
    id: "facilityCode",
    header: "Facility Code",
    accessorKey: "facilityCode",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.facilityCode}
      </div>
    )
  },
  {
    id: "facilityName",
    header: "Facility Details",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.facilityName}</div>
        <div className="text-sm text-gray-500 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {row.location}
        </div>
      </div>
    )
  },
  {
    id: "facilityType",
    header: "Type",
    accessorKey: "facilityType",
    sortable: true,
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.facilityType === 'Storage Terminal' ? 'approved' :
        row.facilityType === 'Distribution Hub' ? 'pending' : 'rejected'
      )}>
        {row.facilityType}
      </span>
    )
  },
  {
    id: "capacity",
    header: "Capacity/Stock",
    cell: (row) => (
      <div className="text-sm">
        {row.capacity > 0 ? (
          <>
            <div className="font-medium">{row.capacity.toLocaleString()} MT</div>
            <div className="text-gray-500">Stock: {row.currentStock.toLocaleString()} MT</div>
          </>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </div>
    )
  },
  {
    id: "manager",
    header: "Manager",
    accessorKey: "manager",
    sortable: true,
    cell: (row) => (
      <div>
        <div className="font-medium">{row.manager}</div>
        <div className="text-sm text-gray-500">Safety: {row.safetyRating}</div>
      </div>
    )
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'operational' ? 'default' :
          row.status === 'maintenance' ? 'secondary' : 'destructive'
        }
      />
    )
  },
  {
    id: "nextMaintenance",
    header: "Next Maintenance",
    cell: (row) => <DateCell date={row.nextMaintenance} />
  }
];

export default function FacilityPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedFacilities, setSelectedFacilities] = React.useState<string[]>([]);

  // Form validation for new facility
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      facilityName: '',
      location: '',
      state: '',
      facilityType: '',
      capacity: '',
      manager: '',
      operatingHours: '',
      emergencyContact: '',
      address: '',
      description: ''
    },
    {
      facilityName: validationRules.required,
      location: validationRules.required,
      state: validationRules.required,
      facilityType: validationRules.required,
      manager: validationRules.required,
      emergencyContact: validationRules.required,
      address: validationRules.required
    }
  );

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Facility registered successfully and added to management system!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkInspection = () => {
    if (selectedFacilities.length === 0) {
      error("Please select facilities to schedule inspection");
      return;
    }
    success(`Inspection scheduled for ${selectedFacilities.length} facility(ies)`);
    setSelectedFacilities([]);
  };

  const handleExport = () => {
    success("Facility report exported to PDF");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Facility Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage LPG storage facilities, terminals, and distribution centers
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {facilityStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="All Facilities"
            description="Comprehensive facility management and monitoring system"
            searchPlaceholder="Search by facility name, code, or location..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Facility data refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedFacilities.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkInspection}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Inspection ({selectedFacilities.length})
                    </Button>
                    <Button variant="outline" onClick={() => success("Maintenance scheduled")}>
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                )}
                <FormModal
                  title="Register New Facility"
                  description="Add a new facility to the management system"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Facility
                    </Button>
                  }
                  onSubmit={handleCreateFacility}
                  submitLabel="Register Facility"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Facility Name" required error={errors.facilityName}>
                      <Input
                        value={values.facilityName}
                        onChange={(e) => setValue('facilityName', e.target.value)}
                        placeholder="Enter facility name"
                      />
                    </FormField>

                    <FormField label="Facility Type" required error={errors.facilityType}>
                      <Select value={values.facilityType} onValueChange={(value) => setValue('facilityType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Complete Address" required error={errors.address}>
                    <Textarea
                      value={values.address}
                      onChange={(e) => setValue('address', e.target.value)}
                      placeholder="Complete facility address"
                      rows={2}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="City/Location" required error={errors.location}>
                      <Input
                        value={values.location}
                        onChange={(e) => setValue('location', e.target.value)}
                        placeholder="City or specific location"
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
                    <FormField label="Storage Capacity (MT)" error={errors.capacity}>
                      <Input
                        type="number"
                        value={values.capacity}
                        onChange={(e) => setValue('capacity', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </FormField>

                    <FormField label="Facility Manager" required error={errors.manager}>
                      <Input
                        value={values.manager}
                        onChange={(e) => setValue('manager', e.target.value)}
                        placeholder="Manager name"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Operating Hours">
                      <Input
                        value={values.operatingHours}
                        onChange={(e) => setValue('operatingHours', e.target.value)}
                        placeholder="e.g., 24/7 or 8:00 AM - 6:00 PM"
                      />
                    </FormField>

                    <FormField label="Emergency Contact" required error={errors.emergencyContact}>
                      <Input
                        value={values.emergencyContact}
                        onChange={(e) => setValue('emergencyContact', e.target.value)}
                        placeholder="+234-XXX-XXX-XXXX"
                      />
                    </FormField>
                  </div>

                  <FormField label="Additional Information">
                    <Textarea
                      value={values.description}
                      onChange={(e) => setValue('description', e.target.value)}
                      placeholder="Additional details about the facility"
                      rows={3}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Facilities Table */}
          <DataTable
            data={facilitiesData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: facilitiesData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "facilityName",
              direction: "asc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedFacilities,
              onRowSelect: (id) => {
                setSelectedFacilities(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedFacilities(prev =>
                  prev.length === facilitiesData.length
                    ? []
                    : facilitiesData.map(facility => facility.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View Details",
                      onClick: () => success(`Viewing ${row.facilityName} details`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.facilityName}`),
                      variant: "outline"
                    },
                    {
                      label: "Inspection",
                      onClick: () => success(`Scheduling inspection for ${row.facilityName}`),
                      variant: "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedFacilities.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkInspection}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Inspect
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Maintenance scheduled")}>
                    <Wrench className="h-4 w-4 mr-1" />
                    Maintain
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Report exported")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No facilities found",
              action: (
                <Button onClick={() => success("Adding first facility...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Facility
                </Button>
              )
            }}
          />
        </section>

        {/* Recent Activity and Alerts */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Facility Alerts & Updates</h2>

          <ListCard
            title="Recent Activity"
            items={[
              {
                id: "1",
                title: "FAC-005 - Kaduna Storage Facility",
                description: "Scheduled maintenance in progress • Manager: Musa Abdullahi",
                status: { label: "Maintenance", variant: "secondary" },
                metadata: [
                  { label: "Capacity", value: "2,000 MT" },
                  { label: "Expected Completion", value: "Jan 20, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Wrench className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "FAC-001 - Lagos Main Terminal",
                description: "Safety inspection completed • Rating: A • All systems operational",
                status: { label: "Operational", variant: "default" },
                metadata: [
                  { label: "Capacity", value: "5,000 MT" },
                  { label: "Current Stock", value: "4,200 MT (84%)" }
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
                title: "FAC-003 - Port Harcourt Depot",
                description: "Maintenance due soon • Safety Rating: B+ • Stock level: 83%",
                status: { label: "Maintenance Due", variant: "secondary" },
                metadata: [
                  { label: "Due Date", value: "Feb 10, 2024" },
                  { label: "Priority", value: "Medium" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No recent facility activity",
              action: {
                label: "Schedule Inspection",
                onClick: () => success("Scheduling facility inspection...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}