"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Clock, Calendar, CheckCircle, TrendingUp, XCircle, Circle, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const leaveRequests = [
  {
    id: "LR-001",
    employee: "John Adeyemi",
    employeeId: "EMP-001",
    department: "TDU",
    leaveType: "Annual Leave",
    startDate: "2025-11-25",
    endDate: "2025-11-29",
    days: 5,
    status: "pending",
    reason: "Family vacation",
    appliedDate: "2025-11-15",
    approver: "Emeka Okafor",
    balance: 18
  },
  {
    id: "LR-002",
    employee: "Sarah Okafor",
    employeeId: "EMP-002",
    department: "Logistics",
    leaveType: "Sick Leave",
    startDate: "2025-11-18",
    endDate: "2025-11-20",
    days: 3,
    status: "approved",
    reason: "Medical treatment",
    appliedDate: "2025-11-16",
    approver: "Grace Nneka",
    balance: 7
  },
  {
    id: "LR-003",
    employee: "Ahmed Hassan",
    employeeId: "EMP-003",
    department: "Finance",
    leaveType: "Maternity Leave",
    startDate: "2025-12-01",
    endDate: "2026-03-01",
    days: 90,
    status: "approved",
    reason: "Maternity care",
    appliedDate: "2025-10-15",
    approver: "David Eze",
    balance: 0
  },
  {
    id: "LR-004",
    employee: "Grace Nneka",
    employeeId: "EMP-004",
    department: "HR",
    leaveType: "Emergency Leave",
    startDate: "2025-11-17",
    endDate: "2025-11-17",
    days: 1,
    status: "rejected",
    reason: "Personal emergency",
    appliedDate: "2025-11-17",
    approver: "David Eze",
    balance: 2
  }
];

const leaveBalances = [
  {
    employee: "John Adeyemi",
    employeeId: "EMP-001",
    department: "TDU",
    annual: { allocated: 21, used: 3, remaining: 18 },
    sick: { allocated: 10, used: 2, remaining: 8 },
    maternity: { allocated: 90, used: 0, remaining: 90 },
    emergency: { allocated: 3, used: 1, remaining: 2 }
  },
  {
    employee: "Sarah Okafor",
    employeeId: "EMP-002",
    department: "Logistics",
    annual: { allocated: 21, used: 8, remaining: 13 },
    sick: { allocated: 10, used: 3, remaining: 7 },
    maternity: { allocated: 90, used: 0, remaining: 90 },
    emergency: { allocated: 3, used: 0, remaining: 3 }
  },
  {
    employee: "Ahmed Hassan",
    employeeId: "EMP-003",
    department: "Finance",
    annual: { allocated: 21, used: 5, remaining: 16 },
    sick: { allocated: 10, used: 1, remaining: 9 },
    maternity: { allocated: 90, used: 90, remaining: 0 },
    emergency: { allocated: 3, used: 2, remaining: 1 }
  },
  {
    employee: "Grace Nneka",
    employeeId: "EMP-004",
    department: "HR",
    annual: { allocated: 21, used: 12, remaining: 9 },
    sick: { allocated: 10, used: 4, remaining: 6 },
    maternity: { allocated: 90, used: 0, remaining: 90 },
    emergency: { allocated: 3, used: 1, remaining: 2 }
  }
];

const leaveCalendar = [
  {
    date: "2025-11-18",
    employee: "Sarah Okafor",
    type: "Sick Leave",
    status: "approved"
  },
  {
    date: "2025-11-19",
    employee: "Sarah Okafor",
    type: "Sick Leave",
    status: "approved"
  },
  {
    date: "2025-11-20",
    employee: "Sarah Okafor",
    type: "Sick Leave",
    status: "approved"
  },
  {
    date: "2025-11-25",
    employee: "John Adeyemi",
    type: "Annual Leave",
    status: "pending"
  },
  {
    date: "2025-12-01",
    employee: "Ahmed Hassan",
    type: "Maternity Leave",
    status: "approved"
  }
];

const leaveStatistics = [
  { month: "Jan", annual: 45, sick: 12, emergency: 3, maternity: 2 },
  { month: "Feb", annual: 38, sick: 15, emergency: 5, maternity: 1 },
  { month: "Mar", annual: 52, sick: 8, emergency: 2, maternity: 3 },
  { month: "Apr", annual: 41, sick: 18, emergency: 7, maternity: 2 },
  { month: "May", annual: 35, sick: 10, emergency: 4, maternity: 1 },
  { month: "Jun", annual: 48, sick: 14, emergency: 6, maternity: 2 }
];

