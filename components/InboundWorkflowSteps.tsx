"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart,
  CheckSquare,
  Truck,
  UserCheck,
  Send,
  Package,
  Shield,
  FileText,
  Navigation,
  MapPin,
  Scale,
  ClipboardCheck,
  RotateCcw,
  Download,
  DollarSign,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundOperation, ProcessInstance } from "@/lib/types";

interface InboundWorkflowStepsProps {
  operation: InboundOperation;
  onAdvanceWorkflow: (stepId: string, action: string, data?: any) => void;
  onInvestigate: (reason: string) => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  department: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'investigating';
  actions?: { id: string; label: string; variant?: 'default' | 'destructive' }[];
  data?: Record<string, any>;
}

export default function InboundWorkflowSteps({
  operation,
  onAdvanceWorkflow,
  onInvestigate
}: InboundWorkflowStepsProps) {
  const [showActionDialog, setShowActionDialog] = useState<{ stepId: string; action: string } | null>(null);
  const [actionData, setActionData] = useState<Record<string, any>>({});

  // Define the complete 15-step workflow
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'product-request',
      name: 'Product Request',
      department: 'Sales',
      icon: ShoppingCart,
      description: 'Customer places order for LPG product',
      status: getStepStatus('product_requested'),
      actions: [
        { id: 'submit', label: 'Submit Request' }
      ]
    },
    {
      id: 'check-availability',
      name: 'Check Product Availability',
      department: 'Operations',
      icon: CheckSquare,
      description: 'Verify if requested product is available at source',
      status: getStepStatus('product_available'),
      actions: [
        { id: 'available', label: 'Product Available' },
        { id: 'unavailable', label: 'Product Not Available', variant: 'destructive' }
      ]
    },
    {
      id: 'request-truck',
      name: 'Request Truck',
      department: 'Trading',
      icon: Truck,
      description: 'Request truck for product transportation',
      status: getStepStatus('truck_requested'),
      actions: [
        { id: 'truck_available', label: 'Truck Available' },
        { id: 'truck_unavailable', label: 'No Truck Available', variant: 'destructive' }
      ]
    },
    {
      id: 'nominate-truck',
      name: 'Nominate Truck',
      department: 'Trading',
      icon: UserCheck,
      description: 'Assign specific truck for the operation',
      status: getStepStatus('truck_nominated'),
      actions: [
        { id: 'nominated', label: 'Truck Nominated' }
      ]
    },
    {
      id: 'dispatch-truck',
      name: 'Dispatch Truck to Load',
      department: 'Logistics',
      icon: Send,
      description: 'Send truck to loading terminal',
      status: getStepStatus('dispatched'),
      actions: [
        { id: 'dispatched', label: 'Truck Dispatched' }
      ]
    },
    {
      id: 'vehicle-loading',
      name: 'Vehicle Loading',
      department: 'Logistics',
      icon: Package,
      description: 'Load product onto truck',
      status: getStepStatus('loaded'),
      actions: [
        { id: 'loaded', label: 'Vehicle Loaded' },
        { id: 'loading_failed', label: 'Loading Failed', variant: 'destructive' }
      ]
    },
    {
      id: 'seal-truck',
      name: 'Seal Truck',
      department: 'Logistics',
      icon: Shield,
      description: 'Seal the truck and record seal number',
      status: getStepStatus('sealed'),
      actions: [
        { id: 'sealed', label: 'Truck Sealed' }
      ]
    },
    {
      id: 'issue-waybill',
      name: 'Issue Waybill',
      department: 'Logistics',
      icon: FileText,
      description: 'Generate and issue weigh bill/waybill',
      status: getStepStatus('sealed'), // Same as seal step
      actions: [
        { id: 'issued', label: 'Waybill Issued' }
      ]
    },
    {
      id: 'product-transit',
      name: 'Product in Transit',
      department: 'Logistics',
      icon: Navigation,
      description: 'Product being transported to destination',
      status: getStepStatus('in_transit'),
      actions: [
        { id: 'arrived', label: 'Product Arrived' }
      ]
    },
    {
      id: 'confirm-arrival',
      name: 'Confirm Arrival',
      department: 'Operations',
      icon: MapPin,
      description: 'Verify seal integrity and product quantity',
      status: getStepStatus('arrived'),
      actions: [
        { id: 'confirmed', label: 'Seal/Weight Confirmed' },
        { id: 'discrepancy', label: 'Discrepancy Found', variant: 'destructive' }
      ]
    },
    {
      id: 'quality-check',
      name: 'Quality Check',
      department: 'Operations',
      icon: ClipboardCheck,
      description: 'Perform quality check on received product',
      status: getStepStatus('quality_check'),
      actions: [
        { id: 'quality_ok', label: 'Quality OK' },
        { id: 'quality_failed', label: 'Quality Check Failed', variant: 'destructive' }
      ]
    },
    {
      id: 'proceed-offload',
      name: 'Proceed to Offload',
      department: 'Operations',
      icon: RotateCcw,
      description: 'Begin offloading process',
      status: getStepStatus('quality_check'), // Same step as quality check
      actions: [
        { id: 'started', label: 'Start Offloading' }
      ]
    },
    {
      id: 'confirm-offload',
      name: 'Confirm Offload',
      department: 'Operations',
      icon: Scale,
      description: 'Verify and confirm quantity offloaded',
      status: getStepStatus('offloaded'),
      actions: [
        { id: 'confirmed', label: 'Quantity Confirmed' },
        { id: 'shortage', label: 'Shortage Detected', variant: 'destructive' },
        { id: 'overage', label: 'Overage Detected', variant: 'destructive' }
      ]
    },
    {
      id: 'enter-inventory',
      name: 'Enter Inventory',
      department: 'Operations',
      icon: Download,
      description: 'Update inventory and generate delivery note',
      status: getStepStatus('offloaded'), // Same as offload confirmation
      actions: [
        { id: 'entered', label: 'Inventory Updated' }
      ]
    },
    {
      id: 'post-delivery',
      name: 'Post Delivery',
      department: 'Finance',
      icon: DollarSign,
      description: 'Record delivery in financial systems',
      status: getStepStatus('completed'),
      actions: [
        { id: 'posted', label: 'Delivery Posted' }
      ]
    }
  ];

  // Add investigation step if needed
  if (operation.investigationRequired || operation.status === 'investigating') {
    workflowSteps.splice(-1, 0, {
      id: 'investigate',
      name: 'Investigation',
      department: 'Operations',
      icon: Search,
      description: 'Investigate discrepancies or quality issues',
      status: 'current',
      actions: [
        { id: 'resolved', label: 'Issue Resolved' },
        { id: 'product_rejected', label: 'Reject Product', variant: 'destructive' },
        { id: 'escalate', label: 'Escalate to Finance' }
      ]
    });
  }

  function getStepStatus(statusThreshold: string): WorkflowStep['status'] {
    if (operation.status === 'investigating') {
      return 'investigating';
    }

    const stepOrder = [
      'product_requested',
      'product_available',
      'truck_requested',
      'truck_nominated',
      'dispatched',
      'loaded',
      'sealed',
      'in_transit',
      'arrived',
      'quality_check',
      'offloaded',
      'completed'
    ];

    const currentIndex = stepOrder.indexOf(operation.status);
    const thresholdIndex = stepOrder.indexOf(statusThreshold);

    if (thresholdIndex < currentIndex) return 'completed';
    if (thresholdIndex === currentIndex) return 'current';
    return 'pending';
  }

  const handleActionClick = (stepId: string, action: string) => {
    if (action === 'discrepancy' || action === 'loading_failed' || action === 'quality_failed' || action === 'shortage' || action === 'overage') {
      // Show investigation dialog
      setShowActionDialog({ stepId, action });
      return;
    }

    // For simple actions, advance directly
    onAdvanceWorkflow(stepId, action);
  };

  const handleDialogSubmit = () => {
    if (!showActionDialog) return;

    const { stepId, action } = showActionDialog;

    if (action === 'discrepancy' || action === 'loading_failed' || action === 'quality_failed' || action === 'shortage' || action === 'overage') {
      onInvestigate(actionData.reason || 'Investigation required');
    } else {
      onAdvanceWorkflow(stepId, action, actionData);
    }

    setShowActionDialog(null);
    setActionData({});
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'investigating':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Sales': 'bg-blue-100 text-blue-800 border-blue-200',
      'Trading': 'bg-purple-100 text-purple-800 border-purple-200',
      'Logistics': 'bg-orange-100 text-orange-800 border-orange-200',
      'Operations': 'bg-green-100 text-green-800 border-green-200',
      'Finance': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inbound Operation Workflow
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {operation.operationNumber} • {operation.requestedQuantity.toLocaleString()}L LPG
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getDepartmentColor('Operations')}>
                {workflowSteps.filter(s => s.status === 'completed').length} / {workflowSteps.length} Steps
              </Badge>
              <Badge
                variant={operation.status === 'investigating' ? 'destructive' : 'default'}
                className="capitalize"
              >
                {operation.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <Card
            key={step.id}
            className={cn(
              "transition-all duration-200",
              step.status === 'current' && "ring-2 ring-blue-500 ring-opacity-50",
              step.status === 'investigating' && "ring-2 ring-red-500 ring-opacity-50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Step Number & Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {index + 1}
                    </div>
                    {getStepIcon(step.status)}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{step.name}</h3>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getDepartmentColor(step.department))}
                      >
                        {step.department}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Actions */}
                {step.status === 'current' && step.actions && (
                  <div className="flex gap-2">
                    {step.actions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        variant={action.variant || 'default'}
                        onClick={() => handleActionClick(step.id, action.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Completed indicator */}
                {step.status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>

              {/* Step-specific data */}
              {step.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    {step.id === 'nominate-truck' && operation.truckId && (
                      <div>
                        <span className="text-muted-foreground">Truck ID:</span>
                        <p className="font-medium">{operation.truckId}</p>
                      </div>
                    )}
                    {step.id === 'seal-truck' && operation.sealNumber && (
                      <div>
                        <span className="text-muted-foreground">Seal Number:</span>
                        <p className="font-medium">{operation.sealNumber}</p>
                      </div>
                    )}
                    {step.id === 'dispatch-truck' && operation.dispatchTime && (
                      <div>
                        <span className="text-muted-foreground">Dispatched:</span>
                        <p className="font-medium">
                          {new Date(operation.dispatchTime).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {step.id === 'confirm-arrival' && operation.arrivalTime && (
                      <div>
                        <span className="text-muted-foreground">Arrived:</span>
                        <p className="font-medium">
                          {new Date(operation.arrivalTime).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={!!showActionDialog} onOpenChange={() => setShowActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showActionDialog?.action === 'discrepancy' && 'Report Discrepancy'}
              {showActionDialog?.action === 'loading_failed' && 'Report Loading Failure'}
              {showActionDialog?.action === 'quality_failed' && 'Report Quality Issue'}
              {showActionDialog?.action === 'shortage' && 'Report Shortage'}
              {showActionDialog?.action === 'overage' && 'Report Overage'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showActionDialog?.action === 'sealed' && (
              <div>
                <Label htmlFor="sealNumber">Seal Number</Label>
                <Input
                  id="sealNumber"
                  value={actionData.sealNumber || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, sealNumber: e.target.value }))}
                  placeholder="Enter seal number"
                />
              </div>
            )}

            {showActionDialog?.action === 'nominated' && (
              <div>
                <Label htmlFor="truckId">Truck ID</Label>
                <Input
                  id="truckId"
                  value={actionData.truckId || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, truckId: e.target.value }))}
                  placeholder="Enter truck ID"
                />
              </div>
            )}

            {(showActionDialog?.action === 'shortage' || showActionDialog?.action === 'overage') && (
              <>
                <div>
                  <Label htmlFor="actualQuantity">Actual Quantity Received</Label>
                  <Input
                    id="actualQuantity"
                    type="number"
                    value={actionData.actualQuantity || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, actualQuantity: e.target.value }))}
                    placeholder="Enter actual quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="variance">Variance</Label>
                  <Input
                    id="variance"
                    type="number"
                    value={actionData.variance || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, variance: e.target.value }))}
                    placeholder="Enter variance amount"
                  />
                </div>
              </>
            )}

            {['discrepancy', 'loading_failed', 'quality_failed', 'shortage', 'overage'].includes(showActionDialog?.action || '') && (
              <div>
                <Label htmlFor="reason">Reason for Investigation</Label>
                <Textarea
                  id="reason"
                  value={actionData.reason || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Describe the issue that requires investigation..."
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowActionDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleDialogSubmit}>
                {['discrepancy', 'loading_failed', 'quality_failed', 'shortage', 'overage'].includes(showActionDialog?.action || '')
                  ? 'Start Investigation'
                  : 'Confirm'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}