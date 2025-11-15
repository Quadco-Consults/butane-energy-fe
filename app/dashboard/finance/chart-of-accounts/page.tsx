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
  Plus, Search, Filter, Edit, Trash2, Eye, Download,
  Building, DollarSign, CreditCard, PiggyBank, Landmark,
  Receipt, Truck, Users, Calculator, FileText, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle, MoreHorizontal,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'

// QuickBooks-style Chart of Accounts structure
interface Account {
  id: string
  code: string
  name: string
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  subType: string
  parentId?: string
  level: number
  balance: number
  isActive: boolean
  description?: string
  normalBalance: 'Debit' | 'Credit'
  taxLine?: string
  isSystem: boolean
  lastActivity?: string
}

// Sample Chart of Accounts data for LPG business
const chartOfAccounts: Account[] = [
  // ASSETS
  { id: '1000', code: '1000', name: 'ASSETS', type: 'Asset', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },

  // Current Assets
  { id: '1100', code: '1100', name: 'Current Assets', type: 'Asset', subType: 'Header', parentId: '1000', level: 1, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '1110', code: '1110', name: 'Cash and Cash Equivalents', type: 'Asset', subType: 'Header', parentId: '1100', level: 2, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '1111', code: '1111', name: 'First Bank - Operations Account', type: 'Asset', subType: 'Bank', parentId: '1110', level: 3, balance: 8750000, isActive: true, normalBalance: 'Debit', isSystem: false, lastActivity: '2024-01-16' },
  { id: '1112', code: '1112', name: 'GTBank - Payroll Account', type: 'Asset', subType: 'Bank', parentId: '1110', level: 3, balance: 2100000, isActive: true, normalBalance: 'Debit', isSystem: false, lastActivity: '2024-01-15' },
  { id: '1113', code: '1113', name: 'UBA - Savings Account', type: 'Asset', subType: 'Bank', parentId: '1110', level: 3, balance: 4900000, isActive: true, normalBalance: 'Debit', isSystem: false, lastActivity: '2024-01-10' },
  { id: '1115', code: '1115', name: 'Petty Cash - Head Office', type: 'Asset', subType: 'Other Current Asset', parentId: '1110', level: 3, balance: 150000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1116', code: '1116', name: 'Petty Cash - Lagos Plant', type: 'Asset', subType: 'Other Current Asset', parentId: '1110', level: 3, balance: 100000, isActive: true, normalBalance: 'Debit', isSystem: false },

  // Accounts Receivable
  { id: '1200', code: '1200', name: 'Accounts Receivable', type: 'Asset', subType: 'Header', parentId: '1100', level: 2, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '1210', code: '1210', name: 'Trade Receivables', type: 'Asset', subType: 'Accounts Receivable', parentId: '1200', level: 3, balance: 3850000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1215', code: '1215', name: 'Employee Advances', type: 'Asset', subType: 'Other Current Asset', parentId: '1200', level: 3, balance: 400000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1220', code: '1220', name: 'Allowance for Doubtful Accounts', type: 'Asset', subType: 'Other Current Asset', parentId: '1200', level: 3, balance: -50000, isActive: true, normalBalance: 'Credit', isSystem: false },

  // Inventory
  { id: '1300', code: '1300', name: 'Inventory', type: 'Asset', subType: 'Header', parentId: '1100', level: 2, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '1310', code: '1310', name: 'LPG Stock - 12.5kg Cylinders', type: 'Asset', subType: 'Inventory', parentId: '1300', level: 3, balance: 2500000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1315', code: '1315', name: 'LPG Stock - 6kg Cylinders', type: 'Asset', subType: 'Inventory', parentId: '1300', level: 3, balance: 1800000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1320', code: '1320', name: 'Empty Cylinders', type: 'Asset', subType: 'Inventory', parentId: '1300', level: 3, balance: 3200000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1325', code: '1325', name: 'Accessories & Equipment', type: 'Asset', subType: 'Inventory', parentId: '1300', level: 3, balance: 450000, isActive: true, normalBalance: 'Debit', isSystem: false },

  // Fixed Assets
  { id: '1500', code: '1500', name: 'Property, Plant & Equipment', type: 'Asset', subType: 'Header', parentId: '1000', level: 1, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '1510', code: '1510', name: 'Land & Buildings', type: 'Asset', subType: 'Fixed Asset', parentId: '1500', level: 2, balance: 85000000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1520', code: '1520', name: 'Plant & Machinery', type: 'Asset', subType: 'Fixed Asset', parentId: '1500', level: 2, balance: 45000000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1530', code: '1530', name: 'Vehicles & Transport Equipment', type: 'Asset', subType: 'Fixed Asset', parentId: '1500', level: 2, balance: 25000000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1540', code: '1540', name: 'Office Equipment & Furniture', type: 'Asset', subType: 'Fixed Asset', parentId: '1500', level: 2, balance: 3500000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '1590', code: '1590', name: 'Accumulated Depreciation', type: 'Asset', subType: 'Fixed Asset', parentId: '1500', level: 2, balance: -18500000, isActive: true, normalBalance: 'Credit', isSystem: false },

  // LIABILITIES
  { id: '2000', code: '2000', name: 'LIABILITIES', type: 'Liability', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },

  // Current Liabilities
  { id: '2100', code: '2100', name: 'Current Liabilities', type: 'Liability', subType: 'Header', parentId: '2000', level: 1, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },
  { id: '2110', code: '2110', name: 'Accounts Payable', type: 'Liability', subType: 'Accounts Payable', parentId: '2100', level: 2, balance: 2100000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '2120', code: '2120', name: 'Accrued Expenses', type: 'Liability', subType: 'Other Current Liability', parentId: '2100', level: 2, balance: 650000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '2130', code: '2130', name: 'Payroll Liabilities', type: 'Liability', subType: 'Other Current Liability', parentId: '2100', level: 2, balance: 750000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '2135', code: '2135', name: 'VAT Payable', type: 'Liability', subType: 'Other Current Liability', parentId: '2100', level: 2, balance: 425000, isActive: true, normalBalance: 'Credit', isSystem: false, taxLine: 'VAT' },
  { id: '2140', code: '2140', name: 'WHT Payable', type: 'Liability', subType: 'Other Current Liability', parentId: '2100', level: 2, balance: 180000, isActive: true, normalBalance: 'Credit', isSystem: false, taxLine: 'WHT' },

  // Long-term Liabilities
  { id: '2500', code: '2500', name: 'Long-term Liabilities', type: 'Liability', subType: 'Header', parentId: '2000', level: 1, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },
  { id: '2510', code: '2510', name: 'Bank Loans', type: 'Liability', subType: 'Long Term Liability', parentId: '2500', level: 2, balance: 15000000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '2520', code: '2520', name: 'Equipment Finance', type: 'Liability', subType: 'Long Term Liability', parentId: '2500', level: 2, balance: 8500000, isActive: true, normalBalance: 'Credit', isSystem: false },

  // EQUITY
  { id: '3000', code: '3000', name: 'EQUITY', type: 'Equity', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },
  { id: '3100', code: '3100', name: 'Share Capital', type: 'Equity', subType: 'Equity', parentId: '3000', level: 1, balance: 50000000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '3200', code: '3200', name: 'Retained Earnings', type: 'Equity', subType: 'Equity', parentId: '3000', level: 1, balance: 125000000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '3900', code: '3900', name: 'Current Year Earnings', type: 'Equity', subType: 'Equity', parentId: '3000', level: 1, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },

  // REVENUE
  { id: '4000', code: '4000', name: 'REVENUE', type: 'Revenue', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },
  { id: '4100', code: '4100', name: 'Sales Revenue', type: 'Revenue', subType: 'Header', parentId: '4000', level: 1, balance: 0, isActive: true, normalBalance: 'Credit', isSystem: true },
  { id: '4110', code: '4110', name: 'LPG Sales - 12.5kg', type: 'Revenue', subType: 'Income', parentId: '4100', level: 2, balance: 5200000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '4115', code: '4115', name: 'LPG Sales - 6kg', type: 'Revenue', subType: 'Income', parentId: '4100', level: 2, balance: 1600000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '4120', code: '4120', name: 'Cylinder Sales', type: 'Revenue', subType: 'Income', parentId: '4100', level: 2, balance: 800000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '4130', code: '4130', name: 'Accessories Sales', type: 'Revenue', subType: 'Income', parentId: '4100', level: 2, balance: 450000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '4200', code: '4200', name: 'Service Revenue', type: 'Revenue', subType: 'Income', parentId: '4000', level: 1, balance: 700000, isActive: true, normalBalance: 'Credit', isSystem: false },
  { id: '4900', code: '4900', name: 'Other Income', type: 'Revenue', subType: 'Other Income', parentId: '4000', level: 1, balance: 150000, isActive: true, normalBalance: 'Credit', isSystem: false },

  // EXPENSES
  { id: '5000', code: '5000', name: 'COST OF GOODS SOLD', type: 'Expense', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '5100', code: '5100', name: 'Cost of LPG', type: 'Expense', subType: 'Cost of Goods Sold', parentId: '5000', level: 1, balance: 3200000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '5200', code: '5200', name: 'Transportation & Logistics', type: 'Expense', subType: 'Cost of Goods Sold', parentId: '5000', level: 1, balance: 850000, isActive: true, normalBalance: 'Debit', isSystem: false },

  { id: '6000', code: '6000', name: 'OPERATING EXPENSES', type: 'Expense', subType: 'Header', level: 0, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '6100', code: '6100', name: 'Personnel Expenses', type: 'Expense', subType: 'Header', parentId: '6000', level: 1, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '6110', code: '6110', name: 'Salaries & Wages', type: 'Expense', subType: 'Expense', parentId: '6100', level: 2, balance: 2100000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '6115', code: '6115', name: 'Employee Benefits', type: 'Expense', subType: 'Expense', parentId: '6100', level: 2, balance: 320000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '6120', code: '6120', name: 'Training & Development', type: 'Expense', subType: 'Expense', parentId: '6100', level: 2, balance: 85000, isActive: true, normalBalance: 'Debit', isSystem: false },

  { id: '6200', code: '6200', name: 'Administrative Expenses', type: 'Expense', subType: 'Header', parentId: '6000', level: 1, balance: 0, isActive: true, normalBalance: 'Debit', isSystem: true },
  { id: '6210', code: '6210', name: 'Rent & Utilities', type: 'Expense', subType: 'Expense', parentId: '6200', level: 2, balance: 450000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '6220', code: '6220', name: 'Professional Services', type: 'Expense', subType: 'Expense', parentId: '6200', level: 2, balance: 180000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '6230', code: '6230', name: 'Insurance', type: 'Expense', subType: 'Expense', parentId: '6200', level: 2, balance: 250000, isActive: true, normalBalance: 'Debit', isSystem: false },
  { id: '6240', code: '6240', name: 'Depreciation Expense', type: 'Expense', subType: 'Expense', parentId: '6200', level: 2, balance: 425000, isActive: true, normalBalance: 'Debit', isSystem: false }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'Asset': return Building
    case 'Liability': return CreditCard
    case 'Equity': return PiggyBank
    case 'Revenue': return TrendingUp
    case 'Expense': return TrendingDown
    default: return FileText
  }
}

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case 'Asset': return 'bg-green-100 text-green-800'
    case 'Liability': return 'bg-red-100 text-red-800'
    case 'Equity': return 'bg-blue-100 text-blue-800'
    case 'Revenue': return 'bg-purple-100 text-purple-800'
    case 'Expense': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function ChartOfAccounts() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']))

  // Filter and group accounts
  const filteredAccounts = useMemo(() => {
    return chartOfAccounts.filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.code.includes(searchTerm)
      const matchesType = filterType === 'all' || account.type === filterType
      return matchesSearch && matchesType
    })
  }, [searchTerm, filterType])

  // Group by account type
  const groupedAccounts = useMemo(() => {
    const groups = filteredAccounts.reduce((acc, account) => {
      if (!acc[account.type]) {
        acc[account.type] = []
      }
      acc[account.type].push(account)
      return acc
    }, {} as Record<string, Account[]>)

    // Sort each group by level then code
    Object.keys(groups).forEach(type => {
      groups[type].sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level
        return a.code.localeCompare(b.code)
      })
    })

    return groups
  }, [filteredAccounts])

  // Calculate totals by type
  const typeTotals = useMemo(() => {
    return Object.keys(groupedAccounts).reduce((acc, type) => {
      acc[type] = groupedAccounts[type]
        .filter(account => account.level > 0) // Exclude headers
        .reduce((sum, account) => sum + (account.balance || 0), 0)
      return acc
    }, {} as Record<string, number>)
  }, [groupedAccounts])

  const toggleTypeExpansion = (type: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  const renderAccountRow = (account: Account) => {
    const Icon = getAccountTypeIcon(account.type)
    const indentLevel = account.level * 20

    return (
      <TableRow
        key={account.id}
        className={`${account.isSystem ? 'bg-gray-50' : ''} ${
          account.level === 0 ? 'border-t-2 font-bold' : ''
        }`}
      >
        <TableCell
          className="font-medium"
          style={{ paddingLeft: `${16 + indentLevel}px` }}
        >
          <div className="flex items-center space-x-2">
            {account.level === 0 && <Icon className="w-4 h-4" />}
            <span className={account.level === 0 ? 'font-bold text-lg' : account.level === 1 ? 'font-semibold' : ''}>
              {account.name}
            </span>
          </div>
        </TableCell>
        <TableCell className="font-mono">{account.code}</TableCell>
        <TableCell>
          <Badge className={getAccountTypeColor(account.type)}>
            {account.type}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-mono">
          {account.balance !== 0 && (
            <span className={`${
              account.normalBalance === 'Debit'
                ? account.balance >= 0 ? 'text-blue-600' : 'text-red-600'
                : account.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(Math.abs(account.balance))}
            </span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant={account.isActive ? 'default' : 'secondary'}>
            {account.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell>
          {!account.isSystem && account.level > 0 && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAccount(account)
                  setShowEditDialog(true)
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAccount(account)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600">Manage your company's account structure and categories</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(typeTotals).map(([type, total]) => {
          const Icon = getAccountTypeIcon(type)
          const color = getAccountTypeColor(type)

          return (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{type}</p>
                    <p className="text-lg font-bold">{formatCurrency(Math.abs(total))}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    color.replace('text-', 'bg-').replace('-800', '-100').replace('text-', 'text-').replace('-100', '-600')
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Account List</CardTitle>
              <CardDescription>
                {filteredAccounts.length} accounts • Click account types to expand/collapse
              </CardDescription>
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Asset">Assets</SelectItem>
                  <SelectItem value="Liability">Liabilities</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedAccounts).map(([type, accounts]) => (
                  expandedTypes.has(type) ? accounts.map(renderAccountRow) :
                  // Show only the type header when collapsed
                  [accounts.find(acc => acc.level === 0)].filter(Boolean).map(renderAccountRow)
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Account Details Dialog */}
      {selectedAccount && !showEditDialog && (
        <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Account Details</DialogTitle>
              <DialogDescription>
                View account information and recent activity
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Name</Label>
                <p className="font-medium">{selectedAccount.name}</p>
              </div>
              <div>
                <Label>Account Code</Label>
                <p className="font-mono">{selectedAccount.code}</p>
              </div>
              <div>
                <Label>Account Type</Label>
                <Badge className={getAccountTypeColor(selectedAccount.type)}>
                  {selectedAccount.type} - {selectedAccount.subType}
                </Badge>
              </div>
              <div>
                <Label>Current Balance</Label>
                <p className="font-bold text-lg">{formatCurrency(selectedAccount.balance)}</p>
              </div>
              {selectedAccount.description && (
                <div className="col-span-2">
                  <Label>Description</Label>
                  <p>{selectedAccount.description}</p>
                </div>
              )}
              <div>
                <Label>Normal Balance</Label>
                <p>{selectedAccount.normalBalance}</p>
              </div>
              <div>
                <Label>Last Activity</Label>
                <p>{selectedAccount.lastActivity || 'No recent activity'}</p>
              </div>
              {selectedAccount.taxLine && (
                <div>
                  <Label>Tax Line</Label>
                  <p>{selectedAccount.taxLine}</p>
                </div>
              )}
              <div>
                <Label>Status</Label>
                <Badge variant={selectedAccount.isActive ? 'default' : 'secondary'}>
                  {selectedAccount.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                Close
              </Button>
              {!selectedAccount.isSystem && (
                <Button onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Account
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Account Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setShowEditDialog(false)
          setSelectedAccount(null)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showAddDialog ? 'Add New Account' : 'Edit Account'}
            </DialogTitle>
            <DialogDescription>
              {showAddDialog ? 'Create a new account in your chart of accounts' : 'Update account information'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                placeholder="Enter account name"
                defaultValue={selectedAccount?.name || ''}
              />
            </div>
            <div>
              <Label htmlFor="accountCode">Account Code *</Label>
              <Input
                id="accountCode"
                placeholder="e.g., 1110"
                defaultValue={selectedAccount?.code || ''}
              />
            </div>
            <div>
              <Label htmlFor="accountType">Account Type *</Label>
              <Select defaultValue={selectedAccount?.type || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subType">Sub Type *</Label>
              <Select defaultValue={selectedAccount?.subType || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Other Current Asset">Other Current Asset</SelectItem>
                  <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                  <SelectItem value="Accounts Receivable">Accounts Receivable</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Accounts Payable">Accounts Payable</SelectItem>
                  <SelectItem value="Other Current Liability">Other Current Liability</SelectItem>
                  <SelectItem value="Long Term Liability">Long Term Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Other Income">Other Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Cost of Goods Sold">Cost of Goods Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <Input
                id="openingBalance"
                type="number"
                placeholder="0.00"
                defaultValue={selectedAccount?.balance || 0}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                defaultChecked={selectedAccount?.isActive ?? true}
                className="w-4 h-4"
              />
              <Label htmlFor="isActive">Active Account</Label>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for this account"
                defaultValue={selectedAccount?.description || ''}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setShowEditDialog(false)
              setSelectedAccount(null)
            }}>
              Cancel
            </Button>
            <Button>
              {showAddDialog ? 'Create Account' : 'Update Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  )
}