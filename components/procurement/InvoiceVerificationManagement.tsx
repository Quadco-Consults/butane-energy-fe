'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Search, Plus, Eye, Edit, Trash2, FileText, CheckCircle,
  XCircle, AlertTriangle, Clock, DollarSign, Package,
  Calculator, Printer, Send, Download, Upload, Scan,
  ArrowRight, ArrowLeft, RotateCcw, Zap, Target,
  TrendingUp, TrendingDown, BarChart3, PieChart,
  Filter, SortAsc, Calendar, User, Building,
  Mail, Phone, MapPin, CreditCard, Banknote
} from 'lucide-react'
import { InvoiceVerification, ThreeWayMatching, PurchaseOrder, GoodsReceipt } from '@/lib/sap-procurement-types'

interface InvoiceVerificationManagementProps {
  invoices?: InvoiceVerification[]
  purchaseOrders?: PurchaseOrder[]
  goodsReceipts?: GoodsReceipt[]
  vendors?: Array<{
    id: string
    name: string
    vendorCode: string
  }>
  onCreateInvoice?: (invoice: Partial<InvoiceVerification>) => void
  onUpdateInvoice?: (id: string, invoice: Partial<InvoiceVerification>) => void
  onPostInvoice?: (id: string) => void
  onBlockInvoice?: (id: string, reason: string) => void
  userPermissions?: {
    canCreate: boolean
    canEdit: boolean
    canPost: boolean
    canBlock: boolean
    canApprove: boolean
  }
}

