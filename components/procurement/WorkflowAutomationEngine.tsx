'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Play, Pause, Square, Settings, Zap, Clock, CheckCircle,
  XCircle, AlertTriangle, BarChart3, Activity, Workflow,
  Users, Building, Calendar, Target, Shield, Bot,
  ArrowRight, GitBranch, RefreshCw, Bell, Mail,
  Filter, Search, Plus, Edit, Trash2, Eye,
  TrendingUp, TrendingDown, Gauge, Brain, Cog
} from 'lucide-react'

interface WorkflowRule {
  id: string
  name: string
  description: string
  trigger: 'DOCUMENT_CREATED' | 'VALUE_THRESHOLD' | 'TIME_BASED' | 'EXCEPTION_DETECTED' | 'APPROVAL_REQUIRED'
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  enabled: boolean
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  category: 'APPROVAL' | 'NOTIFICATION' | 'ROUTING' | 'VALIDATION' | 'ESCALATION'
  executionCount: number
  successRate: number
  lastExecuted?: string
}

interface WorkflowCondition {
  field: string
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'NOT_EQUALS'
  value: string | number
  logicalOperator?: 'AND' | 'OR'
}

interface WorkflowAction {
  type: 'SEND_EMAIL' | 'ROUTE_FOR_APPROVAL' | 'AUTO_APPROVE' | 'SET_FIELD' | 'CREATE_DOCUMENT' | 'ESCALATE'
  parameters: Record<string, any>
  delay?: number
}

interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  triggerEvent: string
  documentId: string
  documentType: 'PR' | 'PO' | 'GR' | 'IV' | 'CONTRACT'
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED'
  startTime: string
  endTime?: string
  duration?: number
  steps: WorkflowStep[]
  errorMessage?: string
}

interface WorkflowStep {
  stepId: string
  stepName: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED'
  startTime?: string
  endTime?: string
  result?: any
  errorMessage?: string
}

interface WorkflowAutomationEngineProps {
  workflows?: WorkflowRule[]
  executions?: WorkflowExecution[]
  onCreateWorkflow?: (workflow: Partial<WorkflowRule>) => void
  onUpdateWorkflow?: (id: string, workflow: Partial<WorkflowRule>) => void
  onExecuteWorkflow?: (id: string, documentId: string) => void
  onPauseWorkflow?: (id: string) => void
  onResumeWorkflow?: (id: string) => void
  userPermissions?: {
    canCreate: boolean
    canEdit: boolean
    canExecute: boolean
    canView: boolean
    canManage: boolean
  }
}

