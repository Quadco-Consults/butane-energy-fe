"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Plus,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  TrendingUp,
  Settings,
  CheckCircle,
  XCircle,
  CreditCard,
  PieChart,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectProcess } from "@/lib/types";

interface Milestone {
  id: string;
  title: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  progress: number;
  deliverables: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  paymentPercentage: number;
  paymentAmount: number;
  paymentStatus: 'pending' | 'approved' | 'paid';
  documents: string[];
}

interface Variation {
  id: string;
  title: string;
  description: string;
  category: 'scope_change' | 'cost_increase' | 'timeline_extension' | 'specification_change';
  impactType: 'cost' | 'time' | 'scope' | 'quality';
  costImpact: number;
  timeImpact: number; // in days
  justification: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  approvedBy?: string;
  approvedAt?: string;
  comments: string;
}

interface Payment {
  id: string;
  milestoneId?: string;
  variationId?: string;
  type: 'milestone' | 'advance' | 'variation' | 'final';
  amount: number;
  description: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'approved' | 'processed' | 'paid';
  approvedBy?: string;
  documents: string[];
}

interface ProjectExecutionManagerProps {
  project: ProjectProcess;
  onMilestoneUpdate: (projectId: string, milestone: Milestone) => void;
  onVariationRequest: (projectId: string, variation: Variation) => void;
  onPaymentProcess: (projectId: string, payment: Payment) => void;
  onProjectProgress: (projectId: string, progressData: any) => void;
}

