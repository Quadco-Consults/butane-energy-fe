"use client";

import React, { createContext, useContext, useState } from 'react';
import {
  WorkflowDefinition,
  ProcessInstance,
  ProcessHistoryEntry,
  ProcessNotification,
  ProcessType,
  Department,
  InboundOperation,
  ProjectProcess,
  ProcurementProcess,
  Investigation,
  QualityCheck
} from '@/lib/types';

interface WorkflowContextType {
  // Workflow Definitions
  workflowDefinitions: WorkflowDefinition[];
  getWorkflowByType: (processType: ProcessType) => WorkflowDefinition | undefined;

  // Process Instances
  processInstances: ProcessInstance[];
  getProcessInstance: (id: string) => ProcessInstance | undefined;
  getProcessesByType: (processType: ProcessType) => ProcessInstance[];
  getProcessesByStatus: (status: ProcessInstance['status']) => ProcessInstance[];
  getProcessesByAssignee: (userId: string) => ProcessInstance[];

  // Process Actions
  startProcess: (processType: ProcessType, referenceId: string, initiatedBy: string, data: Record<string, any>) => ProcessInstance;
  advanceProcess: (processId: string, action: string, performedBy: string, comments?: string, data?: Record<string, any>) => void;
  assignProcess: (processId: string, assigneeId: string) => void;

  // Notifications
  notifications: ProcessNotification[];
  getNotificationsForUser: (userId: string) => ProcessNotification[];
  markNotificationRead: (notificationId: string) => void;

  // Business Process Specific
  inboundOperations: InboundOperation[];
  projectProcesses: ProjectProcess[];
  procurementProcesses: ProcurementProcess[];
  investigations: Investigation[];
  qualityChecks: QualityCheck[];

  // Business Process Actions
  createInboundOperation: (data: Partial<InboundOperation>) => InboundOperation;
  updateInboundOperation: (id: string, data: Partial<InboundOperation>) => void;
  createProjectProcess: (data: Partial<ProjectProcess>) => ProjectProcess;
  updateProjectProcess: (id: string, data: Partial<ProjectProcess>) => void;
  createProcurementProcess: (data: Partial<ProcurementProcess>) => ProcurementProcess;
  updateProcurementProcess: (id: string, data: Partial<ProcurementProcess>) => void;
  createInvestigation: (data: Partial<Investigation>) => Investigation;
  updateInvestigation: (id: string, data: Partial<Investigation>) => void;

  // Quality Control
  performQualityCheck: (data: Partial<QualityCheck>) => QualityCheck;