export default function InvoiceVerificationManagement({
  invoices = [],
  purchaseOrders = [],
  goodsReceipts = [],
  vendors = [],
  onCreateInvoice = () => {},
  onUpdateInvoice = () => {},
  onPostInvoice = () => {},
  onBlockInvoice = () => {},
  userPermissions = {
    canCreate: true,
    canEdit: true,
    canPost: true,
    canBlock: true,
    canApprove: true
  }
}: InvoiceVerificationManagementProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showMatchingSheet, setShowMatchingSheet] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Mock data for demonstration
  const mockInvoices: InvoiceVerification[] = [
    {
      id: 'IV001',
      invoiceNumber: 'INV-2024-001',
      vendorInvoiceNumber: 'VEND-001-2024',
      invoiceDate: '2024-01-15',
      postingDate: '2024-01-16',
      vendor: {
        id: 'V001',
        name: 'Acme Engineering Solutions',
        vendorCode: 'V000001'
      },
      companyCode: '1000',
      currency: 'USD',
      grossAmount: 12500.00,
      taxAmount: 1250.00,
      netAmount: 11250.00,
      paymentTerms: 'NET30',
      baselineDate: '2024-01-16',
      dueDateForPayment: '2024-02-15',
      cashDiscountDate1: '2024-01-26',
      cashDiscountPercent1: 2.0,
      cashDiscountAmount1: 225.00,
      status: 'MATCHED',
      matchingStatus: 'MATCHED',
      workflowStatus: 'RELEASED',
      toleranceExceeded: false,
      requiresApproval: false,
      lineItems: [
        {
          id: 'IVLI001',
          lineNumber: 10,
          purchaseOrderNumber: 'PO-2024-001',
          purchaseOrderItem: 10,
          goodsReceiptNumber: 'GR-2024-001',
          goodsReceiptItem: 10,
          materialNumber: 'MAT001',
          description: 'Steel Pipes DN100',
          quantity: 100,
          unitOfMeasure: 'M',
          unitPrice: 125.00,
          netAmount: 11250.00,
          taxCode: 'S1',
          taxAmount: 1125.00,
          totalAmount: 12375.00
        }
      ],
      threeWayMatching: {
        id: 'TWM001',
        invoiceId: 'IV001',
        purchaseOrderNumber: 'PO-2024-001',
        goodsReceiptNumber: 'GR-2024-001',
        overallMatchingStatus: 'MATCHED',
        toleranceExceeded: false,
        requiresApproval: false,
        quantityVariance: 0,
        priceVariance: 0,
        totalVariance: 0,
        matchingDate: '2024-01-16',
        matchedBy: 'user001',
        matchingDetails: [
          {
            lineNumber: 10,
            purchaseOrderQuantity: 100,
            goodsReceiptQuantity: 100,
            invoiceQuantity: 100,
            purchaseOrderPrice: 125.00,
            invoicePrice: 125.00,
            quantityVariance: 0,
            priceVariance: 0,
            totalVariance: 0,
            matchingStatus: 'MATCHED',
            toleranceExceeded: false
          }
        ]
      },
      paymentHistory: [],
      attachments: [
        {
          id: 'ATT001',
          fileName: 'vendor_invoice.pdf',
          fileType: 'PDF',
          fileSize: 245760,
          uploadDate: '2024-01-15'
        }
      ],
      notes: 'Standard invoice processing - no issues',
      createdBy: 'user001',
      createdAt: '2024-01-15T10:30:00Z',
      lastModifiedBy: 'user001',
      lastModifiedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: 'IV002',
      invoiceNumber: 'INV-2024-002',
      vendorInvoiceNumber: 'TECH-456-2024',
      invoiceDate: '2024-01-18',
      postingDate: '2024-01-19',
      vendor: {
        id: 'V002',
        name: 'TechFlow Industries',
        vendorCode: 'V000002'
      },
      companyCode: '1000',
      currency: 'USD',
      grossAmount: 8750.00,
      taxAmount: 875.00,
      netAmount: 7875.00,
      paymentTerms: 'NET15',
      baselineDate: '2024-01-19',
      dueDateForPayment: '2024-02-03',
      status: 'VARIANCE_EXCEEDS_TOLERANCE',
      matchingStatus: 'VARIANCE_EXCEEDS_TOLERANCE',
      workflowStatus: 'PENDING_APPROVAL',
      toleranceExceeded: true,
      requiresApproval: true,
      lineItems: [
        {
          id: 'IVLI002',
          lineNumber: 10,
          purchaseOrderNumber: 'PO-2024-002',
          purchaseOrderItem: 10,
          goodsReceiptNumber: 'GR-2024-002',
          goodsReceiptItem: 10,
          materialNumber: 'MAT002',
          description: 'Industrial Valves',
          quantity: 25,
          unitOfMeasure: 'PC',
          unitPrice: 350.00,
          netAmount: 7875.00,
          taxCode: 'S1',
          taxAmount: 787.50,
          totalAmount: 8662.50
        }
      ],
      threeWayMatching: {
        id: 'TWM002',
        invoiceId: 'IV002',
        purchaseOrderNumber: 'PO-2024-002',
        goodsReceiptNumber: 'GR-2024-002',
        overallMatchingStatus: 'VARIANCE_EXCEEDS_TOLERANCE',
        toleranceExceeded: true,
        requiresApproval: true,
        quantityVariance: 0,
        priceVariance: 875.00,
        totalVariance: 875.00,
        matchingDate: '2024-01-19',
        matchedBy: 'user001',
        matchingDetails: [
          {
            lineNumber: 10,
            purchaseOrderQuantity: 25,
            goodsReceiptQuantity: 25,
            invoiceQuantity: 25,
            purchaseOrderPrice: 315.00,
            invoicePrice: 350.00,
            quantityVariance: 0,
            priceVariance: 35.00,
            totalVariance: 875.00,
            matchingStatus: 'VARIANCE_EXCEEDS_TOLERANCE',
            toleranceExceeded: true
          }
        ]
      },
      paymentHistory: [],
      attachments: [],
      notes: 'Price variance exceeds tolerance - requires approval',
      createdBy: 'user002',
      createdAt: '2024-01-18T09:15:00Z',
      lastModifiedBy: 'user002',
      lastModifiedAt: '2024-01-19T11:45:00Z'
    }
  ]

  const allInvoices = invoices.length > 0 ? invoices : mockInvoices

  // Filter invoices based on search and status
  const filteredInvoices = useMemo(() => {
    return allInvoices.filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.vendorInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [allInvoices, searchTerm, statusFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = allInvoices.length
    const matched = allInvoices.filter(inv => inv.matchingStatus === 'MATCHED').length
    const variances = allInvoices.filter(inv => inv.toleranceExceeded).length
    const pending = allInvoices.filter(inv => inv.workflowStatus === 'PENDING_APPROVAL').length
    const totalValue = allInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0)

    return {
      totalInvoices: { value: total, change: 8.5 },
      matchedInvoices: { value: matched, change: 12.3 },
      varianceExceptions: { value: variances, change: -15.2 },
      pendingApproval: { value: pending, change: 5.7 },
      totalValue: { value: totalValue, change: 18.4 },
      averageValue: { value: total > 0 ? totalValue / total : 0, change: 3.1 }
    }
  }, [allInvoices])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MATCHED': return 'bg-green-100 text-green-800 border-green-300'
      case 'VARIANCE_WITHIN_TOLERANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'VARIANCE_EXCEEDS_TOLERANCE': return 'bg-red-100 text-red-800 border-red-300'
      case 'PENDING': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'BLOCKED': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'POSTED': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'RELEASED': return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING_APPROVAL': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-300'
      case 'POSTED': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const InvoiceCreationWizard = () => {
    const [formData, setFormData] = useState({
      vendorInvoiceNumber: '',
      invoiceDate: '',
      vendor: '',
      currency: 'USD',
      grossAmount: '',
      taxAmount: '',
      paymentTerms: 'NET30',
      referenceDocument: '',
      description: ''
    })

    const steps = [
      { id: 1, title: 'Basic Information', icon: FileText },
      { id: 2, title: 'Reference Documents', icon: Package },
      { id: 3, title: 'Line Items', icon: Calculator },
      { id: 4, title: 'Review & Submit', icon: CheckCircle }
    ]

    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-2 hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Invoice Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorInvoiceNumber">Vendor Invoice Number *</Label>
                <Input
                  id="vendorInvoiceNumber"
                  value={formData.vendorInvoiceNumber}
                  onChange={(e) => setFormData({...formData, vendorInvoiceNumber: e.target.value})}
                  placeholder="Enter vendor invoice number"
                />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <Select value={formData.vendor} onValueChange={(value) => setFormData({...formData, vendor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.vendorCode} - {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grossAmount">Gross Amount *</Label>
                <Input
                  id="grossAmount"
                  type="number"
                  step="0.01"
                  value={formData.grossAmount}
                  onChange={(e) => setFormData({...formData, grossAmount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({...formData, paymentTerms: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NET30">NET 30</SelectItem>
                    <SelectItem value="NET15">NET 15</SelectItem>
                    <SelectItem value="NET45">NET 45</SelectItem>
                    <SelectItem value="NET60">NET 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Reference Documents</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="referenceDocument">Purchase Order / Goods Receipt</Label>
                <Select value={formData.referenceDocument} onValueChange={(value) => setFormData({...formData, referenceDocument: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reference document" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseOrders.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        PO: {po.purchaseOrderNumber} - {po.vendor?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    Document Scanning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    You can upload and scan invoice documents. The system will automatically extract key information.
                  </CardDescription>
                </CardContent>
              </Card>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice Document
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Automatic Matching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Line items will be automatically matched against purchase orders and goods receipts when you proceed.
                </CardDescription>
              </CardContent>
            </Card>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview Line Items</h4>
              <div className="text-sm text-gray-600">
                Line items will be populated based on the selected reference documents.
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Vendor Invoice Number:</strong>
                    <div>{formData.vendorInvoiceNumber}</div>
                  </div>
                  <div>
                    <strong>Invoice Date:</strong>
                    <div>{formData.invoiceDate}</div>
                  </div>
                  <div>
                    <strong>Vendor:</strong>
                    <div>{vendors.find(v => v.id === formData.vendor)?.name}</div>
                  </div>
                  <div>
                    <strong>Gross Amount:</strong>
                    <div>{formData.currency} {formData.grossAmount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => {
              onCreateInvoice(formData)
              setShowCreateDialog(false)
              setCurrentStep(1)
            }}>
              Create Invoice
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const ThreeWayMatchingSheet = () => {
    const selectedInvoiceData = allInvoices.find(inv => inv.id === selectedInvoice)
    if (!selectedInvoiceData?.threeWayMatching) return null

    const matching = selectedInvoiceData.threeWayMatching

    return (
      <div className="space-y-6">
        {/* Matching Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Three-Way Matching Analysis</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Purchase Order</div>
                    <div className="text-lg font-bold">{matching.purchaseOrderNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">Goods Receipt</div>
                    <div className="text-lg font-bold">{matching.goodsReceiptNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">Invoice</div>
                    <div className="text-lg font-bold">{selectedInvoiceData.invoiceNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Matching Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Matching Status</span>
              <Badge className={getStatusColor(matching.overallMatchingStatus)}>
                {matching.overallMatchingStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  ${Math.abs(matching.quantityVariance).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Quantity Variance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  ${Math.abs(matching.priceVariance).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Price Variance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  ${Math.abs(matching.totalVariance).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Variance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Item Matching Details */}
        <Card>
          <CardHeader>
            <CardTitle>Line Item Matching Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  <TableHead>PO Qty</TableHead>
                  <TableHead>GR Qty</TableHead>
                  <TableHead>Inv Qty</TableHead>
                  <TableHead>PO Price</TableHead>
                  <TableHead>Inv Price</TableHead>
                  <TableHead>Qty Var</TableHead>
                  <TableHead>Price Var</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matching.matchingDetails?.map((detail) => (
                  <TableRow key={detail.lineNumber}>
                    <TableCell>{detail.lineNumber}</TableCell>
                    <TableCell>{detail.purchaseOrderQuantity}</TableCell>
                    <TableCell>{detail.goodsReceiptQuantity}</TableCell>
                    <TableCell>{detail.invoiceQuantity}</TableCell>
                    <TableCell>${detail.purchaseOrderPrice.toFixed(2)}</TableCell>
                    <TableCell>${detail.invoicePrice.toFixed(2)}</TableCell>
                    <TableCell className={detail.quantityVariance !== 0 ? 'text-red-600 font-semibold' : ''}>
                      {detail.quantityVariance}
                    </TableCell>
                    <TableCell className={detail.priceVariance !== 0 ? 'text-red-600 font-semibold' : ''}>
                      ${detail.priceVariance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(detail.matchingStatus)}>
                        {detail.matchingStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Approval Actions */}
        {matching.requiresApproval && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Approval Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Tolerance Exceeded
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      This invoice has variances that exceed the configured tolerance limits and requires management approval.
                    </CardDescription>
                  </CardContent>
                </Card>

                <div className="flex space-x-2">
                  <Button className="flex-1" disabled={!userPermissions.canApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="outline" className="flex-1" disabled={!userPermissions.canBlock}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Verification</h1>
          <p className="text-gray-600">SAP MIRO - Complete invoice verification and three-way matching</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowMatchingSheet(true)}>
            <Target className="w-4 h-4 mr-2" />
            Matching Analysis
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={!userPermissions.canCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice Verification</DialogTitle>
                <DialogDescription>
                  Enter invoice details and match against purchase orders and goods receipts
                </DialogDescription>
              </DialogHeader>
              <InvoiceCreationWizard />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoice List</TabsTrigger>
          <TabsTrigger value="matching">Matching</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-2xl font-bold">{kpis.totalInvoices.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.totalInvoices.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.totalInvoices.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.totalInvoices.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Matched Invoices</p>
                      <p className="text-2xl font-bold text-green-600">{kpis.matchedInvoices.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.matchedInvoices.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.matchedInvoices.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.matchedInvoices.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Variance Exceptions</p>
                      <p className="text-2xl font-bold text-red-600">{kpis.varianceExceptions.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.varianceExceptions.change >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {kpis.varianceExceptions.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.varianceExceptions.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                      <p className="text-2xl font-bold text-orange-600">{kpis.pendingApproval.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.pendingApproval.change >= 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {kpis.pendingApproval.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.pendingApproval.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold">${kpis.totalValue.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.totalValue.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.totalValue.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.totalValue.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Value</p>
                      <p className="text-2xl font-bold">${kpis.averageValue.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.averageValue.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.averageValue.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.averageValue.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoice Verifications</CardTitle>
                <CardDescription>Latest invoice processing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allInvoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-600">{invoice.vendor.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${invoice.grossAmount.toLocaleString()}</div>
                        <Badge className={getStatusColor(invoice.matchingStatus)}>
                          {invoice.matchingStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoice List Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Invoice Verification List</CardTitle>
                  <CardDescription>Manage and track all invoice verification documents</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="MATCHED">Matched</SelectItem>
                      <SelectItem value="VARIANCE_WITHIN_TOLERANCE">Within Tolerance</SelectItem>
                      <SelectItem value="VARIANCE_EXCEEDS_TOLERANCE">Exceeds Tolerance</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Matching Status</TableHead>
                      <TableHead>Workflow Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-600">{invoice.vendorInvoiceNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.vendor.name}</div>
                            <div className="text-sm text-gray-600">{invoice.vendor.vendorCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.invoiceDate}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">${invoice.grossAmount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">{invoice.currency}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.matchingStatus)}>
                            {invoice.matchingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getWorkflowStatusColor(invoice.workflowStatus)}>
                            {invoice.workflowStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.dueDateForPayment}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInvoice(invoice.id)
                                setShowMatchingSheet(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!userPermissions.canEdit}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {invoice.status === 'MATCHED' && (
                              <Button
                                size="sm"
                                onClick={() => onPostInvoice(invoice.id)}
                                disabled={!userPermissions.canPost}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matching Tab */}
        <TabsContent value="matching">
          <div className="grid gap-6">
            {/* Three-Way Matching Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Three-Way Matching Overview
                </CardTitle>
                <CardDescription>
                  Automated matching between Purchase Orders, Goods Receipts, and Invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Purchase Order</h3>
                    <p className="text-sm text-gray-600">Original procurement commitment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Goods Receipt</h3>
                    <p className="text-sm text-gray-600">Physical delivery confirmation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Invoice</h3>
                    <p className="text-sm text-gray-600">Vendor payment request</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matching Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Matching Rules & Tolerances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Quantity Tolerances</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Under-delivery:</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Over-delivery:</span>
                        <span className="text-sm font-medium">2%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Price Tolerances</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Price increase:</span>
                        <span className="text-sm font-medium">3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total variance:</span>
                        <span className="text-sm font-medium">$500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exception Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Exception Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allInvoices.filter(inv => inv.toleranceExceeded).map((invoice) => (
                    <div key={invoice.id} className="border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-800">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-red-600">{invoice.vendor.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-red-800">
                            ${invoice.threeWayMatching?.totalVariance.toFixed(2)} variance
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            Requires Approval
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {allInvoices.filter(inv => inv.toleranceExceeded).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <div>No tolerance exceptions at this time</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Invoice Processing Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">2.5</div>
                    <div className="text-sm text-gray-600">Avg. Days to Process</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Auto-Match Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">6%</div>
                    <div className="text-sm text-gray-600">Exception Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">$2.4M</div>
                    <div className="text-sm text-gray-600">Monthly Volume</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Invoice Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.slice(0, 5).map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-gray-600">{vendor.vendorCode}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Progress value={95 - index * 5} className="w-20" />
                          <span className="text-sm font-medium">{95 - index * 5}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Match rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Processing Costs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Manual processing:</span>
                        <span className="text-sm font-medium">$15.50/invoice</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Automated matching:</span>
                        <span className="text-sm font-medium">$2.30/invoice</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Monthly savings:</span>
                        <span className="text-sm text-green-600">$18,500</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Error Prevention</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Duplicate payments prevented:</span>
                        <span className="text-sm font-medium">$45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Price variance corrections:</span>
                        <span className="text-sm font-medium">$12,300</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Total cost avoidance:</span>
                        <span className="text-sm text-green-600">$57,300</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Three-Way Matching Sheet */}
      <Sheet open={showMatchingSheet} onOpenChange={setShowMatchingSheet}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Three-Way Matching Analysis</SheetTitle>
            <SheetDescription>
              Detailed matching analysis for invoice verification
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ThreeWayMatchingSheet />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}