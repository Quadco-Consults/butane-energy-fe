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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search, Plus, Eye, Edit, Trash2, FileText, CheckCircle,
  XCircle, AlertTriangle, Clock, DollarSign, Package,
  Calculator, Printer, Send, Download, Upload, Scan,
  ArrowRight, ArrowLeft, RotateCcw, Zap, Target,
  TrendingUp, TrendingDown, BarChart3, PieChart,
  Filter, SortAsc, Calendar as CalendarIcon, User, Building,
  Mail, Phone, MapPin, CreditCard, Banknote, Handshake,
  FileSignature, Scale, ShieldCheck, AlertCircle,
  Percent, Calendar as CalIcon, Users, Settings
} from 'lucide-react'
import { Contract, SchedulingAgreement, PurchasingInfoRecord } from '@/lib/sap-procurement-types'
import { format } from 'date-fns'

interface ContractManagementProps {
  contracts?: Contract[]
  schedulingAgreements?: SchedulingAgreement[]
  infoRecords?: PurchasingInfoRecord[]
  vendors?: Array<{
    id: string
    name: string
    vendorCode: string
  }>
  materials?: Array<{
    id: string
    materialNumber: string
    description: string
  }>
  onCreateContract?: (contract: Partial<Contract>) => void
  onUpdateContract?: (id: string, contract: Partial<Contract>) => void
  onReleaseContract?: (id: string) => void
  onTerminateContract?: (id: string, reason: string) => void
  userPermissions?: {
    canCreate: boolean
    canEdit: boolean
    canRelease: boolean
    canTerminate: boolean
    canApprove: boolean
    canViewAnalytics: boolean
  }
}

