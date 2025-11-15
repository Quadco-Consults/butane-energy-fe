'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PlayCircle,
  PauseCircle,
  XCircle,
  Users,
  DollarSign,
  FileText,
  Gauge,
  Flag,
  MapPin,
  Timer,
  Zap,
  AlertCircle
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

// Mock tracking data
const mockTrackingProjects = [
  {
    id: 'PRJ-001',
    code: 'LNG-TERMINAL-2024',
    name: 'LNG Storage Terminal Expansion',
    status: 'In Progress',
    health: 'Green',
    priority: 'High',
    manager: 'Emeka Nwosu',
    location: 'Lagos Terminal',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    daysElapsed: 303,
    daysRemaining: 47,
    progress: 65,
    budgetProgress: 68,
    scheduleVariance: -5,
    costVariance: 3,
    team: 45,
    activeTasks: 12,
    completedTasks: 28,
    totalTasks: 45,
    lastUpdate: '2024-11-14 10:30 AM',
    milestones: [
      { name: 'Design Approval', status: 'Completed', date: '2024-03-15', progress: 100, actualDate: '2024-03-12' },
      { name: 'Procurement Complete', status: 'Completed', date: '2024-06-30', progress: 100, actualDate: '2024-06-28' },
      { name: 'Construction Start', status: 'Completed', date: '2024-07-15', progress: 100, actualDate: '2024-07-20' },
      { name: 'Tank Installation', status: 'In Progress', date: '2024-10-31', progress: 80, actualDate: null },
      { name: 'Testing & Commissioning', status: 'Pending', date: '2024-11-30', progress: 0, actualDate: null },
      { name: 'Project Handover', status: 'Pending', date: '2024-12-31', progress: 0, actualDate: null }
    ],
    recentActivities: [
      { date: '2024-11-14', activity: 'Tank #2 installation 80% complete', type: 'progress' },
      { date: '2024-11-13', activity: 'Safety inspection passed for Tank #1', type: 'milestone' },
      { date: '2024-11-12', activity: 'Budget revision approved (+₦50M)', type: 'budget' },
      { date: '2024-11-11', activity: 'Weather delay reported - 2 days', type: 'issue' }
    ],
    kpis: {
      spi: 0.95, // Schedule Performance Index
      cpi: 1.03, // Cost Performance Index
      qualityScore: 92,
      safetyScore: 98,
      stakeholderSatisfaction: 85
    }
  },
  {
    id: 'PRJ-002',
    code: 'PIPELINE-PH-2024',
    name: 'Port Harcourt Pipeline Extension',
    status: 'In Progress',
    health: 'Yellow',
    priority: 'Medium',
    manager: 'Adaobi Okechukwu',
    location: 'Port Harcourt',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    daysElapsed: 259,
    daysRemaining: 106,
    progress: 35,
    budgetProgress: 28,
    scheduleVariance: -10,
    costVariance: -5,
    team: 28,
    activeTasks: 8,
    completedTasks: 15,
    totalTasks: 32,
    lastUpdate: '2024-11-14 02:15 PM',
    milestones: [
      { name: 'Environmental Impact Assessment', status: 'In Progress', date: '2024-04-30', progress: 75, actualDate: null },
      { name: 'Route Survey Complete', status: 'Pending', date: '2024-05-31', progress: 0, actualDate: null },
      { name: 'Permits Obtained', status: 'Pending', date: '2024-07-31', progress: 0, actualDate: null },
      { name: 'Construction Start', status: 'Pending', date: '2024-09-01', progress: 0, actualDate: null }
    ],
    recentActivities: [
      { date: '2024-11-14', activity: 'Environmental assessment 75% complete', type: 'progress' },
      { date: '2024-11-12', activity: 'Land acquisition negotiations ongoing', type: 'issue' },
      { date: '2024-11-10', activity: 'Geological survey completed', type: 'milestone' },
      { date: '2024-11-08', activity: 'Community engagement session held', type: 'stakeholder' }
    ],
    kpis: {
      spi: 0.90,
      cpi: 0.95,
      qualityScore: 88,
      safetyScore: 95,
      stakeholderSatisfaction: 78
    }
  },
  {
    id: 'PRJ-003',
    code: 'SAFETY-UPGRADE-2024',
    name: 'Facility Safety Systems Upgrade',
    status: 'Completed',
    health: 'Green',
    priority: 'High',
    manager: 'Kemi Adebayo',
    location: 'All Facilities',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    daysElapsed: 365,
    daysRemaining: 0,
    progress: 100,
    budgetProgress: 97,
    scheduleVariance: 35,
    costVariance: 3,
    team: 25,
    activeTasks: 0,
    completedTasks: 38,
    totalTasks: 38,
    lastUpdate: '2024-09-05 04:00 PM',
    milestones: [
      { name: 'System Assessment', status: 'Completed', date: '2023-11-30', progress: 100, actualDate: '2023-11-25' },
      { name: 'Equipment Procurement', status: 'Completed', date: '2024-02-29', progress: 100, actualDate: '2024-02-20' },
      { name: 'Installation Complete', status: 'Completed', date: '2024-06-30', progress: 100, actualDate: '2024-06-25' },
      { name: 'System Testing', status: 'Completed', date: '2024-07-31', progress: 100, actualDate: '2024-07-28' },
      { name: 'Training Complete', status: 'Completed', date: '2024-08-31', progress: 100, actualDate: '2024-08-25' }
    ],
    recentActivities: [
      { date: '2024-09-05', activity: 'Project closure report submitted', type: 'milestone' },
      { date: '2024-09-01', activity: 'Final training session completed', type: 'milestone' },
      { date: '2024-08-28', activity: 'System acceptance testing passed', type: 'milestone' },
      { date: '2024-08-25', activity: 'All safety systems operational', type: 'progress' }
    ],
    kpis: {
      spi: 1.15,
      cpi: 1.03,
      qualityScore: 95,
      safetyScore: 99,
      stakeholderSatisfaction: 92
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'On Hold': return 'bg-yellow-100 text-yellow-800';
    case 'At Risk': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getHealthColor = (health: string) => {
  switch (health) {
    case 'Green': return 'bg-green-100 text-green-800';
    case 'Yellow': return 'bg-yellow-100 text-yellow-800';
    case 'Red': return 'bg-red-100 text-red-800';
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

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'progress': return <Activity className="h-4 w-4 text-blue-500" />;
    case 'milestone': return <Flag className="h-4 w-4 text-green-500" />;
    case 'budget': return <DollarSign className="h-4 w-4 text-orange-500" />;
    case 'issue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'stakeholder': return <Users className="h-4 w-4 text-purple-500" />;
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

export default function TrackingPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewProjectDialog, setViewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');

  const filteredProjects = mockTrackingProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesHealth = filterHealth === 'all' || project.health === filterHealth;

    return matchesSearch && matchesStatus && matchesHealth;
  });

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setViewProjectDialog(true);
  };

  const trackingStats = {
    totalProjects: mockTrackingProjects.length,
    activeProjects: mockTrackingProjects.filter(p => p.status === 'In Progress').length,
    completedProjects: mockTrackingProjects.filter(p => p.status === 'Completed').length,
    atRiskProjects: mockTrackingProjects.filter(p => p.health === 'Red').length,
    avgProgress: Math.round(mockTrackingProjects.reduce((sum, p) => sum + p.progress, 0) / mockTrackingProjects.length),
    onTimeProjects: mockTrackingProjects.filter(p => p.scheduleVariance >= 0).length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Tracking</h1>
            <p className="text-muted-foreground">
              Real-time tracking and monitoring of project progress and deliverables
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="gap-2">
              <Timer className="h-4 w-4" />
              Real-time Dashboard
            </Button>
          </div>
        </div>

        {/* Tracking Stats */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Projects</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{trackingStats.totalProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Active</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{trackingStats.activeProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Completed</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{trackingStats.completedProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-medium">At Risk</h3>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{trackingStats.atRiskProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-medium">Avg Progress</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{trackingStats.avgProgress}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">On Time</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{trackingStats.onTimeProjects}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterHealth} onValueChange={setFilterHealth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Health" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Health</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Project Tracking Overview ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Code</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Last Update</TableHead>
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
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {project.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getHealthColor(project.health)}>
                              {project.health}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2 w-20" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className={`flex items-center gap-1 ${project.scheduleVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {project.scheduleVariance < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                {Math.abs(project.scheduleVariance)}d
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {project.daysRemaining}d left
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className={`flex items-center gap-1 ${project.costVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {project.costVariance < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                {Math.abs(project.costVariance)}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {project.budgetProgress}% used
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{project.lastUpdate.split(' ')[0]}</div>
                              <div className="text-xs text-muted-foreground">{project.lastUpdate.split(' ').slice(1).join(' ')}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => handleViewProject(project)}
                            >
                              <Eye className="h-3 w-3" />
                              Track
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <Badge className={getHealthColor(project.health)}>{project.health}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium mb-1">Schedule Performance</div>
                        <div className={`text-lg font-bold ${project.kpis.spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                          SPI: {project.kpis.spi.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Cost Performance</div>
                        <div className={`text-lg font-bold ${project.kpis.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                          CPI: {project.kpis.cpi.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score</span>
                          <span>{project.kpis.qualityScore}%</span>
                        </div>
                        <Progress value={project.kpis.qualityScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Safety Score</span>
                          <span>{project.kpis.safetyScore}%</span>
                        </div>
                        <Progress value={project.kpis.safetyScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stakeholder Satisfaction</span>
                          <span>{project.kpis.stakeholderSatisfaction}%</span>
                        </div>
                        <Progress value={project.kpis.stakeholderSatisfaction} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-medium text-blue-600">{project.activeTasks}</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-600">{project.completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Done</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600">{project.totalTasks}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}
                    <Badge className={getHealthColor(project.health)}>{project.health}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{milestone.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Due: {milestone.date}
                            {milestone.actualDate && (
                              <span className="ml-2">
                                | Actual: {milestone.actualDate}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
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
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name} - Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="font-medium">{activity.activity}</div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Project Tracking Details Dialog */}
        <Dialog open={viewProjectDialog} onOpenChange={setViewProjectDialog}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {selectedProject?.name} - Tracking Details
              </DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="kpis">KPIs</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Project Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={getStatusColor(selectedProject.status)}>
                            {selectedProject.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Health:</span>
                          <Badge className={getHealthColor(selectedProject.health)}>
                            {selectedProject.health}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Manager:</span>
                          <span className="font-medium">{selectedProject.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Team Size:</span>
                          <span className="font-medium">{selectedProject.team}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Progress Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Progress</span>
                            <span className="font-medium">{selectedProject.progress}%</span>
                          </div>
                          <Progress value={selectedProject.progress} className="h-3" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <div className="font-medium text-green-600">{selectedProject.completedTasks}</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-600">{selectedProject.activeTasks}</div>
                            <div className="text-xs text-muted-foreground">Active</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">{selectedProject.totalTasks}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Schedule & Budget</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days Elapsed:</span>
                          <span className="font-medium">{selectedProject.daysElapsed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days Remaining:</span>
                          <span className="font-medium">{selectedProject.daysRemaining}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Schedule Variance:</span>
                          <span className={`font-medium ${selectedProject.scheduleVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {selectedProject.scheduleVariance}d
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget Used:</span>
                          <span className="font-medium">{selectedProject.budgetProgress}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Milestones Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{milestone.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Due: {milestone.date}
                                {milestone.actualDate && ` | Completed: ${milestone.actualDate}`}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24">
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Start Date:</span>
                            <div className="font-medium">{selectedProject.startDate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End Date:</span>
                            <div className="font-medium">{selectedProject.endDate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium">{selectedProject.daysElapsed + selectedProject.daysRemaining} days</div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-6">
                          {selectedProject.milestones.map((milestone, index) => (
                            <div key={index} className="relative pl-8">
                              <div className="absolute left-0 top-1">
                                <div className={`w-3 h-3 rounded-full border-2 ${
                                  milestone.status === 'Completed' ? 'bg-green-500 border-green-500' :
                                  milestone.status === 'In Progress' ? 'bg-blue-500 border-blue-500' :
                                  'bg-gray-300 border-gray-300'
                                }`} />
                                {index < selectedProject.milestones.length - 1 && (
                                  <div className="absolute top-3 left-1 w-0.5 h-8 bg-gray-300" />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{milestone.name}</div>
                                  <Badge className={getMilestoneStatusColor(milestone.status)}>
                                    {milestone.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Planned: {milestone.date}
                                  {milestone.actualDate && ` | Actual: ${milestone.actualDate}`}
                                </div>
                                <div className="mt-1 w-32">
                                  <Progress value={milestone.progress} className="h-1" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kpis" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Indices</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedProject.kpis.spi.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Schedule Performance Index</div>
                            <div className="text-xs mt-1">
                              {selectedProject.kpis.spi >= 1 ? 'Ahead of Schedule' : 'Behind Schedule'}
                            </div>
                          </div>
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-green-600">
                              {selectedProject.kpis.cpi.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Cost Performance Index</div>
                            <div className="text-xs mt-1">
                              {selectedProject.kpis.cpi >= 1 ? 'Under Budget' : 'Over Budget'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Quality Score</span>
                            <span>{selectedProject.kpis.qualityScore}%</span>
                          </div>
                          <Progress value={selectedProject.kpis.qualityScore} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Safety Score</span>
                            <span>{selectedProject.kpis.safetyScore}%</span>
                          </div>
                          <Progress value={selectedProject.kpis.safetyScore} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Stakeholder Satisfaction</span>
                            <span>{selectedProject.kpis.stakeholderSatisfaction}%</span>
                          </div>
                          <Progress value={selectedProject.kpis.stakeholderSatisfaction} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="updates" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activities & Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedProject.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border rounded">
                            {getActivityIcon(activity.type)}
                            <div className="flex-1">
                              <div className="font-medium">{activity.activity}</div>
                              <div className="text-sm text-muted-foreground">{activity.date}</div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
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