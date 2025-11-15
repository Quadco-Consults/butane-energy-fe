'use client'

import React, { useState, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Landmark, CreditCard, ArrowUpRight, ArrowDownRight, RefreshCw,
  Calendar, Clock, CheckCircle, XCircle, AlertTriangle,
  Banknote, Receipt, FileText, TrendingUp, TrendingDown,
  Building, Users, Target, Gauge, Activity, Wallet
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Link from 'next/link'

interface BankAccount {
  id: string
  name: string
  accountNumber: string
  bank: string
  type: 'Checking' | 'Savings' | 'Credit' | 'Investment'
  balance: number
  availableBalance: number
  currency: string
  status: 'Active' | 'Inactive' | 'Closed'
  lastReconciled?: string
  openingBalance: number
  isDefault: boolean
}

interface Transaction {
  id: string
  date: string
  accountId: string
  accountName: string
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Fee' | 'Interest' | 'Check'
  description: string
  reference?: string
  amount: number
  category: string
  status: 'Completed' | 'Pending' | 'Failed' | 'Reconciled'
  payee?: string
  memo?: string
  checkNumber?: string
}

interface BankingRule {
  id: string
  name: string
  description: string
  conditions: string
  action: string
  isActive: boolean
  category: string
  accountId?: string
}

const bankAccounts: BankAccount[] = [
  {
    id: 'ACC001',
    name: 'First Bank - Operations',
    accountNumber: '3024567890',
    bank: 'First Bank of Nigeria',
    type: 'Checking',
    balance: 8750000,
    availableBalance: 8650000,
    currency: 'NGN',
    status: 'Active',
    lastReconciled: '2024-01-15',
    openingBalance: 5000000,
    isDefault: true
  },
  {
    id: 'ACC002',
    name: 'GTBank - Payroll',
    accountNumber: '0123456789',
    bank: 'Guaranty Trust Bank',
    type: 'Checking',
    balance: 2100000,
    availableBalance: 2100000,
    currency: 'NGN',
    status: 'Active',
    lastReconciled: '2024-01-10',
    openingBalance: 1000000,
    isDefault: false
  },
  {
    id: 'ACC003',
    name: 'UBA - Savings',
    accountNumber: '2087654321',
    bank: 'United Bank for Africa',
    type: 'Savings',
    balance: 4900000,
    availableBalance: 4900000,
    currency: 'NGN',
    status: 'Active',
    lastReconciled: '2024-01-12',
    openingBalance: 3000000,
    isDefault: false
  },
  {
    id: 'ACC004',
    name: 'Corporate Mastercard',
    accountNumber: '**** **** **** 1234',
    bank: 'Access Bank',
    type: 'Credit',
    balance: -320000,
    availableBalance: 680000,
    currency: 'NGN',
    status: 'Active',
    openingBalance: 0,
    isDefault: false
  }
]

const transactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2024-01-16',
    accountId: 'ACC001',
    accountName: 'First Bank - Operations',
    type: 'Deposit',
    description: 'Customer Payment - Inv-2024-001',
    reference: 'INV-2024-001',
    amount: 850000,
    category: 'Sales Revenue',
    status: 'Completed',
    payee: 'ABC Gas Ltd',
    memo: 'LPG Sales Payment'
  },
  {
    id: 'TXN002',
    date: '2024-01-15',
    accountId: 'ACC001',
    accountName: 'First Bank - Operations',
    type: 'Withdrawal',
    description: 'Supplier Payment - Gas Procurement',
    reference: 'PO-2024-005',
    amount: -450000,
    category: 'Cost of Goods',
    status: 'Completed',
    payee: 'Shell Nigeria',
    memo: 'Monthly gas purchase'
  },
  {
    id: 'TXN003',
    date: '2024-01-15',
    accountId: 'ACC002',
    accountName: 'GTBank - Payroll',
    type: 'Withdrawal',
    description: 'Monthly Salary Payment',
    amount: -1250000,
    category: 'Payroll',
    status: 'Completed',
    memo: 'January 2024 salaries'
  },
  {
    id: 'TXN004',
    date: '2024-01-14',
    accountId: 'ACC001',
    accountName: 'First Bank - Operations',
    type: 'Deposit',
    description: 'Customer Deposit - Bulk Order',
    amount: 750000,
    category: 'Customer Deposits',
    status: 'Completed',
    payee: 'XYZ Energy Solutions'
  },
  {
    id: 'TXN005',
    date: '2024-01-14',
    accountId: 'ACC001',
    accountName: 'First Bank - Operations',
    type: 'Check',
    description: 'Office Rent Payment',
    amount: -120000,
    category: 'Administrative',
    status: 'Completed',
    payee: 'Property Management Co.',
    checkNumber: '001234'
  },
  {
    id: 'TXN006',
    date: '2024-01-13',
    accountId: 'ACC004',
    accountName: 'Corporate Mastercard',
    type: 'Withdrawal',
    description: 'Fuel Purchase',
    amount: -85000,
    category: 'Vehicle Expenses',
    status: 'Pending',
    payee: 'Total Energies'
  }
]

const cashFlowData = [
  { date: '2024-01-01', inflow: 2500000, outflow: 1800000, net: 700000 },
  { date: '2024-01-08', inflow: 3200000, outflow: 2100000, net: 1100000 },
  { date: '2024-01-15', inflow: 1800000, outflow: 2850000, net: -1050000 },
  { date: '2024-01-16', inflow: 1600000, outflow: 600000, net: 1000000 }
]

