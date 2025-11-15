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
import {
  Users, DollarSign, Calculator, Calendar, Download, Upload,
  TrendingUp, AlertTriangle, CheckCircle, Clock, FileText,
  Plus, Search, Filter, Edit, Eye, User, Building,
  CreditCard, PiggyBank, Receipt, Target, BarChart3
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface Employee {
  id: string
  name: string
  department: string
  position: string
  baseSalary: number
  allowances: number
  deductions: number
  netPay: number
  payrollStatus: 'Processed' | 'Pending' | 'Hold' | 'Review'
  lastPayDate: string
  bankAccount: string
}

interface PayrollRun {
  id: string
  period: string
  status: 'Draft' | 'Processing' | 'Completed' | 'Cancelled'
  totalGross: number
  totalNet: number
  totalDeductions: number
  employeeCount: number
  runDate: string
  approvedBy?: string
}

export default function PayrollPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showProcessDialog, setShowProcessDialog] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('November 2024')

  // Sample employee payroll data
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Adebayo Johnson',
      department: 'Operations',
      position: 'Senior Engineer',
      baseSalary: 450000,
      allowances: 65000,
      deductions: 95000,
      netPay: 420000,
      payrollStatus: 'Processed',
      lastPayDate: '2024-10-31',
      bankAccount: '****-1234'
    },
    {
      id: 'EMP002',
      name: 'Fatima Abdullahi',
      department: 'Human Resources',
      position: 'HR Specialist',
      baseSalary: 380000,
      allowances: 50000,
      deductions: 78000,
      netPay: 352000,
      payrollStatus: 'Pending',
      lastPayDate: '2024-10-31',
      bankAccount: '****-5678'
    },
    {
      id: 'EMP003',
      name: 'Chidi Okafor',
      department: 'Finance',
      position: 'Finance Manager',
      baseSalary: 520000,
      allowances: 85000,
      deductions: 118000,
      netPay: 487000,
      payrollStatus: 'Review',
      lastPayDate: '2024-10-31',
      bankAccount: '****-9012'
    },
    {
      id: 'EMP004',
      name: 'Aisha Bello',
      department: 'Sales',
      position: 'Sales Representative',
      baseSalary: 320000,
      allowances: 45000,
      deductions: 68000,
      netPay: 297000,
      payrollStatus: 'Hold',
      lastPayDate: '2024-10-31',
      bankAccount: '****-3456'
    }
  ]

  // Sample payroll runs
  const payrollRuns: PayrollRun[] = [
    {
      id: 'PR001',
      period: 'November 2024',
      status: 'Processing',
      totalGross: 1670000,
      totalNet: 1556000,
      totalDeductions: 359000,
      employeeCount: 245,
      runDate: '2024-11-15',
    },
    {
      id: 'PR002',
      period: 'October 2024',
      status: 'Completed',
      totalGross: 1645000,
      totalNet: 1532000,
      totalDeductions: 354000,
      employeeCount: 243,
      runDate: '2024-10-31',
      approvedBy: 'Mohammed Ali'
    },
    {
      id: 'PR003',
      period: 'September 2024',
      status: 'Completed',
      totalGross: 1620000,
      totalNet: 1510000,
      totalDeductions: 348000,
      employeeCount: 240,
      runDate: '2024-09-30',
      approvedBy: 'Sarah Ibrahim'
    }
  ]

  // Sample chart data
  const payrollTrendData = [
    { month: 'Jul', gross: 1580000, net: 1470000, deductions: 330000 },
    { month: 'Aug', gross: 1600000, net: 1485000, deductions: 342000 },
    { month: 'Sep', gross: 1620000, net: 1510000, deductions: 348000 },
    { month: 'Oct', gross: 1645000, net: 1532000, deductions: 354000 },
    { month: 'Nov', gross: 1670000, net: 1556000, deductions: 359000 }
  ]

  const departments = ['Operations', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'IT']

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment
      const matchesStatus = filterStatus === 'all' || emp.payrollStatus === filterStatus

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [searchTerm, filterDepartment, filterStatus])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Processed': { variant: 'default', color: 'text-green-600' },
      'Pending': { variant: 'outline', color: 'text-yellow-600' },
      'Hold': { variant: 'destructive', color: 'text-red-600' },
      'Review': { variant: 'secondary', color: 'text-blue-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
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
    const totalGross = employees.reduce((sum, emp) => sum + emp.baseSalary + emp.allowances, 0)
    const totalNet = employees.reduce((sum, emp) => sum + emp.netPay, 0)
    const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0)
    const pendingCount = employees.filter(emp => emp.payrollStatus === 'Pending').length

    return { totalGross, totalNet, totalDeductions, pendingCount }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600">Process salaries, manage deductions, and generate payroll reports</p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="November 2024">November 2024</SelectItem>
                <SelectItem value="October 2024">October 2024</SelectItem>
                <SelectItem value="September 2024">September 2024</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Process Payroll
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Process Payroll</DialogTitle>
                  <DialogDescription>
                    Process payroll for {selectedPeriod}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Pay Period</Label>
                    <Input value={selectedPeriod} readOnly />
                  </div>
                  <div>
                    <Label>Cut-off Date</Label>
                    <Input type="date" defaultValue="2024-11-15" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Process Payroll
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
                  <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summaryStats.totalGross)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(summaryStats.totalNet)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(summaryStats.totalDeductions)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summaryStats.pendingCount}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employee Payroll</TabsTrigger>
            <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Trends</CardTitle>
                  <CardDescription>Monthly payroll overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={payrollTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="gross" stroke="#3B82F6" name="Gross Pay" />
                      <Line type="monotone" dataKey="net" stroke="#10B981" name="Net Pay" />
                      <Line type="monotone" dataKey="deductions" stroke="#EF4444" name="Deductions" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payroll Runs</CardTitle>
                  <CardDescription>Latest payroll processing activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payrollRuns.slice(0, 3).map((run) => (
                      <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              run.status === 'Completed' ? 'bg-green-500' :
                              run.status === 'Processing' ? 'bg-blue-500' :
                              run.status === 'Draft' ? 'bg-gray-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium">{run.period}</p>
                              <p className="text-sm text-gray-600">{run.employeeCount} employees</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(run.totalNet)}</p>
                          <Badge variant={run.status === 'Completed' ? 'default' : 'outline'}>
                            {run.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Employee Payroll</CardTitle>
                    <CardDescription>
                      {filteredEmployees.length} of {employees.length} employees
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
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Processed">Processed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Hold">Hold</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Base Salary</TableHead>
                      <TableHead className="text-right">Allowances</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => {
                      const statusInfo = getStatusBadge(employee.payrollStatus)

                      return (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{employee.name}</div>
                                <div className="text-sm text-gray-500">{employee.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.department}</div>
                              <div className="text-sm text-gray-600">{employee.position}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(employee.baseSalary)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            +{formatCurrency(employee.allowances)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatCurrency(employee.deductions)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(employee.netPay)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              {employee.payrollStatus}
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

          <TabsContent value="runs">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Runs</CardTitle>
                <CardDescription>History of payroll processing runs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead className="text-right">Gross Pay</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Run Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">{run.period}</TableCell>
                        <TableCell>{run.employeeCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(run.totalGross)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatCurrency(run.totalDeductions)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(run.totalNet)}</TableCell>
                        <TableCell>
                          <Badge variant={run.status === 'Completed' ? 'default' : 'outline'}>
                            {run.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(run.runDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Reports</CardTitle>
                  <CardDescription>Generate comprehensive payroll reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Monthly Payroll Summary</div>
                      <div className="text-sm text-gray-600">Complete payroll overview for the month</div>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Employee Pay Slips</div>
                      <div className="text-sm text-gray-600">Individual pay slips for all employees</div>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Tax Deduction Report</div>
                      <div className="text-sm text-gray-600">PAYE and other tax deductions</div>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Bank Transfer File</div>
                      <div className="text-sm text-gray-600">Export for bank salary transfers</div>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payroll Analytics</CardTitle>
                  <CardDescription>Key metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-blue-900">Average Salary</div>
                          <div className="text-sm text-blue-700">Across all employees</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">₦385K</div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-900">Payroll Efficiency</div>
                          <div className="text-sm text-green-700">Processing accuracy</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">98.5%</div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-yellow-900">Processing Time</div>
                          <div className="text-sm text-yellow-700">Average run duration</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">2.3h</div>
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
                  <CardTitle>Payroll Configuration</CardTitle>
                  <CardDescription>Configure payroll processing settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Pay Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Date</Label>
                    <Select defaultValue="last-day">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-day">Last Day of Month</SelectItem>
                        <SelectItem value="15th">15th of Month</SelectItem>
                        <SelectItem value="30th">30th of Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="NGN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>Configure tax rates and deductions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>PAYE Tax Rate</Label>
                    <Input placeholder="7.5%" defaultValue="7.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pension Contribution</Label>
                    <Input placeholder="8%" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>NHIS Contribution</Label>
                    <Input placeholder="1.75%" defaultValue="1.75" />
                  </div>
                  <div className="space-y-2">
                    <Label>ITF Contribution</Label>
                    <Input placeholder="1%" defaultValue="1" />
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