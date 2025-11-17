// Core types for Butane Energy ERP

export type UserRole =
  | 'super_admin'
  | 'plant_manager'
  | 'department_head'
  | 'senior_staff'
  | 'staff'
  | 'trainee'
  | 'external_contractor';

export type Permission =
  // General permissions
  | 'view_dashboard'
  | 'manage_users'
  | 'system_settings'
  | 'manage_admin_operations'

  // Sales & Marketing
  | 'create_orders'
  | 'view_orders'
  | 'edit_orders'
  | 'approve_orders'
  | 'manage_customers'
  | 'view_sales_reports'

  // TDU (Technical Delivery Unit)
  | 'manage_tdu_operations'
  | 'manage_tdu_orders'
  | 'view_tdu_revenue'
  | 'manage_tdu_logistics'
  | 'view_customer_dashboard'
  | 'generate_tdu_reports'

  // Finance
  | 'view_financial_reports'
  | 'process_payments'
  | 'approve_budgets'
  | 'manage_budgets'
  | 'view_cost_analysis'

  // Procurement
  | 'create_purchase_requests'
  | 'manage_vendors'
  | 'approve_procurements'
  | 'manage_tenders'
  | 'evaluate_bids'

  // Project Management
  | 'create_projects'
  | 'manage_project_budgets'
  | 'approve_project_budgets'
  | 'manage_contractors'
  | 'approve_variations'

  // Management/Executive
  | 'executive_dashboard'
  | 'approve_major_decisions'
  | 'view_all_reports'
  | 'strategic_planning'

  // HR & Payroll
  | 'manage_employees'
  | 'process_payroll'
  | 'view_hr_reports'

  // Legal
  | 'manage_contracts'
  | 'legal_review'
  | 'compliance_monitoring'

  // Trading
  | 'manage_trading_operations'
  | 'view_trading_reports'
  | 'approve_trades'
  | 'manage_commodity_prices'
  | 'view_market_data'

  // Logistics
  | 'manage_logistics'
  | 'manage_fleet'
  | 'schedule_deliveries'
  | 'track_shipments'
  | 'manage_transportation'
  | 'manage_product_purchase'
  | 'manage_fuel'
  | 'manage_trips'
  | 'manage_vehicle_maintenance'
  | 'manage_logistics_stock'
  | 'view_logistics_reports'

  // Admin
  | 'manage_office_operations'
  | 'handle_correspondence'
  | 'manage_documents'
  | 'coordinate_meetings'

  // Global Requests
  | 'create_item_requests'
  | 'create_memos'
  | 'request_leave'
  | 'submit_timesheets'
  | 'request_maintenance'
  | 'manage_plants'

  // IT
  | 'system_administration'
  | 'user_management'
  | 'backup_management';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: Department;
  role: UserRole;
  permissions: Permission[];
  plantAccess: string[]; // Plant IDs this user can access
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'under-construction' | 'planned';
  capacity: number; // in MT
  currentStock: number;
  manager?: string;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'lpg' | 'cylinder' | 'accessory';
  sku: string;
  description: string;
  unit: string;
  price: number;
  stockLevel: number;
  reorderLevel: number;
  plantId: string;
}

