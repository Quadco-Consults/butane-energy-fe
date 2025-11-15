'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Search, Plus, Eye, Edit, Trash2, FileText, CheckCircle,
  XCircle, AlertTriangle, Clock, DollarSign, Package,
  Calculator, Target, RotateCcw, Zap, Settings,
  TrendingUp, TrendingDown, BarChart3, PieChart,
  Filter, Calendar, User, Building, ArrowRight,
  ArrowLeft, Play, Pause, RefreshCw, Download,
  Upload, Mail, Bell, Shield, Lock, Unlock
} from 'lucide-react'
import { ThreeWayMatching, PurchaseOrder, GoodsReceipt, InvoiceVerification } from '@/lib/sap-procurement-types'

interface MatchingRule {
  id: string
  name: string
  description: string
  type: 'QUANTITY' | 'PRICE' | 'TOTAL' | 'DATE'
  tolerance: number
  unit: 'PERCENTAGE' | 'ABSOLUTE' | 'DAYS'
  active: boolean
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface MatchingConfiguration {
  autoMatch: boolean
  requireApprovalForVariances: boolean
  blockInvoicesExceedingTolerance: boolean
  sendNotifications: boolean
  rules: MatchingRule[]
}

interface ThreeWayMatchingEngineProps {
  matchings?: ThreeWayMatching[]
  purchaseOrders?: PurchaseOrder[]
  goodsReceipts?: GoodsReceipt[]
  invoices?: InvoiceVerification[]
  onRunMatching?: (documents: { po: string, gr: string, invoice: string }) => Promise<ThreeWayMatching>
  onApproveVariance?: (matchingId: string, reason: string) => void
  onRejectVariance?: (matchingId: string, reason: string) => void
  onUpdateConfiguration?: (config: MatchingConfiguration) => void
  userPermissions?: {
    canRunMatching: boolean
    canApproveVariances: boolean
    canConfigureRules: boolean
    canViewAnalytics: boolean
  }
}

export default function ThreeWayMatchingEngine({
  matchings = [],
  purchaseOrders = [],
  goodsReceipts = [],
  invoices = [],
  onRunMatching = async () => ({} as ThreeWayMatching),
  onApproveVariance = () => {},
  onRejectVariance = () => {},
  onUpdateConfiguration = () => {},
  userPermissions = {
    canRunMatching: true,
    canApproveVariances: true,
    canConfigureRules: true,
    canViewAnalytics: true
  }
}: ThreeWayMatchingEngineProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMatching, setSelectedMatching] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showConfiguration, setShowConfiguration] = useState(false)
  const [isRunningMatching, setIsRunningMatching] = useState(false)
  const [matchingProgress, setMatchingProgress] = useState(0)

  // Mock data for demonstration
  const mockMatchings: ThreeWayMatching[] = [
    {
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
    {
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
    }
  ]

  const mockConfiguration: MatchingConfiguration = {
    autoMatch: true,
    requireApprovalForVariances: true,
    blockInvoicesExceedingTolerance: true,
    sendNotifications: true,
    rules: [
      {
        id: 'RULE001',
        name: 'Quantity Under-delivery',
        description: 'Tolerance for receiving less quantity than ordered',
        type: 'QUANTITY',
        tolerance: 5,
        unit: 'PERCENTAGE',
        active: true,
        priority: 'HIGH'
      },
      {
        id: 'RULE002',
        name: 'Quantity Over-delivery',
        description: 'Tolerance for receiving more quantity than ordered',
        type: 'QUANTITY',
        tolerance: 2,
        unit: 'PERCENTAGE',
        active: true,
        priority: 'MEDIUM'
      },
      {
        id: 'RULE003',
        name: 'Price Increase',
        description: 'Maximum allowed price increase from PO',
        type: 'PRICE',
        tolerance: 3,
        unit: 'PERCENTAGE',
        active: true,
        priority: 'HIGH'
      },
      {
        id: 'RULE004',
        name: 'Total Amount Variance',
        description: 'Maximum absolute variance in total amount',
        type: 'TOTAL',
        tolerance: 500,
        unit: 'ABSOLUTE',
        active: true,
        priority: 'HIGH'
      }
    ]
  }

  const [configuration, setConfiguration] = useState<MatchingConfiguration>(mockConfiguration)

  const allMatchings = matchings.length > 0 ? matchings : mockMatchings

  // Filter matchings
  const filteredMatchings = useMemo(() => {
    return allMatchings.filter(matching => {
      const matchesSearch = matching.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           matching.goodsReceiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           matching.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || matching.overallMatchingStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [allMatchings, searchTerm, statusFilter])

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = allMatchings.length
    const matched = allMatchings.filter(m => m.overallMatchingStatus === 'MATCHED').length
    const variances = allMatchings.filter(m => m.toleranceExceeded).length
    const pendingApproval = allMatchings.filter(m => m.requiresApproval).length
    const totalVarianceAmount = allMatchings.reduce((sum, m) => sum + Math.abs(m.totalVariance), 0)

    return {
      totalMatchings: total,
      matchedRate: total > 0 ? (matched / total) * 100 : 0,
      varianceRate: total > 0 ? (variances / total) * 100 : 0,
      pendingApprovals: pendingApproval,
      totalVarianceAmount,
      averageVariance: total > 0 ? totalVarianceAmount / total : 0
    }
  }, [allMatchings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MATCHED': return 'bg-green-100 text-green-800 border-green-300'
      case 'VARIANCE_WITHIN_TOLERANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'VARIANCE_EXCEEDS_TOLERANCE': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'QUANTITY': return Package
      case 'PRICE': return DollarSign
      case 'TOTAL': return Calculator
      case 'DATE': return Calendar
      default: return Settings
    }
  }

  const runAutomaticMatching = useCallback(async () => {
    setIsRunningMatching(true)
    setMatchingProgress(0)

    // Simulate matching process
    for (let i = 0; i <= 100; i += 10) {
      setMatchingProgress(i)
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    setIsRunningMatching(false)
    setMatchingProgress(100)

    // Reset progress after completion
    setTimeout(() => {
      setMatchingProgress(0)
    }, 2000)
  }, [])

  const MatchingConfiguration = () => {
    return (
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Configuration</CardTitle>
            <CardDescription>Configure automatic matching behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Automatic Matching</div>
                <div className="text-sm text-gray-600">Run matching automatically when documents are received</div>
              </div>
              <Checkbox
                checked={configuration.autoMatch}
                onCheckedChange={(checked) =>
                  setConfiguration({...configuration, autoMatch: Boolean(checked)})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Require Approval for Variances</div>
                <div className="text-sm text-gray-600">Route variance exceptions for manual approval</div>
              </div>
              <Checkbox
                checked={configuration.requireApprovalForVariances}
                onCheckedChange={(checked) =>
                  setConfiguration({...configuration, requireApprovalForVariances: Boolean(checked)})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Block Invoices Exceeding Tolerance</div>
                <div className="text-sm text-gray-600">Automatically block invoices with excessive variances</div>
              </div>
              <Checkbox
                checked={configuration.blockInvoicesExceedingTolerance}
                onCheckedChange={(checked) =>
                  setConfiguration({...configuration, blockInvoicesExceedingTolerance: Boolean(checked)})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Send Notifications</div>
                <div className="text-sm text-gray-600">Email notifications for matching exceptions</div>
              </div>
              <Checkbox
                checked={configuration.sendNotifications}
                onCheckedChange={(checked) =>
                  setConfiguration({...configuration, sendNotifications: Boolean(checked)})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Matching Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Matching Rules & Tolerances</CardTitle>
            <CardDescription>Configure tolerance limits for automatic matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {configuration.rules.map((rule) => {
                const IconComponent = getRuleTypeIcon(rule.type)
                return (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-gray-600">{rule.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={rule.priority === 'HIGH' ? 'destructive' : rule.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                          {rule.priority}
                        </Badge>
                        <Checkbox
                          checked={rule.active}
                          onCheckedChange={(checked) => {
                            const updatedRules = configuration.rules.map(r =>
                              r.id === rule.id ? { ...r, active: Boolean(checked) } : r
                            )
                            setConfiguration({...configuration, rules: updatedRules})
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`tolerance-${rule.id}`} className="text-sm">Tolerance</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`tolerance-${rule.id}`}
                            type="number"
                            value={rule.tolerance}
                            onChange={(e) => {
                              const updatedRules = configuration.rules.map(r =>
                                r.id === rule.id ? { ...r, tolerance: Number(e.target.value) } : r
                              )
                              setConfiguration({...configuration, rules: updatedRules})
                            }}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">
                            {rule.unit === 'PERCENTAGE' ? '%' : rule.unit === 'ABSOLUTE' ? '$' : 'days'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Unit Type</Label>
                        <Select
                          value={rule.unit}
                          onValueChange={(value: 'PERCENTAGE' | 'ABSOLUTE' | 'DAYS') => {
                            const updatedRules = configuration.rules.map(r =>
                              r.id === rule.id ? { ...r, unit: value } : r
                            )
                            setConfiguration({...configuration, rules: updatedRules})
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                            <SelectItem value="ABSOLUTE">Absolute ($)</SelectItem>
                            <SelectItem value="DAYS">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Priority</Label>
                        <Select
                          value={rule.priority}
                          onValueChange={(value: 'HIGH' | 'MEDIUM' | 'LOW') => {
                            const updatedRules = configuration.rules.map(r =>
                              r.id === rule.id ? { ...r, priority: value } : r
                            )
                            setConfiguration({...configuration, rules: updatedRules})
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => onUpdateConfiguration(configuration)}>
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const MatchingDetails = () => {
    const matching = allMatchings.find(m => m.id === selectedMatching)
    if (!matching) return null

    return (
      <div className="space-y-6">
        {/* Matching Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Matching Details</span>
              <Badge className={getStatusColor(matching.overallMatchingStatus)}>
                {matching.overallMatchingStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-medium">{matching.purchaseOrderNumber}</div>
                <div className="text-sm text-gray-600">Purchase Order</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-medium">{matching.goodsReceiptNumber}</div>
                <div className="text-sm text-gray-600">Goods Receipt</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-medium">{matching.invoiceId}</div>
                <div className="text-sm text-gray-600">Invoice</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Variance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {matching.quantityVariance}
                </div>
                <div className="text-sm text-gray-600">Quantity Variance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${Math.abs(matching.priceVariance).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Price Variance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${Math.abs(matching.totalVariance).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Variance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Item Details */}
        <Card>
          <CardHeader>
            <CardTitle>Line Item Analysis</CardTitle>
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
                  <TableHead>Qty Variance</TableHead>
                  <TableHead>Price Variance</TableHead>
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
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Variance Exceeds Tolerance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    This matching has variances that exceed the configured tolerance limits and requires approval.
                  </CardDescription>
                </CardContent>
              </Card>

              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={() => onApproveVariance(matching.id, 'Variance approved')}
                  disabled={!userPermissions.canApproveVariances}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Variance
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onRejectVariance(matching.id, 'Variance rejected')}
                  disabled={!userPermissions.canApproveVariances}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Variance
                </Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Three-Way Matching Engine</h1>
          <p className="text-gray-600">Automated document matching and variance analysis</p>
        </div>

        <div className="flex space-x-2">
          <Dialog open={showConfiguration} onOpenChange={setShowConfiguration}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!userPermissions.canConfigureRules}>
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Matching Configuration</DialogTitle>
                <DialogDescription>
                  Configure automatic matching rules and tolerances
                </DialogDescription>
              </DialogHeader>
              <MatchingConfiguration />
            </DialogContent>
          </Dialog>

          <Button
            onClick={runAutomaticMatching}
            disabled={isRunningMatching || !userPermissions.canRunMatching}
          >
            {isRunningMatching ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run Matching
          </Button>
        </div>
      </div>

      {/* Matching Progress */}
      {isRunningMatching && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Running automatic matching...</span>
                <span className="text-sm text-gray-600">{matchingProgress}%</span>
              </div>
              <Progress value={matchingProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matchings">Matchings</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Matchings</p>
                      <p className="text-2xl font-bold">{analytics.totalMatchings}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Match Rate</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.matchedRate.toFixed(1)}%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Variance Rate</p>
                      <p className="text-2xl font-bold text-red-600">{analytics.varianceRate.toFixed(1)}%</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-orange-600">{analytics.pendingApprovals}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Variance</p>
                      <p className="text-2xl font-bold text-purple-600">${analytics.totalVarianceAmount.toFixed(0)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Variance</p>
                      <p className="text-2xl font-bold">${analytics.averageVariance.toFixed(0)}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Matching Rules Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Active Matching Rules</CardTitle>
                <CardDescription>Current tolerance configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {configuration.rules.filter(rule => rule.active).map((rule) => {
                    const IconComponent = getRuleTypeIcon(rule.type)
                    return (
                      <div key={rule.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{rule.name}</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {rule.tolerance}
                          {rule.unit === 'PERCENTAGE' ? '%' : rule.unit === 'ABSOLUTE' ? '$' : ' days'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Matching Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allMatchings.slice(0, 5).map((matching) => (
                    <div key={matching.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{matching.purchaseOrderNumber}</div>
                          <div className="text-sm text-gray-600">
                            GR: {matching.goodsReceiptNumber} | Inv: {matching.invoiceId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(matching.overallMatchingStatus)}>
                          {matching.overallMatchingStatus}
                        </Badge>
                        {matching.totalVariance !== 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            ${Math.abs(matching.totalVariance).toFixed(2)} variance
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Matchings Tab */}
        <TabsContent value="matchings">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>All Matchings</CardTitle>
                  <CardDescription>Complete list of three-way matching results</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search matchings..."
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase Order</TableHead>
                    <TableHead>Goods Receipt</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Variance</TableHead>
                    <TableHead>Matching Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatchings.map((matching) => (
                    <TableRow key={matching.id}>
                      <TableCell className="font-medium">
                        {matching.purchaseOrderNumber}
                      </TableCell>
                      <TableCell>{matching.goodsReceiptNumber}</TableCell>
                      <TableCell>{matching.invoiceId}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(matching.overallMatchingStatus)}>
                          {matching.overallMatchingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={matching.totalVariance !== 0 ? 'text-red-600 font-semibold' : ''}>
                          ${Math.abs(matching.totalVariance).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{matching.matchingDate}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMatching(matching.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Matching Details Panel */}
          {selectedMatching && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Matching Details</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMatching(null)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MatchingDetails />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Exceptions Tab */}
        <TabsContent value="exceptions">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Variance Exceptions
                </CardTitle>
                <CardDescription>Matchings requiring attention due to tolerance violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allMatchings.filter(m => m.toleranceExceeded).map((matching) => (
                    <div key={matching.id} className="border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-800">
                            {matching.purchaseOrderNumber} → {matching.invoiceId}
                          </div>
                          <div className="text-sm text-red-600">
                            GR: {matching.goodsReceiptNumber}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-red-800">
                            ${Math.abs(matching.totalVariance).toFixed(2)} variance
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            {matching.requiresApproval ? 'Requires Approval' : 'Review Required'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedMatching(matching.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                        {matching.requiresApproval && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onApproveVariance(matching.id, 'Approved')}
                              disabled={!userPermissions.canApproveVariances}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectVariance(matching.id, 'Rejected')}
                              disabled={!userPermissions.canApproveVariances}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {allMatchings.filter(m => m.toleranceExceeded).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <div>No variance exceptions at this time</div>
                      <div className="text-sm">All matchings are within tolerance limits</div>
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
                  Matching Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">98.5%</div>
                    <div className="text-sm text-gray-600">Automation Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1.2sec</div>
                    <div className="text-sm text-gray-600">Avg Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">4.2%</div>
                    <div className="text-sm text-gray-600">Exception Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">$156K</div>
                    <div className="text-sm text-gray-600">Monthly Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Variance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Quantity Variances</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">This month:</span>
                        <span className="text-sm font-medium">2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last month:</span>
                        <span className="text-sm font-medium">2.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Improvement:</span>
                        <span className="text-sm font-medium text-green-600">-0.7%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Price Variances</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">This month:</span>
                        <span className="text-sm font-medium">1.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Last month:</span>
                        <span className="text-sm font-medium">2.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Improvement:</span>
                        <span className="text-sm font-medium text-green-600">-0.4%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Total Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Variance prevented:</span>
                        <span className="text-sm font-medium">$45,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processing saved:</span>
                        <span className="text-sm font-medium">$12,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Total savings:</span>
                        <span className="text-sm font-medium text-green-600">$58,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rule Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Rule Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {configuration.rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-gray-600">{rule.type} tolerance: {rule.tolerance}{rule.unit === 'PERCENTAGE' ? '%' : rule.unit === 'ABSOLUTE' ? '$' : ' days'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Progress value={85 + Math.random() * 10} className="w-20" />
                          <span className="text-sm font-medium">{(85 + Math.random() * 10).toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Effectiveness</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}