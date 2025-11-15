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
  Clock,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  MapPin,
  DollarSign,
  FileText,
  Briefcase,
  PieChart,
  Activity
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

// Mock planning data
const mockPlanningProjects = [
  {
    id: 'PLAN-001',
    name: 'Gas Pipeline Network Expansion 2025',
    type: 'Infrastructure',
    phase: 'Concept',
    priority: 'High',
    status: 'Planning',
    estimatedBudget: 4500000000,
    estimatedDuration: 18,
    targetStartDate: '2025-03-01',
    targetEndDate: '2025-08-31',
    businessCase: 'Expand pipeline network to serve new industrial customers in Lagos East zone',
    strategicAlignment: 'Infrastructure Growth',
    riskLevel: 'Medium',
    resources: {
      engineers: 12,
      projectManagers: 2,
      contractors: 25,
      equipment: 'Pipeline laying equipment, welding machines'
    },
    milestones: [
      { name: 'Feasibility Study', duration: 60, dependencies: [] },
      { name: 'Environmental Assessment', duration: 90, dependencies: ['Feasibility Study'] },
      { name: 'Design Phase', duration: 120, dependencies: ['Environmental Assessment'] },
      { name: 'Procurement', duration: 90, dependencies: ['Design Phase'] },
      { name: 'Construction', duration: 180, dependencies: ['Procurement'] }
    ],
    assumptions: [
      'Land acquisition approval within 3 months',
      'No major environmental hurdles',
      'Stable currency exchange rates'
    ],
    constraints: [
      'Budget approval required by Q1 2025',
      'Environmental permits must be obtained',
      'Limited specialized equipment availability'
    ],
    createdBy: 'Emeka Nwosu',
    createdAt: '2024-10-15',
    lastUpdated: '2024-11-14'
  },
  {
    id: 'PLAN-002',
    name: 'Safety Management System Upgrade',
    type: 'Safety',
    phase: 'Planning',
    priority: 'High',
    status: 'Planning',
    estimatedBudget: 850000000,
    estimatedDuration: 12,
    targetStartDate: '2025-01-15',
    targetEndDate: '2025-12-31',
    businessCase: 'Upgrade safety systems to meet new regulatory requirements and improve incident prevention',
    strategicAlignment: 'Safety Excellence',
    riskLevel: 'Low',
    resources: {
      engineers: 6,
      projectManagers: 1,
      contractors: 15,
      equipment: 'Safety monitoring systems, emergency equipment'
    },
    milestones: [
      { name: 'Current System Assessment', duration: 30, dependencies: [] },
      { name: 'Requirements Definition', duration: 45, dependencies: ['Current System Assessment'] },
      { name: 'System Design', duration: 60, dependencies: ['Requirements Definition'] },
      { name: 'Implementation', duration: 120, dependencies: ['System Design'] },
      { name: 'Testing & Training', duration: 90, dependencies: ['Implementation'] }
    ],
    assumptions: [
      'Regulatory requirements remain stable',
      'Staff availability for training',
      'No major operational disruptions'
    ],
    constraints: [
      'Must maintain operations during upgrade',
      'Compliance deadline: December 2025',
      'Limited shutdown windows'
    ],
    createdBy: 'Kemi Adebayo',
    createdAt: '2024-10-20',
    lastUpdated: '2024-11-13'
  },
  {
    id: 'PLAN-003',
    name: 'Digital Transformation Initiative',
    type: 'Technology',
    phase: 'Concept',
    priority: 'Medium',
    status: 'Planning',
    estimatedBudget: 1200000000,
    estimatedDuration: 24,
    targetStartDate: '2025-06-01',
    targetEndDate: '2027-05-31',
    businessCase: 'Digitize operations for improved efficiency, data analytics, and remote monitoring capabilities',
    strategicAlignment: 'Digital Excellence',
    riskLevel: 'High',
    resources: {
      engineers: 8,
      projectManagers: 2,
      contractors: 20,
      equipment: 'IoT sensors, cloud infrastructure, analytics software'
    },
    milestones: [
      { name: 'Technology Assessment', duration: 90, dependencies: [] },
      { name: 'Architecture Design', duration: 120, dependencies: ['Technology Assessment'] },
      { name: 'Pilot Implementation', duration: 180, dependencies: ['Architecture Design'] },
      { name: 'Full Rollout Phase 1', duration: 240, dependencies: ['Pilot Implementation'] },
      { name: 'Full Rollout Phase 2', duration: 180, dependencies: ['Full Rollout Phase 1'] }
    ],
    assumptions: [
      'Technology vendor partnerships established',
      'Adequate IT infrastructure available',
      'Staff adaptability to new systems'
    ],
    constraints: [
      'Cybersecurity requirements must be met',
      'Integration with existing systems',
      'Training requirements across all facilities'
    ],
    createdBy: 'Adaobi Okechukwu',
    createdAt: '2024-11-01',
    lastUpdated: '2024-11-14'
  }
];

