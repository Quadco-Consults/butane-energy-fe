/**
 * SAP MM-Inspired Procurement Types for Butane Energy ERP
 * Based on SAP Materials Management best practices
 */

// ==================== VENDOR MANAGEMENT ====================

export interface VendorMaster {
  id: string
  vendorCode: string
  name: string
  searchTerm: string

  // General Data
  generalInfo: {
    title: string
    name1: string
    name2?: string
    name3?: string
    searchTerm1: string
    searchTerm2?: string
    street: string
    postalCode: string
    city: string
    country: string
    region?: string
    language: string
    telephone?: string
    mobile?: string
    email?: string
    website?: string
    taxNumber?: string
    vatRegistration?: string
  }

  // Purchasing Data
  purchasingData: {
    purchaseOrderCurrency: string
    paymentTerms: string
    incoterms?: string
    minimumOrderValue?: number
    orderOptimization: boolean
    automaticEvaluatedReceiptSettlement: boolean
    returnsVendor?: string
    deliveryCompletionRule: 'COMPLETE' | 'PARTIAL'
    underDeliveryTolerance: number
    overDeliveryTolerance: number
    unlimitedOverDelivery: boolean
    underDeliveryToleranceLimit?: number
    priceDate: 'GOODS_RECEIPT' | 'ORDER_DATE' | 'DELIVERY_DATE'
    groupingCriterion?: string
    subjectToEqualization?: boolean
    modeOfTransport?: string
    customsOffice?: string
  }

  // Accounting Data
  accountingData: {
    reconAccount: string // Reconciliation Account
    headOfficeAccount?: string
    alternativeReconciliationAccount?: string
    interestCalculation?: boolean
    interestFrequency?: number
    lastKeyDate?: Date
    interestRunDate?: Date
    paymentMethods: string[]
    paymentBlockReasons?: string[]
    houseBank?: string
    individualPayment?: boolean
    paymentAdvicesByEDI?: boolean
    releaseApprovalGroup?: string
    clerkAtVendor?: string
    accountingClerk: string
    planningGroup?: string
    sortKey?: string
    subsquentDebitCreditAccount?: string
    personnelNumber?: string
    deletionBlock?: boolean
    postingBlock?: boolean
  }

  // Classification
  vendorAccountGroup: 'DOMESTIC' | 'FOREIGN' | 'ONE_TIME' | 'EMPLOYEE'
  vendorClass: 'A' | 'B' | 'C' // ABC Classification

  // Status
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED'
  centralBlockingReasons?: string[]
  purchasingBlockingReasons?: string[]

  // Audit
  createdBy: string
  createdAt: Date
  modifiedBy?: string
  modifiedAt?: Date
  plantAccess: string[] // Plants this vendor can supply to
}

// ==================== PURCHASE REQUISITION ====================

export interface PurchaseRequisition {
  id: string
  prNumber: string
  documentType: 'NB' | 'UB' | 'CB' // Normal, Stock Transfer, Consignment

  // Header Data
  headerInfo: {
    description: string
    requisitionDate: Date
    requiredDate: Date
    processingStatus: 'OPEN' | 'RELEASED' | 'ORDERED' | 'COMPLETED' | 'REJECTED'
    releaseStatus: 'NOT_RELEASED' | 'RELEASED' | 'REJECTED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    trackingNumber?: string
    createdBy: string
    requestedBy: string
    department: string
    costCenter: string
    plant: string
    purchasingGroup?: string
    supplierProposed?: string
    quotationDeadline?: Date
    totalValue: number
    currency: string
  }

  // Line Items
  lineItems: PurchaseRequisitionItem[]

  // Approval Workflow
  approvalHistory: ApprovalStep[]
  currentApprover?: string

  // Notes
  headerNotes?: string

  // Source Information
  sourceDocument?: {
    type: 'MRP' | 'MANUAL' | 'MASTER_AGREEMENT' | 'BLANKET_ORDER'
    documentNumber?: string
    documentItem?: string
  }

  // Audit
  createdAt: Date
  modifiedAt?: Date
  modifiedBy?: string
}

export interface PurchaseRequisitionItem {
  itemNumber: string
  materialNumber?: string
  materialDescription: string
  materialGroup?: string
  quantity: number
  unit: string
  estimatedPrice?: number
  totalValue: number
  deliveryDate: Date
  plant: string
  storageLocation?: string
  costCenter?: string
  accountAssignment: 'COST_CENTER' | 'ASSET' | 'PROJECT' | 'SALES_ORDER'

