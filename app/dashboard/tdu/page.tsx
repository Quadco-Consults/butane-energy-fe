'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useERP } from '@/contexts/ERPContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Package,
  Truck,
  BarChart3,
  Clock,
  CheckCircle,
  Target,
  Zap,
  MapPin,
  Calendar
} from 'lucide-react';

// Mock TDU data - in real app this would come from APIs
const mockTDUData = {
  orders: {
    total: 156,
    pending: 12,
    processing: 8,
    completed: 136,
    totalValue: 2800000000,
    avgOrderValue: 17948718
  },
  revenue: {
    thisMonth: 1200000000,
    lastMonth: 980000000,
    growthRate: 22.4,
    target: 1500000000,
    ytd: 8400000000
  },
  operations: {
    activeDeliveries: 15,
    completedToday: 8,
    pendingPickups: 5,
    trucksInTransit: 12
  },
  customers: {
    total: 47,
    active: 42,
    new: 3,
    atRisk: 2
  },
  performance: {
    deliverySuccess: 96.8,
    customerSatisfaction: 94.2,
    onTimeDelivery: 89.5,
    orderAccuracy: 98.1
  }
};

const mockRecentOrders = [
  { id: 'TDU-2024-001', customer: 'Lagos Gas Station Network', value: 45000000, status: 'processing', priority: 'high' },
  { id: 'TDU-2024-002', customer: 'Abuja Industrial Zone', value: 32000000, status: 'pending', priority: 'medium' },
  { id: 'TDU-2024-003', customer: 'Kano Distribution Hub', value: 28000000, status: 'completed', priority: 'low' },
  { id: 'TDU-2024-004', customer: 'Port Harcourt Terminals', value: 67000000, status: 'processing', priority: 'high' }
];

export default function TDUDashboard() {
  const { user, hasPermission } = useAuth();
  const { canPerformAction } = useERP();

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            TDU Dashboard
          </h1>
          <p className="text-muted-foreground">
            Technical Delivery Unit - Operations & Performance Overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/tdu/orders">
            <Button size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              View All Orders
            </Button>
          </Link>
          <Link href="/dashboard/tdu/reports">
            <Button size="sm" variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/tdu/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTDUData.orders.pending + mockTDUData.orders.processing}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{mockTDUData.orders.total} total orders
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tdu/revenue">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(mockTDUData.revenue.thisMonth / 1000000000).toFixed(1)}B</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{mockTDUData.revenue.growthRate}% vs last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tdu/customers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTDUData.customers.active}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{mockTDUData.customers.new} new this month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tdu/logistics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Deliveries
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTDUData.operations.activeDeliveries}</div>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {mockTDUData.operations.completedToday} completed today
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Performance Metrics & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators for TDU operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Success Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockTDUData.performance.deliverySuccess} className="w-20 h-2" />
                  <span className="text-sm font-bold text-green-600">{mockTDUData.performance.deliverySuccess}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockTDUData.performance.customerSatisfaction} className="w-20 h-2" />
                  <span className="text-sm font-bold text-blue-600">{mockTDUData.performance.customerSatisfaction}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">On-Time Delivery</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockTDUData.performance.onTimeDelivery} className="w-20 h-2" />
                  <span className="text-sm font-bold text-orange-600">{mockTDUData.performance.onTimeDelivery}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order Accuracy</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockTDUData.performance.orderAccuracy} className="w-20 h-2" />
                  <span className="text-sm font-bold text-purple-600">{mockTDUData.performance.orderAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/tdu/reports">
                <Button size="sm" variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Latest customer orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge
                        variant={order.priority === 'high' ? 'destructive' : order.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{order.customer}</p>
                    <p className="text-xs font-medium">₦{(order.value / 1000000).toFixed(1)}M</p>
                  </div>
                  <Badge
                    className={
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/tdu/orders">
                <Button size="sm" variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Target Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Monthly Revenue Progress
          </CardTitle>
          <CardDescription>
            Progress towards monthly revenue target
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current: ₦{(mockTDUData.revenue.thisMonth / 1000000000).toFixed(1)}B</span>
              <span className="text-sm text-muted-foreground">Target: ₦{(mockTDUData.revenue.target / 1000000000).toFixed(1)}B</span>
            </div>
            <Progress
              value={(mockTDUData.revenue.thisMonth / mockTDUData.revenue.target) * 100}
              className="h-3"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round((mockTDUData.revenue.thisMonth / mockTDUData.revenue.target) * 100)}% achieved</span>
              <span>₦{((mockTDUData.revenue.target - mockTDUData.revenue.thisMonth) / 1000000000).toFixed(1)}B remaining</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link href="/dashboard/tdu/revenue">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <BarChart3 className="h-4 w-4" />
                Revenue Analysis
              </Button>
            </Link>
            <Link href="/dashboard/tdu/customers">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Users className="h-4 w-4" />
                Customer Insights
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}