"use client";

import React from "react";
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
  FileEdit,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
} from "lucide-react";

// Sample data for memos
const memoStats = [
  {
    title: "Total Memos",
    value: "156",
    description: "All time",
    icon: <FileEdit className="h-8 w-8" />
  },
  {
    title: "Pending Approval",
    value: "8",
    description: "Awaiting review",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved This Month",
    value: "23",
    description: "Current month",
    trend: { value: "+12%", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Urgent Memos",
    value: "3",
    description: "High priority",
    icon: <AlertTriangle className="h-8 w-8" />
  }
];

const memosData = [
  {
    id: "MEM-2024-001",
    memoNumber: "MEM-2024-001",
    subject: "Office Policy Update - Remote Work Guidelines",
    recipient: "All Staff",
    department: "HR",
    priority: "high",
    status: "approved",
    requestedBy: "Khadija Yusuf",
    date: "2024-01-15",
    dueDate: "2024-01-20",
    approvedBy: "Musa Garba"
  },
  {
    id: "MEM-2024-002",
    memoNumber: "MEM-2024-002",
    subject: "Budget Allocation for Q2 2024 Operations",
    recipient: "Finance Team",
    department: "Finance",
    priority: "medium",
    status: "pending",
    requestedBy: "Emeka Okafor",
    date: "2024-01-12",
    dueDate: "2024-01-25"
  },
  {
    id: "MEM-2024-003",
    memoNumber: "MEM-2024-003",
    subject: "Safety Protocol Enhancement - LPG Handling",
    recipient: "Operations Team",
    department: "Operations",
    priority: "high",
    status: "approved",
    requestedBy: "Ahmed Mohammed",
    date: "2024-01-10",
    dueDate: "2024-01-15",
    approvedBy: "Musa Garba"
  },
  {
    id: "MEM-2024-004",
    memoNumber: "MEM-2024-004",
    subject: "Procurement Guidelines Update",
    recipient: "Procurement Department",
    department: "Procurement",
    priority: "medium",
    status: "draft",
    requestedBy: "Grace Adebayo",
    date: "2024-01-08",
    dueDate: "2024-01-18"
  },
  {
    id: "MEM-2024-005",
    memoNumber: "MEM-2024-005",
    subject: "Vehicle Maintenance Schedule Changes",
    recipient: "Logistics Team",
    department: "Operations",
    priority: "low",
    status: "rejected",
    requestedBy: "Ibrahim Usman",
    date: "2024-01-05",
    dueDate: "2024-01-12"
  }
];

const departments = ["HR", "Finance", "Operations", "Procurement", "Admin", "Trading", "Logistics"];
const priorities = ["low", "medium", "high", "urgent"];
const recipients = [
  "All Staff",
  "Finance Team",
  "Operations Team",
  "Procurement Department",
  "HR Department",
  "Management Team",
  "Specific Employee"
];

const tableColumns: TableColumn[] = [
  {
    id: "memoNumber",
    header: "Memo Number",
    accessorKey: "memoNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.memoNumber}
      </div>
    )
  },
  {
    id: "subject",
    header: "Subject",
    cell: (row) => (
      <div className="max-w-xs truncate" title={row.subject}>
        {row.subject}
      </div>
    )
  },
  {
    id: "recipient",
    header: "Recipient",
    accessorKey: "recipient",
    sortable: true
  },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    sortable: true
  },
  {
    id: "priority",
    header: "Priority",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.priority === 'urgent' || row.priority === 'high' ? 'rejected' :
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
          row.status === 'approved' ? 'default' :
          row.status === 'pending' ? 'secondary' :
          row.status === 'rejected' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "date",
    header: "Date Created",
    cell: (row) => <DateCell date={row.date} />
  }
];