  // Material Classification
  materialType: 'RAW' | 'SEMI_FINISHED' | 'FINISHED' | 'TRADING' | 'SERVICES' | 'NON_STOCK'
  procurementType: 'EXTERNAL' | 'INTERNAL' | 'BOTH'

  // Vendor Information
  desiredVendor?: string
  fixedVendor?: boolean
  quotationDeadline?: Date

  // Source Information
  sourceInfo?: {
    sourceType: 'INFO_RECORD' | 'CONTRACT' | 'SCHEDULING_AGREEMENT' | 'QUOTATION'
    sourceDocument?: string
    sourceItem?: string
  }

  // Technical Specifications
  technicalSpecs?: {
    specifications: string
    drawingNumber?: string
    version?: string
    qualityRequirements?: string[]
  }

  // Delivery
  deliveryAddress?: string
  partialDeliveryAllowed: boolean

  // Item Notes
  itemNotes?: string

  // Status
  itemStatus: 'OPEN' | 'RELEASED' | 'ORDERED' | 'DELIVERED' | 'CANCELLED'

  // Linked Documents
  purchaseOrderNumber?: string
  purchaseOrderItem?: string
  goodsReceiptNumber?: string[]
}

// ==================== PURCHASE ORDER ====================

export interface PurchaseOrder {
  id: string
  poNumber: string
  documentType: 'STANDARD' | 'FRAMEWORK' | 'BLANKET' | 'CONTRACT' | 'SCHEDULING'

  // Header Data
  headerInfo: {
    description: string
    vendor: string
    vendorName: string
    orderDate: Date
    validityStart?: Date
    validityEnd?: Date
    currency: string
    exchangeRate?: number
    paymentTerms: string
    incoterms?: string
    deliveryDate: Date
    purchasingGroup: string
    purchasingOrganization: string
    companyCode: string
    documentStatus: 'OPEN' | 'RELEASED' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED'
    releaseStatus: 'NOT_RELEASED' | 'RELEASED' | 'REJECTED'
    totalNetValue: number
    totalTaxAmount: number
    totalGrossValue: number

    // Delivery Information
    deliveryAddress: string
    shippingInstructions?: string
    transportationMode?: string
    trackingNumber?: string

    // Terms & Conditions
    termsOfPayment: string
    termsOfDelivery: string
    warrantyPeriod?: number
    retentionPercentage?: number

    // Approval
    approvalRequired: boolean
    releaseCode?: string
    releaseStrategy?: string

    // Communication
    printDate?: Date
    transmissionDate?: Date
    confirmationRequired: boolean
    acknowledgmentReceived?: Date

    // Risk Management
    creditCheckStatus?: 'PASSED' | 'FAILED' | 'NOT_REQUIRED'
    budgetCheckStatus?: 'PASSED' | 'FAILED' | 'NOT_REQUIRED'
  }

  // Line Items
  lineItems: PurchaseOrderItem[]

  // Approval Workflow
  approvalHistory: ApprovalStep[]

  // Conditions (Pricing)
  conditions: PurchaseOrderCondition[]

  // Delivery Schedule
  deliverySchedule?: DeliveryScheduleItem[]

  // Partner Functions
  partners: {
    orderingParty: string
    vendor: string
    invoicingParty?: string
    payee?: string
    goodsSupplier?: string
    deliveryAddress?: string
  }

  // Notes
  headerNotes?: string

  // Source Documents
  sourceDocuments: {
    purchaseRequisitions?: string[]
    quotations?: string[]
    contracts?: string[]
  }

  // Follow-up Documents
  followUpDocuments: {
    goodsReceipts?: string[]
    invoiceReceipts?: string[]
    serviceEntries?: string[]
  }

