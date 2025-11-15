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
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Plus, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Download, FileText, User } from 'lucide-react'

export default function LeavePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false)

  // Sample leave data
  const leaveRequests = [
    {
      id: 'LR001',
      employeeId: 'EMP001',
      employeeName: 'Adebayo Johnson',
      leaveType: 'Annual Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-30',
      days: 8,
      status: 'Pending',
      appliedDate: '2024-11-10',
      reason: 'Year-end vacation with family',
      approver: 'Emeka Nwosu',
      comments: null
    },
    {
      id: 'LR002',
      employeeId: 'EMP002',
      employeeName: 'Fatima Abdullahi',
      leaveType: 'Sick Leave',
      startDate: '2024-11-15',
      endDate: '2024-11-17',
      days: 3,
      status: 'Approved',
      appliedDate: '2024-11-14',
      reason: 'Medical treatment',
      approver: 'Sarah Ibrahim',
      comments: 'Approved. Get well soon.'
    },
    {
      id: 'LR003',
      employeeId: 'EMP003',
      employeeName: 'Chidi Okafor',
      leaveType: 'Personal Leave',
      startDate: '2024-11-25',
      endDate: '2024-11-25',
      days: 1,
      status: 'Rejected',
      appliedDate: '2024-11-20',
      reason: 'Personal matters',
      approver: 'Mohammed Ali',
      comments: 'Need more advance notice for personal leave.'
    },
    {
      id: 'LR004',
      employeeId: 'EMP004',
      employeeName: 'Aisha Bello',
      leaveType: 'Maternity Leave',
      startDate: '2024-12-01',
      endDate: '2025-03-01',
      days: 90,
      status: 'Approved',
      appliedDate: '2024-10-15',
      reason: 'Maternity leave',
      approver: 'Sarah Ibrahim',
      comments: 'Congratulations! Approved as per company policy.'
    }
  ]

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Personal Leave',
    'Emergency Leave',
    'Bereavement Leave',
    'Study Leave'
  ]

  const leaveBalances = {
    'EMP001': { annual: 15, sick: 10, personal: 5 },
    'EMP002': { annual: 20, sick: 8, personal: 3 },
    'EMP003': { annual: 18, sick: 12, personal: 7 },
    'EMP004': { annual: 22, sick: 15, personal: 2 }
  }

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || request.leaveType === selectedType
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      'Pending': { variant: 'outline', icon: Clock },
      'Approved': { variant: 'default', icon: CheckCircle },
      'Rejected': { variant: 'destructive', icon: XCircle }
    }
    return variants[status] || { variant: 'outline', icon: Clock }
  }

  const getStatusStats = () => {
    const stats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter(r => r.status === 'Pending').length,
      approved: leaveRequests.filter(r => r.status === 'Approved').length,
      rejected: leaveRequests.filter(r => r.status === 'Rejected').length
    }
    return stats
  }

  const stats = getStatusStats()

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
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <p className="text-sm text-gray-600">Manage employee leave requests and balances</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Dialog open={isApplyLeaveOpen} onOpenChange={setIsApplyLeaveOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                    <DialogDescription>
                      Submit a new leave request for approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employee">Employee</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMP001">Adebayo Johnson</SelectItem>
                            <SelectItem value="EMP002">Fatima Abdullahi</SelectItem>
                            <SelectItem value="EMP003">Chidi Okafor</SelectItem>
                            <SelectItem value="EMP004">Aisha Bello</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="leaveType">Leave Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            {leaveTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea id="reason" placeholder="Please provide the reason for your leave request..." rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="attachments">Supporting Documents (optional)</Label>
                      <Input id="attachments" type="file" multiple />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsApplyLeaveOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
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
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Leave Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leave Types</SelectItem>
              {leaveTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Leave Requests</TabsTrigger>
            <TabsTrigger value="balances">Leave Balances</TabsTrigger>
            <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
            <TabsTrigger value="policies">Leave Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>
                      {filteredRequests.length} of {leaveRequests.length} requests
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const statusInfo = getStatusBadge(request.status)
                      const StatusIcon = statusInfo.icon

                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="font-medium">{request.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{request.employeeName}</div>
                                <div className="text-sm text-gray-500">{request.employeeId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {request.leaveType}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{request.days} days</div>
                              <div className="text-xs text-gray-500">
                                {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
                              <StatusIcon className="h-3 w-3" />
                              <span>{request.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{request.approver}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              {request.status === 'Pending' && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600">
                                    Approve
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    Reject
                                  </Button>
                                </>
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

          <TabsContent value="balances">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(leaveBalances).map(([empId, balances]) => {
                const employee = leaveRequests.find(r => r.employeeId === empId)?.employeeName || empId
                return (
                  <Card key={empId}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>{employee}</span>
                      </CardTitle>
                      <CardDescription>{empId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-900">Annual Leave</span>
                          <span className="text-2xl font-bold text-blue-600">{balances.annual}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-green-900">Sick Leave</span>
                          <span className="text-2xl font-bold text-green-600">{balances.sick}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium text-purple-900">Personal Leave</span>
                          <span className="text-2xl font-bold text-purple-600">{balances.personal}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Leave Calendar</CardTitle>
                <CardDescription>Visual overview of scheduled leaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Calendar view will be implemented with a calendar component</p>
                  <p className="text-sm">Showing all approved leaves and their duration</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Entitlements</CardTitle>
                  <CardDescription>Annual leave allocations by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Senior Management</span>
                      <span className="font-semibold">25 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Management</span>
                      <span className="font-semibold">22 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Senior Staff</span>
                      <span className="font-semibold">20 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Junior Staff</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leave Policies</CardTitle>
                  <CardDescription>Company leave policies and guidelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Annual Leave</h4>
                      <p className="text-sm text-gray-600">Must be requested at least 2 weeks in advance. Maximum 10 consecutive days without special approval.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Sick Leave</h4>
                      <p className="text-sm text-gray-600">Medical certificate required for absences exceeding 3 consecutive days.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Maternity/Paternity Leave</h4>
                      <p className="text-sm text-gray-600">As per Nigerian Labour Act - 12 weeks maternity, 2 weeks paternity.</p>
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