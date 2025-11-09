"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  UserCheck,
  UserX,
  Award,
  Building2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { filterByPlantAccess } from "@/lib/filters";

// Mock HR Data
const hrData = {
  overview: {
    totalEmployees: 245,
    activeEmployees: 238,
    onLeave: 7,
    newHires: 12,
    pendingApprovals: 5,
    averageSalary: 450000,
    turnoverRate: 3.2,
    attendanceRate: 96.8
  },
  departments: [
    { name: "Operations", employees: 98, manager: "John Adebayo", budget: 45000000 },
    { name: "Finance", employees: 22, manager: "Sarah Okonkwo", budget: 12000000 },
    { name: "Procurement", employees: 18, manager: "Ahmed Bello", budget: 8500000 },
    { name: "Admin", employees: 15, manager: "Grace Eze", budget: 6200000 },
    { name: "HR", employees: 8, manager: "David Okafor", budget: 3800000 },
    { name: "IT", employees: 12, manager: "Michael Adamu", budget: 5500000 }
  ],
  recentActivities: [
    { type: "new_hire", name: "Emmanuel Okafor", department: "Operations", date: "2024-01-15" },
    { type: "promotion", name: "Fatima Hassan", department: "Finance", date: "2024-01-14" },
    { type: "leave_request", name: "Joseph Nwankwo", department: "Procurement", date: "2024-01-13" },
    { type: "training", name: "Kemi Adebola", department: "Admin", date: "2024-01-12" },
    { type: "resignation", name: "Tunde Afolabi", department: "Operations", date: "2024-01-11" }
  ]
};

export default function HRPage() {
  const { user } = useAuth();

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_hire': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'promotion': return <Award className="h-4 w-4 text-blue-500" />;
      case 'leave_request': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'training': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'resignation': return <UserX className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'new_hire': return 'New Hire';
      case 'promotion': return 'Promotion';
      case 'leave_request': return 'Leave Request';
      case 'training': return 'Training Completed';
      case 'resignation': return 'Resignation';
      default: return 'Activity';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-muted-foreground">
            Manage employees, track performance, and oversee HR operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrData.overview.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{hrData.overview.newHires}</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrData.overview.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {hrData.overview.onLeave} currently on leave
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(hrData.overview.averageSalary)}</div>
              <p className="text-xs text-muted-foreground">
                Monthly average compensation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrData.overview.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{hrData.overview.turnoverRate}%</span> turnover rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Overview
              </CardTitle>
              <CardDescription>
                Employee distribution and budget allocation by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrData.departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Manager: {dept.manager}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{dept.employees} employees</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(dept.budget)} budget
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest HR activities and employee updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getActivityLabel(activity.type)} • {activity.department}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used HR functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Button className="h-20 flex-col gap-2" variant="outline" asChild>
                <a href="/dashboard/hr/employees">
                  <Users className="h-6 w-6" />
                  Employee Management
                </a>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline" asChild>
                <a href="/dashboard/hr/leave">
                  <Calendar className="h-6 w-6" />
                  Leave Management
                </a>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline" asChild>
                <a href="/dashboard/hr/payroll">
                  <DollarSign className="h-6 w-6" />
                  Payroll
                </a>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline" asChild>
                <a href="/dashboard/hr/training">
                  <FileText className="h-6 w-6" />
                  Training
                </a>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline" asChild>
                <a href="/dashboard/hr/performance">
                  <BarChart3 className="h-6 w-6" />
                  Performance
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        {hrData.overview.pendingApprovals > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription className="text-orange-600">
                You have {hrData.overview.pendingApprovals} items requiring approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                View Pending Items
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}