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
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Plus,
  Edit3,
  Check,
  X,
  Users,
  FileText,
  Calculator,
  TrendingUp,
  AlertCircle,
  Clock,
  Eye,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectProcess } from "@/lib/types";

interface BudgetLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

interface ProjectBudgetManagerProps {
  project: ProjectProcess;
  onBudgetUpdate: (projectId: string, budget: BudgetData) => void;
  onStakeholderMeeting: (projectId: string, meetingData: any) => void;
  onBudgetApproval: (projectId: string, approvalData: any) => void;
}

interface BudgetData {
  lineItems: BudgetLineItem[];
  totalCost: number;
  contingency: number;
  finalBudget: number;
  justification: string;
  timeline: string;
  riskAssessment: string;
}

export function ProjectBudgetManager({
  project,
  onBudgetUpdate,
  onStakeholderMeeting,
  onBudgetApproval
}: ProjectBudgetManagerProps) {
  const [budget, setBudget] = useState<BudgetData>({
    lineItems: [],
    totalCost: 0,
    contingency: 10, // 10% default contingency
    finalBudget: 0,
    justification: "",
    timeline: "",
    riskAssessment: ""
  });

  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetLineItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: "",
    description: "",
    quantity: 1,
    unitCost: 0,
    notes: ""
  });

  const [stakeholderMeeting, setStakeholderMeeting] = useState({
    scheduledDate: "",
    attendees: [] as string[],
    agenda: "",
    feedback: "",
    decision: "" as "approved" | "revision_required" | "rejected" | ""
  });

  const [approvalRequest, setApprovalRequest] = useState({
    requestedAmount: 0,
    justification: "",
    urgency: "medium" as "low" | "medium" | "high",
    approverComments: ""
  });

  const budgetCategories = [
    "Materials",
    "Labor",
    "Equipment",
    "Transportation",
    "Permits & Licenses",
    "Professional Services",
    "Utilities",
    "Safety & Security",
    "Contingency",
    "Other"
  ];

  const calculateTotals = () => {
    const totalCost = budget.lineItems.reduce((sum, item) => sum + item.totalCost, 0);
    const contingencyAmount = totalCost * (budget.contingency / 100);
    const finalBudget = totalCost + contingencyAmount;

    setBudget(prev => ({
      ...prev,
      totalCost,
      finalBudget
    }));
  };

  const addBudgetItem = () => {
    if (!newItem.category || !newItem.description) return;

    const item: BudgetLineItem = {
      id: `item-${Date.now()}`,
      category: newItem.category,
      description: newItem.description,
      quantity: newItem.quantity,
      unitCost: newItem.unitCost,
      totalCost: newItem.quantity * newItem.unitCost,
      notes: newItem.notes
    };

    setBudget(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, item]
    }));

    setNewItem({
      category: "",
      description: "",
      quantity: 1,
      unitCost: 0,
      notes: ""
    });
    setShowAddItem(false);
  };

  const updateBudgetItem = (itemId: string, updatedItem: Partial<BudgetLineItem>) => {
    setBudget(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              ...updatedItem,
              totalCost: (updatedItem.quantity || item.quantity) * (updatedItem.unitCost || item.unitCost)
            }
          : item
      )
    }));
    setEditingItem(null);
  };

  const removeBudgetItem = (itemId: string) => {
    setBudget(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== itemId)
    }));
  };

  const submitBudgetForReview = () => {
    calculateTotals();
    onBudgetUpdate(project.id, budget);
  };

  const scheduleStakeholderMeeting = () => {
    onStakeholderMeeting(project.id, stakeholderMeeting);
  };

  const submitForApproval = () => {
    const approvalData = {
      ...approvalRequest,
      requestedAmount: budget.finalBudget,
      budgetBreakdown: budget
    };
    onBudgetApproval(project.id, approvalData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetStatusColor = () => {
    switch (project.status) {
      case 'budget_development':
        return 'bg-blue-500';
      case 'stakeholder_meeting':
        return 'bg-yellow-500';
      case 'budget_approval':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Budget Management</h2>
          <p className="text-muted-foreground">{project.title}</p>
        </div>
        <Badge variant="outline" className={cn("text-white", getBudgetStatusColor())}>
          {project.status === 'budget_development' && 'In Development'}
          {project.status === 'stakeholder_meeting' && 'Stakeholder Review'}
          {project.status === 'budget_approval' && 'Pending Approval'}
        </Badge>
      </div>

      {/* Budget Development Phase */}
      {project.status === 'budget_development' && (
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(budget.totalCost)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contingency ({budget.contingency}%)</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(budget.totalCost * (budget.contingency / 100))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Final Budget</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(budget.finalBudget)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Budget Line Items</CardTitle>
              <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Budget Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div>
                        <Label>Unit Cost (₦)</Label>
                        <Input
                          type="number"
                          value={newItem.unitCost}
                          onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        value={newItem.notes}
                        onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddItem(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addBudgetItem}>
                        Add Item
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budget.lineItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <h4 className="font-medium">{item.description}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitCost)} = {formatCurrency(item.totalCost)}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBudgetItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {budget.lineItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No budget items added yet.</p>
                    <p className="text-sm">Click "Add Item" to start building your budget.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget Justification */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Justification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Justification</Label>
                <Textarea
                  value={budget.justification}
                  onChange={(e) => setBudget(prev => ({ ...prev, justification: e.target.value }))}
                  placeholder="Explain the need for this project and justify the budget requirements"
                  rows={3}
                />
              </div>
              <div>
                <Label>Timeline</Label>
                <Textarea
                  value={budget.timeline}
                  onChange={(e) => setBudget(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="Provide project timeline and key milestones"
                  rows={3}
                />
              </div>
              <div>
                <Label>Risk Assessment</Label>
                <Textarea
                  value={budget.riskAssessment}
                  onChange={(e) => setBudget(prev => ({ ...prev, riskAssessment: e.target.value }))}
                  placeholder="Identify potential risks and mitigation strategies"
                  rows={3}
                />
              </div>
              <div>
                <Label>Contingency Percentage</Label>
                <Input
                  type="number"
                  value={budget.contingency}
                  onChange={(e) => setBudget(prev => ({ ...prev, contingency: parseInt(e.target.value) || 10 }))}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Budget
            </Button>
            <Button onClick={submitBudgetForReview} disabled={budget.lineItems.length === 0}>
              Submit for Review
            </Button>
          </div>
        </div>
      )}

      {/* Stakeholder Meeting Phase */}
      {project.status === 'stakeholder_meeting' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Stakeholder Meeting Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meeting Date</Label>
                <Input
                  type="datetime-local"
                  value={stakeholderMeeting.scheduledDate}
                  onChange={(e) => setStakeholderMeeting(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>Attendees</Label>
                <Input
                  placeholder="Comma-separated list of attendees"
                  value={stakeholderMeeting.attendees.join(', ')}
                  onChange={(e) => setStakeholderMeeting(prev => ({
                    ...prev,
                    attendees: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                />
              </div>
            </div>
            <div>
              <Label>Meeting Agenda</Label>
              <Textarea
                value={stakeholderMeeting.agenda}
                onChange={(e) => setStakeholderMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="Meeting agenda and discussion points"
                rows={3}
              />
            </div>
            <div>
              <Label>Stakeholder Feedback</Label>
              <Textarea
                value={stakeholderMeeting.feedback}
                onChange={(e) => setStakeholderMeeting(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Record feedback and concerns from stakeholders"
                rows={3}
              />
            </div>
            <div>
              <Label>Decision</Label>
              <Select
                value={stakeholderMeeting.decision}
                onValueChange={(value) => setStakeholderMeeting(prev => ({ ...prev, decision: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved - Proceed to Executive Approval</SelectItem>
                  <SelectItem value="revision_required">Revision Required</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={scheduleStakeholderMeeting} disabled={!stakeholderMeeting.decision}>
                Update Meeting Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Approval Phase */}
      {project.status === 'budget_approval' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Executive Approval Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Requested Amount</Label>
                <Input
                  value={formatCurrency(budget.finalBudget)}
                  disabled
                  className="font-semibold"
                />
              </div>
              <div>
                <Label>Urgency Level</Label>
                <Select
                  value={approvalRequest.urgency}
                  onValueChange={(value) => setApprovalRequest(prev => ({ ...prev, urgency: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Executive Summary & Justification</Label>
              <Textarea
                value={approvalRequest.justification}
                onChange={(e) => setApprovalRequest(prev => ({ ...prev, justification: e.target.value }))}
                placeholder="Executive summary for budget approval"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Budget Report
              </Button>
              <Button onClick={submitForApproval} disabled={!approvalRequest.justification}>
                Submit for Executive Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}