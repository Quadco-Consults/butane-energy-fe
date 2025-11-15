'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload,
  Receipt, Calendar, Clock, CheckCircle, XCircle, AlertTriangle,
  DollarSign, CreditCard, Users, Building, Fuel, Utensils,
  Car, Phone, Zap, Wrench, Calculator, FileText, TrendingDown,
  ArrowUpRight, Activity, Camera, Paperclip, Repeat
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts'

interface Expense {
  id: string
  date: string
  vendor: string
  description: string
  category: string
  account: string
  amount: number
  paymentMethod: 'Cash' | 'Check' | 'Credit Card' | 'Bank Transfer' | 'Mobile Money'
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Rejected'
  receiptUrl?: string
  employeeId?: string
  employeeName?: string
  project?: string
  isReimbursable: boolean
  isBillable: boolean
  customerId?: string
  taxAmount: number
  notes?: string
  approvedBy?: string
  approvedDate?: string
  paidDate?: string
  isRecurring: boolean
  recurringFrequency?: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly'
}

interface Vendor {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  category: string
  paymentTerms: string
  taxId?: string
  status: 'Active' | 'Inactive'
  totalExpenses: number
}

interface ExpenseCategory {
  id: string
  name: string
  description: string
  parentId?: string
  isActive: boolean
  budgetAmount?: number
  spentAmount: number
  accountCode: string
}

const expenses: Expense[] = [
  {
    id: 'EXP001',
    date: '2024-01-16',
    vendor: 'Shell Nigeria',
    description: 'Fuel for delivery trucks',
    category: 'Vehicle Expenses',
    account: '6250 - Vehicle Fuel',
    amount: 85000,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    receiptUrl: '/receipts/exp001.jpg',
    employeeId: 'EMP001',
    employeeName: 'John Adebayo',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 6375,
    notes: 'Fuel for Lagos delivery routes',
    paidDate: '2024-01-16',
    isRecurring: false
  },
  {
    id: 'EXP002',
    date: '2024-01-15',
    vendor: 'Lagos Office Complex',
    description: 'Monthly office rent',
    category: 'Rent & Utilities',
    account: '6210 - Rent Expense',
    amount: 450000,
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    employeeId: 'EMP002',
    employeeName: 'Sarah Okafor',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 0,
    notes: 'Head office rent for January',
    approvedBy: 'Finance Manager',
    approvedDate: '2024-01-15',
    isRecurring: true,
    recurringFrequency: 'Monthly'
  },
  {
    id: 'EXP003',
    date: '2024-01-14',
    vendor: 'PHCN Distribution',
    description: 'Electricity bill - Plant operations',
    category: 'Utilities',
    account: '6220 - Utilities',
    amount: 125000,
    paymentMethod: 'Bank Transfer',
    status: 'Pending Approval',
    employeeId: 'EMP003',
    employeeName: 'Michael Okonkwo',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 0,
    notes: 'December electricity consumption',
    isRecurring: false
  },
  {
    id: 'EXP004',
    date: '2024-01-13',
    vendor: 'Office Supplies Ltd',
    description: 'Stationery and office supplies',
    category: 'Office Supplies',
    account: '6240 - Office Supplies',
    amount: 45000,
    paymentMethod: 'Cash',
    status: 'Paid',
    receiptUrl: '/receipts/exp004.jpg',
    employeeId: 'EMP004',
    employeeName: 'Grace Okoro',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 3375,
    notes: 'Monthly office supplies replenishment',
    paidDate: '2024-01-13',
    isRecurring: false
  },
  {
    id: 'EXP005',
    date: '2024-01-12',
    vendor: 'MTN Nigeria',
    description: 'Corporate mobile phone bills',
    category: 'Telecommunications',
    account: '6230 - Telephone & Internet',
    amount: 75000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    employeeId: 'EMP001',
    employeeName: 'John Adebayo',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 5625,
    notes: 'December mobile bills for all staff',
    paidDate: '2024-01-12',
    isRecurring: true,
    recurringFrequency: 'Monthly'
  },
  {
    id: 'EXP006',
    date: '2024-01-10',
    vendor: 'Auto Repair Services',
    description: 'Truck maintenance and repairs',
    category: 'Vehicle Maintenance',
    account: '6260 - Vehicle Maintenance',
    amount: 180000,
    paymentMethod: 'Check',
    status: 'Approved',
    receiptUrl: '/receipts/exp006.jpg',
    employeeId: 'EMP005',
    employeeName: 'David Okafor',
    isReimbursable: false,
    isBillable: false,
    taxAmount: 13500,
    notes: 'Routine maintenance for truck fleet',
    approvedBy: 'Operations Manager',
    approvedDate: '2024-01-10',
    isRecurring: false
  },
  {
    id: 'EXP007',
    date: '2024-01-08',
    vendor: 'Client Lunch Venue',
    description: 'Business lunch with potential client',
    category: 'Meals & Entertainment',
    account: '6270 - Meals & Entertainment',
    amount: 25000,
    paymentMethod: 'Credit Card',
    status: 'Pending Approval',
    receiptUrl: '/receipts/exp007.jpg',
    employeeId: 'EMP006',
    employeeName: 'Funmi Adebayo',
    isReimbursable: true,
    isBillable: true,
    customerId: 'CUST001',
    taxAmount: 1875,
    notes: 'Lunch meeting with ABC Gas Distribution team',
    isRecurring: false
  }
]

