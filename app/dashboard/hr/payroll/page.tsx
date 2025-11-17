"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Download, DollarSign, Calculator, PiggyBank, Users, CheckCircle, Check, Clock, XCircle, Circle, FileText, Edit, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const payrollRecords = [
  {
    id: "PAY-001",
    employee: "John Adeyemi",
    employeeId: "EMP-001",
    department: "TDU",
    position: "Senior Engineer",
    basicSalary: 180000,
    allowances: 35000,
    overtime: 12000,
    bonus: 25000,
    deductions: 8500,
    tax: 18000,
    pension: 9000,
    netPay: 216500,
    payPeriod: "November 2025",
    status: "processed",
    bankAccount: "1234567890"
  },
  {
    id: "PAY-002",
    employee: "Sarah Okafor",
    employeeId: "EMP-002",
    department: "Logistics",
    position: "Logistics Manager",
    basicSalary: 150000,
    allowances: 28000,
    overtime: 8000,
    bonus: 15000,
    deductions: 6500,
    tax: 15000,
    pension: 7500,
    netPay: 172000,
    payPeriod: "November 2025",
    status: "pending",
    bankAccount: "0987654321"
  },
  {
    id: "PAY-003",
    employee: "Ahmed Hassan",
    employeeId: "EMP-003",
    department: "Finance",
    position: "Financial Analyst",
    basicSalary: 120000,
    allowances: 22000,
    overtime: 5000,
    bonus: 10000,
    deductions: 4200,
    tax: 12000,
    pension: 6000,
    netPay: 134800,
    payPeriod: "November 2025",
    status: "approved",
    bankAccount: "1122334455"
  },
  {
    id: "PAY-004",
    employee: "Grace Nneka",
    employeeId: "EMP-004",
    department: "HR",
    position: "HR Manager",
    basicSalary: 160000,
    allowances: 30000,
    overtime: 6000,
    bonus: 20000,
    deductions: 7000,
    tax: 16000,
    pension: 8000,
    netPay: 185000,
    payPeriod: "November 2025",
    status: "processed",
    bankAccount: "5566778899"
  }
];

const taxBrackets = [
  { income: "₦0 - ₦300K", rate: "7%", employees: 45 },
  { income: "₦300K - ₦600K", rate: "11%", employees: 78 },
  { income: "₦600K - ₦1.1M", rate: "15%", employees: 32 },
  { income: "₦1.1M - ₦1.6M", rate: "19%", employees: 18 },
  { income: "₦1.6M - ₦3.2M", rate: "21%", employees: 8 },
  { income: "Above ₦3.2M", rate: "24%", employees: 3 }
];

const payrollSummary = [
  { month: "Jan", totalPay: 2850000, tax: 285000, pension: 142500, netPay: 2422500 },
  { month: "Feb", totalPay: 2920000, tax: 292000, pension: 146000, netPay: 2482000 },
  { month: "Mar", totalPay: 3150000, tax: 315000, pension: 157500, netPay: 2677500 },
  { month: "Apr", totalPay: 3080000, tax: 308000, pension: 154000, netPay: 2618000 },
  { month: "May", totalPay: 3250000, tax: 325000, pension: 162500, netPay: 2762500 },
  { month: "Jun", totalPay: 3180000, tax: 318000, pension: 159000, netPay: 2703000 }
];

const departmentPayroll = [
  { department: "TDU", employees: 45, totalPay: 8100000, avgPay: 180000 },
  { department: "Logistics", employees: 32, totalPay: 4800000, avgPay: 150000 },
  { department: "Finance", employees: 28, totalPay: 3360000, avgPay: 120000 },
  { department: "HR", employees: 18, totalPay: 2880000, avgPay: 160000 },
  { department: "Admin", employees: 25, totalPay: 3000000, avgPay: 120000 },
  { department: "Sales", employees: 35, totalPay: 5250000, avgPay: 150000 }
];

const payrollBreakdown = [
  { name: "Basic Salary", value: 68, color: "#10B981" },
  { name: "Allowances", value: 15, color: "#3B82F6" },
  { name: "Overtime", value: 8, color: "#F59E0B" },
  { name: "Bonus", value: 9, color: "#8B5CF6" }
];

