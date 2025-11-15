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
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Users,
  Settings,
  Printer,
  Share,
  RefreshCw,
  MapPin,
  Activity,
  Award,
  Flag,
  Archive
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

// Mock reports data
const mockReportTemplates = [
  {
    id: 'RPT-001',
    name: 'Executive Project Summary',
    type: 'Executive',
    description: 'High-level overview of all PDU projects for executive stakeholders',
    frequency: 'Monthly',
    lastGenerated: '2024-11-01',
    nextScheduled: '2024-12-01',
    recipients: ['CEO', 'COO', 'VP Operations'],
    status: 'Active',
    format: 'PDF'
  },
  {
    id: 'RPT-002',
    name: 'Project Performance Dashboard',
    type: 'Performance',
    description: 'Detailed performance metrics and KPIs for all active projects',
    frequency: 'Weekly',
    lastGenerated: '2024-11-14',
    nextScheduled: '2024-11-21',
    recipients: ['Project Managers', 'Department Heads'],
    status: 'Active',
    format: 'Excel'
  },
  {
    id: 'RPT-003',
    name: 'Budget Variance Report',
    type: 'Financial',
    description: 'Analysis of budget performance across all PDU projects',
    frequency: 'Monthly',
    lastGenerated: '2024-11-01',
    nextScheduled: '2024-12-01',
    recipients: ['CFO', 'Finance Team', 'Project Managers'],
    status: 'Active',
    format: 'PDF'
  },
  {
    id: 'RPT-004',
    name: 'Safety & Compliance Report',
    type: 'Safety',
    description: 'Safety incidents, compliance status, and HSE performance metrics',
    frequency: 'Monthly',
    lastGenerated: '2024-11-01',
    nextScheduled: '2024-12-01',
    recipients: ['HSE Manager', 'Safety Officers'],
    status: 'Active',
    format: 'PDF'
  },
  {
    id: 'RPT-005',
    name: 'Resource Utilization Analysis',
    type: 'Resource',
    description: 'Analysis of resource allocation and utilization across projects',
    frequency: 'Quarterly',
    lastGenerated: '2024-10-01',
    nextScheduled: '2025-01-01',
    recipients: ['HR Director', 'Operations Manager'],
    status: 'Active',
    format: 'Excel'
  }
];

const mockAnalytics = {
  projectSummary: {
    totalProjects: 15,
    activeProjects: 8,
    completedProjects: 6,
    onHoldProjects: 1,
    totalBudget: 8500000000,
    spentBudget: 5200000000,
    avgProgress: 68
  },
  performanceMetrics: {
    avgSPI: 0.96,
    avgCPI: 1.02,
    avgQualityScore: 91,
    avgSafetyScore: 96,
    avgStakeholderSatisfaction: 84,
    onTimeDelivery: 75
  },
  monthlyTrends: [
    { month: 'Jan', progress: 45, budget: 85, quality: 88 },
    { month: 'Feb', progress: 52, budget: 87, quality: 90 },
    { month: 'Mar', progress: 58, budget: 89, quality: 89 },
    { month: 'Apr', progress: 63, budget: 88, quality: 92 },
    { month: 'May', progress: 67, budget: 91, quality: 93 },
    { month: 'Jun', progress: 71, budget: 89, quality: 91 }
  ],
  departmentPerformance: [
    { department: 'Engineering', efficiency: 92, utilization: 89, satisfaction: 87 },
    { department: 'Procurement', efficiency: 88, utilization: 94, satisfaction: 85 },
    { department: 'HSE', efficiency: 95, utilization: 87, satisfaction: 92 },
    { department: 'Operations', efficiency: 91, utilization: 96, satisfaction: 89 }
  ]
};