const vendors: Vendor[] = [
  {
    id: 'VEN001',
    name: 'Shell Nigeria',
    email: 'commercial@shell.ng',
    phone: '+234-1-270-2000',
    address: '21A Alhaji Bashir Shittu Avenue, Magodo GRA',
    category: 'Fuel Supplier',
    paymentTerms: 'Net 30',
    taxId: 'TIN-12345678',
    status: 'Active',
    totalExpenses: 850000
  },
  {
    id: 'VEN002',
    name: 'Lagos Office Complex',
    email: 'admin@lagosoffice.com',
    phone: '+234-1-456-7890',
    address: '123 Victoria Island, Lagos',
    category: 'Real Estate',
    paymentTerms: 'Due on Receipt',
    status: 'Active',
    totalExpenses: 1350000
  },
  {
    id: 'VEN003',
    name: 'PHCN Distribution',
    category: 'Utilities',
    paymentTerms: 'Net 15',
    status: 'Active',
    totalExpenses: 375000
  },
  {
    id: 'VEN004',
    name: 'Office Supplies Ltd',
    email: 'sales@officesupplies.ng',
    phone: '+234-803-123-4567',
    category: 'Office Supplies',
    paymentTerms: 'Net 30',
    status: 'Active',
    totalExpenses: 135000
  }
]

const expenseCategories: ExpenseCategory[] = [
  {
    id: 'CAT001',
    name: 'Vehicle Expenses',
    description: 'All vehicle-related costs',
    isActive: true,
    budgetAmount: 500000,
    spentAmount: 265000,
    accountCode: '6250'
  },
  {
    id: 'CAT002',
    name: 'Rent & Utilities',
    description: 'Office rent and utility bills',
    isActive: true,
    budgetAmount: 600000,
    spentAmount: 575000,
    accountCode: '6210'
  },
  {
    id: 'CAT003',
    name: 'Office Supplies',
    description: 'Stationery and office equipment',
    isActive: true,
    budgetAmount: 100000,
    spentAmount: 45000,
    accountCode: '6240'
  },
  {
    id: 'CAT004',
    name: 'Telecommunications',
    description: 'Phone and internet services',
    isActive: true,
    budgetAmount: 150000,
    spentAmount: 75000,
    accountCode: '6230'
  },
  {
    id: 'CAT005',
    name: 'Meals & Entertainment',
    description: 'Business meals and client entertainment',
    isActive: true,
    budgetAmount: 200000,
    spentAmount: 85000,
    accountCode: '6270'
  }
]

const expenseTrends = [
  { month: 'Jul', total: 2800000, categories: { vehicle: 420000, rent: 600000, utilities: 180000, supplies: 95000, meals: 125000 } },
  { month: 'Aug', total: 3100000, categories: { vehicle: 480000, rent: 600000, utilities: 195000, supplies: 110000, meals: 140000 } },
  { month: 'Sep', total: 2950000, categories: { vehicle: 450000, rent: 600000, utilities: 175000, supplies: 85000, meals: 120000 } },
  { month: 'Oct', total: 3250000, categories: { vehicle: 520000, rent: 600000, utilities: 205000, supplies: 125000, meals: 155000 } },
  { month: 'Nov', total: 3050000, categories: { vehicle: 470000, rent: 600000, utilities: 185000, supplies: 105000, meals: 135000 } },
  { month: 'Dec', total: 3400000, categories: { vehicle: 550000, rent: 600000, utilities: 220000, supplies: 140000, meals: 180000 } },
  { month: 'Jan', total: 960000, categories: { vehicle: 265000, rent: 450000, utilities: 125000, supplies: 45000, meals: 75000 } }
]

