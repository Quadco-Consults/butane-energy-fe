"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Calculator,
  CreditCard,
  PieChart,
  BarChart3,
  Receipt,
  Wallet,
  Building,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { filterByPlantAccess } from "@/lib/filters";

// Mock Finance Data
const financeStats = {
  totalRevenue: 125750000, // NGN
  totalExpenses: 87250000,
  netProfit: 38500000,
  cashFlow: 12750000,
  pendingPayables: 15250000,
  pendingReceivables: 22100000,
  monthlyBudget: 95000000,
  budgetUtilization: 78, // percentage
  totalAssets: 450000000,
  totalLiabilities: 180000000,
  equity: 270000000,
  currentRatio: 2.3,
  quickRatio: 1.8,
  debtToEquity: 0.67
};

const recentTransactions = [
  {
    id: "TXN-2024-001",
    type: "Purchase Payment",
    description: "LPG Stock Procurement - Shell Nigeria",
    amount: -8750000,
    date: "2024-01-15",
    status: "completed",
    category: "procurement",
    plantId: "plant-lagos-1"
  },
  {
    id: "TXN-2024-002",
    type: "Sales Receipt",
    description: "Bulk LPG Sale - Dangote Industries",
    amount: 15200000,
    date: "2024-01-15",
    status: "completed",
    category: "sales",
    plantId: "plant-lagos-1"
  },
  {
    id: "TXN-2024-003",
    type: "Imprest Disbursement",
    description: "Operations Petty Cash - January 2024",
    amount: -250000,
    date: "2024-01-14",
    status: "pending_approval",
    category: "imprest",
    plantId: "plant-abuja-1"
  },
  {
    id: "TXN-2024-004",
    type: "Salary Payment",
    description: "Staff Salary - December 2023",
    amount: -12500000,
    date: "2024-01-13",
    status: "completed",
    category: "payroll",
    plantId: "plant-lagos-1"
  }
];

const pendingApprovals = [
  {
    id: "FIN-APP-001",
    type: "Purchase Order Payment",
    description: "Equipment Maintenance - Kano Plant",
    amount: 3500000,
    requestedBy: "John Doe",
    department: "Operations",
    priority: "high",
    dueDate: "2024-01-20",
    plantId: "plant-kano-1"
  },
  {
    id: "FIN-APP-002",
    type: "Imprest Request",
    description: "Lagos Operations Imprest - February",
    amount: 500000,
    requestedBy: "Jane Smith",
    department: "Operations",
    priority: "medium",
    dueDate: "2024-01-25",
    plantId: "plant-lagos-1"
  },
  {
    id: "FIN-APP-003",
    type: "Vendor Payment",
    description: "IT Services - Software License Renewal",
    amount: 850000,
    requestedBy: "Mike Johnson",
    department: "Admin",
    priority: "low",
    dueDate: "2024-01-30",
    plantId: "plant-abuja-1"
  }
];

const financeModules = [
  {
    title: "Purchase Process",
    description: "Manage purchase orders, vendor payments, and procurement financials",
    href: "/dashboard/finance/purchase",
    icon: Receipt,
    color: "bg-blue-500",
    stats: { pending: 12, completed: 85, total: 97 }
  },
  {
    title: "Imprest Process",
    description: "Handle cash advances, petty cash, and employee reimbursements",
    href: "/dashboard/finance/imprest",
    icon: Wallet,
    color: "bg-green-500",
    stats: { pending: 8, approved: 45, total: 53 }
  },
  {
    title: "Profit & Loss",
    description: "Generate P&L statements and analyze profitability",
    href: "/dashboard/finance/profit-loss",
    icon: TrendingUp,
    color: "bg-purple-500",
    stats: { currentMonth: 38500000, lastMonth: 42100000, variance: -8.5 }
  },
  {
    title: "Balance Sheet",
    description: "Generate balance sheets and financial position reports",
    href: "/dashboard/finance/balance-sheet",
    icon: BarChart3,
    color: "bg-orange-500",
    stats: { assets: 450000000, liabilities: 180000000, equity: 270000000 }
  },
  {
    title: "Trial Balance",
    description: "Generate trial balance and account reconciliation reports",
    href: "/dashboard/finance/trial-balance",
    icon: Calculator,
    color: "bg-cyan-500",
    stats: { accounts: 156, balanced: true, lastUpdated: "2024-01-15" }
  },
  {
    title: "Accounts Payable/Receivable",
    description: "Manage payables, receivables, and debt collection",
    href: "/dashboard/finance/accounts",
    icon: CreditCard,
    color: "bg-red-500",
    stats: { payables: 15250000, receivables: 22100000, overdue: 3 }
  },
  {
    title: "Financial Reports",
    description: "Comprehensive financial reporting and analytics",
    href: "/dashboard/finance/reports",
    icon: FileText,
    color: "bg-indigo-500",
    stats: { reports: 24, automated: 18, scheduled: 6 }
  }
];

