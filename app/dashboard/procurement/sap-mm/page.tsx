'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Package, CheckCircle, Calculator, Handshake,
  BarChart3, Target, Workflow, Plus, Eye, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function SAPMMPage() {
  const { user } = useAuth();

  // Mock SAP MM statistics
  const sapMMStats = {
    purchaseRequisitions: { total: 284, pending: 23, approved: 261 },
    purchaseOrders: { total: 194, open: 45, completed: 149, value: 12450000 },
    goodsReceipts: { total: 154, pending: 12, completed: 142 },
    invoiceVerification: { total: 146, matched: 139, exceptions: 7 },
    contracts: { total: 23, active: 18, value: 45600000 },
    vendors: { total: 124, active: 89, performance: 87.6 }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SAP Materials Management (MM)</h1>
            <p className="text-muted-foreground">
              Complete procurement lifecycle management system
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/procurement/sap-mm/dashboard">
              <Button className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Procurement Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Purchase Requisitions
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.purchaseRequisitions.total}</div>
              <p className="text-xs text-orange-600 mt-1">
                {sapMMStats.purchaseRequisitions.pending} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Purchase Orders
              </CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.purchaseOrders.total}</div>
              <p className="text-xs text-blue-600 mt-1">
                ${(sapMMStats.purchaseOrders.value / 1000000).toFixed(1)}M total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Goods Receipts
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.goodsReceipts.total}</div>
              <p className="text-xs text-yellow-600 mt-1">
                {sapMMStats.goodsReceipts.pending} pending processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Invoice Verification
              </CardTitle>
              <Calculator className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.invoiceVerification.total}</div>
              <p className="text-xs text-red-600 mt-1">
                {sapMMStats.invoiceVerification.exceptions} exceptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contracts
              </CardTitle>
              <Handshake className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.contracts.total}</div>
              <p className="text-xs text-green-600 mt-1">
                ${(sapMMStats.contracts.value / 1000000).toFixed(1)}M total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vendor Performance
              </CardTitle>
              <Target className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sapMMStats.vendors.performance}%</div>
              <p className="text-xs text-green-600 mt-1">
                {sapMMStats.vendors.active} active vendors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SAP MM Process Modules */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Purchase Requisitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Purchase Requisitions (PR)
              </CardTitle>
              <CardDescription>
                SAP ME51N - Create and manage purchase requisitions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/purchase-requisitions">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Manage PRs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.purchaseRequisitions.approved} Approved</li>
                  <li>• {sapMMStats.purchaseRequisitions.pending} Pending</li>
                  <li>• 2.3 days avg processing time</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                Purchase Orders (PO)
              </CardTitle>
              <CardDescription>
                SAP ME21N - Complete purchase order management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/purchase-orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    Manage POs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.purchaseOrders.open} Open Orders</li>
                  <li>• {sapMMStats.purchaseOrders.completed} Completed</li>
                  <li>• $6,472 average order value</li>
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
                SAP MIGO - Goods receipt processing and quality management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/goods-receipts">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Manage GRs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.goodsReceipts.completed} Completed</li>
                  <li>• {sapMMStats.goodsReceipts.pending} Pending</li>
                  <li>• 1.5% quality issues rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-500" />
                Invoice Verification (IV)
              </CardTitle>
              <CardDescription>
                SAP MIRO - Three-way matching and invoice processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/invoice-verification">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calculator className="h-4 w-4" />
                    Manage IVs
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.invoiceVerification.matched} Matched</li>
                  <li>• {sapMMStats.invoiceVerification.exceptions} Exceptions</li>
                  <li>• 95.2% auto-match rate</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contract Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-indigo-500" />
                Contract Management
              </CardTitle>
              <CardDescription>
                Outline agreements, scheduling agreements, and contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/contracts">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Handshake className="h-4 w-4" />
                    Manage Contracts
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.contracts.active} Active Contracts</li>
                  <li>• 68.4% average utilization</li>
                  <li>• $2.85M annual savings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-pink-500" />
                Vendor Management
              </CardTitle>
              <CardDescription>
                SAP MK01 - Complete vendor master and performance management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/vendors">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Target className="h-4 w-4" />
                    Manage Vendors
                  </Button>
                </Link>
              </div>
              <div className="text-sm">
                <p className="font-medium">Quick Stats:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {sapMMStats.vendors.active} Active Vendors</li>
                  <li>• {sapMMStats.vendors.performance}% avg performance</li>
                  <li>• 94.2% on-time delivery</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Three-Way Matching Engine */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Three-Way Matching Engine
              </CardTitle>
              <CardDescription>
                Automated PO-GR-Invoice matching with intelligent variance detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/three-way-matching">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Target className="h-4 w-4" />
                    Matching Engine
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-600">94.8%</p>
                  <p className="text-muted-foreground">Auto-match rate</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600">1.2s</p>
                  <p className="text-muted-foreground">Avg processing time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-purple-600" />
                Workflow Automation Engine
              </CardTitle>
              <CardDescription>
                Intelligent process automation with AI-powered optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/procurement/sap-mm/workflow-automation">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Workflow className="h-4 w-4" />
                    Automation Engine
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-purple-600">42</p>
                  <p className="text-muted-foreground">Active workflows</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">98.5%</p>
                  <p className="text-muted-foreground">Success rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              SAP MM Process Health
            </CardTitle>
            <CardDescription>Real-time performance metrics across all procurement processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-muted-foreground">Overall Health Score</div>
                <div className="text-xs text-green-600 mt-1">Excellent Performance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2.3 days</div>
                <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                <div className="text-xs text-blue-600 mt-1">15% improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$2.8M</div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
                <div className="text-xs text-purple-600 mt-1">ROI: 1,800%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">99.8%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
                <div className="text-xs text-orange-600 mt-1">Enterprise reliability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common SAP MM operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/dashboard/procurement/sap-mm/purchase-requisitions">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Create Purchase Requisition
                </Button>
              </Link>
              <Link href="/dashboard/procurement/sap-mm/purchase-orders">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Create Purchase Order
                </Button>
              </Link>
              <Link href="/dashboard/procurement/sap-mm/goods-receipts">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Process Goods Receipt
                </Button>
              </Link>
              <Link href="/dashboard/procurement/sap-mm/dashboard">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}