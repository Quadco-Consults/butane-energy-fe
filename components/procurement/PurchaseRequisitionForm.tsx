"use client"

import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Plus, Trash2, Search, FileText, Building, User, Calendar, DollarSign, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedDataTable, createSortableColumn, createActionsColumn } from "@/components/ui/advanced-data-table"
import { FormModal, ConfirmationModal, useModal } from "@/components/ui/advanced-modal"
import { ResponsiveStack, ResponsiveGrid } from "@/components/ui/responsive-helpers"

import type { PurchaseRequisition, PurchaseRequisitionItem } from "@/lib/sap-procurement-types"

// Validation Schema based on SAP MM standards
const purchaseRequisitionSchema = z.object({
  headerInfo: z.object({
    description: z.string().min(1, "Description is required").max(40, "Maximum 40 characters"),
    requiredDate: z.date().min(new Date(), "Required date must be in the future"),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    requestedBy: z.string().min(1, "Requested by is required"),
    department: z.string().min(1, "Department is required"),
    costCenter: z.string().min(1, "Cost center is required"),
    plant: z.string().min(1, "Plant is required"),
    purchasingGroup: z.string().optional(),
    supplierProposed: z.string().optional(),
    quotationDeadline: z.date().optional(),
    headerNotes: z.string().max(1000, "Maximum 1000 characters").optional()
  }),
  lineItems: z.array(z.object({
    materialDescription: z.string().min(1, "Material description is required"),
    materialNumber: z.string().optional(),
    materialGroup: z.string().optional(),
    quantity: z.number().positive("Quantity must be positive"),
    unit: z.string().min(1, "Unit is required"),
    estimatedPrice: z.number().positive("Price must be positive").optional(),
    deliveryDate: z.date().min(new Date(), "Delivery date must be in the future"),
    plant: z.string().min(1, "Plant is required"),
    storageLocation: z.string().optional(),
    costCenter: z.string().min(1, "Cost center is required"),
    accountAssignment: z.enum(['COST_CENTER', 'ASSET', 'PROJECT', 'SALES_ORDER']),
    materialType: z.enum(['RAW', 'SEMI_FINISHED', 'FINISHED', 'TRADING', 'SERVICES', 'NON_STOCK']),
    procurementType: z.enum(['EXTERNAL', 'INTERNAL', 'BOTH']),
    desiredVendor: z.string().optional(),
    fixedVendor: z.boolean().default(false),
    partialDeliveryAllowed: z.boolean().default(true),
    technicalSpecs: z.object({
      specifications: z.string().optional(),
      drawingNumber: z.string().optional(),
      version: z.string().optional(),
      qualityRequirements: z.array(z.string()).optional()
    }).optional(),
    itemNotes: z.string().max(500, "Maximum 500 characters").optional()
  })).min(1, "At least one line item is required")
})

type PurchaseRequisitionFormData = z.infer<typeof purchaseRequisitionSchema>

interface PurchaseRequisitionFormProps {
  onSubmit?: (data: PurchaseRequisitionFormData) => Promise<void>
  initialData?: Partial<PurchaseRequisition>
  mode?: 'create' | 'edit'
  plants?: Array<{ id: string; name: string; location: string }>
  departments?: Array<{ id: string; name: string }>
  costCenters?: Array<{ id: string; name: string; department: string }>
  vendors?: Array<{ id: string; name: string; code: string }>
  materialMasters?: Array<{ id: string; number: string; description: string; group: string; unit: string }>
  isLoading?: boolean
}