export function ProjectExecutionManager({
  project,
  onMilestoneUpdate,
  onVariationRequest,
  onPaymentProcess,
  onProjectProgress
}: ProjectExecutionManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'milestone-1',
      title: 'Design & Planning',
      description: 'Complete detailed design and project planning',
      plannedDate: '2025-12-15',
      progress: 100,
      deliverables: ['Detailed drawings', 'Project plan', 'Resource allocation'],
      status: 'completed',
      paymentPercentage: 20,
      paymentAmount: (project.approvedBudget || project.estimatedBudget) * 0.2,
      paymentStatus: 'paid',
      documents: []
    },
    {
      id: 'milestone-2',
      title: 'Foundation & Structure',
      description: 'Complete foundation work and structural framework',
      plannedDate: '2026-02-15',
      progress: 75,
      deliverables: ['Foundation completion', 'Structural framework', 'Quality reports'],
      status: 'in_progress',
      paymentPercentage: 30,
      paymentAmount: (project.approvedBudget || project.estimatedBudget) * 0.3,
      paymentStatus: 'pending',
      documents: []
    }
  ]);

  const [variations, setVariations] = useState<Variation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddVariation, setShowAddVariation] = useState(false);
  const [showProcessPayment, setShowProcessPayment] = useState(false);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    plannedDate: "",
    paymentPercentage: 10,
    deliverables: [] as string[]
  });

  const [newVariation, setNewVariation] = useState({
    title: "",
    description: "",
    category: "scope_change" as const,
    impactType: "cost" as const,
    costImpact: 0,
    timeImpact: 0,
    justification: ""
  });

  const [newPayment, setNewPayment] = useState({
    type: "milestone" as const,
    amount: 0,
    description: "",
    dueDate: "",
    milestoneId: ""
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.plannedDate) return;

    const milestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: newMilestone.title,
      description: newMilestone.description,
      plannedDate: newMilestone.plannedDate,
      progress: 0,
      deliverables: newMilestone.deliverables,
      status: 'pending',
      paymentPercentage: newMilestone.paymentPercentage,
      paymentAmount: (project.approvedBudget || project.estimatedBudget) * (newMilestone.paymentPercentage / 100),
      paymentStatus: 'pending',
      documents: []
    };

    setMilestones([...milestones, milestone]);
    onMilestoneUpdate(project.id, milestone);

    setNewMilestone({
      title: "",
      description: "",
      plannedDate: "",
      paymentPercentage: 10,
      deliverables: []
    });
    setShowAddMilestone(false);
  };

  const addVariation = () => {
    if (!newVariation.title || !newVariation.description) return;

    const variation: Variation = {
      id: `var-${Date.now()}`,
      title: newVariation.title,
      description: newVariation.description,
      category: newVariation.category,
      impactType: newVariation.impactType,
      costImpact: newVariation.costImpact,
      timeImpact: newVariation.timeImpact,
      justification: newVariation.justification,
      requestedBy: 'current-user',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      comments: ""
    };

    setVariations([...variations, variation]);
    onVariationRequest(project.id, variation);

    setNewVariation({
      title: "",
      description: "",
      category: "scope_change",
      impactType: "cost",
      costImpact: 0,
      timeImpact: 0,
      justification: ""
    });
    setShowAddVariation(false);
  };

  const processPayment = () => {
    if (!newPayment.amount || !newPayment.description) return;

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      milestoneId: newPayment.milestoneId || undefined,
      type: newPayment.type,
      amount: newPayment.amount,
      description: newPayment.description,
      dueDate: newPayment.dueDate,
      status: 'pending',
      documents: []
    };

    setPayments([...payments, payment]);
    onPaymentProcess(project.id, payment);

    setNewPayment({
      type: "milestone",
      amount: 0,
      description: "",
      dueDate: "",
      milestoneId: ""
    });
    setShowProcessPayment(false);
  };

  const updateMilestoneProgress = (milestoneId: string, progress: number) => {
    setMilestones(prev => prev.map(m =>
      m.id === milestoneId
        ? {
            ...m,
            progress,
            status: progress === 100 ? 'completed' as const : 'in_progress' as const,
            actualDate: progress === 100 ? new Date().toISOString() : undefined
          }
        : m
    ));
  };

  const approveVariation = (variationId: string) => {
    setVariations(prev => prev.map(v =>
      v.id === variationId
        ? {
            ...v,
            status: 'approved' as const,
            approvedBy: 'current-user',
            approvedAt: new Date().toISOString()
          }
        : v
    ));
  };

  const getMilestoneStatusColor = (status: Milestone['status']) => {
    const colors = {
      'pending': 'bg-gray-500',
      'in_progress': 'bg-blue-500',
      'completed': 'bg-green-500',
      'overdue': 'bg-red-500'
    };
    return colors[status];
  };

  const getVariationStatusColor = (status: Variation['status']) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'under_review': 'bg-blue-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500',
      'implemented': 'bg-green-700'
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: Payment['status']) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'approved': 'bg-blue-500',
      'processed': 'bg-green-500',
      'paid': 'bg-green-700'
    };
    return colors[status];
  };

  const totalProjectProgress = milestones.reduce((sum, milestone) =>
    sum + (milestone.progress * milestone.paymentPercentage / 100), 0
  ) / milestones.reduce((sum, milestone) => sum + milestone.paymentPercentage, 0) * 100;

  const totalPaymentsProcessed = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalVariationCost = variations
    .filter(v => v.status === 'approved')
    .reduce((sum, v) => sum + v.costImpact, 0);

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProjectProgress)}%</div>
            <Progress value={totalProjectProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Processed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaymentsProcessed)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(project.approvedBudget || project.estimatedBudget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Milestones</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestones.filter(m => m.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {milestones.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variations</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalVariationCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              {variations.length} variation{variations.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Milestones Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Milestones</CardTitle>
          <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Milestone Title</Label>
                  <Input
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Milestone name"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Milestone description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Planned Date</Label>
                    <Input
                      type="date"
                      value={newMilestone.plannedDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, plannedDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Payment Percentage</Label>
                    <Input
                      type="number"
                      value={newMilestone.paymentPercentage}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, paymentPercentage: parseInt(e.target.value) || 0 }))}
                      placeholder="% of total contract"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddMilestone(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addMilestone}>
                    Add Milestone
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Due: {new Date(milestone.plannedDate).toLocaleDateString()}</span>
                      <span>Payment: {formatCurrency(milestone.paymentAmount)}</span>
                      <Badge variant="outline" className={cn("text-white", getMilestoneStatusColor(milestone.status))}>
                        {milestone.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    {milestone.status === 'in_progress' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMilestoneProgress(milestone.id, Math.min(milestone.progress + 10, 100))}
                        >
                          +10%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMilestoneProgress(milestone.id, Math.min(milestone.progress + 25, 100))}
                        >
                          +25%
                        </Button>
                      </>
                    )}
                  </div>

                  {milestone.status === 'completed' && milestone.paymentStatus === 'pending' && (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setNewPayment({
                          type: 'milestone',
                          amount: milestone.paymentAmount,
                          description: `Payment for milestone: ${milestone.title}`,
                          dueDate: new Date().toISOString().split('T')[0],
                          milestoneId: milestone.id
                        });
                        setShowProcessPayment(true);
                      }}
                    >
                      <DollarSign className="h-4 w-4" />
                      Process Payment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variations Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Variations</CardTitle>
          <Dialog open={showAddVariation} onOpenChange={setShowAddVariation}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Request Variation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Project Variation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Variation Title</Label>
                  <Input
                    value={newVariation.title}
                    onChange={(e) => setNewVariation(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title of the variation"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newVariation.description}
                    onChange={(e) => setNewVariation(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the variation"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newVariation.category}
                      onValueChange={(value) => setNewVariation(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scope_change">Scope Change</SelectItem>
                        <SelectItem value="cost_increase">Cost Increase</SelectItem>
                        <SelectItem value="timeline_extension">Timeline Extension</SelectItem>
                        <SelectItem value="specification_change">Specification Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Impact Type</Label>
                    <Select
                      value={newVariation.impactType}
                      onValueChange={(value) => setNewVariation(prev => ({ ...prev, impactType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                        <SelectItem value="scope">Scope</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cost Impact (₦)</Label>
                    <Input
                      type="number"
                      value={newVariation.costImpact}
                      onChange={(e) => setNewVariation(prev => ({ ...prev, costImpact: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Time Impact (Days)</Label>
                    <Input
                      type="number"
                      value={newVariation.timeImpact}
                      onChange={(e) => setNewVariation(prev => ({ ...prev, timeImpact: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Justification</Label>
                  <Textarea
                    value={newVariation.justification}
                    onChange={(e) => setNewVariation(prev => ({ ...prev, justification: e.target.value }))}
                    placeholder="Justify why this variation is necessary"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddVariation(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addVariation}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variations.map((variation) => (
              <div key={variation.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{variation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{variation.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Cost Impact: {formatCurrency(variation.costImpact)}</span>
                      <span>Time Impact: {variation.timeImpact} days</span>
                      <Badge variant="outline" className={cn("text-white", getVariationStatusColor(variation.status))}>
                        {variation.status}
                      </Badge>
                    </div>
                  </div>
                  {variation.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveVariation(variation.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {variations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4" />
                <p>No variations requested yet.</p>
                <p className="text-sm">Project variations will appear here as they are requested.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Processing Dialog */}
      <Dialog open={showProcessPayment} onOpenChange={setShowProcessPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Type</Label>
              <Select
                value={newPayment.type}
                onValueChange={(value) => setNewPayment(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestone">Milestone Payment</SelectItem>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                  <SelectItem value="variation">Variation Payment</SelectItem>
                  <SelectItem value="final">Final Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newPayment.description}
                onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Payment description"
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProcessPayment(false)}>
                Cancel
              </Button>
              <Button onClick={processPayment}>
                Process Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}