const mockResourcePlanning = [
  {
    department: 'Engineering',
    totalCapacity: 45,
    currentAllocation: 32,
    plannedAllocation: 38,
    availability: 71,
    upcomingProjects: 3,
    criticalSkills: ['Pipeline Engineering', 'Process Safety', 'Project Management']
  },
  {
    department: 'Procurement',
    totalCapacity: 18,
    currentAllocation: 15,
    plannedAllocation: 16,
    availability: 83,
    upcomingProjects: 4,
    criticalSkills: ['Contract Management', 'Vendor Relations', 'Cost Analysis']
  },
  {
    department: 'HSE',
    totalCapacity: 25,
    currentAllocation: 20,
    plannedAllocation: 23,
    availability: 80,
    upcomingProjects: 2,
    criticalSkills: ['Safety Engineering', 'Environmental Assessment', 'Compliance']
  },
  {
    department: 'Operations',
    totalCapacity: 60,
    currentAllocation: 55,
    plannedAllocation: 58,
    availability: 92,
    upcomingProjects: 2,
    criticalSkills: ['Operations Management', 'Maintenance Planning', 'Quality Control']
  }
];

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'Concept': return 'bg-blue-100 text-blue-800';
    case 'Planning': return 'bg-orange-100 text-orange-800';
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'On Hold': return 'bg-yellow-100 text-yellow-800';
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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-orange-100 text-orange-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function PlanningPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewProjectDialog, setViewProjectDialog] = useState(false);
  const [createPlanDialog, setCreatePlanDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredProjects = mockPlanningProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = filterPhase === 'all' || project.phase === filterPhase;
    const matchesType = filterType === 'all' || project.type === filterType;

    return matchesSearch && matchesPhase && matchesType;
  });

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setViewProjectDialog(true);
  };

  const planningStats = {
    totalProjects: mockPlanningProjects.length,
    conceptPhase: mockPlanningProjects.filter(p => p.phase === 'Concept').length,
    planningPhase: mockPlanningProjects.filter(p => p.phase === 'Planning').length,
    totalBudget: mockPlanningProjects.reduce((sum, p) => sum + p.estimatedBudget, 0),
    avgDuration: mockPlanningProjects.reduce((sum, p) => sum + p.estimatedDuration, 0) / mockPlanningProjects.length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Planning</h1>
            <p className="text-muted-foreground">
              Strategic planning and project scheduling for PDU initiatives
            </p>
          </div>
          <Dialog open={createPlanDialog} onOpenChange={setCreatePlanDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Planning Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Planning Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name *</label>
                    <Input placeholder="Enter project name" />
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
                    <label className="text-sm font-medium">Estimated Budget (₦) *</label>
                    <Input type="number" placeholder="Enter estimated budget" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Start Date *</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Duration (months) *</label>
                    <Input type="number" placeholder="Enter duration in months" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Case *</label>
                  <Textarea placeholder="Describe the business case and justification" rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreatePlanDialog(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Create Planning Document
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Planning Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Planning Projects</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{planningStats.totalProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">In Planning Phase</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{planningStats.planningPhase}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Concept Phase</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{planningStats.conceptPhase}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Total Planned Budget</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">₦{(planningStats.totalBudget / 1000000000).toFixed(1)}B</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Planning Projects</TabsTrigger>
            <TabsTrigger value="resources">Resource Planning</TabsTrigger>
            <TabsTrigger value="capacity">Capacity Analysis</TabsTrigger>
            <TabsTrigger value="timeline">Timeline Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
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
                        placeholder="Search planning projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterPhase} onValueChange={setFilterPhase}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      <SelectItem value="Concept">Concept</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
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
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Plans
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Planning Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Planning Portfolio ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Est. Budget</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Target Start</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.type}</TableCell>
                          <TableCell>
                            <Badge className={getPhaseColor(project.phase)}>
                              {project.phase}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>₦{(project.estimatedBudget / 1000000).toFixed(0)}M</TableCell>
                          <TableCell>{project.estimatedDuration} months</TableCell>
                          <TableCell>{project.targetStartDate}</TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(project.riskLevel)}>
                              {project.riskLevel}
                            </Badge>
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
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Resource Allocation Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResourcePlanning.map((dept, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{dept.department}</h3>
                        <Badge className={dept.availability > 80 ? 'bg-green-100 text-green-800' : dept.availability > 60 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}>
                          {dept.availability}% Available
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Total Capacity</div>
                          <div className="text-2xl font-bold">{dept.totalCapacity}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Current Allocation</div>
                          <div className="text-2xl font-bold text-orange-600">{dept.currentAllocation}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Planned Allocation</div>
                          <div className="text-2xl font-bold text-blue-600">{dept.plannedAllocation}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Upcoming Projects</div>
                          <div className="text-2xl font-bold text-purple-600">{dept.upcomingProjects}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Resource Utilization</span>
                          <span>{((dept.plannedAllocation / dept.totalCapacity) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(dept.plannedAllocation / dept.totalCapacity) * 100} className="h-3" />
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Critical Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {dept.criticalSkills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capacity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Capacity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Capacity Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Organization Capacity</span>
                          <span className="font-bold">148 FTEs</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Utilization</span>
                          <span className="font-bold text-orange-600">122 FTEs (82%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Planned Utilization</span>
                          <span className="font-bold text-blue-600">135 FTEs (91%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Available Capacity</span>
                          <span className="font-bold text-green-600">13 FTEs (9%)</span>
                        </div>
                        <Progress value={91} className="h-4" />
                        <div className="text-sm text-muted-foreground">
                          91% planned utilization indicates near-capacity operation
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacity Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-800">High Risk</span>
                          </div>
                          <div className="text-sm text-red-700 mt-1">
                            Engineering capacity at 84% - may impact project delivery
                          </div>
                        </div>

                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Medium Risk</span>
                          </div>
                          <div className="text-sm text-orange-700 mt-1">
                            HSE resources stretched with upcoming safety projects
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Low Risk</span>
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            Operations and Procurement have adequate capacity
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Capacity Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Short-term Actions (Next 3 months)</div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Consider temporary engineering contractors for Gas Pipeline project</li>
                          <li>Prioritize HSE resources for Safety Management System upgrade</li>
                          <li>Evaluate postponing lower-priority projects to Q3 2025</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Long-term Strategies (6-12 months)</div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Recruitment plan for 5 additional engineers by Q2 2025</li>
                          <li>Cross-training programs to increase resource flexibility</li>
                          <li>Strategic partnerships for specialized capabilities</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Master Timeline Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Q1 2025</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">2</div>
                        <div className="text-xs text-muted-foreground">Projects Starting</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Q2 2025</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600 mt-1">1</div>
                        <div className="text-xs text-muted-foreground">Projects Starting</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">2025</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mt-1">1</div>
                        <div className="text-xs text-muted-foreground">Expected Completions</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Total Duration</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mt-1">18</div>
                        <div className="text-xs text-muted-foreground">Avg Months</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Project Timeline Overview</h3>
                    {filteredProjects.map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{project.name}</div>
                          <Badge className={getPhaseColor(project.phase)}>{project.phase}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Target Start: </span>
                            <span className="font-medium">{project.targetStartDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target End: </span>
                            <span className="font-medium">{project.targetEndDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            <span className="font-medium">{project.estimatedDuration} months</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Key Milestones</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {project.milestones.slice(0, 3).map((milestone, mIndex) => (
                              <div key={mIndex} className="text-xs p-2 bg-muted rounded">
                                <div className="font-medium">{milestone.name}</div>
                                <div className="text-muted-foreground">{milestone.duration} days</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Planning Project Details Dialog */}
        <Dialog open={viewProjectDialog} onOpenChange={setViewProjectDialog}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {selectedProject?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedProject.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phase:</span>
                          <Badge className={getPhaseColor(selectedProject.phase)}>
                            {selectedProject.phase}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge className={getPriorityColor(selectedProject.priority)}>
                            {selectedProject.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk Level:</span>
                          <Badge className={getRiskColor(selectedProject.riskLevel)}>
                            {selectedProject.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Strategic Alignment:</span>
                          <span className="font-medium">{selectedProject.strategicAlignment}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Financial Planning</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Budget:</span>
                          <span className="font-medium">₦{(selectedProject.estimatedBudget / 1000000).toFixed(0)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{selectedProject.estimatedDuration} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Start:</span>
                          <span className="font-medium">{selectedProject.targetStartDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target End:</span>
                          <span className="font-medium">{selectedProject.targetEndDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Business Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedProject.businessCase}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.milestones.map((milestone, index) => (
                          <div key={index} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{milestone.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Duration: {milestone.duration} days
                              </div>
                              {milestone.dependencies.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Depends on: {milestone.dependencies.join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium">
                              Day {milestone.dependencies.length === 0 ? 1 : 'TBD'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium mb-2">Human Resources</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Engineers:</span>
                              <span className="font-medium">{selectedProject.resources.engineers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Project Managers:</span>
                              <span className="font-medium">{selectedProject.resources.projectManagers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Contractors:</span>
                              <span className="font-medium">{selectedProject.resources.contractors}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-2">Equipment & Tools</div>
                          <p className="text-sm text-muted-foreground">
                            {selectedProject.resources.equipment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assumptions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedProject.assumptions.map((assumption, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {assumption}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Constraints</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedProject.constraints.map((constraint, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              {constraint}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}