export interface Cylinder extends Product {
  size: '12.5kg' | '6.25kg';
  condition: 'new' | 'good' | 'needs-inspection' | 'retired';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'retail' | 'wholesale' | 'distributor';
  creditLimit?: number;
  outstandingBalance: number;
  plantId: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  plantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'transfer' | 'credit';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  plantId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  reference: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  salesByPlant: {
    plantId: string;
    plantName: string;
    revenue: number;
  }[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  inventoryValue: number;
  lowStockItems: number;
  pendingOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

// NEW TYPES FOR TRADING & LOGISTICS MODULE
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  rating: number;
  createdAt: string;
}

export interface ProcurementRequest {
  id: string;
  requestNumber: string;
  plantId: string;
  requestedBy: string;
  productType: 'lpg-bulk';
  quantity: number;
  expectedDeliveryDate: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'sourcing' | 'ordered' | 'delivered';
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface ProcurementOrder {
  id: string;
  orderNumber: string;
  procurementRequestId: string;
  supplierId: string;
  supplierName: string;
  plantId: string;
  productType: 'lpg-bulk';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
  deliveredAt?: string;
}

export interface Truck {
  id: string;
  plateNumber: string;
  type: 'offtake' | 'delivery' | 'bobtail';
  capacity: number; // in MT for offtake trucks, in liters for bobtail
  driver: string;
  driverPhone: string;
  status: 'available' | 'in-transit' | 'loading' | 'maintenance';
  currentLocation?: string;
  assignedPlantId?: string;
}

export interface Waybill {
  id: string;
  waybillNumber: string;
  truckId: string;
  truckPlateNumber: string;
  driverName: string;
  sourceLocation: string;
  destinationPlantId: string;
  productType: 'lpg-bulk';
  quantity: number;
  loadingDate: string;
  expectedDeliveryDate: string;
  status: 'sealed' | 'in-transit' | 'delivered' | 'discrepancy';
  sealNumber: string;
  issuedBy: string;
  receivedBy?: string;
  actualQuantityDelivered?: number;
  shortage?: number;
  overage?: number;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
}

export interface TruckDispatch {
  id: string;
  dispatchNumber: string;
  truckId: string;
  type: 'offtake' | 'delivery';
  sourceLocation: string;
  destinationLocation: string;
  plantId: string;
  dispatchedBy: string;
  scheduledDate: string;
  actualDepartureTime?: string;
  estimatedArrival: string;
  actualArrivalTime?: string;
  status: 'scheduled' | 'dispatched' | 'in-transit' | 'arrived' | 'completed';
  waybillId?: string;
  notes?: string;
  createdAt: string;
}

export interface BobtailDelivery {
  id: string;
  deliveryNumber: string;
  truckId: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  productType: 'lpg-bulk';
  quantity: number;
  scheduledDate: string;
  dispatchedBy: string;
  status: 'scheduled' | 'dispatched' | 'delivered' | 'confirmed';
  deliveredAt?: string;
  confirmedBy?: string;
  customerSignature?: string;
  notes?: string;
  createdAt: string;
}

// NEW TYPES FOR FINANCE MODULE
export interface PaymentRequest {
  id: string;
  requestNumber: string;
  requestingDepartment: string;
  type: 'payroll' | 'leave-allowance' | 'loan' | 'travel' | 'supplier' | 'expense';
  amount: number;
  beneficiary: string;
  description: string;
  approvalRequired: boolean;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentMethod?: 'transfer' | 'cheque' | 'cash';
  requestedBy: string;
  createdAt: string;
  processedAt?: string;
}

export interface ImprestRequest {
  id: string;
  requestNumber: string;
  type: 'internal' | 'external';
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  purpose: string;
  expectedRepaymentDate: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'disbursed' | 'repaid' | 'overdue';
  disbursedAt?: string;
  repaidAt?: string;
  createdAt: string;
}

export interface AccountEntry {
  id: string;
  accountCode: string;
  accountName: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debitAmount?: number;
  creditAmount?: number;
  balance: number;
  lastUpdated: string;
}

export interface FinancialReport {
  id: string;
  type: 'profit-loss' | 'balance-sheet' | 'trial-balance' | 'cashflow';
  period: string;
  generatedAt: string;
  data: any; // Flexible structure for different report types
}

// NEW TYPES FOR HR MODULE
export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  plantId?: string;
  supervisor?: string;
  dateOfEmployment: string;
  salary: number;
  status: 'active' | 'suspended' | 'terminated';
  avatar?: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  supervisorId: string;
  status: 'pending' | 'supervisor-approved' | 'hr-approved' | 'rejected' | 'cancelled';
  hrApprovedBy?: string;
  allowanceAmount?: number;
  allowancePaid?: boolean;
  createdAt: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // YYYY-MM format
  basicSalary: number;
  allowances: number;
  overtime: number;
  grossPay: number;
  taxDeduction: number;
  pensionDeduction: number;
  otherDeductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  approvedBy?: string;
  paidAt?: string;
  createdAt: string;
}

export interface LoanRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  monthlyDeduction: number;
  supervisorId: string;
  status: 'pending' | 'supervisor-approved' | 'hr-approved' | 'disbursed' | 'rejected';
  eligibilityChecked?: boolean;
  hrApprovedBy?: string;
  disbursedAt?: string;
  createdAt: string;
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  allowanceType: 'local' | 'domestic' | 'international';
  supervisorId: string;
  status: 'pending' | 'supervisor-approved' | 'hr-processed' | 'finance-paid' | 'rejected';
  allowanceAmount?: number;
  hrProcessedBy?: string;
  createdAt: string;
}