export default function ContractManagement({
  contracts = [],
  schedulingAgreements = [],
  infoRecords = [],
  vendors = [],
  materials = [],
  onCreateContract = () => {},
  onUpdateContract = () => {},
  onReleaseContract = () => {},
  onTerminateContract = () => {},
  userPermissions = {
    canCreate: true,
    canEdit: true,
    canRelease: true,
    canTerminate: true,
    canApprove: true,
    canViewAnalytics: true
  }
}: ContractManagementProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedContract, setSelectedContract] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailsSheet, setShowDetailsSheet] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Mock data for demonstration
  const mockContracts: Contract[] = [
    {
      id: 'CTR001',
      contractNumber: 'CTR-2024-001',
      contractType: 'BLANKET_ORDER',
      vendor: {
        id: 'V001',
        name: 'Acme Engineering Solutions',
        vendorCode: 'V000001'
      },
      companyCode: '1000',
      purchasingOrganization: 'PO01',
      purchasingGroup: 'PG01',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      status: 'RELEASED',
      description: 'Annual maintenance and repair services',
      totalValue: 250000.00,
      usedValue: 125000.00,
      remainingValue: 125000.00,
      currency: 'USD',
      paymentTerms: 'NET30',
      termsAndConditions: 'Standard T&Cs for maintenance services',
      lineItems: [
        {
          id: 'CTRLI001',
          lineNumber: 10,
          materialNumber: 'SRV001',
          description: 'Maintenance Services',
          quantity: 100,
          unitOfMeasure: 'HR',
          unitPrice: 150.00,
          netAmount: 15000.00,
          targetQuantity: 1000,
          usedQuantity: 600,
          remainingQuantity: 400
        }
      ],
      releaseOrders: [
        {
          id: 'RO001',
          releaseOrderNumber: 'RO-2024-001',
          releaseDate: '2024-01-15',
          quantity: 50,
          amount: 7500.00,
          status: 'COMPLETED'
        }
      ],
      approvalHistory: [
        {
          step: 1,
          approver: 'John Smith',
          status: 'APPROVED',
          comments: 'Contract terms reviewed and approved',
          date: '2024-01-05'
        }
      ],
      attachments: [
        {
          id: 'ATT001',
          fileName: 'contract_agreement.pdf',
          fileType: 'PDF',
          fileSize: 1245760,
          uploadDate: '2024-01-01'
        }
      ],
      milestones: [
        {
          id: 'M001',
          description: 'Q1 Review',
          dueDate: '2024-03-31',
          status: 'COMPLETED'
        },
        {
          id: 'M002',
          description: 'Mid-year Review',
          dueDate: '2024-06-30',
          status: 'PENDING'
        }
      ],
      createdBy: 'user001',
      createdAt: '2024-01-01T08:00:00Z',
      lastModifiedBy: 'user001',
      lastModifiedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'CTR002',
      contractNumber: 'CTR-2024-002',
      contractType: 'OUTLINE_AGREEMENT',
      vendor: {
        id: 'V002',
        name: 'TechFlow Industries',
        vendorCode: 'V000002'
      },
      companyCode: '1000',
      purchasingOrganization: 'PO01',
      purchasingGroup: 'PG02',
      validFrom: '2024-02-01',
      validTo: '2025-01-31',
      status: 'PENDING_APPROVAL',
      description: 'Raw materials supply agreement',
      totalValue: 500000.00,
      usedValue: 0.00,
      remainingValue: 500000.00,
      currency: 'USD',
      paymentTerms: 'NET45',
      termsAndConditions: 'Standard T&Cs for raw materials',
      lineItems: [
        {
          id: 'CTRLI002',
          lineNumber: 10,
          materialNumber: 'MAT001',
          description: 'Steel Pipes DN100',
          quantity: 1000,
          unitOfMeasure: 'M',
          unitPrice: 125.00,
          netAmount: 125000.00,
          targetQuantity: 4000,
          usedQuantity: 0,
          remainingQuantity: 4000
        }
      ],
      releaseOrders: [],
      approvalHistory: [],
      attachments: [],
      milestones: [
        {
          id: 'M003',
          description: 'Contract Signing',
          dueDate: '2024-02-15',
          status: 'PENDING'
        }
      ],
      createdBy: 'user002',
      createdAt: '2024-02-01T10:00:00Z',
      lastModifiedBy: 'user002',
      lastModifiedAt: '2024-02-01T10:00:00Z'
    }
  ]

  const mockSchedulingAgreements: SchedulingAgreement[] = [
    {
      id: 'SA001',
      agreementNumber: 'SA-2024-001',
      vendor: {
        id: 'V001',
        name: 'Acme Engineering Solutions',
        vendorCode: 'V000001'
      },
      materialNumber: 'MAT002',
      description: 'Monthly steel delivery schedule',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      targetQuantity: 12000,
      deliveredQuantity: 4000,
      remainingQuantity: 8000,
      unitOfMeasure: 'MT',
      unitPrice: 850.00,
      currency: 'USD',
      deliverySchedule: [
        {
          deliveryDate: '2024-01-31',
          plannedQuantity: 1000,
          confirmedQuantity: 1000,
          actualQuantity: 1000,
          status: 'DELIVERED'
        },
        {
          deliveryDate: '2024-02-29',
          plannedQuantity: 1000,
          confirmedQuantity: 1000,
          actualQuantity: 1000,
          status: 'DELIVERED'
        },
        {
          deliveryDate: '2024-03-31',
          plannedQuantity: 1000,
          confirmedQuantity: 1000,
          actualQuantity: 1000,
          status: 'DELIVERED'
        },
        {
          deliveryDate: '2024-04-30',
          plannedQuantity: 1000,
          confirmedQuantity: 1000,
          actualQuantity: 1000,
          status: 'DELIVERED'
        },
        {
          deliveryDate: '2024-05-31',
          plannedQuantity: 1000,
          confirmedQuantity: 950,
          actualQuantity: 0,
          status: 'PENDING'
        }
      ],
      status: 'ACTIVE',
      paymentTerms: 'NET30',
      createdBy: 'user001',
      createdAt: '2024-01-01T09:00:00Z'
    }
  ]

  const allContracts = contracts.length > 0 ? contracts : mockContracts
  const allSchedulingAgreements = schedulingAgreements.length > 0 ? schedulingAgreements : mockSchedulingAgreements

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return allContracts.filter(contract => {
      const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
      const matchesType = contractTypeFilter === 'all' || contract.contractType === contractTypeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [allContracts, searchTerm, statusFilter, contractTypeFilter])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalContracts = allContracts.length
    const activeContracts = allContracts.filter(c => c.status === 'RELEASED' || c.status === 'ACTIVE').length
    const pendingContracts = allContracts.filter(c => c.status === 'PENDING_APPROVAL').length
    const totalValue = allContracts.reduce((sum, c) => sum + c.totalValue, 0)
    const usedValue = allContracts.reduce((sum, c) => sum + c.usedValue, 0)
    const utilization = totalValue > 0 ? (usedValue / totalValue) * 100 : 0

    return {
      totalContracts: { value: totalContracts, change: 8.3 },
      activeContracts: { value: activeContracts, change: 12.1 },
      pendingContracts: { value: pendingContracts, change: -5.2 },
      totalValue: { value: totalValue, change: 15.7 },
      usedValue: { value: usedValue, change: 22.4 },
      utilization: { value: utilization, change: 3.1 }
    }
  }, [allContracts])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RELEASED':
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'DRAFT': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-300'
      case 'TERMINATED': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'BLANKET_ORDER': return Handshake
      case 'OUTLINE_AGREEMENT': return FileSignature
      case 'FRAMEWORK_CONTRACT': return Scale
      case 'SCHEDULING_AGREEMENT': return CalendarIcon
      default: return FileText
    }
  }

  const ContractCreationWizard = () => {
    const [formData, setFormData] = useState({
      contractType: 'BLANKET_ORDER',
      vendor: '',
      description: '',
      validFrom: '',
      validTo: '',
      totalValue: '',
      currency: 'USD',
      paymentTerms: 'NET30',
      purchasingGroup: '',
      termsAndConditions: ''
    })

    const steps = [
      { id: 1, title: 'Contract Type', icon: FileText },
      { id: 2, title: 'Basic Information', icon: Building },
      { id: 3, title: 'Terms & Conditions', icon: Scale },
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
            <h3 className="text-lg font-semibold mb-4">Select Contract Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'BLANKET_ORDER', label: 'Blanket Purchase Order', desc: 'Fixed value with call-off releases' },
                { value: 'OUTLINE_AGREEMENT', label: 'Outline Agreement', desc: 'Framework for future purchases' },
                { value: 'FRAMEWORK_CONTRACT', label: 'Framework Contract', desc: 'Long-term supply agreement' },
                { value: 'SCHEDULING_AGREEMENT', label: 'Scheduling Agreement', desc: 'Delivery schedule based' }
              ].map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer border-2 transition-all ${
                    formData.contractType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, contractType: type.value})}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {React.createElement(getContractTypeIcon(type.value), { className: "w-5 h-5 text-blue-600" })}
                      </div>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.desc}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Contract Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="purchasingGroup">Purchasing Group</Label>
                <Select value={formData.purchasingGroup} onValueChange={(value) => setFormData({...formData, purchasingGroup: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG01">PG01 - General Procurement</SelectItem>
                    <SelectItem value="PG02">PG02 - Materials Procurement</SelectItem>
                    <SelectItem value="PG03">PG03 - Services Procurement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Contract Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter contract description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="validTo">Valid To *</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="totalValue">Total Contract Value *</Label>
                <Input
                  id="totalValue"
                  type="number"
                  step="0.01"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                  placeholder="0.00"
                />
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
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({...formData, paymentTerms: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NET15">NET 15</SelectItem>
                    <SelectItem value="NET30">NET 30</SelectItem>
                    <SelectItem value="NET45">NET 45</SelectItem>
                    <SelectItem value="NET60">NET 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea
                  id="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                  placeholder="Enter terms and conditions"
                  rows={6}
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Legal Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    This contract will be automatically routed for legal review based on the contract value and terms.
                  </CardDescription>
                </CardContent>
              </Card>
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
                    <strong>Contract Type:</strong>
                    <div>{formData.contractType.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <strong>Vendor:</strong>
                    <div>{vendors.find(v => v.id === formData.vendor)?.name}</div>
                  </div>
                  <div>
                    <strong>Valid Period:</strong>
                    <div>{formData.validFrom} to {formData.validTo}</div>
                  </div>
                  <div>
                    <strong>Total Value:</strong>
                    <div>{formData.currency} {formData.totalValue}</div>
                  </div>
                  <div className="col-span-2">
                    <strong>Description:</strong>
                    <div>{formData.description}</div>
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
              onCreateContract(formData)
              setShowCreateDialog(false)
              setCurrentStep(1)
            }}>
              Create Contract
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const ContractDetails = () => {
    const contract = allContracts.find(c => c.id === selectedContract)
    if (!contract) return null

    return (
      <div className="space-y-6">
        {/* Contract Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{contract.contractNumber}</span>
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
            </CardTitle>
            <CardDescription>{contract.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Vendor</div>
                <div>{contract.vendor.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Contract Type</div>
                <div>{contract.contractType.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Valid Period</div>
                <div>{contract.validFrom} to {contract.validTo}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Total Value</div>
                <div>{contract.currency} {contract.totalValue.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Usage Progress</span>
                <span>{((contract.usedValue / contract.totalValue) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(contract.usedValue / contract.totalValue) * 100} className="w-full" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${contract.totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${contract.usedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Used Value</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${contract.remainingValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Remaining Value</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Target Qty</TableHead>
                  <TableHead>Used Qty</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Net Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.lineNumber}</TableCell>
                    <TableCell>{item.materialNumber}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.targetQuantity} {item.unitOfMeasure}</TableCell>
                    <TableCell>{item.usedQuantity} {item.unitOfMeasure}</TableCell>
                    <TableCell>{item.remainingQuantity} {item.unitOfMeasure}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.netAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Release Orders */}
        {contract.releaseOrders && contract.releaseOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Release Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Release Order</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.releaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.releaseOrderNumber}</TableCell>
                      <TableCell>{order.releaseDate}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Milestones */}
        {contract.milestones && contract.milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        milestone.status === 'COMPLETED' ? 'bg-green-500' :
                        milestone.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <div className="font-medium">{milestone.description}</div>
                        <div className="text-sm text-gray-600">Due: {milestone.dueDate}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {contract.status === 'PENDING_APPROVAL' && (
            <Button
              onClick={() => onReleaseContract(contract.id)}
              disabled={!userPermissions.canRelease}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Release Contract
            </Button>
          )}
          <Button variant="outline" disabled={!userPermissions.canEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Contract
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {contract.status === 'RELEASED' && (
            <Button
              variant="destructive"
              onClick={() => onTerminateContract(contract.id, 'Early termination')}
              disabled={!userPermissions.canTerminate}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Terminate
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600">SAP MM contract and agreement management system</p>
        </div>

        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={!userPermissions.canCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>
                  Create a new contract or agreement with vendor
                </DialogDescription>
              </DialogHeader>
              <ContractCreationWizard />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
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
                      <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                      <p className="text-2xl font-bold">{kpis.totalContracts.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.totalContracts.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.totalContracts.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.totalContracts.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                      <p className="text-2xl font-bold text-green-600">{kpis.activeContracts.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.activeContracts.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.activeContracts.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.activeContracts.change)}%
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
                      <p className="text-2xl font-bold text-orange-600">{kpis.pendingContracts.value}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.pendingContracts.change >= 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {kpis.pendingContracts.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.pendingContracts.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contract Value</p>
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
                      <p className="text-sm font-medium text-gray-600">Used Value</p>
                      <p className="text-2xl font-bold text-purple-600">${kpis.usedValue.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.usedValue.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.usedValue.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.usedValue.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                      <p className="text-2xl font-bold">{kpis.utilization.value.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        kpis.utilization.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpis.utilization.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(kpis.utilization.change)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contract Types Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'BLANKET_ORDER', label: 'Blanket Orders', count: 3, icon: Handshake },
                    { type: 'OUTLINE_AGREEMENT', label: 'Outline Agreements', count: 2, icon: FileSignature },
                    { type: 'FRAMEWORK_CONTRACT', label: 'Framework Contracts', count: 1, icon: Scale },
                    { type: 'SCHEDULING_AGREEMENT', label: 'Scheduling Agreements', count: 1, icon: CalendarIcon }
                  ].map((item) => (
                    <div key={item.type} className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <item.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Contract Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allContracts.slice(0, 5).map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {React.createElement(getContractTypeIcon(contract.contractType), { className: "w-5 h-5 text-blue-600" })}
                        </div>
                        <div>
                          <div className="font-medium">{contract.contractNumber}</div>
                          <div className="text-sm text-gray-600">{contract.vendor.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${contract.totalValue.toLocaleString()}</div>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Contract List</CardTitle>
                  <CardDescription>Manage all contracts and agreements</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search contracts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="RELEASED">Released</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="BLANKET_ORDER">Blanket Order</SelectItem>
                      <SelectItem value="OUTLINE_AGREEMENT">Outline Agreement</SelectItem>
                      <SelectItem value="FRAMEWORK_CONTRACT">Framework</SelectItem>
                      <SelectItem value="SCHEDULING_AGREEMENT">Scheduling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Used Value</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.contractNumber}</div>
                          <div className="text-sm text-gray-600 truncate max-w-[200px]">
                            {contract.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {React.createElement(getContractTypeIcon(contract.contractType), { className: "w-4 h-4" })}
                          <span className="text-sm">{contract.contractType.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.vendor.name}</div>
                          <div className="text-sm text-gray-600">{contract.vendor.vendorCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{contract.validFrom}</div>
                          <div className="text-sm text-gray-600">to {contract.validTo}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {contract.currency} {contract.totalValue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {contract.currency} {contract.usedValue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={(contract.usedValue / contract.totalValue) * 100}
                            className="w-16"
                          />
                          <span className="text-sm font-medium">
                            {((contract.usedValue / contract.totalValue) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedContract(contract.id)
                              setShowDetailsSheet(true)
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
                          {contract.status === 'PENDING_APPROVAL' && (
                            <Button
                              size="sm"
                              onClick={() => onReleaseContract(contract.id)}
                              disabled={!userPermissions.canRelease}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Agreements</CardTitle>
              <CardDescription>Delivery schedule management for long-term agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {allSchedulingAgreements.map((agreement) => (
                  <Card key={agreement.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{agreement.agreementNumber}</span>
                        <Badge className={getStatusColor(agreement.status)}>
                          {agreement.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {agreement.description} - {agreement.vendor.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {agreement.targetQuantity.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Target Quantity ({agreement.unitOfMeasure})</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {agreement.deliveredQuantity.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Delivered ({agreement.unitOfMeasure})</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {agreement.remainingQuantity.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Remaining ({agreement.unitOfMeasure})</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {((agreement.deliveredQuantity / agreement.targetQuantity) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Completion</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Delivery Progress</span>
                          <span>{((agreement.deliveredQuantity / agreement.targetQuantity) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={(agreement.deliveredQuantity / agreement.targetQuantity) * 100}
                          className="w-full"
                        />
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Delivery Date</TableHead>
                            <TableHead>Planned Qty</TableHead>
                            <TableHead>Confirmed Qty</TableHead>
                            <TableHead>Actual Qty</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agreement.deliverySchedule?.map((schedule, index) => (
                            <TableRow key={index}>
                              <TableCell>{schedule.deliveryDate}</TableCell>
                              <TableCell>{schedule.plannedQuantity.toLocaleString()}</TableCell>
                              <TableCell>{schedule.confirmedQuantity.toLocaleString()}</TableCell>
                              <TableCell>{schedule.actualQuantity.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(schedule.status)}>
                                  {schedule.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilization Tab */}
        <TabsContent value="utilization">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Utilization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {allContracts.map((contract) => (
                    <div key={contract.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-medium">{contract.contractNumber}</div>
                          <div className="text-sm text-gray-600">{contract.vendor.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {((contract.usedValue / contract.totalValue) * 100).toFixed(1)}% utilized
                          </div>
                          <div className="text-sm text-gray-600">
                            ${contract.usedValue.toLocaleString()} / ${contract.totalValue.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <Progress
                        value={(contract.usedValue / contract.totalValue) * 100}
                        className="w-full mb-4"
                      />

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            ${contract.totalValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Total Value</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            ${contract.usedValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Used Value</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            ${contract.remainingValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Remaining</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Utilization Warnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Utilization Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allContracts
                    .filter(c => {
                      const utilization = (c.usedValue / c.totalValue) * 100
                      return utilization > 80 || utilization < 20
                    })
                    .map((contract) => {
                      const utilization = (contract.usedValue / contract.totalValue) * 100
                      const isLowUtilization = utilization < 20

                      return (
                        <Card key={contract.id} className={isLowUtilization ? 'border-yellow-200' : 'border-red-200'}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              {isLowUtilization ? 'Low Utilization Warning' : 'High Utilization Alert'}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>
                              Contract {contract.contractNumber} has {utilization.toFixed(1)}% utilization.
                              {isLowUtilization
                                ? ' Consider reviewing contract terms or encouraging usage.'
                                : ' Contract may need renewal or expansion soon.'
                              }
                            </CardDescription>
                          </CardContent>
                        </Card>
                      )
                    })}

                  {allContracts.filter(c => {
                    const utilization = (c.usedValue / c.totalValue) * 100
                    return utilization > 80 || utilization < 20
                  }).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <div>All contracts have healthy utilization rates</div>
                      <div className="text-sm">Between 20% and 80% utilization</div>
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
                  Contract Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">85.2%</div>
                    <div className="text-sm text-gray-600">Avg Utilization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">12.5</div>
                    <div className="text-sm text-gray-600">Avg Contract Life (months)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">3.2%</div>
                    <div className="text-sm text-gray-600">Early Termination Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">$2.8M</div>
                    <div className="text-sm text-gray-600">Annual Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Contract Performance</CardTitle>
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
                          <Progress value={90 - index * 5} className="w-20" />
                          <span className="text-sm font-medium">{90 - index * 5}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Contract compliance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contract Negotiation Savings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Price reductions:</span>
                        <span className="text-sm font-medium text-green-600">$485,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volume discounts:</span>
                        <span className="text-sm font-medium text-green-600">$125,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment term benefits:</span>
                        <span className="text-sm font-medium text-green-600">$45,000</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Process Efficiency Gains</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Reduced processing time:</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Automated approvals:</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Exception reduction:</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contract Details Sheet */}
      <Sheet open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Contract Details</SheetTitle>
            <SheetDescription>
              Complete contract information and utilization
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ContractDetails />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}