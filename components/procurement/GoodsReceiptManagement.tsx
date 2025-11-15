"use client"

import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  QrCode,
  Barcode,
  Scale,
  Eye,
  Edit,
  Plus,
  Minus,
  Search,
  FileText,
  Building,
  User,
  Calendar,
  Hash,
  Activity,
  ClipboardCheck,
  XCircle,
  Camera
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { AdvancedDataTable, createSortableColumn, createActionsColumn } from "@/components/ui/advanced-data-table"
import { FormModal, ConfirmationModal, useModal, InfoModal, WizardModal } from "@/components/ui/advanced-modal"
import { KPICard } from "@/components/ui/charts"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ResponsiveGrid } from "@/components/ui/responsive-helpers"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import type {
  GoodsReceipt,
  GoodsReceiptItem,
  PurchaseOrder,
  BatchInformation,
  SerialNumber
} from "@/lib/sap-procurement-types"

// Goods Receipt Schema based on SAP MIGO standards
const goodsReceiptSchema = z.object({
  headerInfo: z.object({
    postingDate: z.date(),
    documentDate: z.date(),
    plant: z.string().min(1, "Plant is required"),
    storageLocation: z.string().min(1, "Storage location is required"),
    deliveryNote: z.string().optional(),
    billOfLading: z.string().optional(),
    receivedBy: z.string().min(1, "Received by is required"),
    verifiedBy: z.string().optional(),
    purchaseOrder: z.string().optional(),
    deliveryNumber: z.string().optional(),
    movementType: z.string().min(1, "Movement type is required"),
    reasonCode: z.string().optional(),
    qualityInspectionRequired: z.boolean()
  }),
  lineItems: z.array(z.object({
    materialNumber: z.string().min(1, "Material number is required"),
    materialDescription: z.string().min(1, "Material description is required"),
    deliveredQuantity: z.number().positive("Delivered quantity must be positive"),
    receivedQuantity: z.number().positive("Received quantity must be positive"),
    rejectedQuantity: z.number().min(0, "Rejected quantity cannot be negative").optional(),
    unit: z.string().min(1, "Unit is required"),
    batch: z.string().optional(),
    purchaseOrderNumber: z.string().optional(),
    purchaseOrderItem: z.string().optional(),
    plant: z.string().min(1, "Plant is required"),
    storageLocation: z.string().min(1, "Storage location is required"),
    stockType: z.enum(['UNRESTRICTED', 'QUALITY_INSPECTION', 'BLOCKED', 'RESTRICTED']),
    movementType: z.string().min(1, "Movement type is required"),
    qualityInspectionRequired: z.boolean(),
    certificateNumber: z.string().optional(),
    vendorDeclaration: z.boolean(),
    itemNotes: z.string().optional()
  })).min(1, "At least one line item is required")
})

type GoodsReceiptFormData = z.infer<typeof goodsReceiptSchema>

interface GoodsReceiptManagementProps {
  goodsReceipts: GoodsReceipt[]
  purchaseOrders: PurchaseOrder[]
  plants: Array<{ id: string; name: string; location: string }>
  storageLocations: Array<{ id: string; name: string; plant: string }>
  onCreateGR: (data: GoodsReceiptFormData) => Promise<void>
  onReverseGR: (grNumber: string, reason: string) => Promise<void>
  onQualityDecision: (grNumber: string, decision: 'PASSED' | 'FAILED') => Promise<void>
  userPermissions: string[]
}

