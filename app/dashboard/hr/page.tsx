'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users, Calendar, Clock, UserPlus, Target, BarChart3,
  TrendingUp, TrendingDown, UserCheck, UserX, Award,
  Building, AlertCircle, CheckCircle, MessageSquare,
  FileText, DollarSign, Activity, Bell, Search,
  Filter, Download, Settings, Plus, Eye, Edit
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts'
import Link from 'next/link'

// OrangeHRM-style data structure
const hrData = {
  overview: {
    totalEmployees: 245,
    activeEmployees: 238,
    onLeave: 7,
    newHiresThisMonth: 12,
    pendingApplications: 8,
    avgAttendance: 96.8,
    turnoverRate: 3.2,
    employeeSatisfaction: 4.2
  },
  quickActions: [
    { title: 'Add Employee', icon: UserPlus, href: '/dashboard/hr/pim/add-employee', color: 'bg-orange-500' },
    { title: 'Apply Leave', icon: Calendar, href: '/dashboard/hr/leave/apply', color: 'bg-blue-500' },
    { title: 'Time Records', icon: Clock, href: '/dashboard/hr/time', color: 'bg-green-500' },
    { title: 'My Timesheet', icon: FileText, href: '/dashboard/hr/time/my-timesheet', color: 'bg-purple-500' },
    { title: 'Assign Leave', icon: UserCheck, href: '/dashboard/hr/leave/assign', color: 'bg-indigo-500' },
    { title: 'Employee Reports', icon: BarChart3, href: '/dashboard/hr/analytics', color: 'bg-teal-500' }
  ],
  pendingApprovals: [
    { id: 'LA001', type: 'Leave Application', employee: 'John Adebayo', department: 'Operations', status: 'Pending', date: '2024-01-16' },
    { id: 'TS002', type: 'Timesheet', employee: 'Sarah Okafor', department: 'Finance', status: 'Pending', date: '2024-01-15' },
    { id: 'JA003', type: 'Job Application', candidate: 'Michael Okonkwo', position: 'Senior Engineer', status: 'Interview', date: '2024-01-14' },
    { id: 'PA004', type: 'Performance Review', employee: 'Grace Okoro', department: 'HR', status: 'Due', date: '2024-01-13' },
    { id: 'LA005', type: 'Leave Application', employee: 'David Okafor', department: 'IT', status: 'Pending', date: '2024-01-12' }
  ],
  employeeDistribution: [
    { department: 'Operations', count: 98, percentage: 40.0, color: '#ff6b35' },
    { department: 'Finance', count: 22, percentage: 9.0, color: '#f7931e' },
    { department: 'Procurement', count: 18, percentage: 7.3, color: '#ffd23f' },
    { department: 'Admin', count: 15, percentage: 6.1, color: '#06ffa5' },
    { department: 'IT', count: 12, percentage: 4.9, color: '#118ab2' },
    { department: 'HR', count: 8, percentage: 3.3, color: '#06d6a0' }
  ],
  attendanceData: [
    { month: 'Jul', attendance: 95.2, leaves: 24 },
    { month: 'Aug', attendance: 96.1, leaves: 28 },
    { month: 'Sep', attendance: 94.8, leaves: 32 },
    { month: 'Oct', attendance: 97.3, leaves: 18 },
    { month: 'Nov', attendance: 96.5, leaves: 25 },
    { month: 'Dec', attendance: 93.8, leaves: 45 },
    { month: 'Jan', attendance: 96.8, leaves: 22 }
  ],
  recentActivities: [
    { id: 1, type: 'New Hire', description: 'Emmanuel Okafor joined Operations', time: '2 hours ago', icon: UserPlus },
    { id: 2, type: 'Leave Approved', description: 'Sarah Okafor - Annual Leave approved', time: '4 hours ago', icon: CheckCircle },
    { id: 3, type: 'Interview Scheduled', description: 'Michael Adamu - Senior Developer position', time: '6 hours ago', icon: Calendar },
    { id: 4, type: 'Performance Review', description: 'Grace Okoro completed quarterly review', time: '1 day ago', icon: Target },
    { id: 5, type: 'Training Completed', description: 'Safety Training - 15 employees', time: '2 days ago', icon: Award }
  ],
  upcomingEvents: [
    { id: 1, title: 'Safety Training Session', date: '2024-01-18', time: '09:00 AM', attendees: 25, type: 'Training' },
    { id: 2, title: 'Performance Review Deadline', date: '2024-01-20', time: '05:00 PM', attendees: 45, type: 'Deadline' },
    { id: 3, title: 'New Employee Orientation', date: '2024-01-22', time: '10:00 AM', attendees: 8, type: 'Orientation' },
    { id: 4, title: 'Monthly Team Meeting', date: '2024-01-25', time: '02:00 PM', attendees: 12, type: 'Meeting' }
  ],
  leaveStatistics: {
    totalLeaveDays: 1850,
    usedLeaveDays: 892,
    pendingApplications: 15,
    rejectedApplications: 3,
    averageLeavePerEmployee: 3.6
  }
}

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-NG').format(number)
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'New Hire': return UserPlus
    case 'Leave Approved': case 'Leave Rejected': return CheckCircle
    case 'Interview Scheduled': return Calendar
    case 'Performance Review': return Target
    case 'Training Completed': return Award
    default: return Activity
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'New Hire': return 'text-green-600'
    case 'Leave Approved': return 'text-blue-600'
    case 'Leave Rejected': return 'text-red-600'
    case 'Interview Scheduled': return 'text-purple-600'
    case 'Performance Review': return 'text-orange-600'
    case 'Training Completed': return 'text-indigo-600'
    default: return 'text-gray-600'
  }
}