  // Audit
  createdBy: string
  createdAt: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export interface PurchaseOrderItem {
  itemNumber: string

  // Material Information
  materialNumber?: string
  materialDescription: string
  materialGroup?: string
  materialType: 'STOCK' | 'NON_STOCK' | 'SERVICE'

  // Quantity & Pricing
  orderQuantity: number
  orderUnit: string
  netPrice: number
  priceUnit: number
  netValue: number
  taxCode?: string
  taxAmount?: number
  grossValue: number

  // Delivery
  deliveryDate: Date
  plant: string
  storageLocation?: string
  deliveryAddress?: string
  partialDeliveryAllowed: boolean
  unlimitedOverdelivery: boolean
  underdeliveryTolerance: number
  overdeliveryTolerance: number

  // Account Assignment
  accountAssignmentCategory: 'COST_CENTER' | 'ASSET' | 'PROJECT' | 'SALES_ORDER' | 'NETWORK'
  costCenter?: string
  generalLedgerAccount?: string
  asset?: string
  project?: string
  profitCenter?: string

  // Quality Management
  qualityInspectionRequired: boolean
  certificateType?: string
  vendorDeclarationRequired: boolean

  // Inventory Management
  movementType?: string
  specialStock?: string
  stockSegment?: string

  // Source Information
  sourceOfSupply?: {
    sourceType: 'QUOTATION' | 'CONTRACT' | 'INFO_RECORD' | 'SCHEDULING_AGREEMENT'
    sourceDocument?: string
    sourceItem?: string
  }

  // Goods Receipt Information
  goodsReceiptNonValuated: boolean
  invoiceReceiptNonValuated: boolean

  // Status Tracking
  deliveryStatus: 'OPEN' | 'PARTIAL' | 'COMPLETE'
  invoiceStatus: 'OPEN' | 'PARTIAL' | 'COMPLETE'

  // Item Notes
  itemNotes?: string

  // Follow-up Actions
  goodsReceiptItems?: GoodsReceiptItem[]
  invoiceItems?: InvoiceVerificationItem[]
}

// ==================== OUTLINE AGREEMENTS ====================

export interface Contract {
  id: string
  contractNumber: string
  contractType: 'VALUE_CONTRACT' | 'QUANTITY_CONTRACT' | 'BLANKET_ORDER'

  // Header Information
  headerInfo: {
    vendor: string
    vendorName: string
    contractDescription: string
    validityStart: Date
    validityEnd: Date
    currency: string
    purchasingGroup: string
    purchasingOrganization: string
    companyCode: string
    paymentTerms: string
    incoterms?: string

    // Contract Limits
    targetValue?: number // For Value Contracts
    targetQuantity?: number // For Quantity Contracts
    targetUnit?: string

    // Release Information
    releasedValue: number
    releasedQuantity: number
    remainingValue: number
    remainingQuantity: number

    // Status
    contractStatus: 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'CANCELLED'
    releaseStrategy?: string
    approvalRequired: boolean
  }

  // Contract Items
  contractItems: ContractItem[]

  // Release Orders (Purchase Orders created against this contract)
  releaseOrders: string[] // PO Numbers

  // Terms & Conditions
  termsAndConditions: string

  // Audit
  createdBy: string
  createdAt: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export interface ContractItem {
  itemNumber: string
  materialNumber?: string
  materialDescription: string
  materialGroup?: string

  // Quantities & Values
  targetQuantity?: number
  targetValue?: number
  unit: string
  netPrice: number
  priceUnit: number

  // Release Tracking
  releasedQuantity: number
  releasedValue: number
  remainingQuantity: number
  remainingValue: number

  // Delivery Information
  plant?: string
  storageLocation?: string
  deliveryTime: number // Lead time in days

  // Account Assignment
  accountAssignmentCategory: string
  costCenter?: string

  // Item Status
  itemStatus: 'ACTIVE' | 'BLOCKED' | 'COMPLETED'
}

export interface SchedulingAgreement {
  id: string
  agreementNumber: string

  // Header Information
  headerInfo: {
    vendor: string
    vendorName: string
    agreementDescription: string
    validityStart: Date
    validityEnd: Date
    currency: string
    purchasingGroup: string
    deliveryType: 'STANDARD' | 'JIT' | 'VENDOR_MANAGED_INVENTORY'

    // Scheduling
    schedulingPeriod: number // Days
    forecastPeriod: number // Days
    scheduleTransmission: 'MANUAL' | 'AUTOMATIC' | 'EDI'
    lastScheduleSent?: Date
    nextScheduleDue?: Date

    // Status
    agreementStatus: 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'CANCELLED'
  }

  // Schedule Lines
  scheduleLines: ScheduleLine[]

  // Delivery Schedule
  deliverySchedule: DeliveryScheduleItem[]
}

export interface ScheduleLine {
  lineNumber: string
  materialNumber: string
  materialDescription: string
  plant: string

  // Scheduling Information
  scheduleQuantity: number
  scheduledDate: Date
  deliveryDate: Date
  unit: string

