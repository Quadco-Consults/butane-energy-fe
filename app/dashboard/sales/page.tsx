'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { TankVisualization } from '@/components/dashboard/TankVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  FileText,
  BarChart3,
  Store
} from 'lucide-react';

export default function SalesDashboard() {
  const { user } = useAuth();

  const salesMetrics = [
    {
      title: "Today's Sales",
      value: "₦245,000",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Customers",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Orders Today",
      value: "23",
      change: "+15%",
      icon: ShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Average Order",
      value: "₦10,652",
      change: "+3%",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const quickActions = [
    {
      title: "Gas Station POS",
      description: "Process sales, manage transactions, handle customer orders",
      href: "/dashboard/pos",
      icon: CreditCard,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Customer Management",
      description: "Manage customer accounts, credit limits, and relationships",
      href: "/dashboard/sales/customers",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Sales Orders",
      description: "View and manage all sales orders and transactions",
      href: "/dashboard/sales/orders",
      icon: ShoppingCart,
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Sales Reports",
      description: "Generate detailed sales analytics and performance reports",
      href: "/dashboard/sales/reports",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Pricing Management",
      description: "Update product prices and manage promotional offers",
      href: "/dashboard/sales/pricing",
      icon: DollarSign,
      color: "bg-red-500 hover:bg-red-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              Sales Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage sales operations, customer relationships, and revenue tracking
            </p>
          </div>
          <Link href="/dashboard/pos">
            <Button size="lg" className="gap-2">
              <CreditCard className="h-5 w-5" />
              Open POS System
            </Button>
          </Link>
        </div>

        {/* Sales Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          {salesMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs ${metric.color}`}>
                    {metric.change} from yesterday
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sales Operations
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={action.href}>
                      <Button variant="outline" className="w-full">
                        Access {action.title}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Latest transactions and customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sale completed - ₦25,000</p>
                    <p className="text-sm text-muted-foreground">Lagos Gas Station Network</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New customer registered</p>
                    <p className="text-sm text-muted-foreground">Ahmed Musa - Individual Account</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">15 minutes ago</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bulk order processed - 50kg LPG</p>
                    <p className="text-sm text-muted-foreground">Kano Distribution Hub</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tank Inventory & Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-500" />
                  LPG Tank Inventory & Storage
                </CardTitle>
                <CardDescription>
                  Real-time tank levels for bulk and cylinder operations at current location
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right text-sm">
                  <p className="font-medium">Current Location</p>
                  <p className="text-muted-foreground">
                    {user?.plantAccess?.[0] === 'lagos-plant' ? 'Lagos Distribution Center' :
                     user?.plantAccess?.[0] === 'kano-plant' ? 'Kano Distribution Hub' :
                     user?.plantAccess?.[0] === 'abuja-plant' ? 'Abuja Operations Center' :
                     'Head Office Location'}
                  </p>
                </div>
                <Link href="/dashboard/pos">
                  <Button className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Open POS System
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TankVisualization
              onSale={(tankId, amount) => {
                console.log(`Sale recorded at ${user?.plantAccess?.[0]}: ${amount} kg from ${tankId}`);
                // In a real app, this would update location-specific sales records
              }}
              showControls={user?.role === 'admin' || user?.role === 'manager' || user?.department === 'sales'}
              userRole={user?.role}
              userDepartment={user?.department}
              currentLocation={user?.plantAccess?.[0]}
            />

            {/* Location-specific notes */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Location Operations Notes</h4>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <p className="font-medium text-green-700">Bulk LPG Sales:</p>
                  <p className="text-muted-foreground">Direct tank-to-truck transfers for commercial customers</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Cylinder Operations:</p>
                  <p className="text-muted-foreground">6kg, 12.5kg, and 25kg cylinder filling from storage tanks</p>
                </div>
                <div>
                  <p className="font-medium text-orange-700">Storage Capacity:</p>
                  <p className="text-muted-foreground">Total location capacity varies by facility size and demand</p>
                </div>
                <div>
                  <p className="font-medium text-purple-700">Quality Control:</p>
                  <p className="text-muted-foreground">Continuous purity and pressure monitoring across all tanks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}