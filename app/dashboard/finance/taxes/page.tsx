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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Calculator, FileText, Calendar, DollarSign, AlertTriangle,
  CheckCircle, Clock, Download, Upload, Plus, Search, Filter,
  Edit, Eye, Trash2, Building2, Receipt, PieChart, TrendingUp,
  Target, Users, CreditCard, Shield, BookOpen, HelpCircle
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface TaxRecord {
  id: string
  taxType: 'VAT' | 'WHT' | 'CIT' | 'PAYE' | 'Education Tax' | 'ITF'
  period: string
  assessedAmount: number
  paidAmount: number
  dueDate: string
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid'
  filedDate?: string
  penaltyAmount?: number
  referenceNumber?: string
}

interface TaxReturn {
  id: string
  returnType: 'Monthly VAT' | 'Annual CIT' | 'Quarterly WHT' | 'Monthly PAYE'
  period: string
  grossRevenue: number
  taxableIncome: number
  taxDue: number
  status: 'Draft' | 'Filed' | 'Accepted' | 'Under Review'
  submissionDate?: string
  acceptanceDate?: string
}

export default function TaxCenterPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showNewTaxDialog, setShowNewTaxDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)

  // Sample tax records
  const taxRecords: TaxRecord[] = [
    {
      id: 'TX001',
      taxType: 'VAT',
      period: 'November 2024',
      assessedAmount: 2450000,
      paidAmount: 2450000,
      dueDate: '2024-12-15',
      status: 'Paid',
      filedDate: '2024-12-10',
      referenceNumber: 'VAT2024110001'
    },
    {
      id: 'TX002',
      taxType: 'PAYE',
      period: 'November 2024',
      assessedAmount: 1850000,
      paidAmount: 1850000,
      dueDate: '2024-12-10',
      status: 'Paid',
      filedDate: '2024-12-08',
      referenceNumber: 'PAYE2024110001'
    },
    {
      id: 'TX003',
      taxType: 'WHT',
      period: 'Q4 2024',
      assessedAmount: 890000,
      paidAmount: 445000,
      dueDate: '2024-12-31',
      status: 'Partially Paid',
      referenceNumber: 'WHT2024Q40001'
    },
    {
      id: 'TX004',
      taxType: 'CIT',
      period: 'FY 2024',
      assessedAmount: 5600000,
      paidAmount: 0,
      dueDate: '2024-12-31',
      status: 'Pending',
    },
    {
      id: 'TX005',
      taxType: 'Education Tax',
      period: 'FY 2024',
      assessedAmount: 280000,
      paidAmount: 0,
      dueDate: '2024-11-30',
      status: 'Overdue',
      penaltyAmount: 14000
    }
  ]

  // Sample tax returns
  const taxReturns: TaxReturn[] = [
    {
      id: 'TR001',
      returnType: 'Monthly VAT',
      period: 'November 2024',
      grossRevenue: 32500000,
      taxableIncome: 32500000,
      taxDue: 2450000,
      status: 'Filed',
      submissionDate: '2024-12-10',
      acceptanceDate: '2024-12-12'
    },
    {
      id: 'TR002',
      returnType: 'Monthly PAYE',
      period: 'November 2024',
      grossRevenue: 24650000,
      taxableIncome: 24650000,
      taxDue: 1850000,
      status: 'Accepted',
      submissionDate: '2024-12-08',
      acceptanceDate: '2024-12-09'
    },
    {
      id: 'TR003',
      returnType: 'Quarterly WHT',
      period: 'Q4 2024',
      grossRevenue: 11850000,
      taxableIncome: 11850000,
      taxDue: 890000,
      status: 'Draft'
    },
    {
      id: 'TR004',
      returnType: 'Annual CIT',
      period: 'FY 2024',
      grossRevenue: 280000000,
      taxableIncome: 186700000,
      taxDue: 5600000,
      status: 'Under Review',
      submissionDate: '2024-11-15'
    }
  ]

  // Tax compliance data for charts
  const complianceData = [
    { month: 'Jul', filed: 95, pending: 5, overdue: 0 },
    { month: 'Aug', filed: 92, pending: 6, overdue: 2 },
    { month: 'Sep', filed: 98, pending: 2, overdue: 0 },
    { month: 'Oct', filed: 90, pending: 8, overdue: 2 },
    { month: 'Nov', filed: 96, pending: 4, overdue: 0 }
  ]

  const taxBreakdownData = [
    { name: 'VAT', value: 2450000, color: '#3B82F6' },
    { name: 'PAYE', value: 1850000, color: '#10B981' },
    { name: 'CIT', value: 5600000, color: '#F59E0B' },
    { name: 'WHT', value: 890000, color: '#EF4444' },
    { name: 'Education Tax', value: 280000, color: '#8B5CF6' },
    { name: 'ITF', value: 125000, color: '#06B6D4' }
  ]

  const taxTypes = ['VAT', 'WHT', 'CIT', 'PAYE', 'Education Tax', 'ITF']
  const returnTypes = ['Monthly VAT', 'Annual CIT', 'Quarterly WHT', 'Monthly PAYE']

  // Filter records
  const filteredRecords = useMemo(() => {
    return taxRecords.filter(record => {
      const matchesSearch = record.taxType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || record.taxType === filterType
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, filterType, filterStatus])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Paid': { variant: 'default', color: 'text-green-600' },
      'Pending': { variant: 'outline', color: 'text-yellow-600' },
      'Overdue': { variant: 'destructive', color: 'text-red-600' },
      'Partially Paid': { variant: 'secondary', color: 'text-blue-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
  }

  const getReturnStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'Filed': { variant: 'outline' },
      'Accepted': { variant: 'default' },
      'Under Review': { variant: 'secondary' },
      'Draft': { variant: 'outline' }
    }
    return variants[status] || { variant: 'outline' }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalDue = taxRecords.reduce((sum, record) => sum + record.assessedAmount, 0)
    const totalPaid = taxRecords.reduce((sum, record) => sum + record.paidAmount, 0)
    const totalPenalties = taxRecords.reduce((sum, record) => sum + (record.penaltyAmount || 0), 0)
    const overdueCount = taxRecords.filter(record => record.status === 'Overdue').length

    return { totalDue, totalPaid, totalPenalties, overdueCount }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tax Center</h1>
            <p className="text-gray-600">Manage Nigerian tax compliance, returns, and payments</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  File Return
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>File Tax Return</DialogTitle>
                  <DialogDescription>Submit a new tax return</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Return Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select return type" />
                      </SelectTrigger>
                      <SelectContent>
                        {returnTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tax Period</Label>
                    <Input placeholder="e.g., November 2024" />
                  </div>
                  <div>
                    <Label>Gross Revenue</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label>Taxable Income</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                      Cancel
                    </Button>
                    <Button>File Return</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showNewTaxDialog} onOpenChange={setShowNewTaxDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Tax Payment</DialogTitle>
                  <DialogDescription>Record a new tax payment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Tax Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tax Period</Label>
                    <Input placeholder="e.g., November 2024" />
                  </div>
                  <div>
                    <Label>Amount Paid</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label>Payment Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Reference Number</Label>
                    <Input placeholder="Payment reference" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowNewTaxDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Record Payment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tax Due</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summaryStats.totalDue)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(summaryStats.totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(summaryStats.totalDue - summaryStats.totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {summaryStats.overdueCount}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Tax Records</TabsTrigger>
            <TabsTrigger value="returns">Tax Returns</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Breakdown</CardTitle>
                  <CardDescription>Distribution by tax type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={taxBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taxBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Trends</CardTitle>
                  <CardDescription>Monthly filing compliance rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="filed" stackId="1" stroke="#10B981" fill="#10B981" name="Filed" />
                      <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Pending" />
                      <Area type="monotone" dataKey="overdue" stackId="1" stroke="#EF4444" fill="#EF4444" name="Overdue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Due Dates</CardTitle>
                  <CardDescription>Tax obligations due soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {taxRecords
                      .filter(record => record.status !== 'Paid')
                      .slice(0, 5)
                      .map(record => (
                        <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{record.taxType}</div>
                            <div className="text-sm text-gray-600">{record.period}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(record.assessedAmount - record.paidAmount)}</div>
                            <div className="text-sm text-gray-600">{new Date(record.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest tax-related activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">VAT Payment Processed</div>
                        <div className="text-xs text-gray-600">November 2024 - ₦2.45M</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">PAYE Return Filed</div>
                        <div className="text-xs text-gray-600">November 2024</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">CIT Assessment Received</div>
                        <div className="text-xs text-gray-600">FY 2024 - ₦5.6M</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tax management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Tax Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Tax Calculator
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Tax Calendar
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Compliance Check
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tax Records</CardTitle>
                    <CardDescription>
                      {filteredRecords.length} of {taxRecords.length} records
                    </CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Tax Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tax Types</SelectItem>
                      {taxTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Records Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Assessed</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const statusInfo = getStatusBadge(record.status)
                      const outstanding = record.assessedAmount - record.paidAmount

                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.taxType}</div>
                            {record.referenceNumber && (
                              <div className="text-sm text-gray-500">{record.referenceNumber}</div>
                            )}
                          </TableCell>
                          <TableCell>{record.period}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.assessedAmount)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(record.paidAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={outstanding > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                              {formatCurrency(outstanding)}
                            </span>
                            {record.penaltyAmount && (
                              <div className="text-sm text-red-600">
                                +{formatCurrency(record.penaltyAmount)} penalty
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{new Date(record.dueDate).toLocaleDateString()}</div>
                            {record.filedDate && (
                              <div className="text-xs text-gray-500">
                                Filed: {new Date(record.filedDate).toLocaleDateString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {outstanding > 0 && (
                                <Button variant="ghost" size="sm" className="text-green-600">
                                  Pay
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

          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle>Tax Returns</CardTitle>
                <CardDescription>Filed and pending tax returns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Gross Revenue</TableHead>
                      <TableHead className="text-right">Taxable Income</TableHead>
                      <TableHead className="text-right">Tax Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxReturns.map((returnRecord) => (
                      <TableRow key={returnRecord.id}>
                        <TableCell className="font-medium">{returnRecord.returnType}</TableCell>
                        <TableCell>{returnRecord.period}</TableCell>
                        <TableCell className="text-right">{formatCurrency(returnRecord.grossRevenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(returnRecord.taxableIncome)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(returnRecord.taxDue)}</TableCell>
                        <TableCell>
                          <Badge variant={getReturnStatusBadge(returnRecord.status).variant}>
                            {returnRecord.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {returnRecord.submissionDate ? new Date(returnRecord.submissionDate).toLocaleDateString() : '-'}
                          {returnRecord.acceptanceDate && (
                            <div className="text-xs text-green-600">
                              Accepted: {new Date(returnRecord.acceptanceDate).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            {returnRecord.status === 'Draft' && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Calendar</CardTitle>
                  <CardDescription>Upcoming tax obligations and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-red-900">Education Tax Due</div>
                          <div className="text-sm text-red-700">FY 2024 - Overdue</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-900">₦280,000</div>
                          <div className="text-sm text-red-700">Nov 30, 2024</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-yellow-900">VAT Return</div>
                          <div className="text-sm text-yellow-700">December 2024</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-900">Due Soon</div>
                          <div className="text-sm text-yellow-700">Dec 15, 2024</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-blue-900">CIT Assessment</div>
                          <div className="text-sm text-blue-700">FY 2024</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-900">₦5.6M</div>
                          <div className="text-sm text-blue-700">Dec 31, 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Overall tax compliance health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Filing Compliance</span>
                        <span className="text-sm font-bold text-green-600">96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Payment Compliance</span>
                        <span className="text-sm font-bold text-yellow-600">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Penalty Avoidance</span>
                        <span className="text-sm font-bold text-red-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">B+</div>
                        <div className="text-sm text-gray-600">Overall Compliance Grade</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Configuration</CardTitle>
                  <CardDescription>Configure tax rates and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>VAT Rate</Label>
                    <Input placeholder="7.5%" defaultValue="7.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>WHT Rate - Services</Label>
                    <Input placeholder="5%" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>WHT Rate - Goods</Label>
                    <Input placeholder="2.5%" defaultValue="2.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Income Tax Rate</Label>
                    <Input placeholder="30%" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Education Tax Rate</Label>
                    <Input placeholder="2%" defaultValue="2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure tax deadline alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Early Warning (Days Before Due)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Final Notice (Days Before Due)</Label>
                    <Input type="number" defaultValue="7" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Notifications</Label>
                    <Input placeholder="tax@butaneenergy.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMS Notifications</Label>
                    <Input placeholder="+234-xxx-xxx-xxxx" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}