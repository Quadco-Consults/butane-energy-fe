'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  ClipboardList,
  Wrench,
  Building,
  FileCheck,
  Award,
  Settings,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();

  // Mock data for admin activities
  const adminStats = {
    storeItems: 234,
    pendingRequests: 12,
    activeMaintenance: 8,
    pendingGRNs: 5,
    pendingCertificates: 3,
    activeServiceOrders: 7
  };

  const recentActivities = [
    {
      id: 1,
      type: 'request',
      title: 'Office Chair Request - HR Department',
      status: 'pending',
      deadline: '2025-11-12',
      department: 'HR',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Air Conditioning Repair - Building A',
      status: 'in_progress',
      deadline: '2025-11-10',
      department: 'Facilities',
      priority: 'high'
    },
    {
      id: 3,
      type: 'grn',
      title: 'GRN-2025-045 - Office Supplies',
      status: 'received',
      deadline: '2025-11-09',
      department: 'Admin',
      priority: 'low'
    },
    {
      id: 4,
      type: 'service_order',
      title: 'SO-2025-023 - Security System Maintenance',
      status: 'approved',
      deadline: '2025-11-15',
      department: 'Security',
      priority: 'high'
    },
    {
      id: 5,
      type: 'certificate',
      title: 'JCC-2025-012 - Cleaning Services',
      status: 'completed',
      deadline: '2025-11-08',
      department: 'Facilities',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'received': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request': return <ClipboardList className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'grn': return <FileCheck className="h-4 w-4" />;
      case 'service_order': return <Settings className="h-4 w-4" />;
      case 'certificate': return <Award className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Department</h1>
            <p className="text-muted-foreground">
              Manage internal operations, facility maintenance, and administrative services
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/requests/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </Link>
            <Link href="/dashboard/admin/grn/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New GRN
              </Button>
            </Link>
            <Link href="/dashboard/admin/service-orders/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Service Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Store Items
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.storeItems}</div>
              <p className="text-xs text-green-600 mt-1">
                12 low stock alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.pendingRequests}</div>
              <p className="text-xs text-yellow-600 mt-1">
                3 urgent requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Maintenance
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.activeMaintenance}</div>
              <p className="text-xs text-orange-600 mt-1">
                2 overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending GRNs
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.pendingGRNs}</div>
              <p className="text-xs text-blue-600 mt-1">
                Processing today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Certificates
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.pendingCertificates}</div>
              <p className="text-xs text-purple-600 mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Service Orders
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.activeServiceOrders}</div>
              <p className="text-xs text-cyan-600 mt-1">
                5 in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* In-house Store */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                In-house Store
              </CardTitle>
              <CardDescription>
                Manage internal inventory and office supplies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/store">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    View Store Inventory
                  </Button>
                </Link>
                <Link href="/dashboard/admin/store/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Add Store Item
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 234 total items</li>
                  <li>• 12 low stock alerts</li>
                  <li>• 5 reorder requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Item Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-yellow-500" />
                Item Requests
              </CardTitle>
              <CardDescription>
                Process internal item requests from departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/requests">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ClipboardList className="h-4 w-4" />
                    View All Requests
                  </Button>
                </Link>
                <Link href="/dashboard/admin/requests/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Request
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Recent Activity:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• HR Chair Request - Pending</li>
                  <li>• IT Equipment - Approved</li>
                  <li>• Office Supplies - Processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-500" />
                Facility Maintenance
              </CardTitle>
              <CardDescription>
                Track office and facility maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/maintenance">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wrench className="h-4 w-4" />
                    View Maintenance
                  </Button>
                </Link>
                <Link href="/dashboard/admin/maintenance/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Maintenance
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• AC Repair - In Progress</li>
                  <li>• Elevator Service - Scheduled</li>
                  <li>• Plumbing Fix - Completed</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Goods Receipt Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                Goods Receipt Notes
              </CardTitle>
              <CardDescription>
                Process incoming deliveries and issue GRNs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/grn">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileCheck className="h-4 w-4" />
                    View All GRNs
                  </Button>
                </Link>
                <Link href="/dashboard/admin/grn/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New GRN
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Today's Activity:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 5 deliveries received</li>
                  <li>• 3 GRNs processed</li>
                  <li>• 2 pending verification</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Job Completion Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Job Completion Certificates
              </CardTitle>
              <CardDescription>
                Issue certificates for completed services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/certificates">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Award className="h-4 w-4" />
                    View Certificates
                  </Button>
                </Link>
                <Link href="/dashboard/admin/certificates/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Issue Certificate
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Recent Certificates:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Cleaning Services - Issued</li>
                  <li>• Security Setup - Pending</li>
                  <li>• HVAC Maintenance - Draft</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Service Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyan-500" />
                Service Orders
              </CardTitle>
              <CardDescription>
                Create and manage service orders to vendors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/admin/service-orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    View Service Orders
                  </Button>
                </Link>
                <Link href="/dashboard/admin/service-orders/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create Service Order
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Active Orders:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Security Maintenance - Active</li>
                  <li>• Office Cleaning - Scheduled</li>
                  <li>• IT Support - Approved</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activities</CardTitle>
            <CardDescription>Latest requests, maintenance, and administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {activity.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(activity.deadline).toLocaleDateString()}
                        </div>
                        <div className={`font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(activity.status)} text-white`}
                    >
                      {activity.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}