export function GoodsReceiptManagement({
  goodsReceipts,
  purchaseOrders,
  plants,
  storageLocations,
  onCreateGR,
  onReverseGR,
  onQualityDecision,
  userPermissions
}: GoodsReceiptManagementProps) {
  const [selectedPO, setSelectedPO] = useState<string>("")
  const [selectedGR, setSelectedGR] = useState<GoodsReceipt | null>(null)
  const [wizardStep, setWizardStep] = useState(0)
  const [scanMode, setScanMode] = useState<'barcode' | 'qr' | 'manual'>('manual')

  const grFormModal = useModal()
  const grDetailsModal = useModal()
  const reverseGRModal = useModal()
  const qualityDecisionModal = useModal()
  const grWizardModal = useModal()

  const form = useForm<GoodsReceiptFormData>({
    resolver: zodResolver(goodsReceiptSchema),
    defaultValues: {
      headerInfo: {
        postingDate: new Date(),
        documentDate: new Date(),
        plant: "",
        storageLocation: "",
        deliveryNote: "",
        billOfLading: "",
        receivedBy: "",
        verifiedBy: "",
        purchaseOrder: "",
        deliveryNumber: "",
        movementType: "101", // Standard GR for PO
        reasonCode: "",
        qualityInspectionRequired: false
      },
      lineItems: []
    }
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "lineItems"
  })

  // Sample movement types based on SAP standards
  const movementTypes = [
    { code: "101", description: "GR for Purchase Order" },
    { code: "102", description: "Reversal of 101" },
    { code: "103", description: "GR for Purchase Order into Quality Inspection" },
    { code: "104", description: "Reversal of 103" },
    { code: "105", description: "Release from Quality Inspection" },
    { code: "106", description: "Return to Quality Inspection" },
    { code: "107", description: "GR for Inbound Delivery" },
    { code: "108", description: "Reversal of 107" }
  ]

  // Calculate KPIs
  const grKPIs = React.useMemo(() => {
    const totalReceipts = goodsReceipts.length
    const todayReceipts = goodsReceipts.filter(gr => {
      try {
        if (!gr.headerInfo?.postingDate) return false
        const grDate = new Date(gr.headerInfo.postingDate)
        if (isNaN(grDate.getTime())) return false
        return format(grDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      } catch (error) {
        return false
      }
    }).length
    const qualityPending = goodsReceipts.filter(gr => gr.headerInfo.qualityStatus === 'PENDING').length
    const avgProcessingTime = 2.5 // Sample data - hours

    return {
      totalReceipts: { value: totalReceipts, change: 15.3 },
      todayReceipts: { value: todayReceipts, change: 8.7 },
      qualityPending: { value: qualityPending, change: -12.1 },
      avgProcessingTime: { value: avgProcessingTime, change: -18.5 }
    }
  }, [goodsReceipts])

  // Goods Receipt columns
  const grColumns = [
    createSortableColumn('materialDocumentNumber', 'Material Doc', ({ row }) => (
      <Button
        variant="link"
        className="h-auto p-0 font-semibold text-primary"
        onClick={() => {
          setSelectedGR(row)
          grDetailsModal.open()
        }}
      >
        {row.materialDocumentNumber}
      </Button>
    )),
    createSortableColumn('headerInfo.postingDate', 'Posting Date', ({ row }) => {
      if (!row.headerInfo?.postingDate) return 'N/A'
      try {
        const date = new Date(row.headerInfo.postingDate)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return format(date, 'dd/MM/yyyy')
      } catch (error) {
        return 'Invalid Date'
      }
    }),
    createSortableColumn('headerInfo.plant', 'Plant'),
    createSortableColumn('headerInfo.purchaseOrder', 'Purchase Order'),
    createSortableColumn('lineItems.length', 'Items', ({ row }) =>
      `${row.lineItems.length} items`
    ),
    createSortableColumn('headerInfo.receivedBy', 'Received By'),
    createSortableColumn('headerInfo.documentStatus', 'Status', ({ row }) => (
      <Badge variant={
        row.headerInfo.documentStatus === 'POSTED' ? 'default' :
        row.headerInfo.documentStatus === 'CANCELLED' ? 'destructive' : 'secondary'
      }>
        {row.headerInfo.documentStatus}
      </Badge>
    )),
    createSortableColumn('headerInfo.qualityStatus', 'Quality Status', ({ row }) => {
      if (!row.headerInfo.qualityInspectionRequired) {
        return <Badge variant="outline">N/A</Badge>
      }
      return (
        <Badge variant={
          row.headerInfo.qualityStatus === 'PASSED' ? 'default' :
          row.headerInfo.qualityStatus === 'FAILED' ? 'destructive' :
          row.headerInfo.qualityStatus === 'PENDING' ? 'secondary' : 'outline'
        }>
          {row.headerInfo.qualityStatus || 'PENDING'}
        </Badge>
      )
    }),
    createActionsColumn((row: GoodsReceipt) => (
      <>
        <DropdownMenuItem onClick={() => {
          setSelectedGR(row)
          grDetailsModal.open()
        }}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {userPermissions.includes('reverse_goods_receipt') && row.headerInfo.documentStatus === 'POSTED' && (
          <DropdownMenuItem onClick={() => {
            setSelectedGR(row)
            reverseGRModal.open()
          }}>
            <XCircle className="mr-2 h-4 w-4" />
            Reverse GR
          </DropdownMenuItem>
        )}
        {userPermissions.includes('quality_decision') && row.headerInfo.qualityInspectionRequired && row.headerInfo.qualityStatus === 'PENDING' && (
          <DropdownMenuItem onClick={() => {
            setSelectedGR(row)
            qualityDecisionModal.open()
          }}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Quality Decision
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <FileText className="mr-2 h-4 w-4" />
          Print Document
        </DropdownMenuItem>
      </>
    ))
  ]

  // Outstanding Purchase Order Items
  const outstandingPOItems = React.useMemo(() => {
    return purchaseOrders
      .filter(po => po.headerInfo.documentStatus === 'RELEASED')
      .flatMap(po =>
        po.lineItems
          .filter(item => item.deliveryStatus !== 'COMPLETE')
          .map(item => ({
            poNumber: po.headerInfo.poNumber,
            poItem: item.itemNumber,
            materialNumber: item.materialNumber,
            materialDescription: item.materialDescription,
            orderQuantity: item.orderQuantity,
            receivedQuantity: item.goodsReceiptItems?.reduce((sum, gr) => sum + gr.receivedQuantity, 0) || 0,
            openQuantity: item.orderQuantity - (item.goodsReceiptItems?.reduce((sum, gr) => sum + gr.receivedQuantity, 0) || 0),
            unit: item.orderUnit,
            deliveryDate: item.deliveryDate,
            plant: item.plant,
            vendor: po.headerInfo.vendorName,
            storageLocation: item.storageLocation || ""
          }))
      )
  }, [purchaseOrders])

  // Load PO items when PO is selected
  const loadPOItems = (poNumber: string) => {
    const po = purchaseOrders.find(p => p.headerInfo.poNumber === poNumber)
    if (po) {
      const items = po.lineItems.map(item => ({
        materialNumber: item.materialNumber || "",
        materialDescription: item.materialDescription,
        deliveredQuantity: item.orderQuantity,
        receivedQuantity: item.orderQuantity, // Default to full delivery
        rejectedQuantity: 0,
        unit: item.orderUnit,
        batch: "",
        purchaseOrderNumber: poNumber,
        purchaseOrderItem: item.itemNumber,
        plant: item.plant,
        storageLocation: item.storageLocation || "",
        stockType: 'UNRESTRICTED' as const,
        movementType: "101",
        qualityInspectionRequired: item.qualityInspectionRequired,
        certificateNumber: "",
        vendorDeclaration: false,
        itemNotes: ""
      }))
      replace(items)
    }
  }

  // Wizard steps for GR creation
  const grWizardSteps = [
    {
      title: 'Document Selection',
      description: 'Select purchase order and delivery information',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Purchase Order</label>
              <Select value={selectedPO} onValueChange={(value) => {
                setSelectedPO(value)
                form.setValue('headerInfo.purchaseOrder', value)
                loadPOItems(value)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders
                    .filter(po => po.headerInfo.documentStatus === 'RELEASED')
                    .map(po => (
                      <SelectItem key={po.headerInfo.poNumber} value={po.headerInfo.poNumber}>
                        {po.headerInfo.poNumber} - {po.headerInfo.vendorName}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Delivery Note</label>
              <Input
                placeholder="Vendor delivery note number"
                value={form.watch('headerInfo.deliveryNote') || ''}
                onChange={(e) => form.setValue('headerInfo.deliveryNote', e.target.value)}
              />
            </div>
          </div>

          {selectedPO && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Outstanding Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outstandingPOItems
                    .filter(item => item.poNumber === selectedPO)
                    .map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{item.materialDescription}</p>
                          <p className="text-xs text-muted-foreground">
                            Material: {item.materialNumber} | Open: {item.openQuantity} {item.unit}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {item.openQuantity} {item.unit}
                        </Badge>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
      isValid: selectedPO !== ""
    },
    {
      title: 'Scan & Verify',
      description: 'Scan items and verify quantities',
      content: (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              size="sm"
            >
              <Hash className="h-4 w-4 mr-2" />
              Manual
            </Button>
            <Button
              type="button"
              variant={scanMode === 'barcode' ? 'default' : 'outline'}
              onClick={() => setScanMode('barcode')}
              size="sm"
            >
              <Barcode className="h-4 w-4 mr-2" />
              Barcode
            </Button>
            <Button
              type="button"
              variant={scanMode === 'qr' ? 'default' : 'outline'}
              onClick={() => setScanMode('qr')}
              size="sm"
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>

          {scanMode === 'manual' && (
            <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
              <h4 className="font-semibold mb-3">Items to Receive</h4>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{field.materialDescription}</p>
                        <p className="text-xs text-muted-foreground">
                          Material: {field.materialNumber}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Delivered</label>
                        <Input
                          type="number"
                          value={field.deliveredQuantity}
                          onChange={(e) => form.setValue(`lineItems.${index}.deliveredQuantity`, Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Received</label>
                        <Input
                          type="number"
                          value={field.receivedQuantity}
                          onChange={(e) => form.setValue(`lineItems.${index}.receivedQuantity`, Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Rejected</label>
                        <Input
                          type="number"
                          value={field.rejectedQuantity || 0}
                          onChange={(e) => form.setValue(`lineItems.${index}.rejectedQuantity`, Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(scanMode === 'barcode' || scanMode === 'qr') && (
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
              <div className="space-y-4">
                {scanMode === 'barcode' ? (
                  <Barcode className="h-16 w-16 mx-auto text-primary" />
                ) : (
                  <QrCode className="h-16 w-16 mx-auto text-primary" />
                )}
                <div>
                  <h3 className="font-semibold">Scan {scanMode === 'barcode' ? 'Barcode' : 'QR Code'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Position the {scanMode} in the camera viewfinder
                  </p>
                </div>
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
      isValid: fields.length > 0
    },
    {
      title: 'Quality & Storage',
      description: 'Set quality inspection and storage details',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="headerInfo.plant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plants.map(plant => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.name} - {plant.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headerInfo.storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {storageLocations
                        .filter(loc => loc.plant === form.watch('headerInfo.plant'))
                        .map(location => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headerInfo.receivedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Received By</FormLabel>
                  <FormControl>
                    <Input placeholder="Person receiving the goods" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headerInfo.qualityInspectionRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Quality Inspection</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Require quality inspection for received items
                    </div>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">Stock Type Assignment</h4>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex justify-between items-center">
                  <span className="text-sm">{field.materialDescription}</span>
                  <Select
                    value={field.stockType}
                    onValueChange={(value) => form.setValue(`lineItems.${index}.stockType`, value as any)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNRESTRICTED">Unrestricted Use</SelectItem>
                      <SelectItem value="QUALITY_INSPECTION">Quality Inspection</SelectItem>
                      <SelectItem value="BLOCKED">Blocked Stock</SelectItem>
                      <SelectItem value="RESTRICTED">Restricted Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      isValid: Boolean(form.watch('headerInfo.plant') && form.watch('headerInfo.storageLocation') && form.watch('headerInfo.receivedBy'))
    }
  ]

  const handleCreateGR = async (data: GoodsReceiptFormData) => {
    try {
      await onCreateGR(data)
      grFormModal.close()
      grWizardModal.close()
      form.reset()
      setSelectedPO("")
      setWizardStep(0)
    } catch (error) {
      console.error('Error creating goods receipt:', error)
    }
  }

  const handleWizardComplete = () => {
    form.handleSubmit(handleCreateGR)()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Goods Receipt Management</h2>
          <p className="text-muted-foreground">
            SAP MIGO-inspired goods receipt processing and inventory posting
          </p>
        </div>
        <div className="flex gap-2">
          {userPermissions.includes('create_goods_receipt') && (
            <Button onClick={grWizardModal.open} className="gap-2">
              <Plus className="h-4 w-4" />
              Goods Receipt
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Truck className="h-4 w-4" />
            Delivery Monitor
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <KPICard
          title="Total Receipts"
          value={grKPIs.totalReceipts.value}
          change={grKPIs.totalReceipts.change}
          trend="up"
          icon={Package}
        />
        <KPICard
          title="Today's Receipts"
          value={grKPIs.todayReceipts.value}
          change={grKPIs.todayReceipts.change}
          trend="up"
          icon={Truck}
        />
        <KPICard
          title="Quality Pending"
          value={grKPIs.qualityPending.value}
          change={grKPIs.qualityPending.change}
          trend="down"
          icon={ClipboardCheck}
        />
        <KPICard
          title="Avg Processing Time"
          value={`${grKPIs.avgProcessingTime.value}h`}
          change={grKPIs.avgProcessingTime.change}
          trend="down"
          icon={Clock}
        />
      </ResponsiveGrid>

      {/* Outstanding Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Outstanding Purchase Order Items
          </CardTitle>
          <CardDescription>
            Items awaiting goods receipt from confirmed purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedDataTable
            columns={[
              createSortableColumn('poNumber', 'PO Number'),
              createSortableColumn('materialDescription', 'Material Description'),
              createSortableColumn('vendor', 'Vendor'),
              createSortableColumn('openQuantity', 'Open Qty', ({ row }) =>
                `${row.openQuantity} ${row.unit}`
              ),
              createSortableColumn('deliveryDate', 'Delivery Date', ({ row }) => {
                if (!row.deliveryDate) return 'N/A'
                try {
                  const date = new Date(row.deliveryDate)
                  if (isNaN(date.getTime())) return 'Invalid Date'
                  return format(date, 'dd/MM/yyyy')
                } catch (error) {
                  return 'Invalid Date'
                }
              }),
              createSortableColumn('plant', 'Plant'),
              createActionsColumn((row: any) => (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedPO(row.poNumber)
                    form.setValue('headerInfo.purchaseOrder', row.poNumber)
                    loadPOItems(row.poNumber)
                    grWizardModal.open()
                  }}
                >
                  Create GR
                </Button>
              ))
            ]}
            data={outstandingPOItems}
            title="Outstanding Items"
            searchPlaceholder="Search materials, vendors..."
          />
        </CardContent>
      </Card>

      {/* Goods Receipts Table */}
      <AdvancedDataTable
        columns={grColumns}
        data={goodsReceipts}
        title="Goods Receipt Documents"
        description={`${goodsReceipts.length} goods receipt documents`}
        searchPlaceholder="Search material documents..."
        enableExport
        exportFilename="goods-receipts.csv"
        onRowClick={(row) => {
          setSelectedGR(row)
          grDetailsModal.open()
        }}
      />

      {/* GR Wizard Modal */}
      <WizardModal
        open={grWizardModal.isOpen}
        onOpenChange={grWizardModal.setIsOpen}
        title="Create Goods Receipt"
        steps={grWizardSteps}
        currentStep={wizardStep}
        onStepChange={setWizardStep}
        onComplete={handleWizardComplete}
        size="xl"
      />

      {/* GR Details Modal */}
      {selectedGR && (
        <InfoModal
          open={grDetailsModal.isOpen}
          onOpenChange={grDetailsModal.setIsOpen}
          title={`Material Document ${selectedGR.materialDocumentNumber}`}
          description={`Posted on ${(() => {
            try {
              if (!selectedGR.headerInfo.postingDate) return 'N/A'
              const date = new Date(selectedGR.headerInfo.postingDate)
              if (isNaN(date.getTime())) return 'Invalid Date'
              return format(date, 'dd/MM/yyyy')
            } catch (error) {
              return 'Invalid Date'
            }
          })()}`}
          size="xl"
          data={selectedGR}
          fields={[
            { key: 'materialDocumentNumber', label: 'Material Document', type: 'text' },
            { key: 'headerInfo.postingDate', label: 'Posting Date', type: 'date' },
            { key: 'headerInfo.plant', label: 'Plant', type: 'text' },
            { key: 'headerInfo.purchaseOrder', label: 'Purchase Order', type: 'text' },
            { key: 'headerInfo.deliveryNote', label: 'Delivery Note', type: 'text' },
            { key: 'headerInfo.receivedBy', label: 'Received By', type: 'text' },
            { key: 'headerInfo.documentStatus', label: 'Status', type: 'badge' },
            { key: 'headerInfo.qualityStatus', label: 'Quality Status', type: 'badge' }
          ]}
        >
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Line Items ({selectedGR.lineItems.length})</h4>
            <div className="space-y-3">
              {selectedGR.lineItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{item.materialDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        Material: {item.materialNumber}
                        {item.batch && ` | Batch: ${item.batch}`}
                      </p>
                    </div>
                    <Badge variant={item.stockType === 'UNRESTRICTED' ? 'default' : 'secondary'}>
                      {item.stockType.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Received:</span>
                      <div className="font-medium">{item.receivedQuantity} {item.unit}</div>
                    </div>
                    {item.rejectedQuantity && item.rejectedQuantity > 0 && (
                      <div>
                        <span className="text-muted-foreground">Rejected:</span>
                        <div className="font-medium text-red-600">{item.rejectedQuantity} {item.unit}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Storage:</span>
                      <div className="font-medium">{item.storageLocation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InfoModal>
      )}

      {/* Reverse GR Modal */}
      <ConfirmationModal
        open={reverseGRModal.isOpen}
        onOpenChange={reverseGRModal.setIsOpen}
        title="Reverse Goods Receipt"
        description={`Are you sure you want to reverse goods receipt ${selectedGR?.materialDocumentNumber}? This will create a reversal document and adjust inventory.`}
        confirmText="Reverse GR"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedGR) {
            onReverseGR(selectedGR.materialDocumentNumber, "User requested reversal")
            reverseGRModal.close()
          }
        }}
        variant="destructive"
      />

      {/* Quality Decision Modal */}
      <FormModal
        open={qualityDecisionModal.isOpen}
        onOpenChange={qualityDecisionModal.setIsOpen}
        title="Quality Decision"
        description={`Make quality decision for goods receipt ${selectedGR?.materialDocumentNumber}`}
        size="md"
        showFooter={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review the quality inspection results and make a decision on the received materials.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (selectedGR) {
                  onQualityDecision(selectedGR.materialDocumentNumber, 'PASSED')
                  qualityDecisionModal.close()
                }
              }}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept (Release to Stock)
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedGR) {
                  onQualityDecision(selectedGR.materialDocumentNumber, 'FAILED')
                  qualityDecisionModal.close()
                }
              }}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject (Block Stock)
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  )
}

export default GoodsReceiptManagement