export default function MemoRequestPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedMemos, setSelectedMemos] = React.useState<string[]>([]);

  // Form validation for new memo
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      subject: '',
      recipient: '',
      department: '',
      priority: 'medium',
      dueDate: '',
      content: '',
      cc: ''
    },
    {
      subject: validationRules.required,
      recipient: validationRules.required,
      department: validationRules.required,
      content: validationRules.required,
      dueDate: validationRules.required
    }
  );

  const handleCreateMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Memo created successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields");
    }
  };

  const handleBulkApprove = () => {
    if (selectedMemos.length === 0) {
      error("Please select memos to approve");
      return;
    }
    success(`${selectedMemos.length} memo(s) approved`);
    setSelectedMemos([]);
  };

  const handleExport = () => {
    success("Memos exported to PDF");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Memo Requests</h1>
        <p className={designSystem.getBody("small")}>
          Create, send, and manage official memos and communications
        </p>
      </div>

      {/* Stats Cards */}
      <div className={designSystem.getGrid("cols4")}>
        {memoStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Filters */}
      <section className="space-y-4">
        <DataTableHeader
          title="All Memos"
          description="Complete list of memos and official communications"
          searchPlaceholder="Search by memo number, subject, or recipient..."
          onSearch={(value) => console.log("Search:", value)}
          onRefresh={() => success("Memos refreshed")}
          onExport={handleExport}
          actions={
            <div className="flex space-x-2">
              {selectedMemos.length > 0 && (
                <Button variant="outline" onClick={handleBulkApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Selected ({selectedMemos.length})
                </Button>
              )}
              <FormModal
                title="Create New Memo"
                description="Create a new official memo or communication"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Memo
                  </Button>
                }
                onSubmit={handleCreateMemo}
                submitLabel="Send Memo"
                size="lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Subject" required error={errors.subject}>
                    <Input
                      value={values.subject}
                      onChange={(e) => setValue('subject', e.target.value)}
                      placeholder="Enter memo subject"
                    />
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Recipient" required error={errors.recipient}>
                    <Select value={values.recipient} onValueChange={(value) => setValue('recipient', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipients.map((recipient) => (
                          <SelectItem key={recipient} value={recipient}>
                            {recipient}
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

                <FormField label="CC (Optional)">
                  <Input
                    value={values.cc}
                    onChange={(e) => setValue('cc', e.target.value)}
                    placeholder="Copy other recipients (comma separated)"
                  />
                </FormField>

                <FormField label="Due Date" required error={errors.dueDate}>
                  <Input
                    type="date"
                    value={values.dueDate}
                    onChange={(e) => setValue('dueDate', e.target.value)}
                  />
                </FormField>

                <FormField label="Memo Content" required error={errors.content}>
                  <Textarea
                    value={values.content}
                    onChange={(e) => setValue('content', e.target.value)}
                    placeholder="Write the memo content here..."
                    rows={6}
                  />
                </FormField>
              </FormModal>
            </div>
          }
        />

        {/* Memos Table */}
        <DataTable
          data={memosData}
          columns={tableColumns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: memosData.length,
            onPageChange: (page) => console.log("Page:", page),
            onPageSizeChange: (size) => console.log("Page size:", size)
          }}
          sorting={{
            column: "date",
            direction: "desc",
            onSortChange: (column, direction) => console.log("Sort:", column, direction)
          }}
          selection={{
            selectedRows: selectedMemos,
            onRowSelect: (id) => {
              setSelectedMemos(prev =>
                prev.includes(id)
                  ? prev.filter(item => item !== id)
                  : [...prev, id]
              );
            },
            onSelectAll: () => {
              setSelectedMemos(prev =>
                prev.length === memosData.length
                  ? []
                  : memosData.map(memo => memo.id)
              );
            }
          }}
          actions={{
            row: (row) => (
              <ActionCell
                actions={[
                  {
                    label: "View",
                    onClick: () => success(`Viewing ${row.memoNumber}`),
                    variant: "outline"
                  },
                  {
                    label: "Edit",
                    onClick: () => success(`Editing ${row.memoNumber}`),
                    variant: "outline"
                  }
                ]}
              />
            ),
            bulk: selectedMemos.length > 0 ? (
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
            message: "No memos found",
            action: (
              <Button onClick={() => success("Creating first memo...")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Memo
              </Button>
            )
          }}
        />
      </section>

      {/* Recent Activity Summary */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h3")}>Recent Memo Activity</h2>

        <ListCard
          title="Latest Updates"
          items={[
            {
              id: "1",
              title: "MEM-2024-001 - Office Policy Update",
              description: "Approved by Musa Garba • HR Department • High Priority",
              status: { label: "Approved", variant: "default" },
              metadata: [
                { label: "Recipient", value: "All Staff" },
                { label: "Due", value: "Jan 20, 2024" }
              ],
              actions: (
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              )
            },
            {
              id: "2",
              title: "MEM-2024-002 - Budget Allocation Q2 2024",
              description: "Pending approval • Finance Department • Medium Priority",
              status: { label: "Pending", variant: "secondary" },
              metadata: [
                { label: "Recipient", value: "Finance Team" },
                { label: "Due", value: "Jan 25, 2024" }
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
              label: "Create Memo",
              onClick: () => success("Creating new memo...")
            }
          }}
        />
      </section>
    </div>
  );
}