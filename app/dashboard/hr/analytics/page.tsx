'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3, Users, TrendingUp, TrendingDown, Target,
  Clock, UserCheck, UserMinus, UserPlus, Calendar,
  Award, AlertTriangle, CheckCircle, DollarSign,
  Building, Briefcase, GraduationCap, Heart
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function HRAnalyticsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Sample analytics data
  const headcountTrend = [
    { month: 'Jun', total: 235, new: 8, left: 3 },
    { month: 'Jul', total: 240, new: 12, left: 7 },
    { month: 'Aug', total: 245, new: 9, left: 4 },
    { month: 'Sep', total: 250, new: 11, left: 6 },
    { month: 'Oct', total: 255, new: 8, left: 3 },
    { month: 'Nov', total: 258, new: 5, left: 2 }
  ]

  const departmentDistribution = [
    { name: 'Operations', value: 85, percentage: 33, color: '#3B82F6' },
    { name: 'Sales', value: 65, percentage: 25, color: '#10B981' },
    { name: 'Finance', value: 35, percentage: 14, color: '#F59E0B' },
    { name: 'HR', value: 25, percentage: 10, color: '#EF4444' },
    { name: 'IT', value: 20, percentage: 8, color: '#8B5CF6' },
    { name: 'Admin', value: 28, percentage: 11, color: '#06B6D4' }
  ]

  const attendanceData = [
    { month: 'Jun', attendance: 96.5, leaves: 3.2, absent: 0.3 },
    { month: 'Jul', attendance: 95.8, leaves: 3.8, absent: 0.4 },
    { month: 'Aug', attendance: 97.2, leaves: 2.5, absent: 0.3 },
    { month: 'Sep', attendance: 96.1, leaves: 3.6, absent: 0.3 },
    { month: 'Oct', attendance: 98.1, leaves: 1.7, absent: 0.2 },
    { month: 'Nov', attendance: 96.8, leaves: 2.9, absent: 0.3 }
  ]

  const performanceData = [
    { category: 'Exceeds Expectations', value: 45, percentage: 18 },
    { category: 'Meets Expectations', value: 180, percentage: 70 },
    { category: 'Below Expectations', value: 25, percentage: 10 },
    { category: 'Needs Improvement', value: 8, percentage: 3 }
  ]

  const recruitmentMetrics = [
    { month: 'Jun', applications: 120, interviews: 45, hires: 8, cost: 450000 },
    { month: 'Jul', applications: 145, interviews: 52, hires: 12, cost: 520000 },
    { month: 'Aug', applications: 98, interviews: 38, hires: 9, cost: 380000 },
    { month: 'Sep', applications: 132, interviews: 48, hires: 11, cost: 465000 },
    { month: 'Oct', applications: 87, interviews: 32, hires: 8, cost: 340000 },
    { month: 'Nov', applications: 76, interviews: 28, hires: 5, cost: 285000 }
  ]

  const turnoverData = [
    { department: 'Operations', rate: 12.5, count: 11 },
    { department: 'Sales', rate: 18.4, count: 12 },
    { department: 'Finance', rate: 8.6, count: 3 },
    { department: 'HR', rate: 4.0, count: 1 },
    { department: 'IT', rate: 15.0, count: 3 },
    { department: 'Admin', rate: 7.1, count: 2 }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Calculate key metrics
  const currentHeadcount = headcountTrend[headcountTrend.length - 1]?.total || 0
  const previousHeadcount = headcountTrend[headcountTrend.length - 2]?.total || 0
  const headcountGrowth = ((currentHeadcount - previousHeadcount) / previousHeadcount) * 100

  const avgAttendance = attendanceData.reduce((sum, item) => sum + item.attendance, 0) / attendanceData.length
  const avgTurnover = turnoverData.reduce((sum, item) => sum + item.rate, 0) / turnoverData.length
  const totalRecruitmentCost = recruitmentMetrics.reduce((sum, item) => sum + item.cost, 0)

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">HR Analytics</h1>
                  <p className="text-sm text-gray-600">Workforce insights and performance metrics</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-xl font-bold text-gray-900">{currentHeadcount}</p>
                <p className={`text-xs flex items-center ${headcountGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {headcountGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(headcountGrowth).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-xl font-bold text-green-600">{avgAttendance.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserMinus className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Turnover Rate</p>
                <p className="text-xl font-bold text-red-600">{avgTurnover.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Hires</p>
                <p className="text-xl font-bold text-purple-600">
                  {recruitmentMetrics[recruitmentMetrics.length - 1]?.hires || 0}
                </p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recruitment Cost</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(totalRecruitmentCost / 1000000)}M</p>
                <p className="text-xs text-gray-500">6 months</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-xl font-bold text-indigo-600">88%</p>
                <p className="text-xs text-gray-500">Meets/Exceeds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          <Tabs defaultValue="workforce" className="space-y-6">
            <TabsList>
              <TabsTrigger value="workforce">Workforce</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
              <TabsTrigger value="retention">Retention</TabsTrigger>
            </TabsList>

            <TabsContent value="workforce">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Headcount Trend</CardTitle>
                    <CardDescription>Employee growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={headcountTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Total Employees" />
                        <Line type="monotone" dataKey="new" stroke="#10B981" name="New Hires" />
                        <Line type="monotone" dataKey="left" stroke="#EF4444" name="Departures" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Distribution</CardTitle>
                    <CardDescription>Workforce breakdown by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={departmentDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workforce Summary</CardTitle>
                    <CardDescription>Key workforce statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Headcount</span>
                      <span className="font-semibold">{currentHeadcount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Employees</span>
                      <span className="font-semibold">{currentHeadcount - 7}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">On Leave</span>
                      <span className="font-semibold">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Contract Workers</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Experience</span>
                      <span className="font-semibold">4.2 years</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                    <CardDescription>Workforce composition</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Male</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Female</span>
                        <span>40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full w-2/5"></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600 mb-2">Age Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>20-30</span>
                          <span>35%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>31-40</span>
                          <span>45%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>41-50</span>
                          <span>15%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>50+</span>
                          <span>5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                    <CardDescription>Key workforce indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="text-sm">
                        <div className="font-medium text-green-900">Headcount Growth</div>
                        <div className="text-green-700">+1.2% this month</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-900">Largest Department</div>
                        <div className="text-blue-700">Operations (85 employees)</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div className="text-sm">
                        <div className="font-medium text-yellow-900">Attention Needed</div>
                        <div className="text-yellow-700">Sales turnover above average</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                    <CardDescription>Monthly attendance patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[90, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
                        <Line type="monotone" dataKey="leaves" stroke="#F59E0B" strokeWidth={2} name="Leave %" />
                        <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Absent %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance by Department</CardTitle>
                    <CardDescription>Current month attendance rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentDistribution.map((dept, index) => {
                        const attendanceRate = 95 + Math.random() * 4 // Random between 95-99%
                        return (
                          <div key={dept.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{dept.name}</span>
                              <span>{attendanceRate.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${attendanceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                    <CardDescription>Employee performance ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">88%</div>
                      <div className="text-sm text-green-700">Meets/Exceeds Expectations</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">18%</div>
                      <div className="text-sm text-blue-700">Top Performers</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">12%</div>
                      <div className="text-sm text-yellow-700">Need Development</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recruitment">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recruitment Funnel</CardTitle>
                    <CardDescription>Monthly hiring metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={recruitmentMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="applications" stroke="#3B82F6" name="Applications" />
                        <Line type="monotone" dataKey="interviews" stroke="#F59E0B" name="Interviews" />
                        <Line type="monotone" dataKey="hires" stroke="#10B981" name="Hires" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recruitment Costs</CardTitle>
                    <CardDescription>Monthly recruitment spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={recruitmentMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="cost" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="retention">
              <Card>
                <CardHeader>
                  <CardTitle>Turnover by Department</CardTitle>
                  <CardDescription>Annual turnover rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {turnoverData.map((dept) => (
                      <div key={dept.department} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{dept.department}</span>
                          <Badge variant={dept.rate > 15 ? 'destructive' : dept.rate > 10 ? 'outline' : 'default'}>
                            {dept.rate}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {dept.count} employees left this year
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              dept.rate > 15 ? 'bg-red-500' :
                              dept.rate > 10 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(dept.rate * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}