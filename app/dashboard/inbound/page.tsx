"use client";

import { useState } from "react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useERP } from "@/contexts/ERPContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Truck,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InboundOperation, ProcessInstance } from "@/lib/types";

export default function InboundOperationsPage() {
  const {
    inboundOperations,
    createInboundOperation,
    updateInboundOperation,
    processInstances,
    startProcess,
    advanceProcess,
    getDashboardStats
  } = useWorkflow();
  const { plants } = useERP();

  const [selectedTab, setSelectedTab] = useState("active");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<InboundOperation | null>(null);
  const [newOperation, setNewOperation] = useState({
    plantId: "",
    requestedQuantity: 0,
    productType: "lpg-bulk" as const,
    priority: "medium" as const
  });

  // Get statistics for inbound operations
  const stats = getDashboardStats();
  const activeOperations = inboundOperations.filter(op =>
    !['completed', 'investigating'].includes(op.status)
  );
  const investigatingOperations = inboundOperations.filter(op =>
    op.status === 'investigating' || op.investigationRequired
  );
  const completedToday = inboundOperations.filter(op =>
    op.status === 'completed' &&
    new Date(op.completedAt || '').toDateString() === new Date().toDateString()
  );

  const handleCreateOperation = () => {
    if (!newOperation.plantId || !newOperation.requestedQuantity) return;

    // Create the inbound operation
    const operation = createInboundOperation({
      ...newOperation,
      requestedBy: 'current-user' // This would be from auth context
    });

    // Start the workflow process
    startProcess(
      'inbound-operation',
      operation.id,
      'current-user',
      {
        plantId: newOperation.plantId,
        requestedQuantity: newOperation.requestedQuantity,
        productType: newOperation.productType
      }
    );

    setShowCreateDialog(false);
    setNewOperation({
      plantId: "",
      requestedQuantity: 0,
      productType: "lpg-bulk",
      priority: "medium"
    });
  };

  const getStatusColor = (status: InboundOperation['status']) => {
    const statusColors = {
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
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: InboundOperation['status']) => {
    const statusLabels = {
      'product_requested': 'Product Requested',
      'product_available': 'Product Available',
      'truck_requested': 'Truck Requested',
      'truck_nominated': 'Truck Nominated',
      'dispatched': 'Dispatched to Load',
      'loaded': 'Vehicle Loaded',
      'sealed': 'Truck Sealed',
      'in_transit': 'In Transit',
      'arrived': 'Arrived at Plant',
      'quality_check': 'Quality Check',
      'offloaded': 'Offloaded',
      'completed': 'Completed',
      'investigating': 'Under Investigation'
    };
    return statusLabels[status] || status;
  };

  const getCurrentStep = (operation: InboundOperation) => {
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
    return { current: currentIndex + 1, total: stepOrder.length - 1 };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inbound Operations</h1>
          <p className="text-muted-foreground">
            LPG Procurement & Delivery Workflow Management
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Operation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Inbound Operation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plant">Destination Plant</Label>
                <Select
                  value={newOperation.plantId}
                  onValueChange={(value) => setNewOperation(prev => ({ ...prev, plantId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map(plant => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name} - {plant.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Requested Quantity (Liters)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newOperation.requestedQuantity || ""}
                  onChange={(e) => setNewOperation(prev => ({
                    ...prev,
                    requestedQuantity: parseInt(e.target.value) || 0
                  }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOperation}>
                  Create Operation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOperations.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {investigatingOperations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedToday.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inboundOperations.reduce((sum, op) => sum + (op.offloadQuantity || op.requestedQuantity), 0).toLocaleString()}L
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Active ({activeOperations.length})
          </TabsTrigger>
          <TabsTrigger value="investigating" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Investigating ({investigatingOperations.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <FileText className="h-4 w-4" />
            All Operations
          </TabsTrigger>
        </TabsList>

        {/* Active Operations */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeOperations.map((operation) => {
              const plant = plants.find(p => p.id === operation.plantId);
              const stepInfo = getCurrentStep(operation);

              return (
                <Card key={operation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", getStatusColor(operation.status))} />
                          <div>
                            <h3 className="font-semibold">{operation.operationNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              {plant?.name} • {operation.requestedQuantity.toLocaleString()}L
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            Step {stepInfo.current} of {stepInfo.total}
                          </Badge>
                          <p className="text-sm font-medium">{getStatusLabel(operation.status)}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOperation(operation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round((stepInfo.current / stepInfo.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all", getStatusColor(operation.status))}
                          style={{ width: `${(stepInfo.current / stepInfo.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Truck:</span>
                        <p className="font-medium">
                          {operation.truckId || 'Not assigned'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Seal:</span>
                        <p className="font-medium">
                          {operation.sealNumber || 'Not sealed'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dispatched:</span>
                        <p className="font-medium">
                          {operation.dispatchTime
                            ? new Date(operation.dispatchTime).toLocaleDateString()
                            : 'Not dispatched'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ETA:</span>
                        <p className="font-medium">
                          {operation.arrivalTime
                            ? new Date(operation.arrivalTime).toLocaleDateString()
                            : 'TBD'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeOperations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Operations</h3>
                  <p className="text-muted-foreground mb-4">
                    Start a new inbound operation to track LPG deliveries.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Create New Operation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Investigating Operations */}
        <TabsContent value="investigating" className="space-y-4">
          <div className="grid gap-4">
            {investigatingOperations.map((operation) => {
              const plant = plants.find(p => p.id === operation.plantId);

              return (
                <Card key={operation.id} className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                          <h3 className="font-semibold text-destructive">{operation.operationNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plant?.name} • {operation.requestedQuantity.toLocaleString()}L
                          </p>
                          <p className="text-sm mt-1 text-destructive">
                            {operation.investigationReason || 'Investigation required'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          Investigate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {investigatingOperations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Clear</h3>
                  <p className="text-muted-foreground">
                    No operations require investigation at this time.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="completed">
          <div className="text-center py-8 text-muted-foreground">
            Completed operations view coming soon...
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="text-center py-8 text-muted-foreground">
            All operations view coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}