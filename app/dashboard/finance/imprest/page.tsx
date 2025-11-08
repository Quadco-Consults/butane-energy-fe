"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  User,
  Building2,
  Calendar,
  Receipt,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { useState } from "react";
import { filterByPlantAccess } from "@/lib/filters";

// Mock Imprest Data
const imprestAccounts = [
  {
    id: "IMP-ACC-001",
    accountName: "Operations Petty Cash - Lagos",
    accountHolder: "Operations Manager",
    currentBalance: 850000,
    allocatedAmount: 1000000,
    plantId: "plant-lagos-1",
    department: "Operations",
    lastReimbursed: "2024-01-10",
    status: "active",
    purpose: "Daily operational expenses",
    approvedBy: "Plant Manager"
  },
  {
    id: "IMP-ACC-002",
    accountName: "Admin Imprest - Kano",
    accountHolder: "Admin Officer",
    currentBalance: 320000,
    allocatedAmount: 500000,
    plantId: "plant-kano-1",
    department: "Admin",
    lastReimbursed: "2024-01-08",
    status: "low_balance",
    purpose: "Office supplies and maintenance",
    approvedBy: "Plant Manager"
  },
  {
    id: "IMP-ACC-003",
    accountName: "Logistics Travel Fund - Abuja",
    accountHolder: "Logistics Coordinator",
    currentBalance: 150000,
    allocatedAmount: 750000,
    plantId: "plant-abuja-1",
    department: "Logistics",
    lastReimbursed: "2024-01-12",
    status: "critical_low",
    purpose: "Travel and transportation expenses",
    approvedBy: "Regional Manager"
  },
  {
    id: "IMP-ACC-004",
    accountName: "HR Activities Fund - Lagos",
    accountHolder: "HR Manager",
    currentBalance: 680000,
    allocatedAmount: 800000,
    plantId: "plant-lagos-1",
    department: "HR",
    lastReimbursed: "2024-01-05",
    status: "active",
    purpose: "Staff welfare and training",
    approvedBy: "General Manager"
  }
];

const imprestRequests = [
  {
    id: "REQ-2024-001",
    requestType: "New Imprest",
    requesterName: "John Smith",
    department: "Operations",
    plantId: "plant-lagos-1",
    requestedAmount: 500000,
    purpose: "Emergency repairs and maintenance",
    requestDate: "2024-01-14",
    approvalDate: null,
    status: "pending_approval",
    priority: "high",
    approver: "Plant Manager",
    justification: "Urgent equipment repairs needed to maintain operations",
    expectedDuration: "30 days",
    supportingDocuments: ["maintenance_quotes.pdf", "breakdown_report.pdf"]
  },
  {
    id: "REQ-2024-002",
    requestType: "Reimbursement",
    requesterName: "Jane Doe",
    department: "Admin",
    plantId: "plant-kano-1",
    requestedAmount: 180000,
    purpose: "Office supplies and utilities payment",
    requestDate: "2024-01-13",
    approvalDate: "2024-01-14",
    status: "approved",
    priority: "medium",
    approver: "Plant Manager",
    justification: "Monthly replenishment of admin imprest account",
    expectedDuration: "N/A",
    supportingDocuments: ["receipts.pdf", "utility_bills.pdf"]
  },
  {
    id: "REQ-2024-003",
    requestType: "Top-up",
    requesterName: "Mike Johnson",
    department: "Logistics",
    plantId: "plant-abuja-1",
    requestedAmount: 600000,
    purpose: "Travel and logistics operations",
    requestDate: "2024-01-12",
    approvalDate: "2024-01-13",
    status: "disbursed",
    priority: "medium",
    approver: "Regional Manager",
    justification: "Increased travel requirements for Q1 deliveries",
    expectedDuration: "45 days",
    supportingDocuments: ["travel_schedule.pdf", "delivery_plan.pdf"]
  },
  {
    id: "REQ-2024-004",
    requestType: "Reimbursement",
    requesterName: "Sarah Wilson",
    department: "HR",
    plantId: "plant-lagos-1",
    requestedAmount: 120000,
    purpose: "Staff training and welfare activities",
    requestDate: "2024-01-11",
    approvalDate: null,
    status: "under_review",
    priority: "low",
    approver: "General Manager",
    justification: "Training expenses and staff welfare programs",
    expectedDuration: "N/A",
    supportingDocuments: ["training_receipts.pdf", "welfare_expenses.pdf"]
  }
];