export interface PerformanceAppraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  supervisorId: string;
  kpis: KPIScore[];
  supervisorRating: number;
  supervisorComments: string;
  employeeSelfRating?: number;
  employeeComments?: string;
  hrReview?: string;
  status: 'pending' | 'employee-submitted' | 'supervisor-rated' | 'hr-reviewed' | 'completed';
  meetingScheduled?: boolean;
  meetingDate?: string;
  finalRating?: number;
  recommendations?: string;
  createdAt: string;
}

export interface KPIScore {
  kpiName: string;
  description: string;
  targetValue: number;
  actualValue: number;
  score: number; // 1-5 scale
  weight: number; // percentage weight in overall score
}

// WORKFLOW ENGINE TYPES - Based on Operational Process Diagrams

export type Department = 'procurement' | 'admin' | 'tdu' | 'finance' | 'hr' | 'sales' | 'trading' | 'logistics';
export type ProcessType = 'inbound-operation' | 'procurement' | 'project-management' | 'sales-order' | 'leave-request' | 'loan-request' | 'travel-request' | 'payroll' | 'imprest';

export interface WorkflowStep {
  id: string;
  name: string;
  department: Department;
  description: string;
  requiredRole: string;
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  isDecisionPoint: boolean;
  nextSteps: WorkflowTransition[];
  timeLimit?: number; // in hours
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface WorkflowAction {
  type: 'notify' | 'update_field' | 'create_document' | 'send_email' | 'schedule_task';
  target: string;
  value?: any;
}

export interface WorkflowTransition {
  condition: string; // e.g., "approved", "rejected", "yes", "no"
  nextStepId: string;
  label: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  processType: ProcessType;
  version: string;
  isActive: boolean;
  startStepId: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessInstance {
  id: string;
  processType: ProcessType;
  workflowDefinitionId: string;
  referenceId: string; // ID of the related entity (order, request, etc.)
  currentStepId: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  initiatedBy: string;
  assignedTo?: string;
  data: Record<string, any>; // Process-specific data
  history: ProcessHistoryEntry[];
  notifications: ProcessNotification[];
  documents: ProcessDocument[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface ProcessHistoryEntry {
  id: string;
  stepId: string;
  stepName: string;
  action: 'started' | 'completed' | 'approved' | 'rejected' | 'investigated' | 'escalated';
  performedBy: string;
  performedAt: string;
  comments?: string;
  attachments?: string[];
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
}

export interface ProcessNotification {
  id: string;
  type: 'pending_approval' | 'investigation_required' | 'deadline_approaching' | 'process_completed' | 'process_failed';
  recipientId: string;
  recipientRole: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ProcessDocument {
  id: string;
  name: string;
  type: 'waybill' | 'delivery_note' | 'invoice' | 'contract' | 'approval_form' | 'report';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  mimeType: string;
}

// INBOUND OPERATIONS PROCESS - Based on Page 1 of Operational Diagrams

export interface InboundOperation {
  id: string;
  operationNumber: string;
  processInstanceId: string;
  plantId: string;
  requestedBy: string;
  productType: 'lpg-bulk';
  requestedQuantity: number;
  status: 'product_requested' | 'product_available' | 'truck_requested' | 'truck_nominated' | 'dispatched' | 'loaded' | 'sealed' | 'in_transit' | 'arrived' | 'quality_check' | 'offloaded' | 'completed' | 'investigating';

  // Trading Department Data
  truckId?: string;
  truckNominated?: boolean;
  truckAvailable?: boolean;

  // Logistics Department Data
  vehicleLoaded?: boolean;
  sealNumber?: string;
  waybillIssued?: boolean;
  dispatchTime?: string;

  // Operations Department Data
  arrivalTime?: string;
  sealConfirmed?: boolean;
  weightGaugeConfirmed?: boolean;
  qualityCheckPassed?: boolean;
  offloadQuantity?: number;
  shortage?: number;
  overage?: number;

  // Investigation Data
  investigationRequired?: boolean;
  investigationReason?: string;
  investigationStatus?: 'pending' | 'ongoing' | 'resolved';
  productRecoverable?: boolean;

  // Finance Integration
  deliveryQuantityPosted?: boolean;
  inventoryAdjusted?: boolean;

  createdAt: string;
  completedAt?: string;
}

// PROJECT MANAGEMENT PROCESS - Based on Page 2 of Operational Diagrams

export interface ProjectProcess {
  id: string;
  projectNumber: string;
  processInstanceId: string;
  name: string;
  description: string;
  status: 'initiated' | 'workflow_defined' | 'stakeholder_meeting' | 'budget_developed' | 'budget_approved' | 'tender_opened' | 'contractor_selected' | 'payment_scheduled' | 'in_progress' | 'variation_requested' | 'completed';

  // Project Definition
  workflowDefined?: boolean;
  stakeholderMeetingHeld?: boolean;

  // Budget Management
  estimatedBudget?: number;
  approvedBudget?: number;
  budgetVariation?: number;
  budgetApprovedBy?: string;

  // Tender Management
  tenderOpened?: boolean;
  tenderSuccessful?: boolean;
  selectedContractorId?: string;
  isExistingContractor?: boolean;
  contractAgreementRequired?: boolean;

  // Payment Management
  paymentSchedule?: ProjectPaymentSchedule[];
  paymentScheduleApproved?: boolean;

  // Variation Management
  scopeVariations?: ProjectVariation[];

  createdAt: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
}

export interface ProjectPaymentSchedule {
  milestone: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'approved' | 'paid';
}

export interface ProjectVariation {
  id: string;
  description: string;
  budgetImpact: number;
  approved: boolean;
  approvedBy?: string;
  createdAt: string;
}

// PROCUREMENT PROCESS - Based on Page 3 of Operational Diagrams

export interface ProcurementProcess {
  id: string;
  procurementNumber: string;
  processInstanceId: string;
  requestingDepartment: Department;
  itemName: string;
  description: string;
  status: 'initiated' | 'timeline_defined' | 'approval_requested' | 'budget_developed' | 'quotes_requested' | 'vendor_selected' | 'quote_approved' | 'payment_processed' | 'supply_received' | 'completed' | 'investigating';

  // Timeline Management
  timelineDefined?: boolean;
  requestApproved?: boolean;

  // Budget & Quotation
  estimatedBudget?: number;
  quotesReceived?: ProcurementQuote[];
  selectedVendorId?: string;
  selectedQuoteAmount?: number;
  quoteApproved?: boolean;

  // Payment Management
  paymentScheduleRequired?: boolean;
  paymentSchedule?: ProcurementPaymentSchedule[];
  paymentProcessed?: boolean;

  // Supply Management
  supplyReceived?: boolean;
  supplyQualityOk?: boolean;
  supplyRecoverable?: boolean;
  deliveryNote?: string;

  // Investigation
  investigationRequired?: boolean;
  investigationReason?: string;

  createdAt: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
}

export interface ProcurementQuote {
  vendorId: string;
  vendorName: string;
  quotedAmount: number;
  deliveryTime: string;
  terms: string;
  receivedAt: string;
}

export interface ProcurementPaymentSchedule {
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'approved' | 'paid';
}

// QUALITY CONTROL & INVESTIGATION TYPES

export interface QualityCheck {
  id: string;
  type: 'seal_verification' | 'weight_verification' | 'gauge_verification' | 'product_quality' | 'supply_quality';
  referenceId: string; // ID of related process
  performedBy: string;
  result: 'passed' | 'failed' | 'inconclusive';
  findings: string;
  actionRequired?: 'investigate' | 'reject' | 'accept_with_notes' | 'escalate';
  performedAt: string;
}

export interface Investigation {
  id: string;
  referenceType: 'inbound_operation' | 'procurement' | 'quality_check';
  referenceId: string;
  type: 'shortage' | 'overage' | 'quality_issue' | 'seal_discrepancy' | 'weight_discrepancy';
  reason: string;
  findings?: string;
  resolution?: string;
  status: 'pending' | 'ongoing' | 'resolved' | 'escalated';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
}