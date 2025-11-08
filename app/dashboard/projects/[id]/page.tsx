"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useERP } from "@/contexts/ERPContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProjectBudgetManager } from "@/components/ProjectBudgetManager";
import { ProjectTenderManager } from "@/components/ProjectTenderManager";
import { ProjectExecutionManager } from "@/components/ProjectExecutionManager";
import {
  Building2,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Progress,
  Target,
  Briefcase,
  Settings,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectProcess } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const {
    projectProcesses,
    updateProjectProcess,
    processInstances,
    advanceProcess,
    getWorkflowByType
  } = useWorkflow();
  const { plants } = useERP();

  const project = projectProcesses.find(p => p.id === projectId);
  const plant = plants.find(p => p.id === project?.plantId);
  const workflow = getWorkflowByType('project-management');
  const processInstance = processInstances.find(p => p.referenceId === projectId);

  const [selectedTab, setSelectedTab] = useState("overview");

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Project Not Found</h3>
          <p className="text-muted-foreground">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

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

  const getCurrentStep = () => {
    if (!workflow) return { current: 0, total: 0 };

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

  const handleBudgetUpdate = (projectId: string, budgetData: any) => {
    updateProjectProcess(projectId, {
      estimatedBudget: budgetData.finalBudget,
      budgetDetails: budgetData
    });

    // Advance to stakeholder meeting
    if (processInstance) {
      advanceProcess(processInstance.id, 'completed', 'current-user', 'Budget development completed');
    }
  };

  const handleStakeholderMeeting = (projectId: string, meetingData: any) => {
    updateProjectProcess(projectId, {
      stakeholderMeetingHeld: true,
      stakeholderFeedback: meetingData.feedback
    });

    // Advance based on decision
    if (processInstance) {
      advanceProcess(processInstance.id, meetingData.decision, 'current-user', meetingData.feedback);
    }
  };

  const handleBudgetApproval = (projectId: string, approvalData: any) => {
    updateProjectProcess(projectId, {
      approvedBudget: approvalData.requestedAmount,
      budgetApprovedBy: 'current-user',
      budgetApprovalDate: new Date().toISOString()
    });

    // Advance to tender preparation
    if (processInstance) {
      advanceProcess(processInstance.id, 'approved', 'current-user', 'Budget approved for tender preparation');
    }
  };

  const advanceToNextStep = (action: string, comments: string = '') => {
    if (processInstance) {
      advanceProcess(processInstance.id, action, 'current-user', comments);
    }
  };

  const handleTenderUpdate = (projectId: string, tenderData: any) => {
    updateProjectProcess(projectId, {
      tenderDetails: tenderData
    });

    // Advance to tender publication
    if (processInstance) {
      advanceProcess(processInstance.id, 'completed', 'current-user', 'Tender preparation completed');
    }
  };

  const handleBidEvaluation = (projectId: string, evaluationData: any) => {
    updateProjectProcess(projectId, {
      bidEvaluation: evaluationData
    });

    // Advance to contractor selection
    if (processInstance) {
      advanceProcess(processInstance.id, 'bids_qualified', 'current-user', 'Bid evaluation completed');
    }
  };

  const handleContractorSelection = (projectId: string, contractorData: any) => {
    updateProjectProcess(projectId, {
      selectedContractor: contractorData.selectedContractor,
      contractAmount: contractorData.contractAmount,
      contractDuration: contractorData.contractDuration
    });

    // Advance to contract award
    if (processInstance) {
      advanceProcess(processInstance.id, 'contractor_selected', 'current-user', 'Contractor selected for award');
    }
  };

  const handleMilestoneUpdate = (projectId: string, milestone: any) => {
    updateProjectProcess(projectId, {
      currentMilestone: milestone.title,
      projectProgress: milestone.progress
    });
  };

  const handleVariationRequest = (projectId: string, variation: any) => {
    updateProjectProcess(projectId, {
      hasVariations: true,
      lastVariation: variation.title
    });
  };

  const handlePaymentProcess = (projectId: string, payment: any) => {
    updateProjectProcess(projectId, {
      lastPayment: payment.amount,
      paymentDate: new Date().toISOString()
    });
  };

  const handleProjectProgress = (projectId: string, progressData: any) => {
    updateProjectProcess(projectId, progressData);
  };

  const stepInfo = getCurrentStep();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <Badge variant="outline" className={cn("text-white", getStatusColor(project.status))}>
                {getStatusLabel(project.status)}
              </Badge>
              {project.priority && (project.priority === 'high' || project.priority === 'critical') && (
                <Badge variant="destructive">
                  {project.priority}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {plant?.name} • Project #{project.projectNumber}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-lg font-semibold">
            Step {stepInfo.current} of {stepInfo.total}
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round((stepInfo.current / stepInfo.total) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={cn("h-3 rounded-full transition-all", getStatusColor(project.status))}
          style={{ width: `${(stepInfo.current / stepInfo.total) * 100}%` }}
        />
      </div>

      {/* Project Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(project.approvedBudget || project.estimatedBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {project.approvedBudget ? 'Approved' : 'Estimated'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.actualStartDate
                ? new Date(project.actualStartDate).toLocaleDateString()
                : project.plannedStartDate
                  ? new Date(project.plannedStartDate).toLocaleDateString()
                  : 'TBD'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {project.actualStartDate ? 'Started' : 'Planned Start'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contractor</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.selectedContractor || 'TBD'}
            </div>
            <p className="text-xs text-muted-foreground">
              Primary Contractor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.actualEndDate
                ? new Date(project.actualEndDate).toLocaleDateString()
                : project.plannedEndDate
                  ? new Date(project.plannedEndDate).toLocaleDateString()
                  : 'TBD'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {project.actualEndDate ? 'Completed' : 'Target Date'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Budget & Approval
          </TabsTrigger>
          <TabsTrigger value="tender" className="gap-2">
            <FileText className="h-4 w-4" />
            Tender & Contractor
          </TabsTrigger>
          <TabsTrigger value="execution" className="gap-2">
            <Target className="h-4 w-4" />
            Execution & Payment
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <Progress className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="mt-1">{project.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Project Type</h4>
                  <p className="mt-1 capitalize">{project.projectType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p className="mt-1">{plant?.name} - {plant?.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
                  <p className="mt-1 capitalize">{project.priority}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{getStatusLabel(project.status)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {workflow?.steps.find(s => s.id === project.status.replace('_', '-'))?.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {project.status === 'tender_preparation' && (
                      <Button onClick={() => advanceToNextStep('completed', 'Tender documents prepared')}>
                        Mark Tender Ready
                      </Button>
                    )}
                    {project.status === 'tender_publication' && (
                      <Button onClick={() => advanceToNextStep('bids_received', 'Bids received from contractors')}>
                        Bids Received
                      </Button>
                    )}
                    {project.status === 'bid_evaluation' && (
                      <Button onClick={() => advanceToNextStep('bids_qualified', 'Bid evaluation completed')}>
                        Complete Evaluation
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget & Approval Tab */}
        <TabsContent value="budget" className="space-y-6">
          <ProjectBudgetManager
            project={project}
            onBudgetUpdate={handleBudgetUpdate}
            onStakeholderMeeting={handleStakeholderMeeting}
            onBudgetApproval={handleBudgetApproval}
          />
        </TabsContent>

        {/* Tender & Contractor Tab */}
        <TabsContent value="tender" className="space-y-6">
          <ProjectTenderManager
            project={project}
            onTenderUpdate={handleTenderUpdate}
            onBidEvaluation={handleBidEvaluation}
            onContractorSelection={handleContractorSelection}
          />
        </TabsContent>

        {/* Execution & Payment Tab */}
        <TabsContent value="execution" className="space-y-6">
          <ProjectExecutionManager
            project={project}
            onMilestoneUpdate={handleMilestoneUpdate}
            onVariationRequest={handleVariationRequest}
            onPaymentProcess={handlePaymentProcess}
            onProjectProgress={handleProjectProgress}
          />
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflow?.steps.map((step, index) => {
                  const isCompleted = stepOrder.indexOf(project.status) > stepOrder.indexOf(step.id.replace('-', '_'));
                  const isCurrent = step.id.replace('-', '_') === project.status;
                  const isPending = stepOrder.indexOf(project.status) < stepOrder.indexOf(step.id.replace('-', '_'));

                  const stepOrder = [
                    'budget-development',
                    'stakeholder-meeting',
                    'budget-approval',
                    'tender-preparation',
                    'tender-publication',
                    'bid-evaluation',
                    'contractor-selection',
                    'contract-award',
                    'project-execution',
                    'milestone-payment',
                    'variation-management',
                    'project-completion',
                    'final-payment',
                    'project-closed'
                  ];

                  return (
                    <div key={step.id} className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                      isCompleted && "bg-green-50 border-green-200",
                      isCurrent && "bg-blue-50 border-blue-200",
                      isPending && "bg-gray-50 border-gray-200"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        isCompleted && "bg-green-500 text-white",
                        isCurrent && "bg-blue-500 text-white",
                        isPending && "bg-gray-300 text-gray-600"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isCurrent ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.name}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {step.department}
                          </Badge>
                          {step.requiredRole && (
                            <Badge variant="outline" className="text-xs">
                              {step.requiredRole}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        {isCompleted && (
                          <Badge variant="default" className="bg-green-500">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default" className="bg-blue-500">
                            In Progress
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="secondary">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Document management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4" />
                <p>Project history tracking coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}