const benefitsData = [
  {
    employee: "John Adeyemi",
    employeeId: "EMP-001",
    department: "TDU",
    healthInsurance: 15000,
    pensionContrib: 9000,
    lifeInsurance: 5000,
    transportAllowance: 25000,
    mealAllowance: 10000,
    totalBenefits: 64000
  },
  {
    employee: "Sarah Okafor",
    employeeId: "EMP-002",
    department: "Logistics",
    healthInsurance: 12000,
    pensionContrib: 7500,
    lifeInsurance: 4000,
    transportAllowance: 20000,
    mealAllowance: 8000,
    totalBenefits: 51500
  },
  {
    employee: "Ahmed Hassan",
    employeeId: "EMP-003",
    department: "Finance",
    healthInsurance: 10000,
    pensionContrib: 6000,
    lifeInsurance: 3000,
    transportAllowance: 15000,
    mealAllowance: 7000,
    totalBenefits: 41000
  },
  {
    employee: "Grace Nneka",
    employeeId: "EMP-004",
    department: "HR",
    healthInsurance: 12500,
    pensionContrib: 8000,
    lifeInsurance: 4500,
    transportAllowance: 22000,
    mealAllowance: 9000,
    totalBenefits: 56000
  }
];

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-green-100 text-green-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed": return <CheckCircle className="h-4 w-4" />;
      case "approved": return <Check className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalNetPay = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalTax = payrollRecords.reduce((sum, record) => sum + record.tax, 0);
  const totalPension = payrollRecords.reduce((sum, record) => sum + record.pension, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee compensation, benefits, and payroll processing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Payroll
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalNetPay)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Deducted</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalTax)}</div>
            <p className="text-xs text-muted-foreground">To be remitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pension Fund</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPension)}</div>
            <p className="text-xs text-muted-foreground">Employee contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">183</div>
            <p className="text-xs text-muted-foreground">4 pending approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payroll">Payroll Records</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="tax">Tax Information</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="TDU">TDU</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payroll Records */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Records</CardTitle>
              <CardDescription>Detailed payroll breakdown for all employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Pension</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">
                                {record.employee.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{record.employee}</p>
                              <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{record.position}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.basicSalary)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.allowances)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.overtime)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.bonus)}</TableCell>
                        <TableCell className="font-medium text-red-600">{formatCurrency(record.deductions)}</TableCell>
                        <TableCell className="font-medium text-red-600">{formatCurrency(record.tax)}</TableCell>
                        <TableCell className="font-medium text-red-600">{formatCurrency(record.pension)}</TableCell>
                        <TableCell className="font-bold text-green-600">{formatCurrency(record.netPay)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{record.bankAccount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {record.status === "approved" && (
                              <Button size="sm">
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Benefits Overview</CardTitle>
              <CardDescription>Breakdown of benefits and allowances by employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Health Insurance</TableHead>
                      <TableHead>Pension Contribution</TableHead>
                      <TableHead>Life Insurance</TableHead>
                      <TableHead>Transport Allowance</TableHead>
                      <TableHead>Meal Allowance</TableHead>
                      <TableHead>Total Benefits</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {benefitsData.map((benefit, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">
                                {benefit.employee.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{benefit.employee}</p>
                              <p className="text-sm text-muted-foreground">{benefit.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{benefit.department}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(benefit.healthInsurance)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(benefit.pensionContrib)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(benefit.lifeInsurance)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(benefit.transportAllowance)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(benefit.mealAllowance)}</TableCell>
                        <TableCell className="font-bold text-green-600">{formatCurrency(benefit.totalBenefits)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Brackets & Employee Distribution</CardTitle>
              <CardDescription>Current tax brackets and employee distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxBrackets.map((bracket, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{bracket.income}</p>
                      <p className="text-sm text-muted-foreground">Income Range</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{bracket.rate}</p>
                      <p className="text-sm text-muted-foreground">Tax Rate</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{bracket.employees} employees</p>
                      <p className="text-sm text-muted-foreground">In this bracket</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payroll Summary</CardTitle>
                <CardDescription>Payroll trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={payrollSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                    <Bar dataKey="totalPay" fill="#10B981" name="Total Pay" />
                    <Bar dataKey="tax" fill="#EF4444" name="Tax" />
                    <Bar dataKey="pension" fill="#3B82F6" name="Pension" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Breakdown</CardTitle>
                <CardDescription>Distribution of pay components</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={payrollBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {payrollBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Payroll</CardTitle>
                <CardDescription>Payroll distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPayroll.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{formatCurrency(dept.totalPay)}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(dept.avgPay)}</p>
                        <p className="text-sm text-muted-foreground">Average</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Pay Trend</CardTitle>
                <CardDescription>Monthly net pay progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={payrollSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                    <Line type="monotone" dataKey="netPay" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}