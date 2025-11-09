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
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  CalendarDays
} from "lucide-react";

// Sample data for leave requests
const leaveRequestStats = [
  {
    title: "Total Requests",
    value: "67",
    description: "All time",
    icon: <Calendar className="h-8 w-8" />
  },
  {
    title: "Pending Approval",
    value: "12",
    description: "Awaiting review",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved This Month",
    value: "18",
    description: "Current month",
    trend: { value: "+15%", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Leave Balance",
    value: "22 days",
    description: "Remaining this year",
    icon: <CalendarDays className="h-8 w-8" />
  }
];

const leaveRequestsData = [
  {
    id: "LR-2024-001",
    requestNumber: "LR-2024-001",
    leaveType: "Annual Leave",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    requestedBy: "Sarah Johnson",
    date: "2024-01-15",
    approvedBy: "Michael Davis"
  },
  {
    id: "LR-2024-002",
    requestNumber: "LR-2024-002",
    leaveType: "Sick Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Medical appointment and recovery",
    status: "pending",
    requestedBy: "Ahmed Hassan",
    date: "2024-01-18"
  },
  {
    id: "LR-2024-003",
    requestNumber: "LR-2024-003",
    leaveType: "Emergency Leave",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    days: 1,
    reason: "Family emergency",
    status: "approved",
    requestedBy: "Grace Adebayo",
    date: "2024-01-24",
    approvedBy: "Michael Davis"
  },
  {
    id: "LR-2024-004",
    requestNumber: "LR-2024-004",
    leaveType: "Annual Leave",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    days: 8,
    reason: "Spring break vacation",
    status: "draft",
    requestedBy: "Lisa Park",
    date: "2024-01-22"
  },
  {
    id: "LR-2024-005",
    requestNumber: "LR-2024-005",
    leaveType: "Maternity Leave",
    startDate: "2024-04-01",
    endDate: "2024-07-01",
    days: 92,
    reason: "Maternity leave",
    status: "rejected",
    requestedBy: "Maria Garcia",
    date: "2024-01-20",
    rejectedBy: "Michael Davis",
    rejectionReason: "Insufficient leave balance - please contact HR"
  }
];

const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Bereavement Leave"];

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
    id: "leaveType",
    header: "Leave Type",
    accessorKey: "leaveType",
    sortable: true,
    cell: (row) => (
      <div className="text-sm font-medium">
        {row.leaveType}
      </div>
    )
  },
  {
    id: "dateRange",
    header: "Date Range",
    cell: (row) => (
      <div className="text-sm">
        <div>{new Date(row.startDate).toLocaleDateString()}</div>
        <div className="text-gray-500">to {new Date(row.endDate).toLocaleDateString()}</div>
      </div>
    )
  },
  {
    id: "days",
    header: "Days",
    cell: (row) => (
      <div className="font-medium">
        {row.days} {row.days === 1 ? 'day' : 'days'}
      </div>
    )
  },
  {
    id: "reason",
    header: "Reason",
    cell: (row) => (
      <div className="max-w-xs truncate" title={row.reason}>
        {row.reason}
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
          row.status === 'approved' ? 'default' :
          row.status === 'pending' ? 'secondary' :
          row.status === 'rejected' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "date",
    header: "Date Requested",
    cell: (row) => <DateCell date={row.date} />
  }
];

export default function LeaveRequestPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedRequests, setSelectedRequests] = React.useState<string[]>([]);

  // Form validation for new leave request
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      emergencyContact: '',
      handoverNotes: ''
    },
    {
      leaveType: validationRules.required,
      startDate: validationRules.required,
      endDate: validationRules.required,
      reason: validationRules.required
    }
  );

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Leave request submitted successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields");
    }
  };

  const handleBulkApprove = () => {
    if (selectedRequests.length === 0) {
      error("Please select leave requests to approve");
      return;
    }
    success(`${selectedRequests.length} leave request(s) approved`);
    setSelectedRequests([]);
  };

  const handleExport = () => {
    success("Leave requests exported to PDF");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Leave Requests</h1>
          <p className={designSystem.getBody("small")}>
            Submit and manage employee leave requests and approvals
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {leaveRequestStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="All Leave Requests"
            description="Submit new requests and track approval status"
            searchPlaceholder="Search by request number, employee, or leave type..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Leave requests refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedRequests.length > 0 && (
                  <Button variant="outline" onClick={handleBulkApprove}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected ({selectedRequests.length})
                  </Button>
                )}
                <FormModal
                  title="New Leave Request"
                  description="Submit a new leave request for approval"
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
                  <FormField label="Leave Type" required error={errors.leaveType}>
                    <Select value={values.leaveType} onValueChange={(value) => setValue('leaveType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date" required error={errors.startDate}>
                      <Input
                        type="date"
                        value={values.startDate}
                        onChange={(e) => setValue('startDate', e.target.value)}
                      />
                    </FormField>

                    <FormField label="End Date" required error={errors.endDate}>
                      <Input
                        type="date"
                        value={values.endDate}
                        onChange={(e) => setValue('endDate', e.target.value)}
                      />
                    </FormField>
                  </div>

                  <FormField label="Reason for Leave" required error={errors.reason}>
                    <Textarea
                      value={values.reason}
                      onChange={(e) => setValue('reason', e.target.value)}
                      placeholder="Please provide a reason for your leave request"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Emergency Contact (Optional)">
                    <Input
                      value={values.emergencyContact}
                      onChange={(e) => setValue('emergencyContact', e.target.value)}
                      placeholder="Emergency contact person and phone number"
                    />
                  </FormField>

                  <FormField label="Handover Notes (Optional)">
                    <Textarea
                      value={values.handoverNotes}
                      onChange={(e) => setValue('handoverNotes', e.target.value)}
                      placeholder="Any work handover notes or instructions for colleagues"
                      rows={4}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Leave Requests Table */}
          <DataTable
            data={leaveRequestsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: leaveRequestsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "date",
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
                  prev.length === leaveRequestsData.length
                    ? []
                    : leaveRequestsData.map(request => request.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View",
                      onClick: () => success(`Viewing ${row.requestNumber}`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.requestNumber}`),
                      variant: "outline",
                      disabled: row.status === 'approved' || row.status === 'rejected'
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
                  <Button variant="outline" size="sm" onClick={() => success("Bulk export started")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No leave requests found",
              action: (
                <Button onClick={() => success("Creating first leave request...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Request
                </Button>
              )
            }}
          />
        </section>

        {/* Recent Activity Summary */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Recent Leave Activity</h2>

          <ListCard
            title="Latest Updates"
            items={[
              {
                id: "1",
                title: "LR-2024-003 - Emergency Leave",
                description: "Approved by Michael Davis • 1 day • Family emergency",
                status: { label: "Approved", variant: "default" },
                metadata: [
                  { label: "Employee", value: "Grace Adebayo" },
                  { label: "Date", value: "Jan 25, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "LR-2024-002 - Sick Leave",
                description: "Pending approval • 3 days • Medical appointment",
                status: { label: "Pending", variant: "secondary" },
                metadata: [
                  { label: "Employee", value: "Ahmed Hassan" },
                  { label: "Dates", value: "Jan 20-22, 2024" }
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
                onClick: () => success("Creating new request...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}