const leaveTypeDistribution = [
  { name: "Annual Leave", value: 65, color: "#10B981" },
  { name: "Sick Leave", value: 20, color: "#EF4444" },
  { name: "Maternity", value: 10, color: "#8B5CF6" },
  { name: "Emergency", value: 5, color: "#F59E0B" }
];

const departmentLeaveUsage = [
  { department: "TDU", usage: 68, allocated: 420, used: 285 },
  { department: "Logistics", usage: 72, allocated: 315, used: 227 },
  { department: "Finance", usage: 59, allocated: 210, used: 124 },
  { department: "HR", usage: 81, allocated: 189, used: 153 },
  { department: "Admin", usage: 45, allocated: 126, used: 57 }
];

export default function LeaveManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Annual Leave": return "bg-blue-100 text-blue-800";
      case "Sick Leave": return "bg-red-100 text-red-800";
      case "Maternity Leave": return "bg-purple-100 text-purple-800";
      case "Emergency Leave": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getBalanceColor = (remaining: number, allocated: number) => {
    const percentage = (remaining / allocated) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.leaveType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests and balances</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Leave Request
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Leave days taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 days</div>
            <p className="text-xs text-muted-foreground">-0.3 days improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name or leave type..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leave Requests */}
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {request.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{request.employee}</CardTitle>
                        <CardDescription>{request.department} • {request.employeeId}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(request.leaveType)}>
                        {request.leaveType}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Leave Dates</p>
                      <p className="font-medium">{request.startDate} - {request.endDate}</p>
                      <p className="text-sm text-muted-foreground">{request.days} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="font-medium">{request.appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approver</p>
                      <p className="font-medium">{request.approver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance Remaining</p>
                      <p className={`font-medium ${getBalanceColor(request.balance, 21)}`}>
                        {request.balance} days
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="text-sm">{request.reason}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    {request.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
              <CardDescription>Current leave allocations and usage by employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {leaveBalances.map((balance, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {balance.employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{balance.employee}</h3>
                          <p className="text-sm text-muted-foreground">{balance.department} • {balance.employeeId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Leave</p>
                        <p className={`font-medium ${getBalanceColor(balance.annual.remaining, balance.annual.allocated)}`}>
                          {balance.annual.remaining}/{balance.annual.allocated}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${(balance.annual.used / balance.annual.allocated) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sick Leave</p>
                        <p className={`font-medium ${getBalanceColor(balance.sick.remaining, balance.sick.allocated)}`}>
                          {balance.sick.remaining}/{balance.sick.allocated}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-red-500 h-1 rounded-full"
                            style={{ width: `${(balance.sick.used / balance.sick.allocated) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maternity Leave</p>
                        <p className={`font-medium ${getBalanceColor(balance.maternity.remaining, balance.maternity.allocated)}`}>
                          {balance.maternity.remaining}/{balance.maternity.allocated}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${(balance.maternity.used / balance.maternity.allocated) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Emergency Leave</p>
                        <p className={`font-medium ${getBalanceColor(balance.emergency.remaining, balance.emergency.allocated)}`}>
                          {balance.emergency.remaining}/{balance.emergency.allocated}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-orange-500 h-1 rounded-full"
                            style={{ width: `${(balance.emergency.used / balance.emergency.allocated) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>Overview of upcoming and recent leave schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveCalendar.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{leave.employee}</p>
                        <p className="text-sm text-muted-foreground">{leave.type}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{leave.date}</p>
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status}
                      </Badge>
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
                <CardTitle>Monthly Leave Trends</CardTitle>
                <CardDescription>Leave usage by type over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaveStatistics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="annual" fill="#10B981" name="Annual" />
                    <Bar dataKey="sick" fill="#EF4444" name="Sick" />
                    <Bar dataKey="emergency" fill="#F59E0B" name="Emergency" />
                    <Bar dataKey="maternity" fill="#8B5CF6" name="Maternity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Type Distribution</CardTitle>
                <CardDescription>Breakdown by leave category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {leaveTypeDistribution.map((entry, index) => (
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
                <CardTitle>Department Leave Usage</CardTitle>
                <CardDescription>Leave utilization by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentLeaveUsage.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.used}/{dept.allocated} days used</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${dept.usage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{dept.usage}%</span>
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
    </DashboardLayout>
  );
}