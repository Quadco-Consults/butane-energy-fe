'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useERP } from '@/contexts/ERPContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  Building2,
  Truck,
  ClipboardCheck,
  FileText,
  Shield,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Award,
  Activity,
  BarChart3,
  XCircle,
  RefreshCw,
  MapPin,
  UserCheck,
  Briefcase,
  Warehouse,
  Factory
} from 'lucide-react';

// Mock data for comprehensive dashboard - in real app this would come from APIs
const mockDashboardData = {
  // PDU Project Data
  pduProjects: {
    total: 15,
    active: 8,
    completed: 6,
    delayed: 2,
    avgProgress: 68,
    totalBudget: 8500000000,
    spentBudget: 5200000000
  },

  // Procurement Data
  procurement: {
    activePurchaseOrders: 12,
    pendingApprovals: 5,
    totalSpent: 2800000000,
    pendingGRNs: 8,
    vendorCount: 45
  },

  // HR Data
  hr: {
    totalEmployees: 285,
    activeEmployees: 278,
    onLeave: 7,
    newHires: 12,
    pendingLeaves: 8,
    trainingsDue: 15
  },

  // Inventory Data
  inventory: {
    totalItems: 1250,
    lowStockItems: 23,
    outOfStock: 5,
    totalValue: 450000000,
    locations: 6
  },

  // Permits Data
  permits: {
    totalPermits: 18,
    active: 15,
    expiringSoon: 4,
    expired: 1,
    avgCompliance: 89
  },

  // Safety & Compliance
  safety: {
    incidentsFree: 45,
    safetyScore: 96,
    complianceScore: 91,
    inspectionsDue: 3
  }
};

const mockRecentActivity = [
  { time: '10 minutes ago', action: 'Purchase Order PO-2024-156 approved', type: 'procurement', user: 'Kemi Adebayo' },
  { time: '25 minutes ago', action: 'Project milestone completed for LNG Terminal', type: 'pdu', user: 'Emeka Nwosu' },
  { time: '1 hour ago', action: 'Safety inspection passed at Lagos facility', type: 'safety', user: 'Adaobi Okechukwu' },
  { time: '2 hours ago', action: 'New employee onboarded in Engineering', type: 'hr', user: 'Fatima Abubakar' },
  { time: '3 hours ago', action: 'Inventory transfer completed between stores', type: 'inventory', user: 'Tunde Lawal' }
];

