"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Building,
  Users,
  Phone,
  Mail,
  Globe,
  MapPin,
  CreditCard,
  FileText,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Eye,
  Ban,
  UserPlus,
  Search,
  Filter,
  Download,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AdvancedDataTable, createSortableColumn, createActionsColumn } from "@/components/ui/advanced-data-table"
import { FormModal, ConfirmationModal, useModal, InfoModal } from "@/components/ui/advanced-modal"
import { KPICard } from "@/components/ui/charts"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ResponsiveGrid, ResponsiveStack } from "@/components/ui/responsive-helpers"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import type { VendorMaster, PurchasingInfoRecord } from "@/lib/sap-procurement-types"

// Vendor Master Data Schema based on SAP MM standards
const vendorSchema = z.object({
  // General Information
  generalInfo: z.object({
    name1: z.string().min(1, "Company name is required"),
    name2: z.string().optional(),
    searchTerm1: z.string().min(1, "Search term is required"),
    searchTerm2: z.string().optional(),
    street: z.string().min(1, "Street address is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    region: z.string().optional(),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    website: z.string().url("Invalid URL format").optional(),
    taxNumber: z.string().optional(),
    vatRegistration: z.string().optional()
  }),

  // Purchasing Data
  purchasingData: z.object({
    purchaseOrderCurrency: z.string().min(1, "Currency is required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    incoterms: z.string().optional(),
    minimumOrderValue: z.number().min(0).optional(),
    orderOptimization: z.boolean(),
    automaticEvaluatedReceiptSettlement: z.boolean(),
    underDeliveryTolerance: z.number().min(0).max(100, "Must be between 0-100%"),
    overDeliveryTolerance: z.number().min(0).max(100, "Must be between 0-100%"),
    unlimitedOverDelivery: z.boolean()
  }),

  // Accounting Data
  accountingData: z.object({
    reconAccount: z.string().min(1, "Reconciliation account is required"),
    paymentMethods: z.array(z.string()).min(1, "At least one payment method required"),
    accountingClerk: z.string().min(1, "Accounting clerk is required")
  }),

  // Classification
  vendorAccountGroup: z.enum(['DOMESTIC', 'FOREIGN', 'ONE_TIME', 'EMPLOYEE']),
  vendorClass: z.enum(['A', 'B', 'C']),
  plantAccess: z.array(z.string()).min(1, "At least one plant required")
})

type VendorFormData = z.infer<typeof vendorSchema>

interface VendorManagementProps {
  vendors: VendorMaster[]
  purchasingInfoRecords: PurchasingInfoRecord[]
  plants: Array<{ id: string; name: string }>
  onCreateVendor: (data: VendorFormData) => Promise<void>
  onUpdateVendor: (vendorId: string, data: VendorFormData) => Promise<void>
  onBanVendor: (vendorId: string, reason: string) => Promise<void>
  onUnblockVendor: (vendorId: string) => Promise<void>
  userPermissions: string[]
}

export function VendorManagement({
  vendors,
  purchasingInfoRecords,
  plants,
  onCreateVendor,
  onUpdateVendor,
  onBanVendor,
  onUnblockVendor,
  userPermissions
}: VendorManagementProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedVendor, setSelectedVendor] = useState<VendorMaster | null>(null)
  const [vendorFormMode, setVendorFormMode] = useState<'create' | 'edit'>('create')

  const vendorFormModal = useModal()
  const vendorDetailsModal = useModal()
  const blockVendorModal = useModal()
  const confirmationModal = useModal()

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      generalInfo: {
        name1: "",
        name2: "",
        searchTerm1: "",
        searchTerm2: "",
        street: "",
        postalCode: "",
        city: "",
        country: "Nigeria",
        region: "",
        telephone: "",
        mobile: "",
        email: "",
        website: "",
        taxNumber: "",
        vatRegistration: ""
      },
      purchasingData: {
        purchaseOrderCurrency: "NGN",
        paymentTerms: "NET30",
        incoterms: "DAP",
        minimumOrderValue: 0,
        orderOptimization: false,
        automaticEvaluatedReceiptSettlement: false,
        underDeliveryTolerance: 5,
        overDeliveryTolerance: 10,
        unlimitedOverDelivery: false
      },
      accountingData: {
        reconAccount: "2100000", // Accounts Payable
        paymentMethods: ["BANK_TRANSFER"],
        accountingClerk: ""
      },
      vendorAccountGroup: 'DOMESTIC',
      vendorClass: 'B',
      plantAccess: []
    }
  })

  // Sample vendor performance data
  const vendorPerformanceData = {
    "V001": {
      onTimeDelivery: 95,
      qualityRating: 88,
      priceCompetitiveness: 92,
      communicationRating: 90,
      overallScore: 91,
      totalOrders: 45,
      totalValue: 125000000,
      averageOrderValue: 2777778,
      lastOrderDate: "2024-01-15"
    },
    "V002": {
      onTimeDelivery: 87,
      qualityRating: 94,
      priceCompetitiveness: 85,
      communicationRating: 89,
      overallScore: 89,
      totalOrders: 32,
      totalValue: 89000000,
      averageOrderValue: 2781250,
      lastOrderDate: "2024-01-12"
    }
  }

  // Calculate vendor KPIs
  const vendorKPIs = React.useMemo(() => {
    const totalVendors = vendors.length
    const activeVendors = vendors.filter(v => v.status === 'ACTIVE').length
    const blockedVendors = vendors.filter(v => v.status === 'BLOCKED').length
    const domesticVendors = vendors.filter(v => v.vendorAccountGroup === 'DOMESTIC').length

    return {
      totalVendors: { value: totalVendors, change: 8.5 },
      activeVendors: { value: activeVendors, change: 12.3 },
      blockedVendors: { value: blockedVendors, change: -15.2 },
      domesticShare: { value: totalVendors > 0 ? (domesticVendors / totalVendors) * 100 : 0, change: 3.1 }
    }
  }, [vendors])

  // Filter vendors
  const filteredVendors = React.useMemo(() => {
    return vendors.filter(vendor => {
      const statusMatch = filterStatus === "all" || vendor.status.toLowerCase() === filterStatus
      const classMatch = filterClass === "all" || vendor.vendorClass === filterClass
      const categoryMatch = filterCategory === "all" || vendor.vendorAccountGroup.toLowerCase() === filterCategory

      return statusMatch && classMatch && categoryMatch
    })
  }, [vendors, filterStatus, filterClass, filterCategory])

  // Vendor columns
  const vendorColumns = [
    createSortableColumn('vendorCode', 'Vendor Code', ({ row }) => (
      <Button
        variant="link"
        className="h-auto p-0 font-semibold text-primary"
        onClick={() => {
          setSelectedVendor(row)
          vendorDetailsModal.open()
        }}
      >
        {row.vendorCode}
      </Button>
    )),
    createSortableColumn('name', 'Vendor Name'),
    createSortableColumn('generalInfo.city', 'Location', ({ row }) =>
      `${row.generalInfo?.city || 'N/A'}, ${row.generalInfo?.country || 'N/A'}`
    ),
    createSortableColumn('vendorClass', 'Class', ({ row }) => (
      <Badge variant={
        row.vendorClass === 'A' ? 'default' :
        row.vendorClass === 'B' ? 'secondary' : 'outline'
      }>
        Class {row.vendorClass}
      </Badge>
    )),
    createSortableColumn('vendorAccountGroup', 'Category', ({ row }) => (
      <Badge variant="outline">
        {row.vendorAccountGroup?.replace('_', ' ') || 'N/A'}
      </Badge>
    )),
    createSortableColumn('status', 'Status', ({ row }) => (
      <Badge variant={
        row.status === 'ACTIVE' ? 'default' :
        row.status === 'BLOCKED' ? 'destructive' : 'secondary'
      }>
        {row.status}
      </Badge>
    )),
    createSortableColumn('plantAccess', 'Plants', ({ row }) =>
      `${row.plantAccess?.length || 0} plants`
    ),
    {
      accessorKey: 'performance',
      header: 'Performance',
      cell: ({ row }: any) => {
        const performance = vendorPerformanceData[row.vendorCode as keyof typeof vendorPerformanceData]
        if (!performance) return <span className="text-muted-foreground">No data</span>

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium">{performance.overallScore}%</span>
            </div>
            <Badge variant={
              performance.overallScore >= 90 ? 'default' :
              performance.overallScore >= 80 ? 'secondary' : 'destructive'
            } size="sm">
              {performance.overallScore >= 90 ? 'Excellent' :
               performance.overallScore >= 80 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        )
      }
    },
    createActionsColumn((row: VendorMaster) => (
      <>
        <DropdownMenuItem onClick={() => {
          setSelectedVendor(row)
          vendorDetailsModal.open()
        }}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {userPermissions.includes('edit_vendor') && (
          <DropdownMenuItem onClick={() => {
            setSelectedVendor(row)
            setVendorFormMode('edit')
            // Populate form with vendor data
            form.reset({
              generalInfo: row.generalInfo,
              purchasingData: row.purchasingData,
              accountingData: row.accountingData,
              vendorAccountGroup: row.vendorAccountGroup,
              vendorClass: row.vendorClass,
              plantAccess: row.plantAccess
            })
            vendorFormModal.open()
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {userPermissions.includes('ban_vendor') && row.status === 'ACTIVE' && (
          <DropdownMenuItem onClick={() => {
            setSelectedVendor(row)
            blockVendorModal.open()
          }}>
            <Ban className="mr-2 h-4 w-4" />
            Ban Vendor
          </DropdownMenuItem>
        )}
        {userPermissions.includes('unblock_vendor') && row.status === 'BLOCKED' && (
          <DropdownMenuItem onClick={() => {
            if (row.id) onUnblockVendor(row.id)
          }}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Unblock Vendor
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </DropdownMenuItem>
      </>
    ))
  ]

  const handleCreateVendor = async (data: VendorFormData) => {
    try {
      await onCreateVendor(data)
      vendorFormModal.close()
      form.reset()
    } catch (error) {
      console.error('Error creating vendor:', error)
    }
  }

  const handleUpdateVendor = async (data: VendorFormData) => {
    try {
      if (selectedVendor) {
        await onUpdateVendor(selectedVendor.id, data)
        vendorFormModal.close()
        form.reset()
      }
    } catch (error) {
      console.error('Error updating vendor:', error)
    }
  }

  const openCreateVendor = () => {
    setVendorFormMode('create')
    setSelectedVendor(null)
    form.reset()
    vendorFormModal.open()
  }

  const getVendorPerformance = (vendorCode: string) => {
    return vendorPerformanceData[vendorCode as keyof typeof vendorPerformanceData] || {
      onTimeDelivery: 0,
      qualityRating: 0,
      priceCompetitiveness: 0,
      communicationRating: 0,
      overallScore: 0,
      totalOrders: 0,
      totalValue: 0,
      averageOrderValue: 0,
      lastOrderDate: "N/A"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">
            SAP MM-inspired vendor master data and relationship management
          </p>
        </div>
        <div className="flex gap-2">
          {userPermissions.includes('create_vendor') && (
            <Button onClick={openCreateVendor} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Create Vendor
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <KPICard
          title="Total Vendors"
          value={vendorKPIs.totalVendors.value}
          change={vendorKPIs.totalVendors.change}
          trend="up"
          icon={Building}
        />
        <KPICard
          title="Active Vendors"
          value={vendorKPIs.activeVendors.value}
          change={vendorKPIs.activeVendors.change}
          trend="up"
          icon={CheckCircle}
        />
        <KPICard
          title="Baned Vendors"
          value={vendorKPIs.blockedVendors.value}
          change={vendorKPIs.blockedVendors.change}
          trend="down"
          icon={Ban}
        />
        <KPICard
          title="Domestic Share"
          value={`${vendorKPIs.domesticShare.value.toFixed(1)}%`}
          change={vendorKPIs.domesticShare.change}
          trend="up"
          icon={MapPin}
        />
      </ResponsiveGrid>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Vendor Filters
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Baned</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Classification</label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="A">Class A (Strategic)</SelectItem>
                  <SelectItem value="B">Class B (Important)</SelectItem>
                  <SelectItem value="C">Class C (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="foreign">Foreign</SelectItem>
                  <SelectItem value="one_time">One-Time</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-10"
                />
              </div>
            </div>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Vendor Performance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(vendorPerformanceData).map(([vendorCode, performance]) => {
              const vendor = vendors.find(v => v.vendorCode === vendorCode)
              if (!vendor) return null

              return (
                <Card key={vendorCode} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground">{vendorCode}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{performance.overallScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On-time Delivery</span>
                        <span className="font-medium">{performance.onTimeDelivery}%</span>
                      </div>
                      <Progress value={performance.onTimeDelivery} className="h-1" />

                      <div className="flex justify-between text-sm">
                        <span>Quality Rating</span>
                        <span className="font-medium">{performance.qualityRating}%</span>
                      </div>
                      <Progress value={performance.qualityRating} className="h-1" />

                      <Separator className="my-2" />

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Orders</span>
                          <p className="font-medium">{performance.totalOrders}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Value</span>
                          <p className="font-medium">₦{(performance.totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <AdvancedDataTable
        columns={vendorColumns}
        data={filteredVendors}
        title="Vendor Master Data"
        description={`${filteredVendors.length} vendors found`}
        searchPlaceholder="Search vendor code, name, or location..."
        enableExport
        exportFilename="vendor-master-data.csv"
        onRowClick={(row) => {
          setSelectedVendor(row)
          vendorDetailsModal.open()
        }}
      />

      {/* Vendor Form Modal */}
      <FormModal
        open={vendorFormModal.isOpen}
        onOpenChange={vendorFormModal.setIsOpen}
        title={vendorFormMode === 'create' ? "Create New Vendor" : "Edit Vendor"}
        description={vendorFormMode === 'create' ? "Add a new vendor to the master data" : `Update vendor ${selectedVendor?.name}`}
        size="xl"
        showFooter={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(vendorFormMode === 'create' ? handleCreateVendor : handleUpdateVendor)}
            className="space-y-6"
          >
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
                <TabsTrigger value="accounting">Accounting</TabsTrigger>
                <TabsTrigger value="classification">Classification</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="generalInfo.name1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company legal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.name2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Additional name line" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.searchTerm1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Term *</FormLabel>
                        <FormControl>
                          <Input placeholder="Primary search term" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.searchTerm2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Term 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Secondary search term" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            <SelectItem value="Ghana">Ghana</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="Egypt">Egypt</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region/State</FormLabel>
                        <FormControl>
                          <Input placeholder="State or region" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone</FormLabel>
                        <FormControl>
                          <Input placeholder="+234-xxx-xxx-xxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax identification number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="generalInfo.vatRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT Registration</FormLabel>
                        <FormControl>
                          <Input placeholder="VAT registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="purchasing" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchasingData.purchaseOrderCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PO Currency *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchasingData.paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NET30">Net 30 Days</SelectItem>
                            <SelectItem value="NET15">Net 15 Days</SelectItem>
                            <SelectItem value="NET60">Net 60 Days</SelectItem>
                            <SelectItem value="CASH">Cash on Delivery</SelectItem>
                            <SelectItem value="ADVANCE">Advance Payment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchasingData.incoterms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incoterms</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                            <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                            <SelectItem value="CPT">CPT - Carriage Paid To</SelectItem>
                            <SelectItem value="CIP">CIP - Carriage and Insurance Paid</SelectItem>
                            <SelectItem value="DAP">DAP - Delivered at Place</SelectItem>
                            <SelectItem value="DPU">DPU - Delivered at Place Unloaded</SelectItem>
                            <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchasingData.minimumOrderValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchasingData.underDeliveryTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Under Delivery Tolerance (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchasingData.overDeliveryTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Over Delivery Tolerance (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="accounting" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountingData.reconAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reconciliation Account *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2100000">2100000 - Trade Payables</SelectItem>
                            <SelectItem value="2110000">2110000 - Other Payables</SelectItem>
                            <SelectItem value="2120000">2120000 - Employee Payables</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountingData.accountingClerk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accounting Clerk *</FormLabel>
                        <FormControl>
                          <Input placeholder="Clerk responsible for this vendor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="classification" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vendorAccountGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Group *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DOMESTIC">Domestic Vendor</SelectItem>
                            <SelectItem value="FOREIGN">Foreign Vendor</SelectItem>
                            <SelectItem value="ONE_TIME">One-Time Vendor</SelectItem>
                            <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendorClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Class *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Class A - Strategic Partner</SelectItem>
                            <SelectItem value="B">Class B - Important Vendor</SelectItem>
                            <SelectItem value="C">Class C - Standard Vendor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plantAccess"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Plant Access *</FormLabel>
                        <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-32 overflow-y-auto">
                          {plants.map((plant) => (
                            <div key={plant.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={plant.id}
                                checked={field.value?.includes(plant.id) || false}
                                onChange={(e) => {
                                  const currentValue = field.value || []
                                  if (e.target.checked) {
                                    field.onChange([...currentValue, plant.id])
                                  } else {
                                    field.onChange(currentValue.filter(id => id !== plant.id))
                                  }
                                }}
                              />
                              <label
                                htmlFor={plant.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {plant.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => vendorFormModal.close()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {vendorFormMode === 'create' ? 'Create Vendor' : 'Update Vendor'}
              </Button>
            </div>
          </form>
        </Form>
      </FormModal>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <InfoModal
          open={vendorDetailsModal.isOpen}
          onOpenChange={vendorDetailsModal.setIsOpen}
          title={`Vendor ${selectedVendor.vendorCode}`}
          description={selectedVendor.name}
          size="xl"
          data={selectedVendor}
          fields={[
            { key: 'vendorCode', label: 'Vendor Code', type: 'text' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'status', label: 'Status', type: 'badge' },
            { key: 'vendorClass', label: 'Classification', type: 'badge' },
            { key: 'vendorAccountGroup', label: 'Account Group', type: 'text' },
            { key: 'generalInfo.city', label: 'Location', type: 'text' },
            { key: 'generalInfo.email', label: 'Email', type: 'text' },
            { key: 'generalInfo.telephone', label: 'Phone', type: 'text' },
            { key: 'purchasingData.paymentTerms', label: 'Payment Terms', type: 'text' },
            { key: 'purchasingData.purchaseOrderCurrency', label: 'Currency', type: 'text' }
          ]}
        >
          {/* Performance Metrics */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Performance Metrics</h4>
            {(() => {
              const performance = getVendorPerformance(selectedVendor.vendorCode)
              return (
                <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{performance.onTimeDelivery}%</div>
                    <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{performance.qualityRating}%</div>
                    <div className="text-sm text-muted-foreground">Quality Rating</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{performance.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">₦{(performance.totalValue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                </ResponsiveGrid>
              )
            })()}
          </div>

          {/* Plant Access */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Plant Access ({selectedVendor.plantAccess.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedVendor.plantAccess.map((plantId) => {
                const plant = plants.find(p => p.id === plantId)
                return plant ? (
                  <Badge key={plantId} variant="outline">
                    {plant.name}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        </InfoModal>
      )}

      {/* Ban Vendor Confirmation */}
      <ConfirmationModal
        open={blockVendorModal.isOpen}
        onOpenChange={blockVendorModal.setIsOpen}
        title="Ban Vendor"
        description={`Are you sure you want to block vendor ${selectedVendor?.name}? This will prevent new purchase orders to this vendor.`}
        confirmText="Ban Vendor"
        cancelText="Cancel"
        onConfirm={() => {
          if (selectedVendor) {
            onBanVendor(selectedVendor.id, "Manual block by user")
            blockVendorModal.close()
          }
        }}
        variant="destructive"
      />
    </div>
  )
}

export default VendorManagement