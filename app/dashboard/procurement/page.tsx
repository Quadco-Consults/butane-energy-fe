'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  ClipboardList,
  ShoppingCart,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileEdit,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function ProcurementPage() {
  const { user } = useAuth();

  // Mock data for procurement activities
  const procurementStats = {
    activeTenders: 3,
    pendingRFQs: 5,
    pendingPOs: 8,
    totalSpend: 15750000
  };

  const recentActivities = [
    {
      id: 1,
      type: 'tender',
      title: 'LPG Storage Tank Procurement',
      status: 'open',
      deadline: '2025-11-20',
      amount: 5000000
    },
    {
      id: 2,
      type: 'rfq',
      title: 'Office Equipment RFQ',
      status: 'pending',
      deadline: '2025-11-15',
      amount: 850000
    },
    {
      id: 3,
      type: 'po',
      title: 'PO-2025-034 - Safety Equipment',
      status: 'approved',
      deadline: '2025-11-12',
      amount: 1200000
    },
    {
      id: 4,
      type: 'tender',
      title: 'Transport Services Tender',
      status: 'evaluation',
      deadline: '2025-11-25',
      amount: 3200000
    },
    {
      id: 5,
      type: 'rfq',
      title: 'Maintenance Supplies RFQ',
      status: 'draft',
      deadline: '2025-11-18',
      amount: 650000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'evaluation': return 'bg-purple-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tender': return <FileText className="h-4 w-4" />;
      case 'rfq': return <ClipboardList className="h-4 w-4" />;
      case 'po': return <ShoppingCart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Procurement Department</h1>
            <p className="text-muted-foreground">
              Manage Tenders, RFQs, and Purchase Orders
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/procurement/tenders/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Tender
              </Button>
            </Link>
            <Link href="/dashboard/procurement/rfq/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New RFQ
              </Button>
            </Link>
            <Link href="/dashboard/procurement/po/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New PO
              </Button>
            </Link>
          </div>
        </div>

        {/* SAP MM Process Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">SAP MM Procurement Process</h2>
                <p className="text-blue-700 mb-4">
                  Follow the standard Purchase-to-Pay (P2P) workflow: PR → PO → GR → IV
                </p>
                <div className="flex gap-2">
                  <Link href="/dashboard/procurement/purchase-requisitions">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <FileEdit className="w-4 h-4 mr-2" />
                      Start with PR
                    </Button>
                  </Link>
                  <Link href="/dashboard/procurement/analytics">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-blue-600">94.2%</div>
                    <div className="text-blue-600">Process Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-green-600">2.3 days</div>
                    <div className="text-green-600">Avg Cycle Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tenders
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procurementStats.activeTenders}</div>
              <p className="text-xs text-green-600 mt-1">
                2 closing this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending RFQs
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procurementStats.pendingRFQs}</div>
              <p className="text-xs text-yellow-600 mt-1">
                3 awaiting response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending POs
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procurementStats.pendingPOs}</div>
              <p className="text-xs text-orange-600 mt-1">
                5 need approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spend (YTD)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{procurementStats.totalSpend.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                +15% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SAP MM Core Processes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Purchase Requisitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-blue-500" />
                Purchase Requisitions (PR)
              </CardTitle>
              <CardDescription>
                SAP ME51N - Start the procurement process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/purchase-requisitions">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileEdit className="h-4 w-4" />
                    Manage PRs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 23 Pending Approval</li>
                  <li>• 261 Approved</li>
                  <li>• 2.3 days avg processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                Purchase Orders (PO)
              </CardTitle>
              <CardDescription>
                SAP ME21N - Convert approved PRs to POs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/purchase-orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Manage POs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 45 Open Orders</li>
                  <li>• $12.45M Total Value</li>
                  <li>• $6,472 avg order value</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Goods Receipts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Goods Receipts (GR)
              </CardTitle>
              <CardDescription>
                SAP MIGO - Record delivery and quality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/goods-receipts">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Process GRs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 12 Pending Processing</li>
                  <li>• 142 Completed</li>
                  <li>• 1.5% quality issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                Invoice Verification (IV)
              </CardTitle>
              <CardDescription>
                SAP MIRO - Three-way matching and payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/invoice-verification">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <DollarSign className="h-4 w-4" />
                    Verify Invoices
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Current Status:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 7 Exceptions to Review</li>
                  <li>• 139 Matched</li>
                  <li>• 95.2% auto-match rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supporting Processes */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Vendor Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
                Vendor Management
              </CardTitle>
              <CardDescription>
                SAP MK01 - Vendor master and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/vendors">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Manage Vendors
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 89 Active Vendors</li>
                  <li>• 87.6% avg performance</li>
                  <li>• 94.2% on-time delivery</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contract Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-500" />
                Contract Management
              </CardTitle>
              <CardDescription>
                Outline agreements and contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/contracts">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Manage Contracts
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 18 Active Contracts</li>
                  <li>• $45.6M total value</li>
                  <li>• 68.4% utilization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                Analytics & Automation
              </CardTitle>
              <CardDescription>
                Process insights and workflow automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/analytics">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/dashboard/procurement/workflow-automation">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Workflow Engine
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Performance:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• 94.2% health score</li>
                  <li>• 42 active workflows</li>
                  <li>• 98.5% success rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Procurement Activities</CardTitle>
            <CardDescription>Latest tenders, RFQs, and purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(activity.deadline).toLocaleDateString()}
                        <span className="mx-1">•</span>
                        <DollarSign className="h-3 w-3" />
                        ₦{activity.amount.toLocaleString()}
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