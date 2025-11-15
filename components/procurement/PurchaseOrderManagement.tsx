"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import {
  ShoppingCart,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Download,
  Eye,
  Edit,
  Plus,
  Filter,
  RefreshCw,
  Building,
  User,
  Calendar,
  DollarSign,
  Package,
  Truck,
  Search,
  Activity
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdvancedDataTable, createSortableColumn, createActionsColumn } from "@/components/ui/advanced-data-table"
import { FormModal, ConfirmationModal, useModal, InfoModal } from "@/components/ui/advanced-modal"
import { KPICard } from "@/components/ui/charts"
import { Progress } from "@/components/ui/progress"
import { ResponsiveGrid } from "@/components/ui/responsive-helpers"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import type { PurchaseOrder, PurchaseOrderItem, VendorMaster } from "@/lib/sap-procurement-types"

interface PurchaseOrderManagementProps {
  purchaseOrders: PurchaseOrder[]
  vendors: VendorMaster[]
  onCreatePO: (prNumbers: string[]) => void
  onReleasePO: (poNumber: string) => void
  onBlockPO: (poNumber: string, reason: string) => void
  onSendPO: (poNumber: string) => void
  onViewPO: (poNumber: string) => void
  onEditPO: (poNumber: string) => void
  userPermissions: string[]
}