const categoryBreakdown = [
  { name: 'Rent & Utilities', value: 575000, color: '#ef4444', percentage: 59.9 },
  { name: 'Vehicle Expenses', value: 265000, color: '#f97316', percentage: 27.6 },
  { name: 'Telecommunications', value: 75000, color: '#eab308', percentage: 7.8 },
  { name: 'Office Supplies', value: 45000, color: '#22c55e', percentage: 4.7 }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800'
    case 'Approved': return 'bg-blue-100 text-blue-800'
    case 'Pending Approval': return 'bg-yellow-100 text-yellow-800'
    case 'Draft': return 'bg-gray-100 text-gray-800'
    case 'Rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return CheckCircle
    case 'Approved': return CheckCircle
    case 'Pending Approval': return Clock
    case 'Draft': return Edit
    case 'Rejected': return XCircle
    default: return Receipt
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Vehicle Expenses': case 'Vehicle Maintenance': return Car
    case 'Rent & Utilities': case 'Utilities': return Building
    case 'Office Supplies': return FileText
    case 'Telecommunications': return Phone
    case 'Meals & Entertainment': return Utensils
    case 'Fuel Supplier': return Fuel
    default: return Receipt
  }
}

export default function ExpenseManagement() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterEmployee, setFilterEmployee] = useState<string>('all')
  const [showExpenseDialog, setShowExpenseDialog] = useState(false)
  const [showVendorDialog, setShowVendorDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
      const matchesEmployee = filterEmployee === 'all' || expense.employeeId === filterEmployee
      return matchesSearch && matchesStatus && matchesCategory && matchesEmployee
    })
  }, [searchTerm, filterStatus, filterCategory, filterEmployee])

  // Calculate totals
  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const pendingApproval = expenses.filter(exp => exp.status === 'Pending Approval').reduce((sum, exp) => sum + exp.amount, 0)
    const reimbursable = expenses.filter(exp => exp.isReimbursable).reduce((sum, exp) => sum + exp.amount, 0)
    const totalPaid = expenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0)

    return { totalExpenses, pendingApproval, reimbursable, totalPaid }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track business expenses, receipts, and reimbursements</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowExpenseDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalExpenses)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(totals.pendingApproval)}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reimbursable</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.reimbursable)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalPaid)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Monthly Expense Trends
                </CardTitle>
                <CardDescription>Expense breakdown by month and category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={expenseTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                      <Area type="monotone" dataKey="total" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Total Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Expense Categories
                </CardTitle>
                <CardDescription>Spending by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category) => {
                    const percentage = category.budgetAmount ? (category.spentAmount / category.budgetAmount) * 100 : 0
                    const Icon = getCategoryIcon(category.name)

                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm">{formatCurrency(category.spentAmount)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {category.budgetAmount ? `${percentage.toFixed(0)}%` : 'No budget'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription>Latest expense submissions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('expenses')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => {
                  const StatusIcon = getStatusIcon(expense.status)
                  const CategoryIcon = getCategoryIcon(expense.category)

                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          expense.status === 'Paid' ? 'bg-green-100' :
                          expense.status === 'Approved' ? 'bg-blue-100' :
                          expense.status === 'Pending Approval' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <StatusIcon className={`w-5 h-5 ${
                            expense.status === 'Paid' ? 'text-green-600' :
                            expense.status === 'Approved' ? 'text-blue-600' :
                            expense.status === 'Pending Approval' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CategoryIcon className="w-3 h-3" />
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{expense.vendor}</span>
                            <span>•</span>
                            <span>{expense.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Expense Tracking</CardTitle>
                  <CardDescription>{filteredExpenses.length} expenses</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending Approval">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => {
                    const StatusIcon = getStatusIcon(expense.status)
                    const CategoryIcon = getCategoryIcon(expense.category)

                    return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-mono">{expense.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {expense.receiptUrl && (
                              <Camera className="w-4 h-4 text-blue-500" />
                            )}
                            <span>{expense.description}</span>
                            {expense.isRecurring && (
                              <Repeat className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4" />
                            <span>{expense.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>{expense.employeeName}</TableCell>
                        <TableCell className="font-mono text-red-600">
                          {formatCurrency(expense.amount)}
                          {expense.isReimbursable && (
                            <Badge variant="outline" className="ml-2">Reimbursable</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={getStatusColor(expense.status)}>
                              {expense.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedExpense(expense)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            {expense.receiptUrl && (
                              <Button size="sm" variant="outline">
                                <Paperclip className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Manage expense categories and budgets</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Usage %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((category) => {
                    const Icon = getCategoryIcon(category.name)
                    const remaining = (category.budgetAmount || 0) - category.spentAmount
                    const usagePercentage = category.budgetAmount ? (category.spentAmount / category.budgetAmount) * 100 : 0

                    return (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{category.accountCode}</TableCell>
                        <TableCell className="font-mono">
                          {category.budgetAmount ? formatCurrency(category.budgetAmount) : 'No budget set'}
                        </TableCell>
                        <TableCell className="font-mono text-red-600">
                          {formatCurrency(category.spentAmount)}
                        </TableCell>
                        <TableCell className={`font-mono ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {category.budgetAmount ? formatCurrency(remaining) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {category.budgetAmount ? (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                <div
                                  className={`h-2 rounded-full ${
                                    usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm">{usagePercentage.toFixed(0)}%</span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? 'default' : 'secondary'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calculator className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Manage suppliers and service providers</CardDescription>
                </div>
                <Button onClick={() => setShowVendorDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Total Expenses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => {
                    const Icon = getCategoryIcon(vendor.category)

                    return (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{vendor.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {vendor.email && <p className="text-sm">{vendor.email}</p>}
                            {vendor.phone && <p className="text-sm text-gray-500">{vendor.phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </TableCell>
                        <TableCell>{vendor.paymentTerms}</TableCell>
                        <TableCell className="font-mono">{formatCurrency(vendor.totalExpenses)}</TableCell>
                        <TableCell>
                          <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense by Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Expenses by Category
                  </CardTitle>
                  <CardDescription>Distribution of expenses across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Reports</CardTitle>
                  <CardDescription>Generate expense reports and summaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Monthly Expense Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Employee Expense Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Building className="w-4 h-4 mr-2" />
                      Vendor Expense Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="w-4 h-4 mr-2" />
                      Category Budget Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="w-4 h-4 mr-2" />
                      Tax Deductible Expenses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Expense Details Dialog */}
      {selectedExpense && (
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
              <DialogDescription>{selectedExpense.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <p>{selectedExpense.date}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="font-bold text-red-600">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <p>{selectedExpense.vendor}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p>{selectedExpense.category}</p>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <p>{selectedExpense.paymentMethod}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedExpense.status)}>
                    {selectedExpense.status}
                  </Badge>
                </div>
                <div>
                  <Label>Employee</Label>
                  <p>{selectedExpense.employeeName}</p>
                </div>
                <div>
                  <Label>Account</Label>
                  <p>{selectedExpense.account}</p>
                </div>
              </div>

              {selectedExpense.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600">{selectedExpense.notes}</p>
                </div>
              )}

              <div className="flex space-x-4">
                {selectedExpense.isReimbursable && (
                  <Badge variant="outline">Reimbursable</Badge>
                )}
                {selectedExpense.isBillable && (
                  <Badge variant="outline">Billable</Badge>
                )}
                {selectedExpense.isRecurring && (
                  <Badge variant="outline">
                    Recurring {selectedExpense.recurringFrequency}
                  </Badge>
                )}
              </div>

              {selectedExpense.receiptUrl && (
                <div>
                  <Label>Receipt</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm text-blue-600 underline cursor-pointer">
                      View Receipt
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedExpense(null)}>
                Close
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Record a new business expense</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expenseDate">Date *</Label>
              <Input
                id="expenseDate"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Input id="description" placeholder="Enter expense description" />
            </div>
            <div>
              <Label htmlFor="vendor">Vendor/Payee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMP001">John Adebayo</SelectItem>
                  <SelectItem value="EMP002">Sarah Okafor</SelectItem>
                  <SelectItem value="EMP003">Michael Okonkwo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or details..."
                rows={3}
              />
            </div>
            <div className="col-span-2 flex space-x-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reimbursable" className="w-4 h-4" />
                <Label htmlFor="reimbursable">Reimbursable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="billable" className="w-4 h-4" />
                <Label htmlFor="billable">Billable to Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="recurring" className="w-4 h-4" />
                <Label htmlFor="recurring">Recurring Expense</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>
              Cancel
            </Button>
            <Button>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vendor Dialog */}
      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>Add a new supplier or service provider</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input id="vendorName" placeholder="Enter vendor name" />
            </div>
            <div>
              <Label htmlFor="vendorEmail">Email</Label>
              <Input id="vendorEmail" type="email" placeholder="Enter email" />
            </div>
            <div>
              <Label htmlFor="vendorPhone">Phone</Label>
              <Input id="vendorPhone" placeholder="Enter phone number" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="vendorAddress">Address</Label>
              <Textarea id="vendorAddress" placeholder="Enter address" rows={2} />
            </div>
            <div>
              <Label htmlFor="vendorCategory">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel Supplier">Fuel Supplier</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Professional Services">Professional Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID (Optional)</Label>
              <Input id="taxId" placeholder="Enter tax identification number" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVendorDialog(false)}>
              Cancel
            </Button>
            <Button>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  )
}