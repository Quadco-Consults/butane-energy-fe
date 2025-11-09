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
  Shield,
  AlertTriangle,
  Search,
  FileText,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Archive
} from "lucide-react";

// Sample data for investigations
const investigationStats = [
  {
    title: "Active Cases",
    value: "12",
    description: "Under investigation",
    icon: <Search className="h-8 w-8" />
  },
  {
    title: "High Priority",
    value: "3",
    description: "Critical incidents",
    icon: <AlertTriangle className="h-8 w-8" />
  },
  {
    title: "Closed This Month",
    value: "8",
    description: "Resolved cases",
    trend: { value: "+2", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Average Resolution",
    value: "5.2",
    description: "Days per case",
    trend: { value: "-0.8", isPositive: true },
    icon: <Clock className="h-8 w-8" />
  }
];

const investigationsData = [
  {
    id: "INV-2024-001",
    caseNumber: "INV-2024-001",
    title: "LPG Storage Tank Pressure Anomaly",
    category: "Safety Incident",
    priority: "high",
    status: "active",
    reportedBy: "Ahmed Mohammed",
    assignedTo: "Kemi Adebayo",
    dateReported: "2024-01-12",
    dateDue: "2024-01-20",
    location: "Lagos Main Terminal",
    department: "Operations",
    description: "Abnormal pressure readings detected in Tank Bay 2 during routine inspection",
    lastUpdate: "2024-01-15"
  },
  {
    id: "INV-2024-002",
    caseNumber: "INV-2024-002",
    title: "Vehicle Fleet Maintenance Irregularities",
    category: "Compliance Review",
    priority: "medium",
    status: "active",
    reportedBy: "Grace Okonkwo",
    assignedTo: "Ibrahim Mohammed",
    dateReported: "2024-01-10",
    dateDue: "2024-01-25",
    location: "Kano Distribution Center",
    department: "Logistics",
    description: "Discrepancies found in vehicle maintenance records and schedules",
    lastUpdate: "2024-01-14"
  },
  {
    id: "INV-2024-003",
    caseNumber: "INV-2024-003",
    title: "Customer Complaint - Delivery Quality",
    category: "Customer Complaint",
    priority: "medium",
    status: "pending_review",
    reportedBy: "Musa Abdullahi",
    assignedTo: "Fatima Aliyu",
    dateReported: "2024-01-08",
    dateDue: "2024-01-18",
    location: "Port Harcourt Depot",
    department: "Quality Control",
    description: "Customer reported inconsistent LPG purity levels in recent deliveries",
    lastUpdate: "2024-01-12"
  },
  {
    id: "INV-2024-004",
    caseNumber: "INV-2024-004",
    title: "Financial Transaction Audit",
    category: "Financial Audit",
    priority: "high",
    status: "closed",
    reportedBy: "Emeka Okafor",
    assignedTo: "Adamu Yakubu",
    dateReported: "2024-01-05",
    dateDue: "2024-01-15",
    dateResolved: "2024-01-14",
    location: "Abuja Regional Office",
    department: "Finance",
    description: "Routine audit of Q4 2023 financial transactions and records",
    resolution: "All transactions verified and documented according to company policy",
    lastUpdate: "2024-01-14"
  },
  {
    id: "INV-2024-005",
    caseNumber: "INV-2024-005",
    title: "Employee Code of Conduct Violation",
    category: "HR Investigation",
    priority: "low",
    status: "suspended",
    reportedBy: "Khadija Yusuf",
    assignedTo: "Chidi Okonkwo",
    dateReported: "2024-01-03",
    dateDue: "2024-01-20",
    location: "Kaduna Storage Facility",
    department: "HR",
    description: "Alleged violation of company safety protocols by operations staff",
    suspensionReason: "Pending additional evidence collection",
    lastUpdate: "2024-01-10"
  }
];

const investigationCategories = [
  "Safety Incident",
  "Compliance Review",
  "Customer Complaint",
  "Financial Audit",
  "HR Investigation",
  "Security Breach",
  "Quality Control",
  "Environmental Issue"
];

const priorities = ["low", "medium", "high", "critical"];
const departments = [
  "Operations", "Finance", "HR", "Quality Control", "Logistics",
  "Security", "IT", "Environmental", "Compliance", "Management"
];

const facilities = [
  "Lagos Main Terminal",
  "Kano Distribution Center",
  "Port Harcourt Depot",
  "Abuja Regional Office",
  "Kaduna Storage Facility"
];

const tableColumns: TableColumn[] = [
  {
    id: "caseNumber",
    header: "Case #",
    accessorKey: "caseNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.caseNumber}
      </div>
    )
  },
  {
    id: "title",
    header: "Investigation Title",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.title}</div>
        <div className="text-sm text-gray-500">{row.category}</div>
      </div>
    )
  },
  {
    id: "assignedTo",
    header: "Assigned To",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.assignedTo}</div>
        <div className="text-sm text-gray-500">{row.department}</div>
      </div>
    )
  },
  {
    id: "priority",
    header: "Priority",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.priority === 'critical' || row.priority === 'high' ? 'rejected' :
        row.priority === 'medium' ? 'pending' : 'approved'
      )}>
        {row.priority}
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
          row.status === 'closed' ? 'default' :
          row.status === 'active' ? 'secondary' :
          row.status === 'suspended' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "location",
    header: "Location",
    accessorKey: "location",
    sortable: true,
    cell: (row) => (
      <div className="text-sm">{row.location}</div>
    )
  },
  {
    id: "dateDue",
    header: "Due Date",
    cell: (row) => <DateCell date={row.dateDue} />
  }
];

