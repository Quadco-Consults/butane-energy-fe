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
  Plus, Search, Filter, Edit, Trash2, Eye, Download, Send,
  FileText, Calendar, Clock, CheckCircle, XCircle, AlertTriangle,
  DollarSign, Users, Building, Mail, Phone, MapPin,
  Calculator, Receipt, Truck, Package, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, Banknote
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  creditLimit: number
  currentBalance: number
  paymentTerms: string
  status: 'Active' | 'Inactive' | 'Hold'
  taxRate: number
  lastPurchase?: string
}

interface Invoice {
  id: string
  number: string
  customerId: string
  customerName: string
  date: string
  dueDate: string
  status: 'Draft' | 'Sent' | 'Viewed' | 'Overdue' | 'Paid' | 'Cancelled'
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  amountPaid: number
  balance: number
  items: InvoiceItem[]
  notes?: string
  terms?: string
  lastAction?: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxable: boolean
  category?: string
}

interface Product {
  id: string
  name: string
  description: string
  sku: string
  price: number
  cost: number
  stockQuantity: number
  unit: string
  taxable: boolean
  category: string
  status: 'Active' | 'Inactive'
}

const customers: Customer[] = [
  {
    id: 'CUST001',
    name: 'ABC Gas Distribution Ltd',
    email: 'accounts@abcgas.com',
    phone: '+234-801-234-5678',
    address: '123 Industrial Estate',
    city: 'Lagos',
    state: 'Lagos',
    creditLimit: 5000000,
    currentBalance: 850000,
    paymentTerms: 'Net 30',
    status: 'Active',
    taxRate: 7.5,
    lastPurchase: '2024-01-16'
  },
  {
    id: 'CUST002',
    name: 'XYZ Energy Solutions',
    email: 'billing@xyzenenergy.com',
    phone: '+234-803-876-5432',
    address: '456 Commercial Avenue',
    city: 'Abuja',
    state: 'FCT',
    creditLimit: 3000000,
    currentBalance: 620000,
    paymentTerms: 'Net 15',
    status: 'Active',
    taxRate: 7.5,
    lastPurchase: '2024-01-14'
  },
  {
    id: 'CUST003',
    name: 'PQR Industrial Services',
    email: 'finance@pqrindustrial.com',
    phone: '+234-805-111-2233',
    address: '789 Port Road',
    city: 'Port Harcourt',
    state: 'Rivers',
    creditLimit: 2000000,
    currentBalance: 0,
    paymentTerms: 'Net 30',
    status: 'Active',
    taxRate: 7.5,
    lastPurchase: '2024-01-10'
  }
]

const products: Product[] = [
  {
    id: 'PROD001',
    name: '12.5kg LPG Cylinder (Filled)',
    description: 'Standard 12.5kg LPG cylinder with gas',
    sku: 'LPG-12.5-FILL',
    price: 8500,
    cost: 6200,
    stockQuantity: 2500,
    unit: 'Each',
    taxable: true,
    category: 'LPG Products',
    status: 'Active'
  },
  {
    id: 'PROD002',
    name: '6kg LPG Cylinder (Filled)',
    description: 'Compact 6kg LPG cylinder with gas',
    sku: 'LPG-6-FILL',
    price: 4200,
    cost: 3100,
    stockQuantity: 1800,
    unit: 'Each',
    taxable: true,
    category: 'LPG Products',
    status: 'Active'
  },
  {
    id: 'PROD003',
    name: 'Empty LPG Cylinder - 12.5kg',
    description: 'Empty 12.5kg LPG cylinder',
    sku: 'CYL-12.5-EMPTY',
    price: 15000,
    cost: 12500,
    stockQuantity: 500,
    unit: 'Each',
    taxable: true,
    category: 'Equipment',
    status: 'Active'
  },
  {
    id: 'PROD004',
    name: 'Gas Regulator',
    description: 'Standard pressure regulator',
    sku: 'REG-STANDARD',
    price: 2500,
    cost: 1800,
    stockQuantity: 200,
    unit: 'Each',
    taxable: true,
    category: 'Accessories',
    status: 'Active'
  },
  {
    id: 'PROD005',
    name: 'Delivery Service',
    description: 'Home/Office delivery service',
    sku: 'SVC-DELIVERY',
    price: 1500,
    cost: 800,
    stockQuantity: 0,
    unit: 'Service',
    taxable: false,
    category: 'Services',
    status: 'Active'
  }
]

