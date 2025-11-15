'use client'

import React, { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus, Search, Eye, Edit, FileText, Calendar, User, Building,
  CheckCircle, Clock, AlertTriangle, XCircle, Filter, Download
} from 'lucide-react'
import Link from 'next/link'

interface PurchaseRequisition {
  id: string
  prNumber: string
  description: string
  requestedBy: string
  department: string
  dateCreated: string
  requiredDate: string
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_procurement' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  totalAmount: number
  itemCount: number
  approver?: string
  plant: string
}

export default function PurchaseRequisitionsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  if (!user) return null

  // Sample purchase requisitions data
  const purchaseRequisitions: PurchaseRequisition[] = [
    {
      id: '1',
      prNumber: 'PR-2024-001',
      description: 'Office Supplies for HR Department',
      requestedBy: 'Adaobi Okechukwu',
      department: 'Human Resources',
      dateCreated: '2024-11-10',
      requiredDate: '2024-11-20',
      status: 'pending_approval',
      priority: 'medium',
      totalAmount: 125000,
      itemCount: 5,
      plant: 'Lagos Main Plant'
    },
    {
      id: '2',
      prNumber: 'PR-2024-002',
      description: 'IT Equipment - Laptops and Accessories',
      requestedBy: 'Chinedu Okafor',
      department: 'Information Technology',
      dateCreated: '2024-11-12',
      requiredDate: '2024-11-25',
      status: 'approved',
      priority: 'high',
      totalAmount: 850000,
      itemCount: 3,
      approver: 'Taiwo Adeniyi',
      plant: 'Lagos Main Plant'
    },
    {
      id: '3',
      prNumber: 'PR-2024-003',
      description: 'Marketing Materials and Promotional Items',
      requestedBy: 'Kemi Adebayo',
      department: 'Marketing',
      dateCreated: '2024-11-13',
      requiredDate: '2024-11-30',
      status: 'in_procurement',
      priority: 'medium',
      totalAmount: 275000,
      itemCount: 8,
      approver: 'Funmi Bakare',
      plant: 'Lagos Main Plant'
    },
    {
      id: '4',
      prNumber: 'PR-2024-004',
      description: 'Maintenance Tools and Safety Equipment',
      requestedBy: 'Emeka Nwosu',
      department: 'Operations',
      dateCreated: '2024-11-14',
      requiredDate: '2024-11-18',
      status: 'urgent',
      priority: 'urgent',
      totalAmount: 450000,
      itemCount: 12,
      plant: 'Port Harcourt Plant'
    },
    {
      id: '5',
      prNumber: 'PR-2024-005',
      description: 'Training Materials and Conference Supplies',
      requestedBy: 'Blessing Okafor',
      department: 'Human Resources',
      dateCreated: '2024-11-15',
      requiredDate: '2024-12-01',
      status: 'draft',
      priority: 'low',
      totalAmount: 95000,
      itemCount: 4,
      plant: 'Lagos Main Plant'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'in_procurement': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />
      case 'pending_approval': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'in_procurement': return <AlertTriangle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredRequisitions = purchaseRequisitions.filter(pr => {
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !selectedStatus || selectedStatus === 'all' || pr.status === selectedStatus
    const matchesPriority = !selectedPriority || selectedPriority === 'all' || pr.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: purchaseRequisitions.length,
    pending: purchaseRequisitions.filter(pr => pr.status === 'pending_approval').length,
    approved: purchaseRequisitions.filter(pr => pr.status === 'approved').length,
    inProcurement: purchaseRequisitions.filter(pr => pr.status === 'in_procurement').length,
    totalValue: purchaseRequisitions.reduce((sum, pr) => sum + pr.totalAmount, 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Requisitions</h1>
            <p className="text-gray-500 mt-1">Manage and track purchase requisition requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link href="/dashboard/procurement/purchase-requisitions/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New PR
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total PRs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Procurement</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProcurement}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Building className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Requisitions</CardTitle>
            <CardDescription>View and manage all purchase requisition requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search PRs by number, description, requestor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_procurement">In Procurement</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PR Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequisitions.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell className="font-medium">{pr.prNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium truncate max-w-[200px]">{pr.description}</div>
                          <div className="text-xs text-gray-500">{pr.itemCount} items</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {pr.requestedBy}
                        </div>
                      </TableCell>
                      <TableCell>{pr.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pr.status)} variant="secondary">
                          {getStatusIcon(pr.status)}
                          <span className="ml-1 capitalize">{pr.status.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(pr.priority)} variant="secondary">
                          {pr.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(pr.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(pr.requiredDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
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

            {filteredRequisitions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No purchase requisitions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || (selectedStatus && selectedStatus !== 'all') || (selectedPriority && selectedPriority !== 'all')
                    ? "No PRs match your current filters."
                    : "Get started by creating a new purchase requisition."
                  }
                </p>
                {!searchTerm && (!selectedStatus || selectedStatus === 'all') && (!selectedPriority || selectedPriority === 'all') && (
                  <div className="mt-6">
                    <Link href="/dashboard/procurement/purchase-requisitions/new">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New PR
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}