  // Status
  lineStatus: 'FIRM' | 'TRADE_OFF' | 'FORECAST'
  transmissionStatus: 'NOT_SENT' | 'SENT' | 'CONFIRMED'

  // Goods Receipt
  receivedQuantity: number
  openQuantity: number
}

// ==================== GOODS RECEIPT ====================

export interface GoodsReceipt {
  id: string
  materialDocumentNumber: string
  documentType: 'GOODS_RECEIPT' | 'GOODS_ISSUE' | 'TRANSFER' | 'INVENTORY'

  // Header Information
  headerInfo: {
    postingDate: Date
    documentDate: Date
    plant: string
    storageLocation: string
    deliveryNote?: string
    billOfLading?: string
    receivedBy: string
    verifiedBy?: string

    // Reference Documents
    purchaseOrder?: string
    deliveryNumber?: string
    invoiceReference?: string

    // Movement Information
    movementType: string // SAP Movement Type (101, 102, etc.)
    reasonCode?: string

    // Status
    documentStatus: 'POSTED' | 'CANCELLED' | 'REVERSED'
    cancellationDocument?: string

    // Quality Management
    qualityInspectionRequired: boolean
    inspectionLot?: string
    qualityStatus?: 'PASSED' | 'FAILED' | 'PENDING' | 'NOT_REQUIRED'
  }

  // Line Items
  lineItems: GoodsReceiptItem[]

  // Serial Numbers (for serialized materials)
  serialNumbers?: SerialNumber[]

  // Batch Information
  batchNumbers?: BatchInformation[]

  // Notes
  headerNotes?: string

  // Audit
  postedBy: string
  postedAt: Date
  reversedBy?: string
  reversedAt?: Date
}

export interface GoodsReceiptItem {
  itemNumber: string

  // Material Information
  materialNumber: string
  materialDescription: string
  batch?: string

  // Quantity Information
  deliveredQuantity: number
  receivedQuantity: number
  rejectedQuantity?: number
  unit: string

  // Reference Information
  purchaseOrderNumber?: string
  purchaseOrderItem?: string
  deliveryItem?: string

  // Storage Information
  plant: string
  storageLocation: string
  stockType: 'UNRESTRICTED' | 'QUALITY_INSPECTION' | 'BLOCKED' | 'RESTRICTED'

  // Valuation
  movementType: string
  amountInLocalCurrency?: number
  amountInDocumentCurrency?: number

  // Quality Information
  qualityInspectionRequired: boolean
  inspectionLot?: string
  certificateNumber?: string
  vendorDeclaration?: boolean

  // Special Stock
  specialStock?: string
  vendor?: string
  customer?: string
  salesOrder?: string

  // Item Notes
  itemNotes?: string

  // Variance Information
  quantityVariance: number
  reasonForVariance?: string
}

// ==================== INVOICE VERIFICATION ====================

export interface InvoiceVerification {
  id: string
  invoiceDocumentNumber: string
  documentType: 'VENDOR_INVOICE' | 'CREDIT_MEMO' | 'DEBIT_MEMO'

  // Header Information
  headerInfo: {
    vendor: string
    vendorName: string
    invoiceDate: Date
    postingDate: Date
    documentDate: Date
    invoiceReference: string // Vendor's Invoice Number
    currency: string
    exchangeRate?: number
    paymentTerms: string
    paymentMethod?: string
    dueDate: Date

    // Payment Information
    cashDiscount1Percent?: number
    cashDiscount1Days?: number
    cashDiscount2Percent?: number
    cashDiscount2Days?: number
    netPaymentDays?: number

    // Totals
    invoiceGrossAmount: number
    taxAmount: number
    invoiceNetAmount: number
    discountAmount?: number

    // Reference Documents
    purchaseOrder?: string
    deliveryNote?: string
    goodsReceiptDocument?: string

    // Status
    documentStatus: 'PARKED' | 'POSTED' | 'BLOCKED' | 'CANCELLED'
    paymentStatus: 'OPEN' | 'PARTIAL' | 'PAID'

    // Blocking Information
    paymentBlock?: string
    blockingReason?: string

    // Approval Workflow
    approvalRequired: boolean
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'

    // Three-Way Matching
    matchingStatus: 'MATCHED' | 'VARIANCE' | 'NOT_MATCHED'
    matchingToleranceExceeded: boolean
    varianceAmount?: number
  }

  // Line Items
  lineItems: InvoiceVerificationItem[]