export function PurchaseRequisitionForm({
  onSubmit = async () => {},
  initialData,
  mode = 'create',
  plants = [],
  departments = [],
  costCenters = [],
  vendors = [],
  materialMasters = [],
  isLoading = false
}: PurchaseRequisitionFormProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0)
  const materialSearchModal = useModal()
  const confirmModal = useModal()

  // Form setup with default values based on SAP standards
  const form = useForm<PurchaseRequisitionFormData>({
    resolver: zodResolver(purchaseRequisitionSchema),
    defaultValues: {
      headerInfo: {
        description: initialData?.headerInfo?.description || "",
        requiredDate: initialData?.headerInfo?.requiredDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
        priority: initialData?.headerInfo?.priority || 'MEDIUM',
        requestedBy: initialData?.headerInfo?.requestedBy || "",
        department: initialData?.headerInfo?.department || "",
        costCenter: initialData?.headerInfo?.costCenter || "",
        plant: initialData?.headerInfo?.plant || "",
        purchasingGroup: initialData?.headerInfo?.purchasingGroup || "",
        supplierProposed: initialData?.headerInfo?.supplierProposed || "",
        quotationDeadline: initialData?.headerInfo?.quotationDeadline || undefined,
        headerNotes: initialData?.headerNotes || ""
      },
      lineItems: initialData?.lineItems || [
        {
          materialDescription: "",
          materialNumber: "",
          materialGroup: "",
          quantity: 1,
          unit: "EA",
          estimatedPrice: 0,
          deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days from now
          plant: "",
          storageLocation: "",
          costCenter: "",
          accountAssignment: 'COST_CENTER' as const,
          materialType: 'RAW' as const,
          procurementType: 'EXTERNAL' as const,
          desiredVendor: "",
          fixedVendor: false,
          partialDeliveryAllowed: true,
          technicalSpecs: {
            specifications: "",
            drawingNumber: "",
            version: "",
            qualityRequirements: []
          },
          itemNotes: ""
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems"
  })

  // Calculate total estimated value
  React.useEffect(() => {
    const lineItems = form.watch("lineItems")
    const total = lineItems.reduce((sum, item) => {
      return sum + ((item.estimatedPrice || 0) * item.quantity)
    }, 0)
    setCalculatedTotal(total)
  }, [form.watch])

  const addLineItem = () => {
    const headerPlant = form.watch("headerInfo.plant")
    const headerCostCenter = form.watch("headerInfo.costCenter")

    append({
      materialDescription: "",
      materialNumber: "",
      materialGroup: "",
      quantity: 1,
      unit: "EA",
      estimatedPrice: 0,
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      plant: headerPlant || "",
      storageLocation: "",
      costCenter: headerCostCenter || "",
      accountAssignment: 'COST_CENTER' as const,
      materialType: 'RAW' as const,
      procurementType: 'EXTERNAL' as const,
      desiredVendor: "",
      fixedVendor: false,
      partialDeliveryAllowed: true,
      technicalSpecs: {
        specifications: "",
        drawingNumber: "",
        version: "",
        qualityRequirements: []
      },
      itemNotes: ""
    })
  }

  const selectMaterial = (materialId: string, lineItemIndex: number) => {
    const material = materialMasters.find(m => m.id === materialId)
    if (material) {
      form.setValue(`lineItems.${lineItemIndex}.materialNumber`, material.number)
      form.setValue(`lineItems.${lineItemIndex}.materialDescription`, material.description)
      form.setValue(`lineItems.${lineItemIndex}.materialGroup`, material.group)
      form.setValue(`lineItems.${lineItemIndex}.unit`, material.unit)
    }
    materialSearchModal.close()
  }

  const handleSubmit = async (data: PurchaseRequisitionFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting purchase requisition:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'destructive'
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'default'
      case 'LOW': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Purchase Requisition - Header Information
                </CardTitle>
                <CardDescription>
                  Basic information and requirements for the purchase requisition
                </CardDescription>
              </div>
              {mode === 'edit' && (
                <Badge variant="outline">
                  PR: {initialData?.prNumber}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
              <FormField
                control={form.control}
                name="headerInfo.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>PR Description *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of the purchase requisition"
                        {...field}
                        maxLength={40}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headerInfo.priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Low</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="MEDIUM">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Medium</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="HIGH">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">High</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="URGENT">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Urgent</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headerInfo.requiredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headerInfo.requestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested By *</FormLabel>
                    <FormControl>
                      <Input placeholder="Employee name or ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headerInfo.department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments?.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
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
                name="headerInfo.costCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Center *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cost center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {costCenters?.map((cc) => (
                          <SelectItem key={cc.id} value={cc.id}>
                            {cc.name} ({cc.id})
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
                name="headerInfo.plant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plants?.map((plant) => (
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
                name="headerInfo.purchasingGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchasing Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purchasing group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="001">001 - General Procurement</SelectItem>
                        <SelectItem value="002">002 - LPG & Gas Procurement</SelectItem>
                        <SelectItem value="003">003 - Equipment & Machinery</SelectItem>
                        <SelectItem value="004">004 - Services & Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headerInfo.supplierProposed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposed Supplier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendors?.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name} ({vendor.code})
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
                name="headerInfo.quotationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveGrid>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="headerInfo.headerNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional information, special requirements, or notes..."
                        {...field}
                        rows={3}
                        maxLength={1000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Line Items
                </CardTitle>
                <CardDescription>
                  Detailed specifications for each item to be procured
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Estimated Total: </span>
                  <span className="text-lg font-bold text-primary">
                    ₦{calculatedTotal.toLocaleString()}
                  </span>
                </div>
                <Button type="button" onClick={addLineItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Item {index + 1}
                      </CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="delivery">Delivery & Plant</TabsTrigger>
                        <TabsTrigger value="specifications">Specifications</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4 mt-4">
                        <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                          {/* Material Search */}
                          <div className="md:col-span-3">
                            <FormLabel>Material Selection</FormLabel>
                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`lineItems.${index}.materialNumber`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder="Material number"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedMaterial(`${index}`)
                                  materialSearchModal.open()
                                }}
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.materialDescription`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Material Description *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Description of material or service"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.materialGroup`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Material Group</FormLabel>
                                <FormControl>
                                  <Input placeholder="Material group" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity *</FormLabel>
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
                            name={`lineItems.${index}.unit`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="EA">Each (EA)</SelectItem>
                                    <SelectItem value="KG">Kilogram (KG)</SelectItem>
                                    <SelectItem value="MT">Metric Ton (MT)</SelectItem>
                                    <SelectItem value="L">Liter (L)</SelectItem>
                                    <SelectItem value="M">Meter (M)</SelectItem>
                                    <SelectItem value="M2">Square Meter (M²)</SelectItem>
                                    <SelectItem value="M3">Cubic Meter (M³)</SelectItem>
                                    <SelectItem value="HR">Hour (HR)</SelectItem>
                                    <SelectItem value="SET">Set (SET)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.estimatedPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimated Price (₦)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
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
                            name={`lineItems.${index}.materialType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Material Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="RAW">Raw Material</SelectItem>
                                    <SelectItem value="SEMI_FINISHED">Semi-Finished</SelectItem>
                                    <SelectItem value="FINISHED">Finished Goods</SelectItem>
                                    <SelectItem value="TRADING">Trading Goods</SelectItem>
                                    <SelectItem value="SERVICES">Services</SelectItem>
                                    <SelectItem value="NON_STOCK">Non-Stock Items</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.procurementType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Procurement Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="EXTERNAL">External</SelectItem>
                                    <SelectItem value="INTERNAL">Internal</SelectItem>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </ResponsiveGrid>
                      </TabsContent>

                      <TabsContent value="delivery" className="space-y-4 mt-4">
                        <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.deliveryDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Date *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.plant`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plant *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select plant" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {plants?.map((plant) => (
                                      <SelectItem key={plant.id} value={plant.id}>
                                        {plant.name}
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
                            name={`lineItems.${index}.storageLocation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Storage Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Storage location code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.costCenter`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost Center *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select cost center" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {costCenters?.map((cc) => (
                                      <SelectItem key={cc.id} value={cc.id}>
                                        {cc.name}
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
                            name={`lineItems.${index}.accountAssignment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Assignment *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="COST_CENTER">Cost Center</SelectItem>
                                    <SelectItem value="ASSET">Asset</SelectItem>
                                    <SelectItem value="PROJECT">Project</SelectItem>
                                    <SelectItem value="SALES_ORDER">Sales Order</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.desiredVendor`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desired Vendor</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select preferred vendor" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {vendors?.map((vendor) => (
                                      <SelectItem key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </ResponsiveGrid>
                      </TabsContent>

                      <TabsContent value="specifications" className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.technicalSpecs.specifications`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Technical Specifications</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Detailed technical specifications, quality requirements, standards..."
                                  {...field}
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <ResponsiveGrid cols={{ base: 1, md: 2 }} gap={4}>
                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.technicalSpecs.drawingNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Drawing Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Technical drawing reference" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.technicalSpecs.version`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl>
                                  <Input placeholder="Drawing/specification version" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </ResponsiveGrid>

                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.itemNotes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Additional notes for this line item..."
                                  {...field}
                                  rows={3}
                                  maxLength={500}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Items: </span>
                  {fields.length}
                </div>
                <div className="text-lg font-semibold">
                  <span className="text-muted-foreground">Total Estimated Value: </span>
                  <span className="text-primary">₦{calculatedTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : mode === 'create' ? "Create PR" : "Update PR"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material Search Modal */}
        <FormModal
          open={materialSearchModal.isOpen}
          onOpenChange={materialSearchModal.setIsOpen}
          title="Search Materials"
          description="Select a material from the master data"
          size="lg"
          showFooter={false}
        >
          <AdvancedDataTable
            columns={[
              createSortableColumn('number', 'Material Number'),
              createSortableColumn('description', 'Description'),
              createSortableColumn('group', 'Group'),
              createSortableColumn('unit', 'Unit'),
              createActionsColumn((row: any) => (
                <Button
                  size="sm"
                  onClick={() => selectMaterial(row.id, parseInt(selectedMaterial))}
                >
                  Select
                </Button>
              ))
            ]}
            data={materialMasters}
            title="Material Master Data"
            searchPlaceholder="Search materials..."
          />
        </FormModal>
      </form>
    </Form>
  )
}

export default PurchaseRequisitionForm