  // Dashboard Data
  getDashboardStats: () => {
    totalActiveProcesses: number;
    pendingApprovals: number;
    investigationsRequired: number;
    completedToday: number;
    overdueTasks: number;
    processesByDepartment: { department: Department; count: number }[];
    processesByType: { type: ProcessType; count: number }[];
  };
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflowDefinitions] = useState<WorkflowDefinition[]>(INITIAL_WORKFLOW_DEFINITIONS);
  const [processInstances, setProcessInstances] = useState<ProcessInstance[]>(MOCK_PROCESS_INSTANCES);
  const [notifications, setNotifications] = useState<ProcessNotification[]>(MOCK_NOTIFICATIONS);
  const [inboundOperations, setInboundOperations] = useState<InboundOperation[]>(MOCK_INBOUND_OPERATIONS);
  const [projectProcesses, setProjectProcesses] = useState<ProjectProcess[]>(MOCK_PROJECT_PROCESSES);
  const [procurementProcesses, setProcurementProcesses] = useState<ProcurementProcess[]>(MOCK_PROCUREMENT_PROCESSES);
  const [investigations, setInvestigations] = useState<Investigation[]>(MOCK_INVESTIGATIONS);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);

  const getWorkflowByType = (processType: ProcessType) => {
    return workflowDefinitions.find(w => w.processType === processType && w.isActive);
  };

  const getProcessInstance = (id: string) => {
    return processInstances.find(p => p.id === id);
  };

  const getProcessesByType = (processType: ProcessType) => {
    return processInstances.filter(p => p.processType === processType);
  };

  const getProcessesByStatus = (status: ProcessInstance['status']) => {
    return processInstances.filter(p => p.status === status);
  };

  const getProcessesByAssignee = (userId: string) => {
    return processInstances.filter(p => p.assignedTo === userId);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const startProcess = (processType: ProcessType, referenceId: string, initiatedBy: string, data: Record<string, any>) => {
    const workflow = getWorkflowByType(processType);
    if (!workflow) {
      throw new Error(`No active workflow found for process type: ${processType}`);
    }

    const newProcess: ProcessInstance = {
      id: generateId(),
      processType,
      workflowDefinitionId: workflow.id,
      referenceId,
      currentStepId: workflow.startStepId,
      status: 'active',
      priority: 'medium',
      initiatedBy,
      data,
      history: [{
        id: generateId(),
        stepId: workflow.startStepId,
        stepName: workflow.steps.find(s => s.id === workflow.startStepId)?.name || 'Start',
        action: 'started',
        performedBy: initiatedBy,
        performedAt: new Date().toISOString(),
        newData: data
      }],
      notifications: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProcessInstances(prev => [...prev, newProcess]);
    return newProcess;
  };

  const advanceProcess = (processId: string, action: string, performedBy: string, comments?: string, data?: Record<string, any>) => {
    setProcessInstances(prev => prev.map(process => {
      if (process.id === processId) {
        const workflow = getWorkflowByType(process.processType);
        const currentStep = workflow?.steps.find(s => s.id === process.currentStepId);
        const nextTransition = currentStep?.nextSteps.find(t => t.condition === action);

        if (!nextTransition) {
          throw new Error(`No valid transition found for action: ${action}`);
        }

        const historyEntry: ProcessHistoryEntry = {
          id: generateId(),
          stepId: process.currentStepId,
          stepName: currentStep?.name || 'Unknown',
          action: action as any,
          performedBy,
          performedAt: new Date().toISOString(),
          comments,
          previousData: { ...process.data },
          newData: data ? { ...process.data, ...data } : process.data
        };

        return {
          ...process,
          currentStepId: nextTransition.nextStepId,
          data: data ? { ...process.data, ...data } : process.data,
          history: [...process.history, historyEntry],
          updatedAt: new Date().toISOString(),
          status: nextTransition.nextStepId === 'completed' ? 'completed' : process.status,
          completedAt: nextTransition.nextStepId === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return process;
    }));
  };

  const assignProcess = (processId: string, assigneeId: string) => {
    setProcessInstances(prev => prev.map(process =>
      process.id === processId
        ? { ...process, assignedTo: assigneeId, updatedAt: new Date().toISOString() }
        : process
    ));
  };

  const getNotificationsForUser = (userId: string) => {
    return notifications.filter(n => n.recipientId === userId);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  // Business Process CRUD Operations
  const createInboundOperation = (data: Partial<InboundOperation>): InboundOperation => {
    const newOperation: InboundOperation = {
      id: generateId(),
      operationNumber: `INB-${Date.now()}`,
      processInstanceId: '',
      plantId: data.plantId || '',
      requestedBy: data.requestedBy || '',
      productType: 'lpg-bulk',
      requestedQuantity: data.requestedQuantity || 0,
      status: 'product_requested',
      createdAt: new Date().toISOString(),
      ...data
    };

    setInboundOperations(prev => [...prev, newOperation]);
    return newOperation;
  };

  const updateInboundOperation = (id: string, data: Partial<InboundOperation>) => {
    setInboundOperations(prev => prev.map(op =>
      op.id === id ? { ...op, ...data } : op
    ));
  };

  const createProjectProcess = (data: Partial<ProjectProcess>): ProjectProcess => {
    const newProject: ProjectProcess = {
      id: generateId(),
      projectNumber: `PRJ-${Date.now()}`,
      processInstanceId: '',
      name: data.name || '',
      description: data.description || '',
      status: 'initiated',
      createdAt: new Date().toISOString(),
      ...data
    };

    setProjectProcesses(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProjectProcess = (id: string, data: Partial<ProjectProcess>) => {
    setProjectProcesses(prev => prev.map(proj =>
      proj.id === id ? { ...proj, ...data } : proj
    ));
  };

  const createProcurementProcess = (data: Partial<ProcurementProcess>): ProcurementProcess => {
    const newProcurement: ProcurementProcess = {
      id: generateId(),
      procurementNumber: `PROC-${Date.now()}`,
      processInstanceId: '',
      requestingDepartment: data.requestingDepartment || 'operations',
      itemName: data.itemName || '',
      description: data.description || '',
      status: 'initiated',
      createdAt: new Date().toISOString(),
      ...data
    };

    setProcurementProcesses(prev => [...prev, newProcurement]);
    return newProcurement;
  };

  const updateProcurementProcess = (id: string, data: Partial<ProcurementProcess>) => {
    setProcurementProcesses(prev => prev.map(proc =>
      proc.id === id ? { ...proc, ...data } : proc
    ));
  };

  const createInvestigation = (data: Partial<Investigation>): Investigation => {
    const newInvestigation: Investigation = {
      id: generateId(),
      referenceType: data.referenceType || 'inbound_operation',
      referenceId: data.referenceId || '',
      type: data.type || 'quality_issue',
      reason: data.reason || '',
      status: 'pending',
      assignedTo: data.assignedTo || '',
      createdBy: data.createdBy || '',
      createdAt: new Date().toISOString(),
      ...data
    };

    setInvestigations(prev => [...prev, newInvestigation]);
    return newInvestigation;
  };

  const updateInvestigation = (id: string, data: Partial<Investigation>) => {
    setInvestigations(prev => prev.map(inv =>
      inv.id === id ? { ...inv, ...data } : inv
    ));
  };

  const performQualityCheck = (data: Partial<QualityCheck>): QualityCheck => {
    const newCheck: QualityCheck = {
      id: generateId(),
      type: data.type || 'product_quality',
      referenceId: data.referenceId || '',
      performedBy: data.performedBy || '',
      result: data.result || 'passed',
      findings: data.findings || '',
      performedAt: new Date().toISOString(),
      ...data
    };

    setQualityChecks(prev => [...prev, newCheck]);
    return newCheck;
  };

  const getDashboardStats = () => {
    const activeProcesses = processInstances.filter(p => p.status === 'active');
    const completedToday = processInstances.filter(p =>
      p.status === 'completed' &&
      p.completedAt &&
      new Date(p.completedAt).toDateString() === new Date().toDateString()
    );

    const pendingApprovals = activeProcesses.filter(p => {
      const workflow = getWorkflowByType(p.processType);
      const currentStep = workflow?.steps.find(s => s.id === p.currentStepId);
      return currentStep?.name.toLowerCase().includes('approval');
    });

    const investigationsRequired = investigations.filter(i => i.status === 'pending' || i.status === 'ongoing');

    const processesByDepartment = Object.entries(
      activeProcesses.reduce((acc, p) => {
        const workflow = getWorkflowByType(p.processType);
        const currentStep = workflow?.steps.find(s => s.id === p.currentStepId);
        const dept = currentStep?.department || 'unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([department, count]) => ({ department: department as Department, count }));

    const processesByType = Object.entries(
      activeProcesses.reduce((acc, p) => {
        acc[p.processType] = (acc[p.processType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type: type as ProcessType, count }));

    return {
      totalActiveProcesses: activeProcesses.length,
      pendingApprovals: pendingApprovals.length,
      investigationsRequired: investigationsRequired.length,
      completedToday: completedToday.length,
      overdueTasks: 0, // TODO: Calculate based on due dates
      processesByDepartment,
      processesByType
    };
  };

  return (
    <WorkflowContext.Provider value={{
      workflowDefinitions,
      getWorkflowByType,
      processInstances,
      getProcessInstance,
      getProcessesByType,
      getProcessesByStatus,
      getProcessesByAssignee,
      startProcess,
      advanceProcess,
      assignProcess,
      notifications,
      getNotificationsForUser,
      markNotificationRead,
      inboundOperations,
      projectProcesses,
      procurementProcesses,
      investigations,
      qualityChecks,
      createInboundOperation,
      updateInboundOperation,
      createProjectProcess,
      updateProjectProcess,
      createProcurementProcess,
      updateProcurementProcess,
      createInvestigation,
      updateInvestigation,
      performQualityCheck,
      getDashboardStats
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

// INITIAL WORKFLOW DEFINITIONS
const INITIAL_WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: 'inbound-operation-v1',
    name: 'Inbound LPG Operation',
    description: 'Complete workflow for LPG procurement and delivery based on operational diagrams',
    processType: 'inbound-operation',
    version: '1.0',
    isActive: true,
    startStepId: 'product-request',
    steps: [
      {
        id: 'product-request',
        name: 'Product Request',
        department: 'sales',
        description: 'Request for LPG product',
        requiredRole: 'sales',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'submitted', nextStepId: 'check-availability', label: 'Submit Request' }]
      },
      {
        id: 'check-availability',
        name: 'Check Product Availability',
        department: 'operations',
        description: 'Verify if requested product is available',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'available', nextStepId: 'request-truck', label: 'Product Available' },
          { condition: 'unavailable', nextStepId: 'product-request', label: 'Product Not Available' }
        ]
      },
      {
        id: 'request-truck',
        name: 'Request Truck',
        department: 'trading',
        description: 'Request truck for product transportation',
        requiredRole: 'trading',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'truck_available', nextStepId: 'nominate-truck', label: 'Truck Available' },
          { condition: 'truck_unavailable', nextStepId: 'request-truck', label: 'No Truck Available' }
        ]
      },
      {
        id: 'nominate-truck',
        name: 'Nominate Truck for Loading',
        department: 'trading',
        description: 'Assign specific truck for the operation',
        requiredRole: 'trading',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'nominated', nextStepId: 'dispatch-truck', label: 'Truck Nominated' }]
      },
      {
        id: 'dispatch-truck',
        name: 'Dispatch Truck to Load',
        department: 'logistics',
        description: 'Send truck to loading terminal',
        requiredRole: 'logistics',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'dispatched', nextStepId: 'vehicle-loading', label: 'Truck Dispatched' }]
      },
      {
        id: 'vehicle-loading',
        name: 'Vehicle Loading',
        department: 'logistics',
        description: 'Load product onto truck',
        requiredRole: 'logistics',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'loaded', nextStepId: 'seal-truck', label: 'Vehicle Loaded' },
          { condition: 'loading_failed', nextStepId: 'investigate', label: 'Loading Failed' }
        ]
      },
      {
        id: 'seal-truck',
        name: 'Seal Truck and Confirm Seal Number',
        department: 'logistics',
        description: 'Seal the truck and record seal number',
        requiredRole: 'logistics',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'sealed', nextStepId: 'issue-waybill', label: 'Truck Sealed' }]
      },
      {
        id: 'issue-waybill',
        name: 'Issue Weigh Bill',
        department: 'logistics',
        description: 'Generate and issue weigh bill/waybill',
        requiredRole: 'logistics',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'issued', nextStepId: 'product-transit', label: 'Waybill Issued' }]
      },
      {
        id: 'product-transit',
        name: 'Product in Transit',
        department: 'logistics',
        description: 'Product being transported to destination',
        requiredRole: 'logistics',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'arrived', nextStepId: 'confirm-arrival', label: 'Product Arrived' }]
      },
      {
        id: 'confirm-arrival',
        name: 'Confirm Seal/Weight/Gauge',
        department: 'operations',
        description: 'Verify seal integrity and product quantity',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'confirmed', nextStepId: 'quality-check', label: 'Seal/Weight Confirmed' },
          { condition: 'discrepancy', nextStepId: 'investigate', label: 'Discrepancy Found' }
        ]
      },
      {
        id: 'quality-check',
        name: 'Confirm Quality Check',
        department: 'operations',
        description: 'Perform quality check on received product',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'quality_ok', nextStepId: 'proceed-offload', label: 'Quality OK' },
          { condition: 'quality_failed', nextStepId: 'investigate', label: 'Quality Check Failed' }
        ]
      },
      {
        id: 'proceed-offload',
        name: 'Proceed to Offload',
        department: 'operations',
        description: 'Begin offloading process',
        requiredRole: 'operations',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'started', nextStepId: 'confirm-offload', label: 'Offloading Started' }]
      },
      {
        id: 'confirm-offload',
        name: 'Confirm Offload Quantity',
        department: 'operations',
        description: 'Verify and confirm quantity offloaded',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'confirmed', nextStepId: 'enter-inventory', label: 'Quantity Confirmed' },
          { condition: 'shortage', nextStepId: 'investigate', label: 'Shortage Detected' },
          { condition: 'overage', nextStepId: 'investigate', label: 'Overage Detected' }
        ]
      },
      {
        id: 'enter-inventory',
        name: 'Enter Inventory & Issue Delivery Note',
        department: 'operations',
        description: 'Update inventory and generate delivery note',
        requiredRole: 'operations',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'entered', nextStepId: 'post-delivery', label: 'Inventory Updated' }]
      },
      {
        id: 'post-delivery',
        name: 'Post Delivery Quantity',
        department: 'finance',
        description: 'Record delivery in financial systems',
        requiredRole: 'finance',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'posted', nextStepId: 'completed', label: 'Delivery Posted' }]
      },
      {
        id: 'investigate',
        name: 'Investigation Required',
        department: 'operations',
        description: 'Investigate discrepancies or quality issues',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'resolved', nextStepId: 'enter-inventory', label: 'Issue Resolved' },
          { condition: 'product_rejected', nextStepId: 'adjust-inventory', label: 'Product Rejected' },
          { condition: 'escalate', nextStepId: 'finance-review', label: 'Escalate to Finance' }
        ]
      },
      {
        id: 'adjust-inventory',
        name: 'Adjust Inventory',
        department: 'finance',
        description: 'Adjust inventory for rejected/lost product',
        requiredRole: 'finance',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'adjusted', nextStepId: 'completed', label: 'Inventory Adjusted' }]
      },
      {
        id: 'finance-review',
        name: 'Finance Review',
        department: 'finance',
        description: 'Finance department review of escalated issues',
        requiredRole: 'finance',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'approved', nextStepId: 'adjust-inventory', label: 'Adjustment Approved' },
          { condition: 'rejected', nextStepId: 'investigate', label: 'Return to Investigation' }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-management-v1',
    name: 'Project Management Workflow',
    description: 'Complete project lifecycle from budget development to completion based on operational diagrams',
    processType: 'project-management',
    version: '1.0',
    isActive: true,
    startStepId: 'budget-development',
    steps: [
      {
        id: 'budget-development',
        name: 'Budget Development',
        department: 'finance',
        description: 'Develop detailed project budget and timeline',
        requiredRole: 'finance',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'completed', nextStepId: 'stakeholder-meeting', label: 'Schedule Stakeholder Meeting' }]
      },
      {
        id: 'stakeholder-meeting',
        name: 'Stakeholder Meeting',
        department: 'management',
        description: 'Present project proposal to stakeholders and gather feedback',
        requiredRole: 'management',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'approved', nextStepId: 'budget-approval', label: 'Proceed to Budget Approval' },
          { condition: 'revision_required', nextStepId: 'budget-development', label: 'Revise Budget' },
          { condition: 'rejected', nextStepId: 'project-cancelled', label: 'Cancel Project' }
        ]
      },
      {
        id: 'budget-approval',
        name: 'Budget Approval',
        department: 'executive',
        description: 'Executive approval of project budget and authorization',
        requiredRole: 'executive',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'approved', nextStepId: 'tender-preparation', label: 'Proceed to Tender Preparation' },
          { condition: 'revision_required', nextStepId: 'budget-development', label: 'Revise Budget' },
          { condition: 'rejected', nextStepId: 'project-cancelled', label: 'Cancel Project' }
        ]
      },
      {
        id: 'tender-preparation',
        name: 'Tender Preparation',
        department: 'procurement',
        description: 'Prepare tender documents and specifications',
        requiredRole: 'procurement',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'completed', nextStepId: 'tender-publication', label: 'Publish Tender' }]
      },
      {
        id: 'tender-publication',
        name: 'Tender Publication',
        department: 'procurement',
        description: 'Publish tender and manage bidding process',
        requiredRole: 'procurement',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'bids_received', nextStepId: 'bid-evaluation', label: 'Evaluate Bids' }]
      },
      {
        id: 'bid-evaluation',
        name: 'Bid Evaluation',
        department: 'procurement',
        description: 'Technical and commercial evaluation of received bids',
        requiredRole: 'procurement',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'bids_qualified', nextStepId: 'contractor-selection', label: 'Select Contractor' },
          { condition: 'no_qualified_bids', nextStepId: 'tender-preparation', label: 'Re-tender' }
        ]
      },
      {
        id: 'contractor-selection',
        name: 'Contractor Selection',
        department: 'management',
        description: 'Final selection and approval of preferred contractor',
        requiredRole: 'management',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'contractor_selected', nextStepId: 'contract-award', label: 'Award Contract' },
          { condition: 'selection_rejected', nextStepId: 'bid-evaluation', label: 'Re-evaluate Bids' }
        ]
      },
      {
        id: 'contract-award',
        name: 'Contract Award',
        department: 'legal',
        description: 'Contract negotiation, signing and award',
        requiredRole: 'legal',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'contract_signed', nextStepId: 'project-execution', label: 'Begin Project Execution' }]
      },
      {
        id: 'project-execution',
        name: 'Project Execution',
        department: 'operations',
        description: 'Monitor project progress and contractor performance',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'milestone_completed', nextStepId: 'milestone-payment', label: 'Process Milestone Payment' },
          { condition: 'variation_required', nextStepId: 'variation-management', label: 'Manage Variation' },
          { condition: 'project_completed', nextStepId: 'project-completion', label: 'Complete Project' }
        ]
      },
      {
        id: 'milestone-payment',
        name: 'Milestone Payment',
        department: 'finance',
        description: 'Process milestone payment based on deliverables',
        requiredRole: 'finance',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'payment_processed', nextStepId: 'project-execution', label: 'Continue Project' }]
      },
      {
        id: 'variation-management',
        name: 'Variation Management',
        department: 'management',
        description: 'Assess and approve project variations or changes',
        requiredRole: 'management',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'variation_approved', nextStepId: 'project-execution', label: 'Continue with Variation' },
          { condition: 'variation_rejected', nextStepId: 'project-execution', label: 'Continue Original Scope' }
        ]
      },
      {
        id: 'project-completion',
        name: 'Project Completion',
        department: 'operations',
        description: 'Project handover and completion verification',
        requiredRole: 'operations',
        isDecisionPoint: true,
        nextSteps: [
          { condition: 'satisfactory', nextStepId: 'final-payment', label: 'Process Final Payment' },
          { condition: 'defects_found', nextStepId: 'project-execution', label: 'Address Defects' }
        ]
      },
      {
        id: 'final-payment',
        name: 'Final Payment',
        department: 'finance',
        description: 'Process final payment and project closure',
        requiredRole: 'finance',
        isDecisionPoint: false,
        nextSteps: [{ condition: 'completed', nextStepId: 'project-closed', label: 'Close Project' }]
      },
      {
        id: 'project-closed',
        name: 'Project Closed',
        department: 'management',
        description: 'Project successfully completed and closed',
        requiredRole: 'management',
        isDecisionPoint: false,
        nextSteps: []
      },
      {
        id: 'project-cancelled',
        name: 'Project Cancelled',
        department: 'management',
        description: 'Project cancelled due to rejection or other factors',
        requiredRole: 'management',
        isDecisionPoint: false,
        nextSteps: []
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// MOCK DATA
const MOCK_PROCESS_INSTANCES: ProcessInstance[] = [
  {
    id: 'proc-001',
    processType: 'inbound-operation',
    workflowDefinitionId: 'inbound-operation-v1',
    referenceId: 'INB-001',
    currentStepId: 'confirm-arrival',
    status: 'active',
    priority: 'high',
    initiatedBy: 'user-001',
    assignedTo: 'ops-001',
    data: {
      productType: 'lpg-bulk',
      quantity: 20000,
      truckId: 'truck-001',
      sealNumber: 'SEAL-12345'
    },
    history: [
      {
        id: 'hist-001',
        stepId: 'product-request',
        stepName: 'Product Request',
        action: 'started',
        performedBy: 'user-001',
        performedAt: '2025-11-08T08:00:00Z'
      }
    ],
    notifications: [],
    documents: [],
    createdAt: '2025-11-08T08:00:00Z',
    updatedAt: '2025-11-08T10:30:00Z',
    dueDate: '2025-11-08T18:00:00Z'
  }
];

const MOCK_NOTIFICATIONS: ProcessNotification[] = [
  {
    id: 'notif-001',
    type: 'pending_approval',
    recipientId: 'ops-001',
    recipientRole: 'operations',
    message: 'Seal/Weight confirmation required for INB-001',
    isRead: false,
    createdAt: '2025-11-08T10:30:00Z',
    actionUrl: '/workflow/inbound/INB-001'
  }
];

const MOCK_INBOUND_OPERATIONS: InboundOperation[] = [
  {
    id: 'inb-001',
    operationNumber: 'INB-001',
    processInstanceId: 'proc-001',
    plantId: 'plant-kano',
    requestedBy: 'sales-001',
    productType: 'lpg-bulk',
    requestedQuantity: 20000,
    status: 'arrived',
    truckId: 'truck-001',
    truckNominated: true,
    truckAvailable: true,
    vehicleLoaded: true,
    sealNumber: 'SEAL-12345',
    waybillIssued: true,
    dispatchTime: '2025-11-08T06:00:00Z',
    arrivalTime: '2025-11-08T10:30:00Z',
    createdAt: '2025-11-08T08:00:00Z'
  }
];

const MOCK_PROJECT_PROCESSES: ProjectProcess[] = [
  {
    id: 'proj-001',
    projectNumber: 'PRJ-001',
    processInstanceId: 'proc-proj-001',
    name: 'Abuja Plant Construction',
    description: 'New LPG storage facility in Abuja',
    status: 'budget_approved',
    workflowDefined: true,
    stakeholderMeetingHeld: true,
    estimatedBudget: 500000000,
    approvedBudget: 480000000,
    budgetApprovedBy: 'exec-001',
    createdAt: '2025-10-01T00:00:00Z',
    targetCompletionDate: '2026-06-01T00:00:00Z'
  }
];

const MOCK_PROCUREMENT_PROCESSES: ProcurementProcess[] = [
  {
    id: 'proc-001',
    procurementNumber: 'PROC-001',
    processInstanceId: 'proc-procurement-001',
    requestingDepartment: 'operations',
    itemName: 'Safety Equipment',
    description: 'Safety helmets and protective gear for Kano plant',
    status: 'quotes_requested',
    timelineDefined: true,
    requestApproved: true,
    estimatedBudget: 150000,
    quotesReceived: [
      {
        vendorId: 'vendor-001',
        vendorName: 'Safety First Nigeria',
        quotedAmount: 145000,
        deliveryTime: '2 weeks',
        terms: 'Net 30',
        receivedAt: '2025-11-07T00:00:00Z'
      }
    ],
    createdAt: '2025-11-01T00:00:00Z',
    expectedCompletionDate: '2025-11-20T00:00:00Z'
  }
];

const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv-001',
    referenceType: 'inbound_operation',
    referenceId: 'inb-002',
    type: 'shortage',
    reason: 'Delivered quantity 500L less than waybill',
    findings: 'Leak detected in truck compartment during transit',
    status: 'ongoing',
    assignedTo: 'ops-002',
    createdBy: 'ops-001',
    createdAt: '2025-11-07T14:30:00Z'
  }
];