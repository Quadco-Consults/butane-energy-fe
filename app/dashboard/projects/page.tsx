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
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  DollarSign,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  Target,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectProcess } from "@/lib/types";

export default function ProjectManagementPage() {
  const {
    projectProcesses,
    createProjectProcess,
    updateProjectProcess,
    processInstances,
    startProcess,
    advanceProcess,
    getDashboardStats
  } = useWorkflow();
  const { plants } = useERP();

  const [selectedTab, setSelectedTab] = useState("active");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectProcess | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    projectType: "infrastructure" as const,
    estimatedBudget: 0,
    plannedStartDate: "",
    plannedEndDate: "",
    plantId: "",
    priority: "medium" as const
  });

  // Get statistics for project processes
  const stats = getDashboardStats();
  const activeProjects = projectProcesses.filter(project =>
    !['completed', 'cancelled', 'on_hold'].includes(project.status)
  );
  const budgetApprovalPending = projectProcesses.filter(project =>
    ['budget_development', 'stakeholder_meeting', 'budget_approval'].includes(project.status)
  );
  const tenderPhase = projectProcesses.filter(project =>
    ['tender_preparation', 'tender_publication', 'bid_evaluation', 'contractor_selection'].includes(project.status)
  );
  const completedThisMonth = projectProcesses.filter(project =>
    project.status === 'completed' &&
    new Date(project.completedAt || '').getMonth() === new Date().getMonth()
  );

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.plantId || !newProject.estimatedBudget) return;

    // Create the project process
    const project = createProjectProcess({
      ...newProject,
      requestedBy: 'current-user' // This would be from auth context
    });

    // Start the workflow process
    startProcess(
      'project-management',
      project.id,
      'current-user',
      {
        projectType: newProject.projectType,
        estimatedBudget: newProject.estimatedBudget,
        plantId: newProject.plantId
      }
    );

    setShowCreateDialog(false);
    setNewProject({
      title: "",
      description: "",
      projectType: "infrastructure",
      estimatedBudget: 0,
      plannedStartDate: "",
      plannedEndDate: "",
      plantId: "",
      priority: "medium"
    });
  };

  const getStatusColor = (status: ProjectProcess['status']) => {
    const statusColors = {
      'budget_development': 'bg-blue-500',
      'stakeholder_meeting': 'bg-yellow-500',
      'budget_approval': 'bg-orange-500',
      'tender_preparation': 'bg-purple-500',
      'tender_publication': 'bg-indigo-500',
      'bid_evaluation': 'bg-cyan-500',
      'contractor_selection': 'bg-blue-600',
      'contract_award': 'bg-green-500',
      'project_execution': 'bg-green-600',
      'milestone_payment': 'bg-yellow-600',
      'variation_management': 'bg-orange-600',
      'project_completion': 'bg-green-700',
      'final_payment': 'bg-green-800',
      'completed': 'bg-green-900',
      'cancelled': 'bg-red-500',
      'on_hold': 'bg-gray-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: ProjectProcess['status']) => {
    const statusLabels = {
      'budget_development': 'Budget Development',
      'stakeholder_meeting': 'Stakeholder Meeting',
      'budget_approval': 'Budget Approval',
      'tender_preparation': 'Tender Preparation',
      'tender_publication': 'Tender Publication',
      'bid_evaluation': 'Bid Evaluation',
      'contractor_selection': 'Contractor Selection',
      'contract_award': 'Contract Award',
      'project_execution': 'Project Execution',
      'milestone_payment': 'Milestone Payment',
      'variation_management': 'Variation Management',
      'project_completion': 'Project Completion',
      'final_payment': 'Final Payment',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'on_hold': 'On Hold'
    };
    return statusLabels[status] || status;
  };

  const getCurrentStep = (project: ProjectProcess) => {
    const stepOrder = [
      'budget_development',
      'stakeholder_meeting',
      'budget_approval',
      'tender_preparation',
      'tender_publication',
      'bid_evaluation',
      'contractor_selection',
      'contract_award',
      'project_execution',
      'milestone_payment',
      'variation_management',
      'project_completion',
      'final_payment',
      'completed'
    ];

    const currentIndex = stepOrder.indexOf(project.status);
    return { current: currentIndex + 1, total: stepOrder.length - 1 };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">
            Infrastructure Projects & Budget Management
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Kano Plant Expansion"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description and objectives"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Project Type</Label>
                  <Select
                    value={newProject.projectType}
                    onValueChange={(value) => setNewProject(prev => ({ ...prev, projectType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="expansion">Expansion</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newProject.priority}
                    onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="plant">Target Plant</Label>
                <Select
                  value={newProject.plantId}
                  onValueChange={(value) => setNewProject(prev => ({ ...prev, plantId: value }))}
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
                <Label htmlFor="budget">Estimated Budget (₦)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newProject.estimatedBudget || ""}
                  onChange={(e) => setNewProject(prev => ({
                    ...prev,
                    estimatedBudget: parseInt(e.target.value) || 0
                  }))}
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Planned Start</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.plannedStartDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, plannedStartDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Planned End</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProject.plannedEndDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, plannedEndDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
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
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {budgetApprovalPending.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tender Phase</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {tenderPhase.length}
            </div>
            <p className="text-xs text-muted-foreground">
              In tender process
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(activeProjects.reduce((sum, p) => sum + (p.approvedBudget || p.estimatedBudget), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Active ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Budget Phase ({budgetApprovalPending.length})
          </TabsTrigger>
          <TabsTrigger value="tender" className="gap-2">
            <FileText className="h-4 w-4" />
            Tender Phase ({tenderPhase.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Active Projects */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeProjects.map((project) => {
              const plant = plants.find(p => p.id === project.plantId);
              const stepInfo = getCurrentStep(project);

              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", getStatusColor(project.status))} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{project.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {project.projectType}
                              </Badge>
                              {project.priority === 'high' || project.priority === 'critical' && (
                                <Badge variant="destructive" className="text-xs">
                                  {project.priority}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {plant?.name} • {formatCurrency(project.approvedBudget || project.estimatedBudget)}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            Step {stepInfo.current} of {stepInfo.total}
                          </Badge>
                          <p className="text-sm font-medium">{getStatusLabel(project.status)}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProject(project)}
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
                          className={cn("h-2 rounded-full transition-all", getStatusColor(project.status))}
                          style={{ width: `${(stepInfo.current / stepInfo.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contractor:</span>
                        <p className="font-medium">
                          {project.selectedContractor || 'Not selected'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start Date:</span>
                        <p className="font-medium">
                          {project.actualStartDate
                            ? new Date(project.actualStartDate).toLocaleDateString()
                            : project.plannedStartDate
                              ? new Date(project.plannedStartDate).toLocaleDateString()
                              : 'TBD'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date:</span>
                        <p className="font-medium">
                          {project.actualEndDate
                            ? new Date(project.actualEndDate).toLocaleDateString()
                            : project.plannedEndDate
                              ? new Date(project.plannedEndDate).toLocaleDateString()
                              : 'TBD'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget Status:</span>
                        <p className="font-medium">
                          {project.approvedBudget ? 'Approved' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeProjects.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground mb-4">
                    Start a new project to manage infrastructure development.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Create New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Budget Phase */}
        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-4">
            {budgetApprovalPending.map((project) => {
              const plant = plants.find(p => p.id === project.plantId);

              return (
                <Card key={project.id} className="border-yellow-500/50 bg-yellow-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold text-yellow-700">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plant?.name} • {formatCurrency(project.estimatedBudget)}
                          </p>
                          <p className="text-sm mt-1 text-yellow-600">
                            {getStatusLabel(project.status)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                        >
                          Review Budget
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

            {budgetApprovalPending.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Budgets</h3>
                  <p className="text-muted-foreground">
                    All project budgets are approved or in other phases.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="tender">
          <div className="text-center py-8 text-muted-foreground">
            Tender phase view coming soon...
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8 text-muted-foreground">
            Completed projects view coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}