const invoices: Invoice[] = [
  {
    id: 'INV001',
    number: 'INV-2024-001',
    customerId: 'CUST001',
    customerName: 'ABC Gas Distribution Ltd',
    date: '2024-01-16',
    dueDate: '2024-02-15',
    status: 'Sent',
    subtotal: 850000,
    taxAmount: 63750,
    discountAmount: 0,
    total: 913750,
    amountPaid: 0,
    balance: 913750,
    items: [
      {
        id: '1',
        description: '12.5kg LPG Cylinder (Filled)',
        quantity: 100,
        rate: 8500,
        amount: 850000,
        taxable: true
      }
    ],
    notes: 'Bulk order for monthly distribution',
    terms: 'Payment due within 30 days',
    lastAction: 'Email sent to customer'
  },
  {
    id: 'INV002',
    number: 'INV-2024-002',
    customerId: 'CUST002',
    customerName: 'XYZ Energy Solutions',
    date: '2024-01-14',
    dueDate: '2024-01-29',
    status: 'Overdue',
    subtotal: 630000,
    taxAmount: 47250,
    discountAmount: 15000,
    total: 662250,
    amountPaid: 42250,
    balance: 620000,
    items: [
      {
        id: '1',
        description: '12.5kg LPG Cylinder (Filled)',
        quantity: 50,
        rate: 8500,
        amount: 425000,
        taxable: true
      },
      {
        id: '2',
        description: '6kg LPG Cylinder (Filled)',
        quantity: 50,
        rate: 4200,
        amount: 210000,
        taxable: true
      },
      {
        id: '3',
        description: 'Delivery Service',
        quantity: 1,
        rate: 10000,
        amount: 10000,
        taxable: false
      }
    ],
    notes: 'Mixed order with delivery service',
    terms: 'Payment due within 15 days'
  },
  {
    id: 'INV003',
    number: 'INV-2024-003',
    customerId: 'CUST003',
    customerName: 'PQR Industrial Services',
    date: '2024-01-10',
    dueDate: '2024-02-09',
    status: 'Paid',
    subtotal: 400000,
    taxAmount: 30000,
    discountAmount: 0,
    total: 430000,
    amountPaid: 430000,
    balance: 0,
    items: [
      {
        id: '1',
        description: '6kg LPG Cylinder (Filled)',
        quantity: 100,
        rate: 4200,
        amount: 420000,
        taxable: true
      }
    ],
    notes: 'Regular monthly order',
    terms: 'Payment due within 30 days'
  },
  {
    id: 'INV004',
    number: 'INV-2024-004',
    customerId: 'CUST001',
    customerName: 'ABC Gas Distribution Ltd',
    date: '2024-01-08',
    dueDate: '2024-02-07',
    status: 'Draft',
    subtotal: 750000,
    taxAmount: 56250,
    discountAmount: 0,
    total: 806250,
    amountPaid: 0,
    balance: 806250,
    items: [
      {
        id: '1',
        description: 'Empty LPG Cylinder - 12.5kg',
        quantity: 50,
        rate: 15000,
        amount: 750000,
        taxable: true
      }
    ],
    notes: 'Cylinder replacement order',
    terms: 'Payment due within 30 days'
  }
]

const salesData = [
  { month: 'Jul', revenue: 12500000, invoices: 45 },
  { month: 'Aug', revenue: 14200000, invoices: 52 },
  { month: 'Sep', revenue: 13800000, invoices: 48 },
  { month: 'Oct', revenue: 15600000, invoices: 58 },
  { month: 'Nov', revenue: 14900000, invoices: 54 },
  { month: 'Dec', revenue: 16800000, invoices: 62 },
  { month: 'Jan', revenue: 8750000, invoices: 32 }
]

const categoryBreakdown = [
  { name: 'LPG Products', value: 6800000, color: '#0ea5e9', percentage: 77.7 },
  { name: 'Equipment', value: 1250000, color: '#3b82f6', percentage: 14.3 },
  { name: 'Accessories', value: 450000, color: '#6366f1', percentage: 5.1 },
  { name: 'Services', value: 250000, color: '#8b5cf6', percentage: 2.9 }
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
    case 'Sent': case 'Viewed': return 'bg-blue-100 text-blue-800'
    case 'Overdue': return 'bg-red-100 text-red-800'
    case 'Draft': return 'bg-gray-100 text-gray-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return CheckCircle
    case 'Sent': case 'Viewed': return Mail
    case 'Overdue': return AlertTriangle
    case 'Draft': return Edit
    case 'Cancelled': return XCircle
    default: return FileText
  }
}