const bankingRules: BankingRule[] = [
  {
    id: 'RULE001',
    name: 'Auto-categorize LPG Sales',
    description: 'Automatically categorize deposits containing "LPG" or "Gas" as Sales Revenue',
    conditions: 'Description contains "LPG" OR "Gas"',
    action: 'Set category to "Sales Revenue"',
    isActive: true,
    category: 'Sales Revenue'
  },
  {
    id: 'RULE002',
    name: 'Fuel Expense Auto-category',
    description: 'Categorize payments to fuel stations as Vehicle Expenses',
    conditions: 'Payee contains "Total" OR "Shell" OR "Mobil"',
    action: 'Set category to "Vehicle Expenses"',
    isActive: true,
    category: 'Vehicle Expenses'
  },
  {
    id: 'RULE003',
    name: 'Payroll Auto-categorization',
    description: 'Categorize bulk salary payments as Payroll expenses',
    conditions: 'Description contains "Salary" AND Amount > 1000000',
    action: 'Set category to "Payroll"',
    isActive: true,
    category: 'Payroll'
  }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'Deposit': return ArrowDownRight
    case 'Withdrawal': return ArrowUpRight
    case 'Transfer': return RefreshCw
    case 'Check': return FileText
    case 'Fee': return Receipt
    case 'Interest': return TrendingUp
    default: return Banknote
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': case 'Reconciled': return 'bg-green-100 text-green-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'Failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'Checking': return Landmark
    case 'Savings': return Wallet
    case 'Credit': return CreditCard
    case 'Investment': return TrendingUp
    default: return Building
  }
}

export default function BankingDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAccount, setFilterAccount] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showReconcileDialog, setShowReconcileDialog] = useState(false)

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           txn.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           txn.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAccount = filterAccount === 'all' || txn.accountId === filterAccount
      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus
      return matchesSearch && matchesAccount && matchesStatus
    })
  }, [searchTerm, filterAccount, filterStatus])

  // Calculate totals
  const totals = useMemo(() => {
    const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    const totalDeposits = transactions
      .filter(txn => txn.amount > 0)
      .reduce((sum, txn) => sum + txn.amount, 0)
    const totalWithdrawals = transactions
      .filter(txn => txn.amount < 0)
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)

    return { totalBalance, totalDeposits, totalWithdrawals }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banking & Cash Management</h1>
          <p className="text-gray-600">Monitor bank accounts, transactions, and cash flow</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Transactions
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowReconcileDialog(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reconcile
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="rules">Banking Rules</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Balance</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalBalance)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Inflows</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.totalDeposits)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Outflows</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalWithdrawals)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                    <p className="text-2xl font-bold">{bankAccounts.filter(acc => acc.status === 'Active').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cash Flow Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Cash Flow Trend
                </CardTitle>
                <CardDescription>Daily cash inflows and outflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                      <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Inflow" />
                      <Area type="monotone" dataKey="outflow" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Outflow" />
                      <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Account List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Landmark className="w-5 h-5 mr-2" />
                  Bank Accounts
                </CardTitle>
                <CardDescription>Account balances and status</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {bankAccounts.map((account) => {
                      const Icon = getAccountTypeIcon(account.type)
                      return (
                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              account.type === 'Credit' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                account.type === 'Credit' ? 'text-red-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{account.name}</p>
                              <p className="text-xs text-gray-500">{account.bank} • {account.accountNumber}</p>
                              <Badge variant={account.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                                {account.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(account.balance))}
                            </p>
                            {account.type === 'Credit' && (
                              <p className="text-xs text-gray-500">
                                Available: {formatCurrency(account.availableBalance)}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Latest banking activity</CardDescription>
                </div>
                <Link href="/dashboard/finance/banking?tab=transactions">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.accountName} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Bank Accounts Management</CardTitle>
                  <CardDescription>Manage your company bank accounts</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Available Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reconciled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-gray-500">{account.accountNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{account.bank}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.type}</Badge>
                      </TableCell>
                      <TableCell className={`font-mono ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(account.availableBalance)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(account.status)}>
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.lastReconciled || 'Never'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>{filteredTransactions.length} transactions</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterAccount} onValueChange={setFilterAccount}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Reconciled">Reconciled</SelectItem>
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
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const Icon = getTransactionIcon(transaction.type)
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">{transaction.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              {transaction.payee && (
                                <p className="text-sm text-gray-500">{transaction.payee}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.accountName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className={`font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
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

        {/* Transfers Tab */}
        <TabsContent value="transfers">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Fund Transfers</CardTitle>
                    <CardDescription>Transfer money between accounts</CardDescription>
                  </div>
                  <Button onClick={() => setShowTransferDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Transfer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No transfers found. Create your first transfer to get started.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banking Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Banking Rules</CardTitle>
                  <CardDescription>Automate transaction categorization and processing</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankingRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    <div className="text-sm">
                      <p><span className="font-medium">Conditions:</span> {rule.conditions}</p>
                      <p><span className="font-medium">Action:</span> {rule.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Fund Transfer</DialogTitle>
            <DialogDescription>Transfer money between your accounts</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fromAccount">From Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toAccount">To Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                placeholder="Transfer description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Cancel
            </Button>
            <Button>Transfer Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  )
}