export default function InvestigationsPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedCases, setSelectedCases] = React.useState<string[]>([]);

  // Form validation for new investigation
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      title: '',
      category: '',
      priority: 'medium',
      reportedBy: '',
      assignedTo: '',
      location: '',
      department: '',
      description: '',
      immediateActions: '',
      dateDue: ''
    },
    {
      title: validationRules.required,
      category: validationRules.required,
      reportedBy: validationRules.required,
      assignedTo: validationRules.required,
      location: validationRules.required,
      department: validationRules.required,
      description: validationRules.required,
      dateDue: validationRules.required
    }
  );

  const handleCreateInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Investigation case created successfully and assigned to investigator!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkAssign = () => {
    if (selectedCases.length === 0) {
      error("Please select cases to assign");
      return;
    }
    success(`${selectedCases.length} case(s) reassigned`);
    setSelectedCases([]);
  };

  const handleExport = () => {
    success("Investigation report exported to PDF");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Investigation Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage incident investigations, compliance reviews, and case resolutions
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {investigationStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="Investigation Cases"
            description="Comprehensive investigation case management and tracking system"
            searchPlaceholder="Search by case number, title, or investigator..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Investigation data refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedCases.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkAssign}>
                      <Users className="h-4 w-4 mr-2" />
                      Reassign ({selectedCases.length})
                    </Button>
                    <Button variant="outline" onClick={() => success("Cases updated")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Update Deadline
                    </Button>
                  </div>
                )}
                <FormModal
                  title="Open New Investigation"
                  description="Create a new investigation case"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Investigation
                    </Button>
                  }
                  onSubmit={handleCreateInvestigation}
                  submitLabel="Open Investigation"
                  size="lg"
                >
                  <FormField label="Investigation Title" required error={errors.title}>
                    <Input
                      value={values.title}
                      onChange={(e) => setValue('title', e.target.value)}
                      placeholder="Brief descriptive title of the investigation"
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Category" required error={errors.category}>
                      <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {investigationCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Priority" required>
                      <Select value={values.priority} onValueChange={(value) => setValue('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Reported By" required error={errors.reportedBy}>
                      <Input
                        value={values.reportedBy}
                        onChange={(e) => setValue('reportedBy', e.target.value)}
                        placeholder="Person reporting the incident"
                      />
                    </FormField>

                    <FormField label="Assign To" required error={errors.assignedTo}>
                      <Input
                        value={values.assignedTo}
                        onChange={(e) => setValue('assignedTo', e.target.value)}
                        placeholder="Lead investigator"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Location" required error={errors.location}>
                      <Select value={values.location} onValueChange={(value) => setValue('location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility} value={facility}>
                              {facility}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Department" required error={errors.department}>
                      <Select value={values.department} onValueChange={(value) => setValue('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Investigation Deadline" required error={errors.dateDue}>
                    <Input
                      type="date"
                      value={values.dateDue}
                      onChange={(e) => setValue('dateDue', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Incident Description" required error={errors.description}>
                    <Textarea
                      value={values.description}
                      onChange={(e) => setValue('description', e.target.value)}
                      placeholder="Detailed description of the incident or issue requiring investigation"
                      rows={4}
                    />
                  </FormField>

                  <FormField label="Immediate Actions Taken">
                    <Textarea
                      value={values.immediateActions}
                      onChange={(e) => setValue('immediateActions', e.target.value)}
                      placeholder="Any immediate containment or corrective actions already implemented"
                      rows={3}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Investigations Table */}
          <DataTable
            data={investigationsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: investigationsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "priority",
              direction: "desc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedCases,
              onRowSelect: (id) => {
                setSelectedCases(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedCases(prev =>
                  prev.length === investigationsData.length
                    ? []
                    : investigationsData.map(investigation => investigation.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View Details",
                      onClick: () => success(`Viewing ${row.caseNumber} details`),
                      variant: "outline"
                    },
                    {
                      label: "Update Status",
                      onClick: () => success(`Updating ${row.caseNumber} status`),
                      variant: "outline"
                    },
                    {
                      label: "Add Evidence",
                      onClick: () => success(`Adding evidence to ${row.caseNumber}`),
                      variant: "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedCases.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkAssign}>
                    <Users className="h-4 w-4 mr-1" />
                    Reassign
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Status updated")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Report exported")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No investigation cases found",
              action: (
                <Button onClick={() => success("Opening first investigation...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Open First Investigation
                </Button>
              )
            }}
          />
        </section>

        {/* Recent Activity and Critical Cases */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Investigation Activity</h2>

          <ListCard
            title="High Priority Cases"
            items={[
              {
                id: "1",
                title: "INV-2024-001 - LPG Storage Tank Pressure Anomaly",
                description: "Safety Incident • Ahmed Mohammed → Kemi Adebayo • Lagos Main Terminal",
                status: { label: "Active", variant: "secondary" },
                metadata: [
                  { label: "Priority", value: "High" },
                  { label: "Due", value: "Jan 20, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <AlertTriangle className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "INV-2024-004 - Financial Transaction Audit",
                description: "Financial Audit • Emeka Okafor → Adamu Yakubu • Abuja Regional Office",
                status: { label: "Closed", variant: "default" },
                metadata: [
                  { label: "Priority", value: "High" },
                  { label: "Resolved", value: "Jan 14, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "3",
                title: "INV-2024-005 - Employee Code of Conduct Violation",
                description: "HR Investigation • Khadija Yusuf → Chidi Okonkwo • Kaduna Storage Facility",
                status: { label: "Suspended", variant: "destructive" },
                metadata: [
                  { label: "Priority", value: "Low" },
                  { label: "Reason", value: "Pending evidence" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <XCircle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No high priority cases",
              action: {
                label: "Open Investigation",
                onClick: () => success("Opening new investigation...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}