  // Tax Information
  taxItems: InvoiceTaxItem[]

  // Matching Information
  threeWayMatching: ThreeWayMatching

  // Approval History
  approvalHistory: ApprovalStep[]

  // Notes
  headerNotes?: string

  // Audit
  enteredBy: string
  enteredAt: Date
  postedBy?: string
  postedAt?: Date
  verifiedBy?: string
  verifiedAt?: Date
}

export interface InvoiceVerificationItem {
  itemNumber: string

  // Material Information
  materialNumber?: string
  materialDescription: string

  // Quantity & Pricing
  invoicedQuantity: number
  unit: string
  unitPrice: number
  netAmount: number
  taxCode: string
  taxAmount: number
  grossAmount: number

  // Reference Information
  purchaseOrderNumber?: string
  purchaseOrderItem?: string
  goodsReceiptDocument?: string
  goodsReceiptItem?: string

  // Account Assignment
  generalLedgerAccount?: string
  costCenter?: string
  asset?: string
  project?: string

  // Variance Information
  quantityVariance: number
  priceVariance: number
  totalVariance: number
  varianceReason?: string

  // Item Status
  itemStatus: 'MATCHED' | 'VARIANCE' | 'BLOCKED'

  // Item Notes
  itemNotes?: string
}

// ==================== THREE-WAY MATCHING ====================

export interface ThreeWayMatching {
  matchingId: string

  // Document References
  purchaseOrderNumber: string
  goodsReceiptNumber: string
  invoiceNumber: string

  // Matching Results
  overallMatchingStatus: 'MATCHED' | 'VARIANCE_WITHIN_TOLERANCE' | 'VARIANCE_EXCEEDS_TOLERANCE'

  // Line Item Matching
  lineItemMatching: LineItemMatching[]

  // Tolerance Settings
  toleranceSettings: {
    quantityTolerancePercent: number
    priceTolerancePercent: number
    amountTolerancePercent: number
    maximumAmountTolerance: number
  }

  // Matching Summary
  totalVarianceAmount: number
  toleranceExceeded: boolean
  requiresApproval: boolean

  // Audit
  matchedBy: string
  matchedAt: Date
}

export interface LineItemMatching {
  itemNumber: string

  // Quantities
  orderedQuantity: number
  receivedQuantity: number
  invoicedQuantity: number

  // Prices
  orderedPrice: number
  actualPrice: number // From Goods Receipt
  invoicedPrice: number

  // Variances
  quantityVariance: number
  quantityVariancePercent: number
  priceVariance: number
  priceVariancePercent: number
  totalVariance: number
  totalVariancePercent: number

  // Tolerance Check
  quantityWithinTolerance: boolean
  priceWithinTolerance: boolean
  amountWithinTolerance: boolean

  // Status
  matchingStatus: 'MATCHED' | 'VARIANCE_WITHIN_TOLERANCE' | 'VARIANCE_EXCEEDS_TOLERANCE'

  // Variance Explanation
  varianceReasons: string[]
  approvalRequired: boolean
}

// ==================== WORKFLOW & APPROVAL ====================

export interface ApprovalStep {
  stepNumber: number
  approverRole: string
  approverUserId: string
  approverName: string
  approvalAction: 'APPROVE' | 'REJECT' | 'SEND_BACK' | 'DELEGATE'
  approvalDate: Date
  comments?: string
  delegatedTo?: string
  nextApprover?: string
}

// ==================== MASTER DATA ====================

export interface PurchasingInfoRecord {
  id: string
  infoRecordNumber: string

  // Key Information
  vendor: string
  material: string
  purchasingOrganization: string
  plant?: string

  // Conditions
  conditions: InfoRecordCondition[]

  // Purchasing Data
  standardOrderQuantity?: number
  minimumOrderQuantity?: number
  orderUnit: string
  netPrice: number
  priceUnit: number
  validFrom: Date
  validTo?: Date

  // Delivery
  standardDeliveryTime: number // in days
  overdDeliveryTolerance: number
  underDeliveryTolerance: number
  unlimitedOverDelivery: boolean

  // Status
  recordStatus: 'ACTIVE' | 'BLOCKED' | 'DELETED'
  deletionFlag: boolean

