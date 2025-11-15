'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Search, Download, Calendar, Users, CheckCircle, AlertTriangle, LogIn, LogOut, User, BarChart3, Clock3 } from 'lucide-react'

export default function TimeAttendancePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Sample attendance data
  const attendanceRecords = [
    {
      id: 'ATT001',
      employeeId: 'EMP001',
      employeeName: 'Adebayo Johnson',
      department: 'Operations',
      date: '2024-11-14',
      clockIn: '08:15',
      clockOut: '17:30',
      breakTime: '45',
      totalHours: '8.75',
      overtimeHours: '0.75',
      status: 'Present',
      location: 'Lagos Office'
    },
    {
      id: 'ATT002',
      employeeId: 'EMP002',
      employeeName: 'Fatima Abdullahi',
      department: 'Human Resources',
      date: '2024-11-14',
      clockIn: '07:45',
      clockOut: '16:45',
      breakTime: '60',
      totalHours: '8.00',
      overtimeHours: '0.00',
      status: 'Present',
      location: 'Abuja Office'
    },
    {
      id: 'ATT003',
      employeeId: 'EMP003',
      employeeName: 'Chidi Okafor',
      department: 'Finance',
      date: '2024-11-14',
      clockIn: '08:30',
      clockOut: '18:00',
      breakTime: '60',
      totalHours: '8.50',
      overtimeHours: '0.50',
      status: 'Present',
      location: 'Port Harcourt'
    },
    {
      id: 'ATT004',
      employeeId: 'EMP004',
      employeeName: 'Aisha Bello',
      department: 'Sales',
      date: '2024-11-14',
      clockIn: null,
      clockOut: null,
      breakTime: null,
      totalHours: '0.00',
      overtimeHours: '0.00',
      status: 'On Leave',
      location: 'Kano Office'
    },
    {
      id: 'ATT005',
      employeeId: 'EMP005',
      employeeName: 'Emeka Nwosu',
      department: 'Operations',
      date: '2024-11-14',
      clockIn: '09:15',
      clockOut: null,
      breakTime: '30',
      totalHours: '0.00',
      overtimeHours: '0.00',
      status: 'Clocked In',
      location: 'Lagos Office'
    }
  ]

  const departments = ['Operations', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'IT', 'Procurement']

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Present': { variant: 'default', color: 'text-green-600' },
      'Absent': { variant: 'destructive', color: 'text-red-600' },
      'Late': { variant: 'outline', color: 'text-yellow-600' },
      'On Leave': { variant: 'secondary', color: 'text-blue-600' },
      'Clocked In': { variant: 'outline', color: 'text-orange-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
  }

  const getAttendanceStats = () => {
    const stats = {
      totalEmployees: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'Present').length,
      absent: attendanceRecords.filter(r => r.status === 'Absent').length,
      late: attendanceRecords.filter(r => r.status === 'Late').length,
      onLeave: attendanceRecords.filter(r => r.status === 'On Leave').length,
      clockedIn: attendanceRecords.filter(r => r.status === 'Clocked In').length,
      avgHours: attendanceRecords
        .filter(r => parseFloat(r.totalHours) > 0)
        .reduce((sum, r) => sum + parseFloat(r.totalHours), 0) /
        attendanceRecords.filter(r => parseFloat(r.totalHours) > 0).length,
      totalOvertime: attendanceRecords.reduce((sum, r) => sum + parseFloat(r.overtimeHours), 0)
    }
    return stats
  }

  const stats = getAttendanceStats()

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
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Time & Attendance</h1>
                <p className="text-sm text-gray-600">Track employee attendance and working hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Clock3 className="h-4 w-4 mr-2" />
                Clock In/Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-xl font-bold text-green-600">{stats.present}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-xl font-bold text-yellow-600">{stats.late}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-xl font-bold text-purple-600">{stats.onLeave}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <LogIn className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clocked In</p>
              <p className="text-xl font-bold text-orange-600">{stats.clockedIn}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Hours</p>
              <p className="text-xl font-bold text-gray-600">{stats.avgHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
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
          <div>
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
            <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            <TabsTrigger value="overtime">Overtime</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Attendance - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
                    <CardDescription>
                      {filteredRecords.length} of {attendanceRecords.length} employees
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Mark Attendance</Button>
                    <Button variant="outline" size="sm">Bulk Actions</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const statusInfo = getStatusBadge(record.status)

                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{record.employeeName}</div>
                                <div className="text-sm text-gray-500">{record.employeeId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>
                            {record.clockIn ? (
                              <div className="flex items-center space-x-1">
                                <LogIn className="h-4 w-4 text-green-600" />
                                <span>{record.clockIn}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.clockOut ? (
                              <div className="flex items-center space-x-1">
                                <LogOut className="h-4 w-4 text-red-600" />
                                <span>{record.clockOut}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.breakTime ? `${record.breakTime} min` : '--'}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{record.totalHours}h</span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${parseFloat(record.overtimeHours) > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                              {record.overtimeHours}h
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{record.location}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Edit</Button>
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

          <TabsContent value="timesheets">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Timesheet</CardTitle>
                    <CardDescription>Employee working hours for the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                        <div>Employee</div>
                        <div className="text-center">Mon</div>
                        <div className="text-center">Tue</div>
                        <div className="text-center">Wed</div>
                        <div className="text-center">Thu</div>
                        <div className="text-center">Fri</div>
                        <div className="text-center">Sat</div>
                        <div className="text-center">Total</div>
                      </div>
                      {filteredRecords.slice(0, 5).map((record) => (
                        <div key={record.id} className="grid grid-cols-8 gap-2 text-sm py-2 border-b">
                          <div className="font-medium">{record.employeeName}</div>
                          <div className="text-center">8.0</div>
                          <div className="text-center">8.0</div>
                          <div className="text-center">7.5</div>
                          <div className="text-center">{record.totalHours}</div>
                          <div className="text-center">8.0</div>
                          <div className="text-center">0.0</div>
                          <div className="text-center font-semibold">
                            {(31.5 + parseFloat(record.totalHours)).toFixed(1)}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Timesheet management tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Approve Timesheets
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Timesheets
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Work Schedules
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overtime">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overtime Summary</CardTitle>
                  <CardDescription>Current month overtime hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-900">Total Overtime</span>
                      <span className="text-2xl font-bold text-orange-600">{stats.totalOvertime.toFixed(1)}h</span>
                    </div>
                    <div className="space-y-3">
                      {attendanceRecords
                        .filter(r => parseFloat(r.overtimeHours) > 0)
                        .map(record => (
                          <div key={record.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{record.employeeName}</div>
                              <div className="text-sm text-gray-600">{record.department}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{record.overtimeHours}h</div>
                              <div className="text-sm text-gray-600">{record.date}</div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Overtime Policies</CardTitle>
                  <CardDescription>Company overtime guidelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Standard Overtime</h4>
                      <p className="text-sm text-gray-600">1.5x regular pay rate for hours worked beyond 8 hours per day or 40 hours per week.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Weekend Overtime</h4>
                      <p className="text-sm text-gray-600">2x regular pay rate for work performed on weekends and public holidays.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Approval Required</h4>
                      <p className="text-sm text-gray-600">All overtime must be pre-approved by department managers except in emergency situations.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Reports</CardTitle>
                  <CardDescription>Generate comprehensive attendance reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Daily Attendance Summary</div>
                        <div className="text-sm text-gray-600">Today's attendance overview</div>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Monthly Attendance Report</div>
                        <div className="text-sm text-gray-600">Detailed monthly analysis</div>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Overtime Analysis</div>
                        <div className="text-sm text-gray-600">Overtime trends and costs</div>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Department Comparison</div>
                        <div className="text-sm text-gray-600">Cross-department attendance metrics</div>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                  <CardDescription>Key metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-900">Attendance Rate</div>
                          <div className="text-sm text-green-700">Current month</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">94.2%</div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-blue-900">Punctuality Rate</div>
                          <div className="text-sm text-blue-700">On-time arrivals</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">87.8%</div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-yellow-900">Avg Working Hours</div>
                          <div className="text-sm text-yellow-700">Per employee/day</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">8.1h</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  )
}