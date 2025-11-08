"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useERP } from "@/contexts/ERPContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InboundWorkflowSteps from "@/components/InboundWorkflowSteps";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Clock,
  User,
  FileText,
  AlertTriangle,
  History,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundOperation, ProcessInstance } from "@/lib/types";

export default function InboundOperationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    inboundOperations,
    updateInboundOperation,
    processInstances,
    advanceProcess,
    createInvestigation
  } = useWorkflow();
  const { plants, trucks } = useERP();

  const operationId = params.id as string;
  const operation = inboundOperations.find(op => op.id === operationId);
  const processInstance = processInstances.find(p => p.referenceId === operationId);
  const plant = plants.find(p => p.id === operation?.plantId);
  const truck = trucks?.find(t => t.id === operation?.truckId);

  if (!operation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Operation Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested inbound operation could not be found.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleAdvanceWorkflow = (stepId: string, action: string, data?: any) => {
    if (!processInstance) return;

    // Update the process instance
    advanceProcess(processInstance.id, action, 'current-user', undefined, data);

    // Update the inbound operation based on the action
    const updates: Partial<InboundOperation> = {};

    switch (action) {
      case 'available':
        updates.status = 'product_available';
        break;
      case 'truck_available':
        updates.status = 'truck_requested';
        updates.truckAvailable = true;
        break;
      case 'nominated':
        updates.status = 'truck_nominated';
        updates.truckNominated = true;
        if (data?.truckId) updates.truckId = data.truckId;
        break;
      case 'dispatched':
        updates.status = 'dispatched';
        updates.dispatchTime = new Date().toISOString();
        break;
      case 'loaded':
        updates.status = 'loaded';
        updates.vehicleLoaded = true;
        break;
      case 'sealed':
        updates.status = 'sealed';
        if (data?.sealNumber) updates.sealNumber = data.sealNumber;
        break;
      case 'issued':
        updates.waybillIssued = true;
        break;
      case 'arrived':
        updates.status = 'arrived';
        updates.arrivalTime = new Date().toISOString();
        break;
      case 'confirmed':
        if (stepId === 'confirm-arrival') {
          updates.sealConfirmed = true;
          updates.weightGaugeConfirmed = true;
          updates.status = 'quality_check';
        } else if (stepId === 'confirm-offload') {
          updates.status = 'offloaded';
          if (data?.actualQuantity) updates.offloadQuantity = parseInt(data.actualQuantity);
        }
        break;
      case 'quality_ok':
        updates.qualityCheckPassed = true;
        break;
      case 'started':
        // Proceed to offload
        break;
      case 'entered':
        updates.status = 'completed';
        updates.completedAt = new Date().toISOString();
        break;
      case 'posted':
        updates.deliveryQuantityPosted = true;
        break;
    }

    if (Object.keys(updates).length > 0) {
      updateInboundOperation(operationId, updates);
    }
  };

  const handleInvestigate = (reason: string) => {
    // Create investigation
    createInvestigation({
      referenceType: 'inbound_operation',
      referenceId: operationId,
      type: 'quality_issue', // This could be more specific based on the issue
      reason: reason,
      assignedTo: 'ops-manager',
      createdBy: 'current-user'
    });

    // Update operation status
    updateInboundOperation(operationId, {
      status: 'investigating',
      investigationRequired: true,
      investigationReason: reason,
      investigationStatus: 'pending'
    });
  };

  const getStatusColor = (status: InboundOperation['status']) => {
    const colors = {
      'product_requested': 'bg-blue-500',
      'product_available': 'bg-green-500',
      'truck_requested': 'bg-yellow-500',
      'truck_nominated': 'bg-orange-500',
      'dispatched': 'bg-purple-500',
      'loaded': 'bg-indigo-500',
      'sealed': 'bg-cyan-500',
      'in_transit': 'bg-blue-600',
      'arrived': 'bg-green-600',
      'quality_check': 'bg-yellow-600',
      'offloaded': 'bg-green-700',
      'completed': 'bg-green-800',
      'investigating': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {operation.operationNumber}
            </h1>
            <p className="text-muted-foreground">
              Inbound Operation Details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={operation.status === 'investigating' ? 'destructive' : 'default'}
            className="capitalize"
          >
            {operation.status.replace('_', ' ')}
          </Badge>
          {operation.investigationRequired && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Investigation Required
            </Badge>
          )}
        </div>
      </div>

      {/* Operation Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-semibold">{plant?.name}</p>
                <p className="text-xs text-muted-foreground">{plant?.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold">{operation.requestedQuantity.toLocaleString()}L</p>
                <p className="text-xs text-muted-foreground">
                  {operation.offloadQuantity && `Received: ${operation.offloadQuantity.toLocaleString()}L`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Truck</p>
                <p className="font-semibold">{operation.truckId || 'Not assigned'}</p>
                <p className="text-xs text-muted-foreground">
                  {operation.sealNumber && `Seal: ${operation.sealNumber}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-semibold">
                  {operation.createdAt && new Date(operation.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {operation.completedAt
                    ? `Completed: ${new Date(operation.completedAt).toLocaleDateString()}`
                    : 'In progress'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="workflow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflow" className="gap-2">
            <FileText className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Package className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          {operation.investigationRequired && (
            <TabsTrigger value="investigation" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Investigation
            </TabsTrigger>
          )}
        </TabsList>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <InboundWorkflowSteps
            operation={operation}
            onAdvanceWorkflow={handleAdvanceWorkflow}
            onInvestigate={handleInvestigate}
          />
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Operation Details */}
            <Card>
              <CardHeader>
                <CardTitle>Operation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Operation Number</p>
                    <p className="font-medium">{operation.operationNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(operation.status))} />
                      <p className="font-medium capitalize">{operation.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Product Type</p>
                    <p className="font-medium">LPG Bulk</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Requested By</p>
                    <p className="font-medium">{operation.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDateTime(operation.createdAt)}</p>
                  </div>
                  {operation.completedAt && (
                    <div>
                      <p className="text-muted-foreground">Completed At</p>
                      <p className="font-medium">{formatDateTime(operation.completedAt)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transportation Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transportation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Truck ID</p>
                    <p className="font-medium">{operation.truckId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Seal Number</p>
                    <p className="font-medium">{operation.sealNumber || 'Not sealed'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Waybill Issued</p>
                    <p className="font-medium">{operation.waybillIssued ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle Loaded</p>
                    <p className="font-medium">{operation.vehicleLoaded ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dispatch Time</p>
                    <p className="font-medium">{formatDateTime(operation.dispatchTime)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Arrival Time</p>
                    <p className="font-medium">{formatDateTime(operation.arrivalTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality & Delivery Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quality & Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requested Quantity</p>
                    <p className="font-medium">{operation.requestedQuantity.toLocaleString()}L</p>
                  </div>
                  {operation.offloadQuantity && (
                    <div>
                      <p className="text-muted-foreground">Offloaded Quantity</p>
                      <p className="font-medium">{operation.offloadQuantity.toLocaleString()}L</p>
                    </div>
                  )}
                  {operation.shortage && (
                    <div>
                      <p className="text-muted-foreground">Shortage</p>
                      <p className="font-medium text-red-600">{operation.shortage.toLocaleString()}L</p>
                    </div>
                  )}
                  {operation.overage && (
                    <div>
                      <p className="text-muted-foreground">Overage</p>
                      <p className="font-medium text-green-600">{operation.overage.toLocaleString()}L</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Seal Confirmed</p>
                    <p className="font-medium">{operation.sealConfirmed ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight Confirmed</p>
                    <p className="font-medium">{operation.weightGaugeConfirmed ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quality Check</p>
                    <p className="font-medium">{operation.qualityCheckPassed ? 'Passed' : 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Posted</p>
                    <p className="font-medium">{operation.deliveryQuantityPosted ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Process History</CardTitle>
            </CardHeader>
            <CardContent>
              {processInstance?.history.length ? (
                <div className="space-y-4">
                  {processInstance.history.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {index < processInstance.history.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{entry.stepName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.performedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {entry.action.replace('_', ' ')} by {entry.performedBy}
                        </p>
                        {entry.comments && (
                          <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                            {entry.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investigation Tab */}
        {operation.investigationRequired && (
          <TabsContent value="investigation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Investigation Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                    <h4 className="font-medium text-destructive mb-2">Investigation Details</h4>
                    <p className="text-sm">
                      <strong>Reason:</strong> {operation.investigationReason}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Status:</strong> {operation.investigationStatus}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="border-destructive text-destructive">
                      View Investigation Details
                    </Button>
                    <Button variant="outline">
                      Assign Investigator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}