export default function FinancePage() {
  const { user } = useAuth();

  if (!user) return null;

  // Filter data based on user's plant access
  const filteredTransactions = filterByPlantAccess(recentTransactions, user);
  const filteredApprovals = filterByPlantAccess(pendingApprovals, user);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Purchase Payment': return Receipt;
      case 'Sales Receipt': return DollarSign;
      case 'Imprest Disbursement': return Wallet;
      case 'Salary Payment': return CreditCard;
      default: return FileText;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Finance Department</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive financial management and reporting for Butane Energy operations
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financeStats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financeStats.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              30.6% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(financeStats.cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              Positive cash position
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financeStats.budgetUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(financeStats.monthlyBudget)} monthly budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Finance Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {financeModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                    <IconComponent className={`h-6 w-6 ${module.color.replace('bg-', 'text-')}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {module.title.includes('Balance') ? 'Reports' :
                     module.title.includes('Process') ? 'Operations' : 'Analytics'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {module.title === 'Purchase Process' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium">{module.stats.pending}</span>
                    </div>
                  )}
                  {module.title === 'Imprest Process' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Approved:</span>
                      <span className="font-medium">{module.stats.approved}</span>
                    </div>
                  )}
                  {module.title === 'Profit & Loss' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Net Profit:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(module.stats.currentMonth)}
                      </span>
                    </div>
                  )}
                  {module.title === 'Balance Sheet' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Assets:</span>
                      <span className="font-medium">
                        {formatCurrency(module.stats.assets)}
                      </span>
                    </div>
                  )}
                  {module.title === 'Trial Balance' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accounts:</span>
                      <span className="font-medium">{module.stats.accounts}</span>
                    </div>
                  )}
                  {module.title === 'Accounts Payable/Receivable' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receivables:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(module.stats.receivables)}
                      </span>
                    </div>
                  )}
                  {module.title === 'Financial Reports' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reports:</span>
                      <span className="font-medium">{module.stats.reports}</span>
                    </div>
                  )}
                </div>
                <Button asChild className="w-full">
                  <Link href={module.href}>
                    Access {module.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions & Pending Approvals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest financial transactions across all plants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.slice(0, 5).map((transaction) => {
                const IconComponent = getTransactionIcon(transaction.type);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <IconComponent className={`h-4 w-4 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {transaction.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Financial requests requiring approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <div key={approval.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{approval.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested by {approval.requestedBy} • {approval.department}
                      </p>
                    </div>
                    <Badge variant={getPriorityColor(approval.priority)} className="text-xs">
                      {approval.priority.replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-600">
                      {formatCurrency(approval.amount)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Due: {approval.dueDate}</span>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Approvals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Financial Health Indicators
          </CardTitle>
          <CardDescription>Key financial ratios and health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{financeStats.currentRatio}</div>
              <p className="text-sm text-muted-foreground">Current Ratio</p>
              <p className="text-xs text-green-600">Healthy</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{financeStats.quickRatio}</div>
              <p className="text-sm text-muted-foreground">Quick Ratio</p>
              <p className="text-xs text-green-600">Good Liquidity</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{financeStats.debtToEquity}</div>
              <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
              <p className="text-xs text-blue-600">Conservative</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">30.6%</div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="text-xs text-purple-600">Strong</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}