const imprestTransactions = [
  {
    id: "TRN-2024-001",
    imprestAccountId: "IMP-ACC-001",
    type: "disbursement",
    amount: 150000,
    description: "Emergency maintenance supplies",
    transactionDate: "2024-01-15",
    processedBy: "Finance Officer",
    approvedBy: "Operations Manager",
    plantId: "plant-lagos-1",
    category: "Maintenance",
    receipts: ["receipt_001.pdf", "receipt_002.pdf"],
    balance: 850000
  },
  {
    id: "TRN-2024-002",
    imprestAccountId: "IMP-ACC-002",
    type: "reimbursement",
    amount: 180000,
    description: "Admin imprest reimbursement",
    transactionDate: "2024-01-14",
    processedBy: "Senior Finance Officer",
    approvedBy: "Plant Manager",
    plantId: "plant-kano-1",
    category: "Reimbursement",
    receipts: ["reimbursement_receipt.pdf"],
    balance: 500000
  },
  {
    id: "TRN-2024-003",
    imprestAccountId: "IMP-ACC-003",
    type: "disbursement",
    amount: 75000,
    description: "Fuel for delivery trucks",
    transactionDate: "2024-01-13",
    processedBy: "Finance Officer",
    approvedBy: "Logistics Coordinator",
    plantId: "plant-abuja-1",
    category: "Transportation",
    receipts: ["fuel_receipt.pdf"],
    balance: 675000
  },
  {
    id: "TRN-2024-004",
    imprestAccountId: "IMP-ACC-001",
    type: "disbursement",
    amount: 45000,
    description: "Office cleaning supplies",
    transactionDate: "2024-01-12",
    processedBy: "Finance Officer",
    approvedBy: "Operations Manager",
    plantId: "plant-lagos-1",
    category: "Maintenance",
    receipts: ["cleaning_receipt.pdf"],
    balance: 1000000
  }
];

