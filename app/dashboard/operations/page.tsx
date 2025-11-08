'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Truck,
  Package,
  ShoppingCart,
  FileText,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function OperationsPage() {
  const { user } = useAuth();

  // Mock data for operations activities
  const operationsStats = {
    activeSales: 15,
    pendingDispatches: 8,
    stockLevel: 85, // percentage
    todayInvoices: 12,
    lpgStock: 2450, // MT
    pendingOrders: 6,
    trucksInTransit: 14,
    totalRevenue: 45750000
  };

  const recentActivities = [
    {
      id: 1,
      type: 'sales',
      title: 'LPG Bulk Sale - Industrial Customer',
      description: 'Sale of 50MT LPG to Manufacturing Corp',
      status: 'processing',
      amount: 12500000,
      department: 'Trading',
      priority: 'high',
      deadline: '2025-11-10'
    },
    {
      id: 2,
      type: 'dispatch_offtake',
      title: 'Truck Dispatch for Product Offtake',
      description: 'Dispatch truck TRK-045 for LPG collection from depot',
      status: 'in_transit',
      amount: 0,
      department: 'Logistics',
      priority: 'medium',
      deadline: '2025-11-09'
    },
    {
      id: 3,
      type: 'procurement',
      title: 'LPG Procurement Request to HQ',
      description: 'Request for 200MT LPG procurement from headquarters',
      status: 'pending_approval',
      amount: 50000000,
      department: 'Trading',
      priority: 'high',
      deadline: '2025-11-12'
    },
    {
      id: 4,
      type: 'dispatch_offloading',
      title: 'Truck Dispatch for Product Offloading',
      description: 'Dispatch truck TRK-023 to deliver LPG to customer site',
      status: 'completed',
      amount: 8500000,
      department: 'Logistics',
      priority: 'medium',
      deadline: '2025-11-08'
    },
    {
      id: 5,
      type: 'invoice',
      title: 'Invoice Generation - Retail Sales',
      description: 'Generated invoice for multiple retail sales transactions',
      status: 'generated',
      amount: 2750000,
      department: 'Trading',
      priority: 'low',
      deadline: '2025-11-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'in_transit': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'generated': return 'bg-cyan-500';
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
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'dispatch_offtake': return <Truck className="h-4 w-4" />;
      case 'dispatch_offloading': return <Truck className="h-4 w-4" />;
      case 'procurement': return <ShoppingCart className="h-4 w-4" />;
      case 'invoice': return <FileText className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Operations Department</h1>
            <p className="text-muted-foreground">
              Manage Trading and Logistics operations for LPG business
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/operations/trading/sales/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Sale
              </Button>
            </Link>
            <Link href="/dashboard/operations/trading/orders/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Sales Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Operations Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                LPG Stock Level
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationsStats.lpgStock} MT</div>
              <p className="text-xs text-green-600 mt-1">
                {operationsStats.stockLevel}% capacity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Sales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationsStats.activeSales}</div>
              <p className="text-xs text-blue-600 mt-1">
                {operationsStats.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trucks in Transit
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationsStats.trucksInTransit}</div>
              <p className="text-xs text-orange-600 mt-1">
                {operationsStats.pendingDispatches} pending dispatch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{operationsStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                {operationsStats.todayInvoices} invoices generated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Operations Modules */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Trading Operations */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Trading Operations
              </CardTitle>
              <CardDescription>
                Manage LPG trading, sales, procurement, and stock management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/operations/trading/sales">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    LPG Sales Process
                  </Button>
                </Link>
                <Link href="/dashboard/operations/trading/procurement">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    LPG Procurement Process
                  </Button>
                </Link>
                <Link href="/dashboard/operations/trading/stock">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    LPG Stock Management
                  </Button>
                </Link>
                <Link href="/dashboard/operations/trading/orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Sales Order Process
                  </Button>
                </Link>
                <Link href="/dashboard/operations/trading/invoices">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Invoice Generation
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 15 active sales processes</li>
                  <li>• 2,450 MT LPG in stock (85%)</li>
                  <li>• 6 pending procurement requests</li>
                  <li>• ₦45.7M revenue today</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Logistics Operations */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-500" />
                Logistics Operations
              </CardTitle>
              <CardDescription>
                Manage truck dispatching, inventory, and logistics coordination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/operations/logistics/offtake">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Truck className="h-4 w-4" />
                    Truck Dispatch (Offtake)
                  </Button>
                </Link>
                <Link href="/dashboard/operations/logistics/offloading">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Truck className="h-4 w-4" />
                    Truck Dispatch (Offloading)
                  </Button>
                </Link>
                <Link href="/dashboard/operations/logistics/inventory">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    Plant Items Inventory
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 14 trucks currently in transit</li>
                  <li>• 8 dispatches pending approval</li>
                  <li>• 23 plant inventory items</li>
                  <li>• 95% on-time delivery rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Operations Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Operations Activities</CardTitle>
            <CardDescription>Latest trading and logistics activities across all plants</CardDescription>
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{activity.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.department}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(activity.deadline).toLocaleDateString()}
                        </div>
                        {activity.amount > 0 && (
                          <>
                            <span className="mx-1">•</span>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ₦{activity.amount.toLocaleString()}
                            </div>
                          </>
                        )}
                        <span className="mx-1">•</span>
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
                      {activity.status.replace('_', ' ')}
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

        {/* Quick Actions & Alerts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Operations Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-700">Low LPG Stock Alert</p>
                  <p className="text-yellow-600">Stock level at 85% - Consider procurement</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                <Clock className="h-4 w-4 text-red-600" />
                <div className="text-sm">
                  <p className="font-medium text-red-700">Overdue Dispatch</p>
                  <p className="text-red-600">TRK-034 dispatch overdue by 2 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-blue-700">Pending Procurement Approval</p>
                  <p className="text-blue-600">6 procurement requests awaiting HQ approval</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Sales Target</span>
                <span className="text-sm font-medium">85% achieved</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">Dispatch Efficiency</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}