  // Audit
  createdBy: string
  createdAt: Date
  modifiedBy?: string
  modifiedAt?: Date
}

export interface InfoRecordCondition {
  conditionType: string // e.g., 'PB00' (Gross Price), 'RB00' (Discount)
  amount: number
  unit: string
  currency: string
  validFrom: Date
  validTo?: Date
  scaleQuantity?: number
  scaleUnit?: string
}

// ==================== SUPPORTING TYPES ====================

export interface PurchaseOrderCondition {
  conditionType: string
  description: string
  amount: number
  currency: string
  unit?: string
  calculationType: 'PERCENTAGE' | 'ABSOLUTE' | 'QUANTITY_BASED'
  stepNumber: number
  baseAmount?: number
}

export interface DeliveryScheduleItem {
  scheduleLineNumber: string
  deliveryDate: Date
  quantity: number
  unit: string
  delivered: boolean
  deliveredQuantity?: number
  deliveryNote?: string
}

export interface SerialNumber {
  serialNumber: string
  materialNumber: string
  plant: string
  storageLocation: string
  status: 'AVAILABLE' | 'IN_USE' | 'BLOCKED'
}

export interface BatchInformation {
  batchNumber: string
  materialNumber: string
  plant: string
  manufacturingDate?: Date
  expirationDate?: Date
  vendorBatch?: string
  availableQuantity: number
  restrictedQuantity?: number
  qualityStatus: 'UNRESTRICTED' | 'QUALITY_INSPECTION' | 'BLOCKED'
}

export interface InvoiceTaxItem {
  taxCode: string
  taxJurisdiction: string
  taxAmount: number
  taxBaseAmount: number
  taxRate: number
  nonDeductibleAmount?: number
}

// ==================== WORKFLOW STATUS ENUMS ====================

export const ProcurementStatus = {
  // Purchase Requisition Status
  PR_CREATED: 'PR_CREATED',
  PR_RELEASED: 'PR_RELEASED',
  PR_ORDERED: 'PR_ORDERED',
  PR_COMPLETED: 'PR_COMPLETED',

  // Purchase Order Status
  PO_CREATED: 'PO_CREATED',
  PO_RELEASED: 'PO_RELEASED',
  PO_CONFIRMED: 'PO_CONFIRMED',
  PO_PARTIALLY_DELIVERED: 'PO_PARTIALLY_DELIVERED',
  PO_FULLY_DELIVERED: 'PO_FULLY_DELIVERED',
  PO_INVOICED: 'PO_INVOICED',
  PO_COMPLETED: 'PO_COMPLETED',

  // Goods Receipt Status
  GR_POSTED: 'GR_POSTED',
  GR_QUALITY_PENDING: 'GR_QUALITY_PENDING',
  GR_QUALITY_APPROVED: 'GR_QUALITY_APPROVED',
  GR_QUALITY_REJECTED: 'GR_QUALITY_REJECTED',

  // Invoice Verification Status
  IV_RECEIVED: 'IV_RECEIVED',
  IV_MATCHED: 'IV_MATCHED',
  IV_VARIANCE: 'IV_VARIANCE',
  IV_APPROVED: 'IV_APPROVED',
  IV_PAID: 'IV_PAID'
} as const

export type ProcurementStatusType = typeof ProcurementStatus[keyof typeof ProcurementStatus]

// ==================== INTEGRATION INTERFACES ====================

export interface ERPIntegration {
  // SAP Document Numbers
  sapDocumentNumbers: {
    purchaseRequisition?: string
    purchaseOrder?: string
    goodsReceipt?: string
    invoiceDocument?: string
    contractNumber?: string
  }

  // Financial Integration
  financialPosting: {
    posted: boolean
    documentNumber?: string
    fiscalYear?: string
    companyCode: string
    postingDate?: Date
  }

  // Inventory Integration
  inventoryMovement: {
    materialDocument?: string
    movementType?: string
    stockUpdated: boolean
    stockType: 'UNRESTRICTED' | 'BLOCKED' | 'QUALITY_INSPECTION'
  }

  // Quality Management Integration
  qualityManagement: {
    inspectionRequired: boolean
    inspectionLot?: string
    qualityDecision?: 'ACCEPTED' | 'REJECTED' | 'PENDING'
    certificateRequired: boolean
    certificateReceived: boolean
  }
}

export default {
  VendorMaster,
  PurchaseRequisition,
  PurchaseOrder,
  Contract,
  SchedulingAgreement,
  GoodsReceipt,
  InvoiceVerification,
  ThreeWayMatching,
  PurchasingInfoRecord,
  ProcurementStatus
}