export default function ImprestProcessPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!user) return null;

  // Filter data based on user's plant access
  const filteredImprestAccounts = filterByPlantAccess(imprestAccounts, user);
  const filteredImprestRequests = filterByPlantAccess(imprestRequests, user);
  const filteredImprestTransactions = filterByPlantAccess(imprestTransactions, user);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'low_balance': return 'secondary';
      case 'critical_low': return 'destructive';
      case 'pending_approval': return 'secondary';
      case 'approved': return 'default';
      case 'disbursed': return 'default';
      case 'under_review': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'disbursed': return CheckCircle;
      case 'pending_approval':
      case 'under_review': return Clock;
      case 'low_balance':
      case 'critical_low': return AlertCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getBalancePercentage = (current: number, allocated: number) => {
    return Math.round((current / allocated) * 100);
  };

  const getBalanceStatus = (current: number, allocated: number) => {
    const percentage = getBalancePercentage(current, allocated);
    if (percentage <= 20) return 'critical_low';
    if (percentage <= 40) return 'low_balance';
    return 'active';
  };

  const filteredRequests = filteredImprestRequests.filter(request => {
    const matchesSearch = request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalAccounts: filteredImprestAccounts.length,
    activeAccounts: filteredImprestAccounts.filter(acc => acc.status === 'active').length,
    lowBalanceAccounts: filteredImprestAccounts.filter(acc => acc.status === 'low_balance' || acc.status === 'critical_low').length,
    totalAllocated: filteredImprestAccounts.reduce((sum, acc) => sum + acc.allocatedAmount, 0),
    totalBalance: filteredImprestAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0),
    pendingRequests: filteredImprestRequests.filter(req => req.status === 'pending_approval').length,
    monthlyDisbursements: filteredImprestTransactions.filter(t => t.type === 'disbursement').reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Imprest Process</h1>
        <p className="text-muted-foreground mt-2">
          Handle cash advances, petty cash, and employee reimbursements
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAccounts} active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalAllocated)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all imprest accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.totalBalance/stats.totalAllocated)*100)}% of allocated amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search requests, accounts, or staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Statuses</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="disbursed">Disbursed</option>
          <option value="under_review">Under Review</option>
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Imprest Accounts</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Imprest Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4">
            {filteredImprestAccounts.map((account) => {
              const StatusIcon = getStatusIcon(account.status);
              const balancePercentage = getBalancePercentage(account.currentBalance, account.allocatedAmount);
              const balanceStatus = getBalanceStatus(account.currentBalance, account.allocatedAmount);

              return (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{account.accountName}</CardTitle>
                        <CardDescription>Held by: {account.accountHolder}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(account.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {account.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{account.purpose}</p>

                      {/* Balance Information */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Current Balance</p>
                          <p className="font-bold text-lg text-green-600">{formatCurrency(account.currentBalance)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Allocated Amount</p>
                          <p className="text-sm font-medium">{formatCurrency(account.allocatedAmount)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Utilization</p>
                          <p className="text-sm font-medium">{balancePercentage}% remaining</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Last Reimbursed</p>
                          <p className="text-sm font-medium">{account.lastReimbursed}</p>
                        </div>
                      </div>

                      {/* Balance Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Balance Status</span>
                          <span className="text-sm font-medium">{balancePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              balanceStatus === 'critical_low' ? 'bg-red-500' :
                              balanceStatus === 'low_balance' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${balancePercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>Plant: {account.plantId.split('-')[1].toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Department: {account.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          <span>Approved by: {account.approvedBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Account ID: {account.id}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Transactions
                          </Button>
                          {balanceStatus !== 'active' && (
                            <Button size="sm">
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Request Top-up
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4">
            {filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{request.id}</CardTitle>
                        <CardDescription>{request.requesterName} • {request.department}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority.replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <Badge variant={getStatusColor(request.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{request.justification}</p>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Request Type</p>
                          <Badge variant="outline">{request.requestType}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-bold text-lg text-green-600">{formatCurrency(request.requestedAmount)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Request Date</p>
                          <p className="text-sm font-medium">{request.requestDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Expected Duration</p>
                          <p className="text-sm font-medium">{request.expectedDuration}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Purpose</p>
                        <p className="text-sm font-medium">{request.purpose}</p>
                      </div>

                      {request.supportingDocuments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Supporting Documents</p>
                          <div className="flex gap-2 flex-wrap">
                            {request.supportingDocuments.map((doc, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>Plant: {request.plantId.split('-')[1].toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Approver: {request.approver}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {request.approvalDate && (
                            <span>Approved on: {request.approvalDate}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {request.status === 'pending_approval' && (
                            <>
                              <Button variant="outline" size="sm">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button size="sm">
                              <ArrowDownLeft className="h-4 w-4 mr-2" />
                              Disburse
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4">
            {filteredImprestTransactions.map((transaction) => {
              const isIncoming = transaction.type === 'reimbursement';
              return (
                <Card key={transaction.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {isIncoming ?
                            <ArrowDownLeft className="h-5 w-5 text-green-500" /> :
                            <ArrowUpRight className="h-5 w-5 text-red-500" />
                          }
                          {transaction.id}
                        </CardTitle>
                        <CardDescription>{transaction.description}</CardDescription>
                      </div>
                      <Badge variant={isIncoming ? 'default' : 'secondary'}>
                        {transaction.type.replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className={`font-bold text-lg ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">{transaction.transactionDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Category</p>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Balance After</p>
                          <p className="text-sm font-medium">{formatCurrency(transaction.balance)}</p>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Processed by: {transaction.processedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          <span>Approved by: {transaction.approvedBy}</span>
                        </div>
                      </div>

                      {transaction.receipts.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Receipts/Documents</p>
                          <div className="flex gap-2 flex-wrap">
                            {transaction.receipts.map((receipt, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer">
                                <Receipt className="h-3 w-3 mr-1" />
                                {receipt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Account: {transaction.imprestAccountId}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Department-wise Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Imprest Usage</CardTitle>
                <CardDescription>Current allocation and utilization by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { department: "Operations", allocated: 1000000, used: 150000, accounts: 1 },
                    { department: "HR", allocated: 800000, used: 120000, accounts: 1 },
                    { department: "Logistics", allocated: 750000, used: 600000, accounts: 1 },
                    { department: "Admin", allocated: 500000, used: 180000, accounts: 1 },
                  ].map((dept) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.accounts} account{dept.accounts > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Used: {formatCurrency(dept.used)}</span>
                        <span>Allocated: {formatCurrency(dept.allocated)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((dept.used/dept.allocated)*100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Imprest Activity</CardTitle>
                <CardDescription>Disbursements and reimbursements trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "January 2024", disbursements: 455000, reimbursements: 180000 },
                    { month: "December 2023", disbursements: 320000, reimbursements: 250000 },
                    { month: "November 2023", disbursements: 280000, reimbursements: 180000 },
                  ].map((month) => (
                    <div key={month.month} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{month.month}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Disbursements</p>
                          <p className="font-bold text-red-600">{formatCurrency(month.disbursements)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reimbursements</p>
                          <p className="font-bold text-green-600">{formatCurrency(month.reimbursements)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}