export default function DashboardPage() {
  const { dashboardStats, products, orders, plants, canPerformAction } = useERP();
  const { user, hasPermission } = useAuth();

  // Generate stats based on user permissions and department
  const stats = [];

  // Executive & Management - Show high level KPIs
  if (hasPermission('view_dashboard') || user?.role === 'executive' || user?.role === 'manager') {
    stats.push(
      {
        title: 'Active Projects',
        value: mockDashboardData.pduProjects.active,
        change: '+2 this month',
        icon: Target,
        trend: 'up',
        href: '/dashboard/pdu/projects'
      },
      {
        title: 'Total Revenue',
        value: `₦${(mockDashboardData.pduProjects.spentBudget / 1000000000).toFixed(1)}B`,
        change: '+12.5%',
        icon: DollarSign,
        trend: 'up',
        href: '/dashboard/pdu/reports'
      },
      {
        title: 'Employee Count',
        value: mockDashboardData.hr.totalEmployees,
        change: `+${mockDashboardData.hr.newHires} new hires`,
        icon: Users,
        trend: 'up',
        href: '/dashboard/hr'
      },
      {
        title: 'Safety Score',
        value: `${mockDashboardData.safety.safetyScore}%`,
        change: `${mockDashboardData.safety.incidentsFree} days incident-free`,
        icon: Shield,
        trend: 'up',
        href: '/dashboard/pdu/permits'
      }
    );
  }

  // Procurement specific stats
  if (hasPermission('create_purchase_requests') || user?.department === 'procurement') {
    if (!hasPermission('view_dashboard')) { // Only add if not already added for executives
      stats.push({
        title: 'Active Purchase Orders',
        value: mockDashboardData.procurement.activePurchaseOrders,
        change: '+3 new this week',
        icon: ShoppingCart,
        trend: 'up',
        href: '/dashboard/procurement'
      });
    }
    stats.push({
      title: 'Pending Approvals',
      value: mockDashboardData.procurement.pendingApprovals,
      icon: ClipboardCheck,
      href: '/dashboard/procurement/purchase-orders'
    });
  }

  // HR specific stats
  if (hasPermission('manage_employees') || user?.department === 'hr') {
    if (!hasPermission('view_dashboard')) {
      stats.push({
        title: 'Total Employees',
        value: mockDashboardData.hr.totalEmployees,
        change: `+${mockDashboardData.hr.newHires} new hires`,
        icon: Users,
        trend: 'up',
        href: '/dashboard/hr'
      });
    }
    stats.push({
      title: 'On Leave Today',
      value: mockDashboardData.hr.onLeave,
      icon: Calendar,
      href: '/dashboard/hr/leave'
    });
  }

  // Operations specific stats
  if (hasPermission('manage_inbound_operations') || user?.department === 'operations') {
    stats.push(
      {
        title: 'Inventory Items',
        value: mockDashboardData.inventory.totalItems.toLocaleString(),
        icon: Package,
        href: '/dashboard/admin/inventory'
      },
      {
        title: 'Low Stock Alerts',
        value: mockDashboardData.inventory.lowStockItems,
        icon: AlertTriangle,
        href: '/dashboard/admin/inventory'
      }
    );
  }

  // Finance specific stats
  if (hasPermission('view_financial_reports') || user?.department === 'finance') {
    stats.push(
      {
        title: 'Procurement Spend',
        value: `₦${(mockDashboardData.procurement.totalSpent / 1000000000).toFixed(1)}B`,
        change: '+8.3% vs last month',
        icon: DollarSign,
        trend: 'up',
        href: '/dashboard/procurement'
      },
      {
        title: 'Inventory Value',
        value: `₦${(mockDashboardData.inventory.totalValue / 1000000).toFixed(0)}M`,
        icon: Warehouse,
        href: '/dashboard/admin/inventory'
      }
    );
  }

  const lowStockProducts = products.filter(p => p.stockLevel <= p.reorderLevel);
  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Department-specific quick actions
  const getQuickActions = () => {
    if (!user) return [];
    const actions = [];

    // Executive actions
    if (hasPermission('view_dashboard')) {
      actions.push(
        { label: 'View Projects', href: '/dashboard/pdu/projects', icon: Target, color: 'bg-blue-500' },
        { label: 'Reports', href: '/dashboard/pdu/reports', icon: BarChart3, color: 'bg-green-500' }
      );
    }

    // Procurement actions
    if (hasPermission('create_purchase_requests')) {
      actions.push(
        { label: 'Create Purchase Request', href: '/dashboard/procurement/purchase-requests', icon: ShoppingCart, color: 'bg-blue-500' },
        { label: 'Manage Vendors', href: '/dashboard/procurement/vendors', icon: Users, color: 'bg-green-500' }
      );
    }

    // HR actions
    if (hasPermission('manage_employees')) {
      actions.push(
        { label: 'Add Employee', href: '/dashboard/hr/directory', icon: UserCheck, color: 'bg-purple-500' },
        { label: 'Leave Management', href: '/dashboard/hr/leave', icon: Calendar, color: 'bg-orange-500' }
      );
    }

    // Operations actions
    if (hasPermission('manage_inbound_operations')) {
      actions.push(
        { label: 'Manage Inventory', href: '/dashboard/admin/inventory', icon: Package, color: 'bg-orange-500' },
        { label: 'Store Operations', href: '/dashboard/admin/inventory/store', icon: Warehouse, color: 'bg-teal-500' }
      );
    }

    return actions.slice(0, 4); // Limit to 4 actions
  };

  const quickActions = getQuickActions();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}!
              {user?.department && (
                <span className="ml-1">
                  Department: {user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
              {user?.role && (
                <Badge variant="outline" className="ml-2">
                  {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              )}
            </p>
            {user?.currentPlant && (
              <Badge variant="outline" className="mt-1">
                <Factory className="h-3 w-3 mr-1" />
                Current Plant: {plants.find(p => p.id === user?.plantAccess?.[0])?.name || 'Unknown'}
              </Badge>
            )}
          </div>
          {quickActions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button size="sm" className="gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href || '#'}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Role-based Alert Widgets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* PDU Project Alerts - For executives, project managers */}
          {(hasPermission('view_dashboard') || hasPermission('manage_projects')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  PDU Project Status
                </CardTitle>
                <CardDescription>
                  Active projects requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LNG Terminal Expansion</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-16 h-2" />
                      <span className="text-xs">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Safety Systems Upgrade</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-xs">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pipeline Extension</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-16 h-2" />
                      <span className="text-xs text-orange-600">35%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/pdu/tracking">
                      <Button size="sm" variant="outline" className="w-full">
                        View Project Tracking
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Procurement Alerts - For procurement, finance, executives */}
          {(hasPermission('create_purchase_requests') || hasPermission('view_financial_reports') || hasPermission('view_dashboard')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                  Procurement Updates
                </CardTitle>
                <CardDescription>
                  Purchase orders and approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">PO-2024-156</span>
                    <Badge className="bg-orange-100 text-orange-800">Pending Approval</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">PO-2024-157</span>
                    <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">PO-2024-158</span>
                    <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/procurement/purchase-orders">
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Purchase Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* HR Alerts - For HR, executives */}
          {(hasPermission('manage_employees') || hasPermission('view_dashboard')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  HR Notifications
                </CardTitle>
                <CardDescription>
                  Employee and leave management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Leave Approvals</span>
                    <Badge className="bg-orange-100 text-orange-800">{mockDashboardData.hr.pendingLeaves}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Training Due</span>
                    <Badge className="bg-red-100 text-red-800">{mockDashboardData.hr.trainingsDue}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Hires (This Month)</span>
                    <Badge className="bg-green-100 text-green-800">{mockDashboardData.hr.newHires}</Badge>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/hr/leave">
                      <Button size="sm" variant="outline" className="w-full">
                        HR Management
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inventory Alerts - For operations, procurement */}
          {(hasPermission('manage_inbound_operations') || hasPermission('create_purchase_requests')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  Inventory Status
                </CardTitle>
                <CardDescription>
                  Stock levels and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Stock Items</span>
                    <Badge className="bg-orange-100 text-orange-800">{mockDashboardData.inventory.lowStockItems}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Out of Stock</span>
                    <Badge className="bg-red-100 text-red-800">{mockDashboardData.inventory.outOfStock}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Inventory Value</span>
                    <span className="text-sm font-medium">₦{(mockDashboardData.inventory.totalValue / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/admin/inventory">
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Inventory
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permits & Compliance - For HSE, executives */}
          {(hasPermission('manage_compliance') || hasPermission('view_dashboard')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Permits & Compliance
                </CardTitle>
                <CardDescription>
                  Regulatory compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expiring Soon</span>
                    <Badge className="bg-orange-100 text-orange-800">{mockDashboardData.permits.expiringSoon}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expired</span>
                    <Badge className="bg-red-100 text-red-800">{mockDashboardData.permits.expired}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={mockDashboardData.permits.avgCompliance} className="w-16 h-2" />
                      <span className="text-xs">{mockDashboardData.permits.avgCompliance}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/pdu/permits">
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Permits
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Dashboard - For HSE, operations, executives */}
          {(hasPermission('manage_safety') || hasPermission('view_dashboard')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Safety & HSE
                </CardTitle>
                <CardDescription>
                  Safety performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Days Incident-Free</span>
                    <Badge className="bg-green-100 text-green-800">{mockDashboardData.safety.incidentsFree}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Safety Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={mockDashboardData.safety.safetyScore} className="w-16 h-2" />
                      <span className="text-xs">{mockDashboardData.safety.safetyScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inspections Due</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{mockDashboardData.safety.inspectionsDue}</Badge>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/admin/maintenance">
                      <Button size="sm" variant="outline" className="w-full">
                        Safety Management
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity Feed - For all users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates across all systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'procurement' ? 'bg-blue-500' :
                    activity.type === 'pdu' ? 'bg-green-500' :
                    activity.type === 'safety' ? 'bg-yellow-500' :
                    activity.type === 'hr' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time} • by {activity.user}</p>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plant Status - Only show if user has plant access */}
        {plants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Plant Operations
              </CardTitle>
              <CardDescription>
                Plants you have access to ({plants.length} of {user?.plantAccess?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {plants.map((plant) => (
                  <div key={plant.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{plant.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {plant.location}
                        </p>
                        {plant.manager && (
                          <p className="text-xs text-muted-foreground mt-1">Manager: {plant.manager}</p>
                        )}
                      </div>
                      <Badge
                        variant={plant.status === 'operational' ? 'default' : 'secondary'}
                      >
                        {plant.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    {plant.status === 'operational' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Capacity Utilization</span>
                          <span className="font-medium">
                            {plant.currentStock} / {plant.capacity} MT
                          </span>
                        </div>
                        <Progress
                          value={Math.min((plant.currentStock / plant.capacity) * 100, 100)}
                          className="h-2"
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Math.round((plant.currentStock / plant.capacity) * 100)}% utilized
                        </div>
                      </div>
                    )}
                    {hasPermission('manage_inbound_operations') && (
                      <div className="mt-3">
                        <Link href={`/dashboard/plants/${plant.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            Manage Plant
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
