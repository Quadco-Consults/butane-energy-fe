'use client'

import React, { useState, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt,
  Calendar, Target, AlertTriangle, CheckCircle, BarChart3,
  PieChart, Users, Building, Clock, Plus, FileText,
  Banknote, Calculator, RefreshCw, Download, Upload,
  ArrowUpRight, ArrowDownRight, Activity, Gauge, Wallet,
  ShoppingCart, HandCoins, PiggyBank, Building2,
  FileBarChart, Landmark, CreditCard as CreditCardIcon
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Link from 'next/link'

interface FinanceDashboardProps {
  currentPeriod?: string
  companyId?: string
}

// QuickBooks-like dashboard data structure
const dashboardData = {
  snapshot: {
    totalIncome: 8750000, // NGN
    totalExpenses: 6200000,
    netIncome: 2550000,
    bankBalance: 15750000,
    accountsReceivable: 4250000,
    accountsPayable: 2100000,
    cashFlow: 1850000,
    currentRatio: 2.4
  },
  recentActivity: [
    { id: 'TXN001', type: 'Invoice', description: 'LPG Sales - Lagos Distribution', amount: 850000, date: '2024-01-16', status: 'Paid' },
    { id: 'TXN002', type: 'Expense', description: 'Office Rent - Head Office', amount: -120000, date: '2024-01-15', status: 'Paid' },
    { id: 'TXN003', type: 'Payment', description: 'Supplier Payment - Gas Procurement', amount: -450000, date: '2024-01-15', status: 'Pending' },
    { id: 'TXN004', type: 'Invoice', description: 'LPG Sales - Abuja Distribution', amount: 620000, date: '2024-01-14', status: 'Overdue' },
    { id: 'TXN005', type: 'Deposit', description: 'Customer Deposit - Bulk Order', amount: 750000, date: '2024-01-14', status: 'Completed' }
  ],
  cashFlowData: [
    { month: 'Jul', inflow: 7500, outflow: 5200, net: 2300 },
    { month: 'Aug', inflow: 8200, outflow: 5800, net: 2400 },
    { month: 'Sep', inflow: 8800, outflow: 6100, net: 2700 },
    { month: 'Oct', inflow: 9200, outflow: 6400, net: 2800 },
    { month: 'Nov', inflow: 8600, outflow: 6000, net: 2600 },
    { month: 'Dec', inflow: 9500, outflow: 6800, net: 2700 },
    { month: 'Jan', inflow: 8750, outflow: 6200, net: 2550 }
  ],
  incomeCategories: [
    { name: 'LPG Sales', value: 6800000, color: '#0ea5e9', percentage: 77.7 },
    { name: 'Equipment Sales', value: 1250000, color: '#3b82f6', percentage: 14.3 },
    { name: 'Services', value: 450000, color: '#6366f1', percentage: 5.1 },
    { name: 'Other Income', value: 250000, color: '#8b5cf6', percentage: 2.9 }
  ],
  expenseCategories: [
    { name: 'Cost of Goods', value: 3200000, color: '#ef4444', percentage: 51.6 },
    { name: 'Operations', value: 1450000, color: '#f97316', percentage: 23.4 },
    { name: 'Personnel', value: 950000, color: '#eab308', percentage: 15.3 },
    { name: 'Admin & General', value: 600000, color: '#84cc16', percentage: 9.7 }
  ],
  quickActions: [
    { title: 'Create Invoice', icon: FileText, href: '/dashboard/finance/sales/invoices/new', color: 'bg-blue-500' },
    { title: 'Record Payment', icon: Banknote, href: '/dashboard/finance/banking/payments/new', color: 'bg-green-500' },
    { title: 'Add Expense', icon: Receipt, href: '/dashboard/finance/expenses/new', color: 'bg-orange-500' },
    { title: 'Bank Deposit', icon: Landmark, href: '/dashboard/finance/banking/deposits/new', color: 'bg-purple-500' },
    { title: 'Write Check', icon: CreditCardIcon, href: '/dashboard/finance/banking/checks/new', color: 'bg-indigo-500' },
    { title: 'Transfer Funds', icon: ArrowUpRight, href: '/dashboard/finance/banking/transfers/new', color: 'bg-teal-500' }
  ],
  accounts: {
    bank: [
      { name: 'First Bank - Operations', balance: 8750000, type: 'Checking' },
      { name: 'GTBank - Payroll', balance: 2100000, type: 'Checking' },
      { name: 'UBA - Savings', balance: 4900000, type: 'Savings' }
    ],
    creditCards: [
      { name: 'Corporate Mastercard', balance: 320000, limit: 1000000, type: 'Credit' },
      { name: 'Fuel Purchase Card', balance: 180000, limit: 500000, type: 'Credit' }
    ]
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const MetricCard: React.FC<{
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color?: string
  onClick?: () => void
}> = ({ title, value, change, icon: Icon, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
            {change !== undefined && (
              <p className={`text-sm flex items-center ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(change).toFixed(1)}%
              </p>
            )}
          </div>
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FinanceDashboard({ currentPeriod = 'Jan 2024', companyId }: FinanceDashboardProps) {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod)
  const [selectedAccount, setSelectedAccount] = useState<string>('all')

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600">Complete financial overview and management system</p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jan 2024">January 2024</SelectItem>
              <SelectItem value="Dec 2023">December 2023</SelectItem>
              <SelectItem value="Nov 2023">November 2023</SelectItem>
              <SelectItem value="Q4 2023">Q4 2023</SelectItem>
              <SelectItem value="YTD 2024">YTD 2024</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Books
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Income"
          value={dashboardData.snapshot.totalIncome}
          change={12.5}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Total Expenses"
          value={dashboardData.snapshot.totalExpenses}
          change={8.3}
          icon={TrendingDown}
          color="red"
        />
        <MetricCard
          title="Net Income"
          value={dashboardData.snapshot.netIncome}
          change={15.2}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Bank Balance"
          value={dashboardData.snapshot.bankBalance}
          change={5.7}
          icon={Landmark}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common financial tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dashboardData.quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">{action.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Cash Flow Trend
            </CardTitle>
            <CardDescription>Monthly cash inflow vs outflow (in thousands NGN)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₦${value}K`} />
                  <Tooltip formatter={(value: any) => `₦${value}K`} />
                  <Legend />
                  <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="outflow" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Account Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Account Balances
            </CardTitle>
            <CardDescription>Bank and credit accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Bank Accounts</h4>
                  {dashboardData.accounts.bank.map((account, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg mb-2">
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.type}</p>
                      </div>
                      <p className="font-bold text-green-600">{formatCurrency(account.balance)}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Credit Cards</h4>
                  {dashboardData.accounts.creditCards.map((card, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg mb-2">
                      <div>
                        <p className="font-medium text-sm">{card.name}</p>
                        <p className="text-xs text-gray-500">Limit: {formatCurrency(card.limit)}</p>
                      </div>
                      <p className="font-bold text-red-600">-{formatCurrency(card.balance)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Income by Category
            </CardTitle>
            <CardDescription>Revenue breakdown for {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={dashboardData.incomeCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.incomeCategories.map((entry, index) => (
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

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Expenses by Category
            </CardTitle>
            <CardDescription>Spending breakdown for {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={dashboardData.expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.expenseCategories.map((entry, index) => (
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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest financial transactions</CardDescription>
            </div>
            <Link href="/dashboard/finance/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'Invoice' ? 'bg-blue-100' :
                    transaction.type === 'Payment' ? 'bg-red-100' :
                    transaction.type === 'Expense' ? 'bg-orange-100' :
                    'bg-green-100'
                  }`}>
                    {transaction.type === 'Invoice' ? (
                      <FileText className="w-5 h-5 text-blue-600" />
                    ) : transaction.type === 'Payment' ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : transaction.type === 'Expense' ? (
                      <Receipt className="w-5 h-5 text-orange-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.id} • {transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Badge variant={
                    transaction.status === 'Paid' || transaction.status === 'Completed' ? 'default' :
                    transaction.status === 'Pending' ? 'secondary' : 'destructive'
                  }>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Accounts Receivable"
          value={dashboardData.snapshot.accountsReceivable}
          icon={HandCoins}
          color="blue"
        />
        <MetricCard
          title="Accounts Payable"
          value={dashboardData.snapshot.accountsPayable}
          icon={CreditCard}
          color="orange"
        />
        <MetricCard
          title="Current Ratio"
          value={dashboardData.snapshot.currentRatio.toFixed(1)}
          icon={Gauge}
          color="green"
        />
        <MetricCard
          title="Cash Flow"
          value={dashboardData.snapshot.cashFlow}
          change={8.4}
          icon={TrendingUp}
          color="purple"
        />
      </div>
    </div>
    </DashboardLayout>
  )
}