export default function WorkflowAutomationEngine({
  workflows = [],
  executions = [],
  onCreateWorkflow = () => {},
  onUpdateWorkflow = () => {},
  onExecuteWorkflow = () => {},
  onPauseWorkflow = () => {},
  onResumeWorkflow = () => {},
  userPermissions = {
    canCreate: true,
    canEdit: true,
    canExecute: true,
    canView: true,
    canManage: true
  }
}: WorkflowAutomationEngineProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)

  // Mock data for demonstration
  const mockWorkflows: WorkflowRule[] = [
    {
      id: 'WF001',
      name: 'High Value PO Approval',
      description: 'Automatically route purchase orders over $10,000 for manager approval',
      trigger: 'DOCUMENT_CREATED',
      conditions: [
        { field: 'totalValue', operator: 'GREATER_THAN', value: 10000 }
      ],
      actions: [
        {
          type: 'ROUTE_FOR_APPROVAL',
          parameters: { approverRole: 'MANAGER', escalationTime: 24 }
        },
        {
          type: 'SEND_EMAIL',
          parameters: { template: 'po_approval_required', recipient: 'manager' }
        }
      ],
      enabled: true,
      priority: 'HIGH',
      category: 'APPROVAL',
      executionCount: 245,
      successRate: 98.7,
      lastExecuted: '2024-01-16T10:30:00Z'
    },
    {
      id: 'WF002',
      name: 'Emergency PR Fast Track',
      description: 'Auto-approve emergency purchase requisitions under $5,000',
      trigger: 'DOCUMENT_CREATED',
      conditions: [
        { field: 'priority', operator: 'EQUALS', value: 'URGENT' },
        { field: 'totalValue', operator: 'LESS_THAN', value: 5000, logicalOperator: 'AND' }
      ],
      actions: [
        {
          type: 'AUTO_APPROVE',
          parameters: { approver: 'SYSTEM', reason: 'Emergency fast track' }
        },
        {
          type: 'CREATE_DOCUMENT',
          parameters: { documentType: 'PO', autoGenerate: true }
        }
      ],
      enabled: true,
      priority: 'HIGH',
      category: 'APPROVAL',
      executionCount: 89,
      successRate: 100.0,
      lastExecuted: '2024-01-15T14:20:00Z'
    },
    {
      id: 'WF003',
      name: 'Invoice Variance Escalation',
      description: 'Escalate invoice verification exceptions to procurement manager',
      trigger: 'EXCEPTION_DETECTED',
      conditions: [
        { field: 'variancePercentage', operator: 'GREATER_THAN', value: 5 }
      ],
      actions: [
        {
          type: 'ESCALATE',
          parameters: { escalateTo: 'PROCUREMENT_MANAGER', severity: 'HIGH' }
        },
        {
          type: 'SEND_EMAIL',
          parameters: { template: 'variance_exception', urgency: 'HIGH' }
        }
      ],
      enabled: true,
      priority: 'HIGH',
      category: 'ESCALATION',
      executionCount: 34,
      successRate: 94.1,
      lastExecuted: '2024-01-14T09:15:00Z'
    },
    {
      id: 'WF004',
      name: 'Contract Renewal Reminder',
      description: 'Send renewal reminders for contracts expiring within 60 days',
      trigger: 'TIME_BASED',
      conditions: [
        { field: 'daysToExpiry', operator: 'LESS_THAN', value: 60 }
      ],
      actions: [
        {
          type: 'SEND_EMAIL',
          parameters: { template: 'contract_renewal_reminder', schedule: 'DAILY' }
        },
        {
          type: 'SET_FIELD',
          parameters: { field: 'renewalStatus', value: 'RENEWAL_REQUIRED' }
        }
      ],
      enabled: true,
      priority: 'MEDIUM',
      category: 'NOTIFICATION',
      executionCount: 156,
      successRate: 99.3,
      lastExecuted: '2024-01-16T08:00:00Z'
    },
    {
      id: 'WF005',
      name: 'Goods Receipt Quality Check',
      description: 'Automatically flag goods receipts with quality issues',
      trigger: 'DOCUMENT_CREATED',
      conditions: [
        { field: 'qualityIssue', operator: 'EQUALS', value: true }
      ],
      actions: [
        {
          type: 'SET_FIELD',
          parameters: { field: 'status', value: 'QUALITY_HOLD' }
        },
        {
          type: 'ROUTE_FOR_APPROVAL',
          parameters: { approverRole: 'QUALITY_MANAGER' }
        }
      ],
      enabled: true,
      priority: 'HIGH',
      category: 'VALIDATION',
      executionCount: 67,
      successRate: 97.0,
      lastExecuted: '2024-01-13T16:45:00Z'
    }
  ]

  const mockExecutions: WorkflowExecution[] = [
    {
      id: 'EX001',
      workflowId: 'WF001',
      workflowName: 'High Value PO Approval',
      triggerEvent: 'PO_CREATED',
      documentId: 'PO-2024-001',
      documentType: 'PO',
      status: 'COMPLETED',
      startTime: '2024-01-16T10:30:00Z',
      endTime: '2024-01-16T10:32:15Z',
      duration: 135,
      steps: [
        {
          stepId: 'STEP001',
          stepName: 'Evaluate Conditions',
          status: 'COMPLETED',
          startTime: '2024-01-16T10:30:00Z',
          endTime: '2024-01-16T10:30:05Z',
          result: 'Conditions met: totalValue > $10,000'
        },
        {
          stepId: 'STEP002',
          stepName: 'Route for Approval',
          status: 'COMPLETED',
          startTime: '2024-01-16T10:30:05Z',
          endTime: '2024-01-16T10:32:00Z',
          result: 'Routed to Manager: John Smith'
        },
        {
          stepId: 'STEP003',
          stepName: 'Send Email Notification',
          status: 'COMPLETED',
          startTime: '2024-01-16T10:32:00Z',
          endTime: '2024-01-16T10:32:15Z',
          result: 'Email sent to john.smith@company.com'
        }
      ]
    },
    {
      id: 'EX002',
      workflowId: 'WF002',
      workflowName: 'Emergency PR Fast Track',
      triggerEvent: 'PR_CREATED',
      documentId: 'PR-2024-156',
      documentType: 'PR',
      status: 'RUNNING',
      startTime: '2024-01-16T11:45:00Z',
      duration: 0,
      steps: [
        {
          stepId: 'STEP001',
          stepName: 'Evaluate Conditions',
          status: 'COMPLETED',
          startTime: '2024-01-16T11:45:00Z',
          endTime: '2024-01-16T11:45:02Z',
          result: 'Conditions met: priority=URGENT and totalValue < $5,000'
        },
        {
          stepId: 'STEP002',
          stepName: 'Auto Approve',
          status: 'RUNNING',
          startTime: '2024-01-16T11:45:02Z'
        },
        {
          stepId: 'STEP003',
          stepName: 'Create Purchase Order',
          status: 'PENDING'
        }
      ]
    }
  ]

  const allWorkflows = workflows.length > 0 ? workflows : mockWorkflows
  const allExecutions = executions.length > 0 ? executions : mockExecutions

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return allWorkflows.filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || workflow.category === categoryFilter
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'enabled' && workflow.enabled) ||
                           (statusFilter === 'disabled' && !workflow.enabled)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [allWorkflows, searchTerm, categoryFilter, statusFilter])

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalWorkflows = allWorkflows.length
    const enabledWorkflows = allWorkflows.filter(w => w.enabled).length
    const totalExecutions = allWorkflows.reduce((sum, w) => sum + w.executionCount, 0)
    const avgSuccessRate = allWorkflows.reduce((sum, w) => sum + w.successRate, 0) / totalWorkflows
    const recentExecutions = allExecutions.filter(e =>
      new Date(e.startTime).getTime() > Date.now() - (24 * 60 * 60 * 1000)
    ).length

    return {
      totalWorkflows,
      enabledWorkflows,
      totalExecutions,
      avgSuccessRate,
      recentExecutions,
      automationRate: (totalExecutions / (totalExecutions + 100)) * 100 // Mock calculation
    }
  }, [allWorkflows, allExecutions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300'
      case 'RUNNING': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-300'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'APPROVAL': return CheckCircle
      case 'NOTIFICATION': return Bell
      case 'ROUTING': return GitBranch
      case 'VALIDATION': return Shield
      case 'ESCALATION': return AlertTriangle
      default: return Workflow
    }
  }

  const WorkflowCreator = () => {
    const [workflowData, setWorkflowData] = useState({
      name: '',
      description: '',
      trigger: 'DOCUMENT_CREATED',
      category: 'APPROVAL',
      priority: 'MEDIUM',
      enabled: true
    })

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workflowName">Workflow Name *</Label>
            <Input
              id="workflowName"
              value={workflowData.name}
              onChange={(e) => setWorkflowData({...workflowData, name: e.target.value})}
              placeholder="Enter workflow name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={workflowData.category} onValueChange={(value) => setWorkflowData({...workflowData, category: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVAL">Approval</SelectItem>
                <SelectItem value="NOTIFICATION">Notification</SelectItem>
                <SelectItem value="ROUTING">Routing</SelectItem>
                <SelectItem value="VALIDATION">Validation</SelectItem>
                <SelectItem value="ESCALATION">Escalation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workflowData.description}
              onChange={(e) => setWorkflowData({...workflowData, description: e.target.value})}
              placeholder="Describe what this workflow does"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select value={workflowData.trigger} onValueChange={(value) => setWorkflowData({...workflowData, trigger: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DOCUMENT_CREATED">Document Created</SelectItem>
                <SelectItem value="VALUE_THRESHOLD">Value Threshold</SelectItem>
                <SelectItem value="TIME_BASED">Time Based</SelectItem>
                <SelectItem value="EXCEPTION_DETECTED">Exception Detected</SelectItem>
                <SelectItem value="APPROVAL_REQUIRED">Approval Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={workflowData.priority} onValueChange={(value) => setWorkflowData({...workflowData, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            <Checkbox
              checked={workflowData.enabled}
              onCheckedChange={(checked) => setWorkflowData({...workflowData, enabled: checked})}
            />
            <Label>Enable workflow immediately</Label>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI-Powered Workflow Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Describe your process in plain English and our AI will automatically generate the workflow conditions and actions.
            </CardDescription>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCreateWorkflow(workflowData)
              setShowCreateDialog(false)
            }}
          >
            Create Workflow
          </Button>
        </div>
      </div>
    )
  }

  const WorkflowDetails = () => {
    const workflow = allWorkflows.find(w => w.id === selectedWorkflow)
    if (!workflow) return null

    return (
      <div className="space-y-6">
        {/* Workflow Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{workflow.name}</span>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(workflow.priority)}>
                  {workflow.priority}
                </Badge>
                <Badge variant={workflow.enabled ? 'default' : 'secondary'}>
                  {workflow.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>{workflow.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Executions</div>
                <div className="text-2xl font-bold">{workflow.executionCount}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Success Rate</div>
                <div className="text-2xl font-bold text-green-600">{workflow.successRate}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Category</div>
                <div className="text-lg font-medium">{workflow.category}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Last Executed</div>
                <div className="text-lg font-medium">
                  {workflow.lastExecuted ? new Date(workflow.lastExecuted).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Logic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitBranch className="w-5 h-5 mr-2" />
              Workflow Logic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Trigger */}
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div className="font-medium">Trigger: {workflow.trigger.replace('_', ' ')}</div>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />

              {/* Conditions */}
              <div className="p-4 border rounded-lg bg-yellow-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div className="font-medium">Conditions</div>
                </div>
                <div className="space-y-2 ml-11">
                  {workflow.conditions.map((condition, index) => (
                    <div key={index} className="text-sm">
                      {condition.logicalOperator && index > 0 && (
                        <span className="font-medium text-blue-600">{condition.logicalOperator} </span>
                      )}
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                        {condition.field} {condition.operator.replace('_', ' ').toLowerCase()} {condition.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />

              {/* Actions */}
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="font-medium">Actions</div>
                </div>
                <div className="space-y-2 ml-11">
                  {workflow.actions.map((action, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                        {action.type.replace('_', ' ').toLowerCase()}
                      </span>
                      {action.delay && (
                        <span className="text-gray-500 ml-2">(delay: {action.delay}h)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {workflow.enabled ? (
                <Button
                  variant="outline"
                  onClick={() => onPauseWorkflow(workflow.id)}
                  disabled={!userPermissions.canManage}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={() => onResumeWorkflow(workflow.id)}
                  disabled={!userPermissions.canManage}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button
                variant="outline"
                disabled={!userPermissions.canEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onExecuteWorkflow(workflow.id, 'TEST-001')}
                disabled={!userPermissions.canExecute}
              >
                <Play className="w-4 h-4 mr-2" />
                Test Execute
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Automation Engine</h1>
          <p className="text-gray-600">Intelligent automation for SAP MM procurement processes</p>
        </div>

        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={!userPermissions.canCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Design an automated workflow to streamline your procurement processes
                </DialogDescription>
              </DialogHeader>
              <WorkflowCreator />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                      <p className="text-2xl font-bold">{analytics.enabledWorkflows}</p>
                    </div>
                    <div className="text-right">
                      <Workflow className="w-8 h-8 text-blue-600" />
                      <div className="text-sm text-gray-600">{analytics.totalWorkflows} total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Automation Rate</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.automationRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <Bot className="w-8 h-8 text-green-600" />
                      <div className="text-sm text-green-600">+12.5% this month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{analytics.avgSuccessRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <Target className="w-8 h-8 text-purple-600" />
                      <div className="text-sm text-gray-600">Avg across all workflows</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Executions</p>
                      <p className="text-2xl font-bold">{analytics.totalExecutions.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Activity className="w-8 h-8 text-orange-600" />
                      <div className="text-sm text-gray-600">All time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recent Executions</p>
                      <p className="text-2xl font-bold text-blue-600">{analytics.recentExecutions}</p>
                    </div>
                    <div className="text-right">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div className="text-sm text-gray-600">Last 24 hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold text-green-600">1,240h</p>
                    </div>
                    <div className="text-right">
                      <Gauge className="w-8 h-8 text-green-600" />
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Workflow Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['APPROVAL', 'NOTIFICATION', 'ROUTING', 'VALIDATION', 'ESCALATION'].map((category) => {
                    const count = allWorkflows.filter(w => w.category === category).length
                    const IconComponent = getCategoryIcon(category)

                    return (
                      <div key={category} className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-gray-600">{category.toLowerCase()}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workflow Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allExecutions.slice(0, 5).map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          execution.status === 'COMPLETED' ? 'bg-green-100' :
                          execution.status === 'RUNNING' ? 'bg-blue-100' :
                          execution.status === 'FAILED' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {execution.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : execution.status === 'RUNNING' ? (
                            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                          ) : execution.status === 'FAILED' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{execution.workflowName}</div>
                          <div className="text-sm text-gray-600">
                            Document: {execution.documentId} ({execution.documentType})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                        {execution.duration && (
                          <div className="text-sm text-gray-600 mt-1">
                            {execution.duration}s
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Automation Engine Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">99.8%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    <Progress value={99.8} className="w-full mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <Progress value={85} className="w-full mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">150/h</div>
                    <div className="text-sm text-gray-600">Processing Rate</div>
                    <Progress value={92} className="w-full mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Workflow Library</CardTitle>
                  <CardDescription>Manage all automation workflows</CardDescription>
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="APPROVAL">Approval</SelectItem>
                      <SelectItem value="NOTIFICATION">Notification</SelectItem>
                      <SelectItem value="ROUTING">Routing</SelectItem>
                      <SelectItem value="VALIDATION">Validation</SelectItem>
                      <SelectItem value="ESCALATION">Escalation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => {
                  const IconComponent = getCategoryIcon(workflow.category)

                  return (
                    <div key={workflow.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-lg">{workflow.name}</div>
                            <div className="text-sm text-gray-600 max-w-lg">{workflow.description}</div>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge className={getPriorityColor(workflow.priority)}>
                                {workflow.priority}
                              </Badge>
                              <span className="text-sm text-gray-500">{workflow.category}</span>
                              <span className="text-sm text-gray-500">
                                {workflow.executionCount} executions
                              </span>
                              <span className="text-sm text-green-600">
                                {workflow.successRate}% success rate
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant={workflow.enabled ? 'default' : 'secondary'}>
                              {workflow.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedWorkflow(workflow.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!userPermissions.canEdit}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {workflow.enabled ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onPauseWorkflow(workflow.id)}
                              disabled={!userPermissions.canManage}
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => onResumeWorkflow(workflow.id)}
                              disabled={!userPermissions.canManage}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selectedWorkflow && (
                <div className="mt-6 pt-6 border-t">
                  <WorkflowDetails />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Executions</CardTitle>
              <CardDescription>Monitor workflow execution history and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allExecutions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{execution.workflowName}</div>
                          <div className="text-sm text-gray-600">{execution.triggerEvent}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{execution.documentId}</div>
                          <div className="text-sm text-gray-600">{execution.documentType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(execution.startTime).toLocaleString()}</TableCell>
                      <TableCell>
                        {execution.duration ? `${execution.duration}s` :
                         execution.status === 'RUNNING' ? 'In progress...' : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                      <div>Execution trend chart would be displayed here</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average execution time</span>
                      <span className="font-bold">2.3 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fastest execution</span>
                      <span className="font-bold text-green-600">0.8 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slowest execution</span>
                      <span className="font-bold text-red-600">45.2 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error rate</span>
                      <span className="font-bold">0.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Executions</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Avg Duration</TableHead>
                      <TableHead>Time Saved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell className="font-medium">{workflow.name}</TableCell>
                        <TableCell>{workflow.executionCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={workflow.successRate} className="w-16" />
                            <span className="text-sm">{workflow.successRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {(Math.random() * 10 + 1).toFixed(1)}s
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            {(workflow.executionCount * 15).toFixed(0)}h
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI-Powered Process Optimization
                </CardTitle>
                <CardDescription>Intelligent recommendations for improving your workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-800">Workflow Optimization Opportunity</div>
                        <div className="text-sm text-blue-600 mt-1">
                          Combine "High Value PO Approval" and "Emergency PR Fast Track" workflows to reduce processing time by 35%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-green-800">Performance Improvement</div>
                        <div className="text-sm text-green-600 mt-1">
                          Implement parallel processing for invoice verification workflows to increase throughput by 60%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <div className="font-medium text-orange-800">Risk Mitigation</div>
                        <div className="text-sm text-orange-600 mt-1">
                          Add backup approval paths for critical workflows to ensure 99.9% availability
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-medium text-purple-800">Automation Expansion</div>
                        <div className="text-sm text-purple-600 mt-1">
                          Create smart routing workflows for contract renewals to achieve 80% automation rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2,450</div>
                      <div className="text-sm text-gray-600">Predicted executions next month</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-sm text-gray-600">Predicted success rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">1,850h</div>
                      <div className="text-sm text-gray-600">Estimated time savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Processing Time Spike
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Invoice verification workflows taking 40% longer than usual - investigate potential bottlenecks
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Performance Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Emergency PR processing time reduced by 25% this week - optimization successful
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Cog className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium">Auto-tune Thresholds</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Optimize approval thresholds based on historical data
                    </div>
                    <Button size="sm" className="mt-3" variant="outline">
                      Apply
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-medium">Smart Routing</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Route approvals based on workload and expertise
                    </div>
                    <Button size="sm" className="mt-3" variant="outline">
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-medium">Time Optimization</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Schedule workflows during optimal processing windows
                    </div>
                    <Button size="sm" className="mt-3" variant="outline">
                      Optimize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}