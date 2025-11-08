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
  AlertCircle
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

        {/* Procurement Modules */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Tenders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Tenders
              </CardTitle>
              <CardDescription>
                Manage tender processes and supplier bids
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/tenders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    View All Tenders
                  </Button>
                </Link>
                <Link href="/dashboard/procurement/tenders/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Tender
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Recent Activity:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• LPG Storage Tank - Open</li>
                  <li>• Transport Services - Evaluation</li>
                  <li>• Office Renovation - Closed</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* RFQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-yellow-500" />
                RFQ (Request for Quotation)
              </CardTitle>
              <CardDescription>
                Create and manage request for quotations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/rfq">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ClipboardList className="h-4 w-4" />
                    View All RFQs
                  </Button>
                </Link>
                <Link href="/dashboard/procurement/rfq/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New RFQ
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Recent Activity:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Office Equipment - Pending</li>
                  <li>• Maintenance Supplies - Draft</li>
                  <li>• IT Hardware - Quoted</li>
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
                Create and track purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/po">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    View All POs
                  </Button>
                </Link>
                <Link href="/dashboard/procurement/po/new">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New PO
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Recent Activity:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Safety Equipment - Approved</li>
                  <li>• Raw Materials - Processing</li>
                  <li>• Vehicle Parts - Delivered</li>
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