const mockGeneratedReports = [
  {
    id: 'GEN-001',
    name: 'Q3 2024 Project Performance Report',
    type: 'Performance',
    generatedDate: '2024-10-01',
    generatedBy: 'Emeka Nwosu',
    size: '2.4 MB',
    format: 'PDF',
    downloads: 24,
    recipients: 12
  },
  {
    id: 'GEN-002',
    name: 'October 2024 Executive Summary',
    type: 'Executive',
    generatedDate: '2024-11-01',
    generatedBy: 'Adaobi Okechukwu',
    size: '1.8 MB',
    format: 'PDF',
    downloads: 18,
    recipients: 8
  },
  {
    id: 'GEN-003',
    name: 'Budget Analysis Report - October 2024',
    type: 'Financial',
    generatedDate: '2024-11-02',
    generatedBy: 'Kemi Adebayo',
    size: '3.1 MB',
    format: 'Excel',
    downloads: 15,
    recipients: 6
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Inactive': return 'bg-gray-100 text-gray-800';
    case 'Draft': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Executive': return 'bg-purple-100 text-purple-800';
    case 'Performance': return 'bg-blue-100 text-blue-800';
    case 'Financial': return 'bg-green-100 text-green-800';
    case 'Safety': return 'bg-orange-100 text-orange-800';
    case 'Resource': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function PDUReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewReportDialog, setViewReportDialog] = useState(false);
  const [createReportDialog, setCreateReportDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReports = mockReportTemplates.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setViewReportDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">PDU Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive reporting and analytics for PDU operations and projects
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={createReportDialog} onOpenChange={setCreateReportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Name *</label>
                      <Input placeholder="Enter report name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Executive">Executive</SelectItem>
                          <SelectItem value="Performance">Performance</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Safety">Safety</SelectItem>
                          <SelectItem value="Resource">Resource</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="Excel">Excel</SelectItem>
                          <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                          <SelectItem value="Word">Word</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Enter report description" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateReportDialog(false)}>
                      Cancel
                    </Button>
                    <Button>Create Report</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Projects</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{mockAnalytics.projectSummary.totalProjects}</p>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Avg Progress</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{mockAnalytics.projectSummary.avgProgress}%</p>
              <p className="text-xs text-muted-foreground">Portfolio average</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Budget Utilization</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {Math.round((mockAnalytics.projectSummary.spentBudget / mockAnalytics.projectSummary.totalBudget) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">
                ₦{(mockAnalytics.projectSummary.spentBudget / 1000000000).toFixed(1)}B / ₦{(mockAnalytics.projectSummary.totalBudget / 1000000000).toFixed(1)}B
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-medium">On-Time Delivery</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{mockAnalytics.performanceMetrics.onTimeDelivery}%</p>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="generated">Generated Reports</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
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
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Templates Table */}
            <Card>
              <CardHeader>
                <CardTitle>Report Templates ({filteredReports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Last Generated</TableHead>
                        <TableHead>Next Scheduled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(report.type)}>
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.frequency}</TableCell>
                          <TableCell>{report.lastGenerated}</TableCell>
                          <TableCell>{report.nextScheduled}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.format}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => handleViewReport(report)}
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Download className="h-3 w-3" />
                                Generate
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-blue-600">
                        {mockAnalytics.performanceMetrics.avgSPI.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Average SPI</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">
                        {mockAnalytics.performanceMetrics.avgCPI.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Average CPI</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Score</span>
                        <span>{mockAnalytics.performanceMetrics.avgQualityScore}%</span>
                      </div>
                      <Progress value={mockAnalytics.performanceMetrics.avgQualityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Safety Score</span>
                        <span>{mockAnalytics.performanceMetrics.avgSafetyScore}%</span>
                      </div>
                      <Progress value={mockAnalytics.performanceMetrics.avgSafetyScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stakeholder Satisfaction</span>
                        <span>{mockAnalytics.performanceMetrics.avgStakeholderSatisfaction}%</span>
                      </div>
                      <Progress value={mockAnalytics.performanceMetrics.avgStakeholderSatisfaction} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.departmentPerformance.map((dept, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="font-medium mb-2">{dept.department}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                            <div className="font-medium">{dept.efficiency}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Utilization</div>
                            <div className="font-medium">{dept.utilization}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Satisfaction</div>
                            <div className="font-medium">{dept.satisfaction}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-4">
                    {mockAnalytics.monthlyTrends.map((month, index) => (
                      <div key={index} className="text-center p-3 border rounded">
                        <div className="font-medium text-sm">{month.month}</div>
                        <div className="space-y-2 mt-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Progress</div>
                            <div className="text-sm font-medium">{month.progress}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Budget</div>
                            <div className="text-sm font-medium">{month.budget}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Quality</div>
                            <div className="text-sm font-medium">{month.quality}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Generated Date</TableHead>
                        <TableHead>Generated By</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGeneratedReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(report.type)}>
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.generatedDate}</TableCell>
                          <TableCell>{report.generatedBy}</TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3 text-muted-foreground" />
                              {report.downloads}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-1">
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Share className="h-3 w-3" />
                                Share
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

          <TabsContent value="dashboards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Executive Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-level KPIs and project portfolio overview for executives
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Real-time</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Project Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed project metrics, SPI/CPI analysis, and performance trends
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Daily Updates</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Budget tracking, cost analysis, and financial performance metrics
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Weekly Updates</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Resource Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Resource utilization, capacity planning, and workforce analytics
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Monthly Updates</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Safety & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Safety metrics, incident tracking, and compliance monitoring
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Real-time</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Project timelines, milestone tracking, and schedule analysis
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Daily Updates</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Report Details Dialog */}
        <Dialog open={viewReportDialog} onOpenChange={setViewReportDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedReport?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <div className="mt-1">
                      <Badge className={getTypeColor(selectedReport.type)}>
                        {selectedReport.type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {selectedReport.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                    <div className="mt-1 font-medium">{selectedReport.frequency}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Format</label>
                    <div className="mt-1 font-medium">{selectedReport.format}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{selectedReport.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recipients</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedReport.recipients.map((recipient, index) => (
                      <Badge key={index} variant="outline">{recipient}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Generated</label>
                    <div className="mt-1 font-medium">{selectedReport.lastGenerated}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Next Scheduled</label>
                    <div className="mt-1 font-medium">{selectedReport.nextScheduled}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Template
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Generate Now
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}