export function PurchaseOrderManagement({
  purchaseOrders,
  vendors,
  onCreatePO,
  onReleasePO,
  onBlockPO,
  onSendPO,
  onViewPO,
  onEditPO,
  userPermissions
}: PurchaseOrderManagementProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterVendor, setFilterVendor] = useState<string>("all")
  const [filterDateRange, setFilterDateRange] = useState<string>("all")
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)

  const createPOModal = useModal()
  const releaseConfirmModal = useModal()
  const sendConfirmModal = useModal()
  const poDetailsModal = useModal()

  // Sample Purchase Requisitions awaiting PO creation
  const availablePRs = [
    {
      id: "PR-001",
      prNumber: "PR-2024-001",
      description: "LPG Equipment Procurement",
      requester: "John Doe",
      totalValue: 15000000,
      items: 5,
      priority: "HIGH",
      requiredDate: "2024-12-15",
      vendor: "Shell Nigeria Limited"
    },
    {
      id: "PR-002",
      prNumber: "PR-2024-002",
      description: "Maintenance Supplies",
      requester: "Jane Smith",
      totalValue: 2500000,
      items: 12,
      priority: "MEDIUM",
      requiredDate: "2024-12-20",
      vendor: "Total Nigeria Plc"
    }
  ]

  // Calculate KPIs
  const kpis = React.useMemo(() => {
    const totalOrders = purchaseOrders.length
    const openOrders = purchaseOrders.filter(po => po.headerInfo?.documentStatus === 'OPEN').length
    const releasedOrders = purchaseOrders.filter(po => po.headerInfo?.documentStatus === 'RELEASED').length
    const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.headerInfo?.totalNetValue || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0

    return {
      totalOrders: { value: totalOrders, change: 12.5 },
      openOrders: { value: openOrders, change: -8.3 },
      totalValue: { value: totalValue, change: 15.7 },
      avgOrderValue: { value: avgOrderValue, change: 3.2 }
    }
  }, [purchaseOrders])

  // Filter purchase orders
  const filteredOrders = React.useMemo(() => {
    return purchaseOrders.filter(po => {
      const statusMatch = filterStatus === "all" || po.headerInfo?.documentStatus?.toLowerCase() === filterStatus
      const vendorMatch = filterVendor === "all" || po.headerInfo?.vendor === filterVendor

      let dateMatch = true
      if (filterDateRange !== "all" && po.headerInfo?.orderDate) {
        const orderDate = new Date(po.headerInfo.orderDate)
        const today = new Date()
        const daysAgo = filterDateRange === "7" ? 7 : filterDateRange === "30" ? 30 : 90
        const cutoffDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000)
        dateMatch = orderDate >= cutoffDate
      }

      return statusMatch && vendorMatch && dateMatch
    })
  }, [purchaseOrders, filterStatus, filterVendor, filterDateRange])

  // Purchase Order columns
  const poColumns = [
    createSortableColumn('headerInfo.poNumber', 'PO Number', ({ row }) => (
      <Button
        variant="link"
        className="h-auto p-0 font-semibold text-primary"
        onClick={() => {
          setSelectedPO(row)
          poDetailsModal.open()
        }}
      >
        {row.headerInfo?.poNumber || row.poNumber || 'N/A'}
      </Button>
    )),
    createSortableColumn('headerInfo.vendorName', 'Vendor', ({ row }) =>
      row.headerInfo?.vendorName || 'N/A'
    ),
    createSortableColumn('headerInfo.orderDate', 'Order Date', ({ row }) =>
      row.headerInfo?.orderDate ? format(new Date(row.headerInfo.orderDate), 'dd/MM/yyyy') : 'N/A'
    ),
    createSortableColumn('headerInfo.deliveryDate', 'Delivery Date', ({ row }) =>
      row.headerInfo?.deliveryDate ? format(new Date(row.headerInfo.deliveryDate), 'dd/MM/yyyy') : 'N/A'
    ),
    createSortableColumn('headerInfo.totalNetValue', 'Total Value', ({ row }) =>
      row.headerInfo?.totalNetValue ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(row.headerInfo.totalNetValue) : 'N/A'
    ),
    createSortableColumn('headerInfo.currency', 'Currency', ({ row }) =>
      row.headerInfo?.currency || 'N/A'
    ),
    createSortableColumn('headerInfo.documentStatus', 'Status', ({ row }) => {
      const status = row.headerInfo?.documentStatus || 'UNKNOWN'
      return (
        <Badge variant={
          status === 'RELEASED' ? 'default' :
          status === 'OPEN' ? 'secondary' :
          status === 'COMPLETED' ? 'default' :
          status === 'BLOCKED' ? 'destructive' : 'outline'
        }>
          {status.replace('_', ' ')}
        </Badge>
      )
    }),
    createSortableColumn('lineItems.length', 'Items', ({ row }) =>
      `${row.lineItems?.length || 0} items`
    ),
    createActionsColumn((row: PurchaseOrder) => (
      <>
        <DropdownMenuItem onClick={() => onViewPO(row.headerInfo?.poNumber || row.poNumber || '')}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {userPermissions.includes('edit_po') && row.headerInfo?.documentStatus === 'OPEN' && (
          <DropdownMenuItem onClick={() => onEditPO(row.headerInfo?.poNumber || row.poNumber || '')}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {userPermissions.includes('release_po') && row.headerInfo?.documentStatus === 'OPEN' && (
          <DropdownMenuItem onClick={() => {
            setSelectedPO(row)
            releaseConfirmModal.open()
          }}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Release
          </DropdownMenuItem>
        )}
        {userPermissions.includes('send_po') && row.headerInfo?.documentStatus === 'RELEASED' && (
          <DropdownMenuItem onClick={() => {
            setSelectedPO(row)
            sendConfirmModal.open()
          }}>
            <Send className="mr-2 h-4 w-4" />
            Send to Vendor
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </DropdownMenuItem>
      </>
    ))
  ]

  // Purchase Requisition columns for PO creation
  const prColumns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        />
      ),
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    createSortableColumn('prNumber', 'PR Number'),
    createSortableColumn('description', 'Description'),
    createSortableColumn('requester', 'Requester'),
    createSortableColumn('vendor', 'Proposed Vendor'),
    createSortableColumn('totalValue', 'Estimated Value', ({ row }) =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(row.totalValue)
    ),
    createSortableColumn('items', 'Items', ({ row }) => `${row.items} items`),
    createSortableColumn('priority', 'Priority', ({ row }) => (
      <Badge variant={
        row.priority === 'HIGH' ? 'destructive' :
        row.priority === 'MEDIUM' ? 'default' : 'secondary'
      }>
        {row.priority}
      </Badge>
    )),
    createSortableColumn('requiredDate', 'Required Date', ({ row }) => {
      if (!row.requiredDate) return 'N/A'
      try {
        const date = new Date(row.requiredDate)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return format(date, 'dd/MM/yyyy')
      } catch (error) {
        return 'Invalid Date'
      }
    })
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'RELEASED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'BLOCKED': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleCreatePO = (selectedPRs: string[]) => {
    onCreatePO(selectedPRs)
    createPOModal.close()
  }

  const handleReleasePO = () => {
    if (selectedPO) {
      onReleasePO(selectedPO.headerInfo?.poNumber || selectedPO.poNumber || '')
      releaseConfirmModal.close()
    }
  }

  const handleSendPO = () => {
    if (selectedPO) {
      onSendPO(selectedPO.headerInfo?.poNumber || selectedPO.poNumber || '')
      sendConfirmModal.close()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Purchase Order Management</h2>
          <p className="text-muted-foreground">
            Manage purchase orders and vendor relationships
          </p>
        </div>
        <div className="flex gap-2">
          {userPermissions.includes('create_po') && (
            <Button onClick={createPOModal.open} className="gap-2">
              <Plus className="h-4 w-4" />
              Create PO
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <KPICard
          title="Total Purchase Orders"
          value={kpis.totalOrders.value}
          change={kpis.totalOrders.change}
          trend="up"
          icon={ShoppingCart}
        />
        <KPICard
          title="Open Orders"
          value={kpis.openOrders.value}
          change={kpis.openOrders.change}
          trend="down"
          icon={Clock}
        />
        <KPICard
          title="Total Value"
          value={`₦${(kpis.totalValue.value / 1000000).toFixed(1)}M`}
          change={kpis.totalValue.change}
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Avg Order Value"
          value={`₦${(kpis.avgOrderValue.value / 1000).toFixed(0)}K`}
          change={kpis.avgOrderValue.change}
          trend="up"
          icon={FileText}
        />
      </ResponsiveGrid>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Vendor</label>
              <Select value={filterVendor} onValueChange={setFilterVendor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PO number, vendor..."
                  className="pl-10"
                />
              </div>
            </div>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <AdvancedDataTable
        columns={poColumns}
        data={filteredOrders}
        title="Purchase Orders"
        description={`${filteredOrders.length} purchase orders found`}
        searchPlaceholder="Search purchase orders..."
        enableExport
        exportFilename="purchase-orders.csv"
        onRowClick={(row) => {
          setSelectedPO(row)
          poDetailsModal.open()
        }}
      />

      {/* Workflow Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Purchase Order Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {['OPEN', 'RELEASED', 'COMPLETED', 'BLOCKED'].map((status) => {
              const count = purchaseOrders.filter(po => po.headerInfo?.documentStatus === status).length
              const percentage = purchaseOrders.length > 0 ? (count / purchaseOrders.length) * 100 : 0

              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create PO Modal */}
      <FormModal
        open={createPOModal.isOpen}
        onOpenChange={createPOModal.setIsOpen}
        title="Create Purchase Order"
        description="Select Purchase Requisitions to convert to Purchase Orders"
        size="xl"
        showFooter={false}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Purchase Requisitions</h3>
            <Badge variant="outline">
              {availablePRs.length} PRs awaiting PO creation
            </Badge>
          </div>

          <AdvancedDataTable
            columns={prColumns}
            data={availablePRs}
            title="Purchase Requisitions"
            description="Select PRs to create purchase orders"
            searchPlaceholder="Search PRs..."
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={createPOModal.close}>
              Cancel
            </Button>
            <Button onClick={() => handleCreatePO(["PR-001", "PR-002"])}>
              Create PO from Selected PRs
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Release Confirmation Modal */}
      <ConfirmationModal
        open={releaseConfirmModal.isOpen}
        onOpenChange={releaseConfirmModal.setIsOpen}
        title="Release Purchase Order"
        description={`Are you sure you want to release PO ${selectedPO?.headerInfo?.poNumber || selectedPO?.poNumber || 'N/A'}? This will make it available for transmission to the vendor.`}
        confirmText="Release PO"
        cancelText="Cancel"
        onConfirm={handleReleasePO}
        variant="default"
      />

      {/* Send Confirmation Modal */}
      <ConfirmationModal
        open={sendConfirmModal.isOpen}
        onOpenChange={sendConfirmModal.setIsOpen}
        title="Send Purchase Order to Vendor"
        description={`Send PO ${selectedPO?.headerInfo?.poNumber || selectedPO?.poNumber || 'N/A'} to ${selectedPO?.headerInfo?.vendorName || 'N/A'}?`}
        confirmText="Send PO"
        cancelText="Cancel"
        onConfirm={handleSendPO}
        variant="default"
      />

      {/* PO Details Modal */}
      {selectedPO && (
        <InfoModal
          open={poDetailsModal.isOpen}
          onOpenChange={poDetailsModal.setIsOpen}
          title={`Purchase Order ${selectedPO.headerInfo?.poNumber || selectedPO.poNumber || 'N/A'}`}
          description={`Vendor: ${selectedPO.headerInfo?.vendorName || 'N/A'}`}
          size="xl"
          data={selectedPO}
          fields={[
            { key: 'headerInfo.poNumber', label: 'PO Number', type: 'text' },
            { key: 'headerInfo.vendorName', label: 'Vendor', type: 'text' },
            { key: 'headerInfo.orderDate', label: 'Order Date', type: 'date' },
            { key: 'headerInfo.deliveryDate', label: 'Delivery Date', type: 'date' },
            { key: 'headerInfo.totalNetValue', label: 'Total Value', type: 'currency' },
            { key: 'headerInfo.currency', label: 'Currency', type: 'text' },
            { key: 'headerInfo.documentStatus', label: 'Status', type: 'badge' },
            { key: 'headerInfo.paymentTerms', label: 'Payment Terms', type: 'text' },
            { key: 'headerInfo.purchasingGroup', label: 'Purchasing Group', type: 'text' },
            { key: 'headerInfo.deliveryAddress', label: 'Delivery Address', type: 'text' }
          ]}
        >
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Line Items ({selectedPO.lineItems?.length || 0})</h4>
            <div className="space-y-2">
              {(selectedPO.lineItems || []).map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.materialDescription}</p>
                      {item.materialNumber && (
                        <p className="text-sm text-muted-foreground">
                          Material: {item.materialNumber}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.orderQuantity} {item.orderUnit} |
                        Price: ₦{item.netPrice.toLocaleString()} per {item.orderUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{item.netValue.toLocaleString()}</p>
                      <Badge variant={
                        item.deliveryStatus === 'COMPLETE' ? 'default' :
                        item.deliveryStatus === 'PARTIAL' ? 'secondary' : 'outline'
                      }>
                        {item.deliveryStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InfoModal>
      )}
    </div>
  )
}

export default PurchaseOrderManagement