export default function SalesInvoicing() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCustomer, setFilterCustomer] = useState<string>('all')
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
      const matchesCustomer = filterCustomer === 'all' || invoice.customerId === filterCustomer
      return matchesSearch && matchesStatus && matchesCustomer
    })
  }, [searchTerm, filterStatus, filterCustomer])

  // Calculate totals
  const totals = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalOutstanding = invoices.filter(inv => inv.balance > 0).reduce((sum, inv) => sum + inv.balance, 0)
    const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.balance, 0)
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0)

    return { totalRevenue, totalOutstanding, totalOverdue, totalPaid }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Invoicing</h1>
          <p className="text-gray-600">Manage customers, products, invoices and sales</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowInvoiceDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(totals.totalOutstanding)}</p>
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
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalOverdue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.totalPaid)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Monthly revenue and invoice count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                      <YAxis yAxisId="invoices" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          name === 'revenue' ? formatCurrency(value) : value,
                          name === 'revenue' ? 'Revenue' : 'Invoices'
                        ]}
                      />
                      <Legend />
                      <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
                      <Line yAxisId="invoices" type="monotone" dataKey="invoices" stroke="#3b82f6" strokeWidth={2} name="Invoices" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>Latest invoicing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => {
                      const StatusIcon = getStatusIcon(invoice.status)
                      return (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              invoice.status === 'Paid' ? 'bg-green-100' :
                              invoice.status === 'Overdue' ? 'bg-red-100' :
                              invoice.status === 'Draft' ? 'bg-gray-100' : 'bg-blue-100'
                            }`}>
                              <StatusIcon className={`w-5 h-5 ${
                                invoice.status === 'Paid' ? 'text-green-600' :
                                invoice.status === 'Overdue' ? 'text-red-600' :
                                invoice.status === 'Draft' ? 'text-gray-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{invoice.number}</p>
                              <p className="text-xs text-gray-500">{invoice.customerName}</p>
                              <Badge className={getStatusColor(invoice.status)} variant="outline">
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatCurrency(invoice.total)}</p>
                            {invoice.balance > 0 && (
                              <p className="text-xs text-red-600">
                                Due: {formatCurrency(invoice.balance)}
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

          {/* Revenue by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Revenue by Category
              </CardTitle>
              <CardDescription>Sales breakdown by product categories</CardDescription>
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
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>{filteredInvoices.length} invoices</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Viewed">Viewed</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
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
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.balance > 0

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{invoice.number}</span>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell className="font-mono">{invoice.date}</TableCell>
                        <TableCell className={`font-mono ${isOverdue ? 'text-red-600' : ''}`}>
                          {invoice.dueDate}
                        </TableCell>
                        <TableCell className="font-mono">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell className={`font-mono ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(invoice.balance)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="w-3 h-3" />
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

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Customer Management</CardTitle>
                  <CardDescription>{customers.length} customers</CardDescription>
                </div>
                <Button onClick={() => setShowCustomerDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">Last purchase: {customer.lastPurchase || 'Never'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.city}, {customer.state}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(customer.creditLimit)}</TableCell>
                      <TableCell className={`font-mono ${customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(customer.currentBalance)}
                      </TableCell>
                      <TableCell>{customer.paymentTerms}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status}
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
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3" />
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

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product & Services</CardTitle>
                  <CardDescription>{products.length} items</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product/Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product/Service</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(product.cost)}</TableCell>
                      <TableCell>
                        {product.stockQuantity > 0 ? (
                          <span className="text-green-600">{product.stockQuantity} {product.unit}</span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                          {product.status}
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estimates Tab */}
        <TabsContent value="estimates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estimates & Quotes</CardTitle>
                  <CardDescription>Manage sales estimates and quotes</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Estimate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No estimates found. Create your first estimate to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedInvoice.number}</DialogTitle>
              <DialogDescription>Invoice details and line items</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <p>{selectedInvoice.date}</p>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <p>{selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div>
                <Label>Line Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-mono">{formatCurrency(item.rate)}</TableCell>
                        <TableCell className="font-mono">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice.taxAmount)}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <span className="font-mono text-green-600">-{formatCurrency(selectedInvoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-green-600">{formatCurrency(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Balance Due:</span>
                  <span className={`font-mono ${selectedInvoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(selectedInvoice.balance)}
                  </span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Generate an invoice for a customer</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div>
                <Label htmlFor="terms">Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Invoice Notes</Label>
              <Textarea
                placeholder="Add notes or special instructions..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
              Cancel
            </Button>
            <Button>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer profile</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="customerName">Company Name *</Label>
              <Input id="customerName" placeholder="Enter company name" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter street address" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter city" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="Enter state" />
            </div>
            <div>
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input id="creditLimit" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net15">Net 15</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net45">Net 45</SelectItem>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
              Cancel
            </Button>
            <Button>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  )
}