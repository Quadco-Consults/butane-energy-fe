'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
  Settings,
  MapPin,
  Building,
  User,
  Briefcase
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock project data
const mockProjects = [
  {
    id: 'PRJ-001',
    code: 'LNG-TERMINAL-2024',
    name: 'LNG Storage Terminal Expansion',
    description: 'Expansion of LNG storage capacity at Lagos terminal with new 50,000 MT storage tanks',
    type: 'Infrastructure',
    priority: 'High',
    status: 'In Progress',
    phase: 'Execution',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    plannedEndDate: '2024-12-31',
    actualStartDate: '2024-01-20',
    projectManager: 'Emeka Nwosu',
    sponsor: 'Fatima Abubakar',
    location: 'Lagos Terminal',
    department: 'Operations',
    progress: 65,
    budget: {
      approved: 2500000000,
      committed: 1950000000,
      spent: 1625000000,
      remaining: 875000000,
      variance: -75000000,
      costPercentage: 65
    },
    timeline: {
      plannedDuration: 350,
      actualDuration: 300,
      remainingDays: 50,
      isDelayed: false
    },
    team: [
      { name: 'Emeka Nwosu', role: 'Project Manager', department: 'PDU' },
      { name: 'Adaobi Okechukwu', role: 'Engineering Lead', department: 'Engineering' },
      { name: 'Kemi Adebayo', role: 'Procurement Lead', department: 'Procurement' },
      { name: 'Tunde Lawal', role: 'HSE Lead', department: 'HSE' }
    ],
    milestones: [
      { name: 'Design Approval', date: '2024-03-15', status: 'Completed', progress: 100 },
      { name: 'Procurement Complete', date: '2024-06-30', status: 'Completed', progress: 100 },
      { name: 'Construction Start', date: '2024-07-15', status: 'Completed', progress: 100 },
      { name: 'Tank Installation', date: '2024-10-31', status: 'In Progress', progress: 80 },
      { name: 'Testing & Commissioning', date: '2024-11-30', status: 'Pending', progress: 0 },
      { name: 'Project Handover', date: '2024-12-31', status: 'Pending', progress: 0 }
    ],
    risks: [
      { type: 'High', description: 'Weather delays during tank installation', impact: 'Schedule', mitigation: 'Weather monitoring and backup plans' },
      { type: 'Medium', description: 'Currency fluctuation affecting costs', impact: 'Budget', mitigation: 'Hedge foreign exchange exposure' }
    ],
    documents: [
      { name: 'Project Charter', type: 'Charter', date: '2024-01-10', size: '2.3 MB' },
      { name: 'Design Specifications', type: 'Technical', date: '2024-03-10', size: '15.7 MB' },
      { name: 'Budget Approval', type: 'Financial', date: '2024-01-12', size: '1.2 MB' }
    ],
    createdBy: 'Fatima Abubakar',
    createdAt: '2024-01-10',
    lastUpdated: '2024-11-14'
  },
  {
    id: 'PRJ-002',
    code: 'PIPELINE-PH-2024',
    name: 'Port Harcourt Pipeline Extension',
    description: 'Extension of gas pipeline from Port Harcourt refinery to industrial zone',
    type: 'Infrastructure',
    priority: 'Medium',
    status: 'Planning',
    phase: 'Planning',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    plannedEndDate: '2025-02-28',
    actualStartDate: null,
    projectManager: 'Adaobi Okechukwu',
    sponsor: 'Emeka Nwosu',
    location: 'Port Harcourt',
    department: 'Engineering',
    progress: 25,
    budget: {
      approved: 1800000000,
      committed: 450000000,
      spent: 180000000,
      remaining: 1620000000,
      variance: 0,
      costPercentage: 10
    },
    timeline: {
      plannedDuration: 365,
      actualDuration: 0,
      remainingDays: 365,
      isDelayed: false
    },
    team: [
      { name: 'Adaobi Okechukwu', role: 'Project Manager', department: 'PDU' },
      { name: 'Samuel Okon', role: 'Pipeline Engineer', department: 'Engineering' },
      { name: 'Blessing Eze', role: 'Environmental Lead', department: 'HSE' }
    ],
    milestones: [
      { name: 'Environmental Impact Assessment', date: '2024-04-30', status: 'In Progress', progress: 60 },
      { name: 'Route Survey Complete', date: '2024-05-31', status: 'Pending', progress: 0 },
      { name: 'Permits Obtained', date: '2024-07-31', status: 'Pending', progress: 0 },
      { name: 'Construction Start', date: '2024-09-01', status: 'Pending', progress: 0 }
    ],
    risks: [
      { type: 'High', description: 'Land acquisition delays', impact: 'Schedule', mitigation: 'Early engagement with landowners' },
      { type: 'Medium', description: 'Environmental permit delays', impact: 'Schedule', mitigation: 'Regular follow-up with regulatory bodies' }
    ],
    documents: [
      { name: 'Feasibility Study', type: 'Technical', date: '2024-02-15', size: '8.5 MB' },
      { name: 'Environmental Assessment', type: 'Environmental', date: '2024-03-20', size: '12.3 MB' }
    ],
    createdBy: 'Emeka Nwosu',
    createdAt: '2024-02-20',
    lastUpdated: '2024-11-13'
  },
  {
    id: 'PRJ-003',
    code: 'SAFETY-UPGRADE-2024',
    name: 'Facility Safety Systems Upgrade',
    description: 'Comprehensive upgrade of safety systems across all facilities',
    type: 'Safety',
    priority: 'High',
    status: 'Completed',
    phase: 'Closed',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    plannedEndDate: '2024-09-30',
    actualStartDate: '2023-09-05',
    projectManager: 'Kemi Adebayo',
    sponsor: 'Tunde Lawal',
    location: 'All Facilities',
    department: 'HSE',
    progress: 100,
    budget: {
      approved: 950000000,
      committed: 950000000,
      spent: 920000000,
      remaining: 30000000,
      variance: 30000000,
      costPercentage: 97
    },
    timeline: {
      plannedDuration: 395,
      actualDuration: 360,
      remainingDays: 0,
      isDelayed: false
    },
    team: [
      { name: 'Kemi Adebayo', role: 'Project Manager', department: 'PDU' },
      { name: 'Tunde Lawal', role: 'HSE Director', department: 'HSE' },
      { name: 'Ibrahim Musa', role: 'Safety Engineer', department: 'HSE' }
    ],
    milestones: [
      { name: 'System Assessment', date: '2023-11-30', status: 'Completed', progress: 100 },
      { name: 'Equipment Procurement', date: '2024-02-29', status: 'Completed', progress: 100 },
      { name: 'Installation Complete', date: '2024-06-30', status: 'Completed', progress: 100 },
      { name: 'System Testing', date: '2024-07-31', status: 'Completed', progress: 100 },
      { name: 'Training Complete', date: '2024-08-31', status: 'Completed', progress: 100 }
    ],
    risks: [],
    documents: [
      { name: 'Project Closure Report', type: 'Report', date: '2024-09-05', size: '5.2 MB' },
      { name: 'Lessons Learned', type: 'Report', date: '2024-09-10', size: '2.1 MB' }
    ],
    createdBy: 'Tunde Lawal',
    createdAt: '2023-08-15',
    lastUpdated: '2024-09-10'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planning': return 'bg-blue-100 text-blue-800';
    case 'In Progress': return 'bg-orange-100 text-orange-800';
    case 'On Hold': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-orange-100 text-orange-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMilestoneStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    case 'Delayed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (type: string) => {
  switch (type) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-orange-100 text-orange-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewProjectDialog, setViewProjectDialog] = useState(false);
  const [createProjectDialog, setCreateProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesType = filterType === 'all' || project.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setViewProjectDialog(true);
  };

  const projectStats = {
    total: mockProjects.length,
    active: mockProjects.filter(p => p.status === 'In Progress').length,
    planning: mockProjects.filter(p => p.status === 'Planning').length,
    completed: mockProjects.filter(p => p.status === 'Completed').length,
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget.approved, 0),
    spentBudget: mockProjects.reduce((sum, p) => sum + p.budget.spent, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">
              Comprehensive project lifecycle management for PDU initiatives
            </p>
          </div>
          <Dialog open={createProjectDialog} onOpenChange={setCreateProjectDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name *</label>
                    <Input placeholder="Enter project name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Code *</label>
                    <Input placeholder="e.g., LNG-TERMINAL-2024" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Expansion">Expansion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date *</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date *</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Manager *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emeka Nwosu">Emeka Nwosu</SelectItem>
                        <SelectItem value="Adaobi Okechukwu">Adaobi Okechukwu</SelectItem>
                        <SelectItem value="Kemi Adebayo">Kemi Adebayo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget (₦) *</label>
                    <Input type="number" placeholder="Enter budget amount" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea placeholder="Enter project description" rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateProjectDialog(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Projects</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{projectStats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Active Projects</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{projectStats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Completed</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{projectStats.completed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Total Budget</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">₦{(projectStats.totalBudget / 1000000000).toFixed(1)}B</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects, codes, or managers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Expansion">Expansion</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Portfolio ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Code</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Budget Status</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{project.code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {project.projectManager}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">₦{(project.budget.spent / 1000000).toFixed(0)}M / ₦{(project.budget.approved / 1000000).toFixed(0)}M</div>
                          <Progress value={project.budget.costPercentage} className="h-2 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {project.endDate}
                          </div>
                          <div className={`text-xs ${project.timeline.isDelayed ? 'text-red-600' : 'text-green-600'}`}>
                            {project.timeline.remainingDays} days left
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleViewProject(project)}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Dialog */}
        <Dialog open={viewProjectDialog} onOpenChange={setViewProjectDialog}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {selectedProject?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Project Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Project Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Project Code:</span>
                          <span className="font-medium">{selectedProject.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedProject.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge className={getPriorityColor(selectedProject.priority)}>
                            {selectedProject.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={getStatusColor(selectedProject.status)}>
                            {selectedProject.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phase:</span>
                          <span className="font-medium">{selectedProject.phase}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Progress & Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Progress</span>
                            <span className="font-medium">{selectedProject.progress}%</span>
                          </div>
                          <Progress value={selectedProject.progress} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Start Date:</span>
                            <span>{selectedProject.startDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">End Date:</span>
                            <span>{selectedProject.endDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Days Remaining:</span>
                            <span className="font-medium">{selectedProject.timeline.remainingDays}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Budget Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Budget Utilized</span>
                            <span className="font-medium">{selectedProject.budget.costPercentage}%</span>
                          </div>
                          <Progress value={selectedProject.budget.costPercentage} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Approved:</span>
                            <span>₦{(selectedProject.budget.approved / 1000000).toFixed(0)}M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Spent:</span>
                            <span>₦{(selectedProject.budget.spent / 1000000).toFixed(0)}M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="font-medium text-green-600">₦{(selectedProject.budget.remaining / 1000000).toFixed(0)}M</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                    </CardContent>
                  </Card>

                  {/* Milestones */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{milestone.name}</div>
                              <div className="text-sm text-muted-foreground">Due: {milestone.date}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24">
                                <Progress value={milestone.progress} className="h-2" />
                              </div>
                              <Badge className={getMilestoneStatusColor(milestone.status)}>
                                {milestone.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  {selectedProject.risks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Project Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedProject.risks.map((risk, index) => (
                            <div key={index} className="p-3 border rounded">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className={getRiskColor(risk.type)}>
                                  {risk.type} Risk
                                </Badge>
                                <span className="text-sm text-muted-foreground">Impact: {risk.impact}</span>
                              </div>
                              <div className="mb-2">
                                <strong>Description:</strong> {risk.description}
                              </div>
                              <div>
                                <strong>Mitigation:</strong> {risk.mitigation}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="budget" className="space-y-6">
                  {/* Budget Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <h3 className="text-sm font-medium">Approved Budget</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          ₦{(selectedProject.budget.approved / 1000000).toFixed(0)}M
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <h3 className="text-sm font-medium">Amount Spent</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                          ₦{(selectedProject.budget.spent / 1000000).toFixed(0)}M
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <h3 className="text-sm font-medium">Remaining Budget</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          ₦{(selectedProject.budget.remaining / 1000000).toFixed(0)}M
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-purple-500" />
                          <h3 className="text-sm font-medium">Budget Variance</h3>
                        </div>
                        <p className={`text-2xl font-bold mt-2 ${selectedProject.budget.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProject.budget.variance >= 0 ? '+' : ''}₦{(selectedProject.budget.variance / 1000000).toFixed(0)}M
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Budget Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Budget Utilization</span>
                            <span className="font-medium">{selectedProject.budget.costPercentage}%</span>
                          </div>
                          <Progress value={selectedProject.budget.costPercentage} className="h-4" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>₦0</span>
                            <span>₦{(selectedProject.budget.approved / 1000000).toFixed(0)}M</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Committed</div>
                            <div className="text-lg font-bold">₦{(selectedProject.budget.committed / 1000000).toFixed(0)}M</div>
                            <div className="text-muted-foreground">
                              {((selectedProject.budget.committed / selectedProject.budget.approved) * 100).toFixed(1)}% of budget
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Actual Spent</div>
                            <div className="text-lg font-bold">₦{(selectedProject.budget.spent / 1000000).toFixed(0)}M</div>
                            <div className="text-muted-foreground">
                              {selectedProject.budget.costPercentage}% of budget
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Available</div>
                            <div className="text-lg font-bold text-green-600">₦{(selectedProject.budget.remaining / 1000000).toFixed(0)}M</div>
                            <div className="text-muted-foreground">
                              {(100 - selectedProject.budget.costPercentage).toFixed(1)}% remaining
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Planned Duration</div>
                            <div className="text-lg font-bold">{selectedProject.timeline.plannedDuration} days</div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Actual Duration</div>
                            <div className="text-lg font-bold">{selectedProject.timeline.actualDuration || 'TBD'} days</div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-muted-foreground">Days Remaining</div>
                            <div className={`text-lg font-bold ${selectedProject.timeline.isDelayed ? 'text-red-600' : 'text-green-600'}`}>
                              {selectedProject.timeline.remainingDays} days
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold">Milestone Timeline</h4>
                          {selectedProject.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border rounded">
                              <div className="flex-1">
                                <div className="font-medium">{milestone.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due: {milestone.date}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-20">
                                  <Progress value={milestone.progress} className="h-2" />
                                  <div className="text-xs text-center mt-1">{milestone.progress}%</div>
                                </div>
                                <Badge className={getMilestoneStatusColor(milestone.status)}>
                                  {milestone.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.team.map((member, index) => (
                          <div key={index} className="p-4 border rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.role}</div>
                                <div className="text-xs text-muted-foreground">{member.department}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Leadership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="font-medium text-muted-foreground">Project Manager</div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{selectedProject.projectManager}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-muted-foreground">Project Sponsor</div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{selectedProject.sponsor}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-muted-foreground">{doc.type} • {doc.date} • {doc.size}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Generate Status Report
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Budget Analysis
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Analysis
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Risk Register
                        </Button>
                        {selectedProject.status === 'Completed' && (
                          <Button variant="outline" className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Project Closure Report
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}