const MetricCard: React.FC<{
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color?: string
  href?: string
}> = ({ title, value, change, icon: Icon, color = 'orange', href }) => {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  }

  const CardComponent = (
    <Card className={href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? formatNumber(value) : value}
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

  return href ? <Link href={href}>{CardComponent}</Link> : CardComponent
}

export default function HRDashboard() {
  const { user } = useAuth()
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resource Management</h1>
          <p className="text-gray-600">Comprehensive employee management and HR analytics</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={hrData.overview.totalEmployees}
          change={4.2}
          icon={Users}
          color="orange"
          href="/dashboard/hr/pim"
        />
        <MetricCard
          title="Active Employees"
          value={hrData.overview.activeEmployees}
          icon={UserCheck}
          color="green"
        />
        <MetricCard
          title="On Leave Today"
          value={hrData.overview.onLeave}
          icon={Calendar}
          color="blue"
          href="/dashboard/hr/leave"
        />
        <MetricCard
          title="New Hires (MTD)"
          value={hrData.overview.newHiresThisMonth}
          change={8.3}
          icon={UserPlus}
          color="purple"
          href="/dashboard/hr/recruitment"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <Activity className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common HR tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hrData.quickActions.map((action, index) => (
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
        {/* Attendance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <BarChart3 className="w-5 h-5 mr-2" />
              Attendance & Leave Trends
            </CardTitle>
            <CardDescription>Monthly attendance rates and leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrData.attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${value}%`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      name === 'attendance' ? `${value}%` : value,
                      name === 'attendance' ? 'Attendance Rate' : 'Leave Applications'
                    ]}
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="attendance" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.6} name="Attendance Rate" />
                  <Line yAxisId="right" type="monotone" dataKey="leaves" stroke="#118ab2" strokeWidth={2} name="Leave Applications" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Employee Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Building className="w-5 h-5 mr-2" />
              Department Distribution
            </CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hrData.employeeDistribution.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-gray-500">{dept.count} ({dept.percentage}%)</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </div>
              <Badge variant="destructive">{hrData.pendingApprovals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {hrData.pendingApprovals.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        {item.type.includes('Leave') ? (
                          <Calendar className="w-5 h-5 text-orange-600" />
                        ) : item.type.includes('Timesheet') ? (
                          <Clock className="w-5 h-5 text-orange-600" />
                        ) : item.type.includes('Job') ? (
                          <UserPlus className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Target className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.type}</p>
                        <p className="text-sm text-gray-600">
                          {item.employee || item.candidate} • {item.department || item.position}
                        </p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'Pending' ? 'secondary' : item.status === 'Due' ? 'destructive' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest HR activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {hrData.recentActivities.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type)
                  const iconColor = getActivityColor(activity.type)

                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Applications"
          value={hrData.overview.pendingApplications}
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${hrData.overview.avgAttendance}%`}
          change={2.1}
          icon={UserCheck}
          color="green"
        />
        <MetricCard
          title="Turnover Rate"
          value={`${hrData.overview.turnoverRate}%`}
          change={-0.8}
          icon={TrendingDown}
          color="red"
        />
        <MetricCard
          title="Employee Satisfaction"
          value={`${hrData.overview.employeeSatisfaction}/5.0`}
          change={3.2}
          icon={Award}
          color="indigo"
        />
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Events & Deadlines
          </CardTitle>
          <CardDescription>Important dates and scheduled activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hrData.upcomingEvents.map((event, index) => (
              <Card key={index} className="border-l-4 border-orange-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                      <span className="text-xs text-gray-500">{event.attendees} people</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}