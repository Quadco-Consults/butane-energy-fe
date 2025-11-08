"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Building2,
  Clock,
  Eye,
  Send,
  Settings,
  RefreshCw,
  Filter
} from "lucide-react";
import { useState } from "react";

// Mock Financial Reports Data
const availableReports = [
  {
    id: "RPT-001",
    name: "Monthly Financial Statement",
    description: "Comprehensive monthly financial performance including P&L, Balance Sheet, and Cash Flow",
    category: "Financial Statements",
    frequency: "Monthly",
    lastGenerated: "2024-01-31",
    nextScheduled: "2024-02-28",
    format: ["PDF", "Excel", "CSV"],
    recipients: ["CFO", "CEO", "Finance Team"],
    status: "active",
    automated: true,
    size: "2.5 MB",
    pages: 15
  },
  {
    id: "RPT-002",
    name: "Weekly Cash Flow Report",
    description: "Weekly analysis of cash inflows, outflows, and projected liquidity position",
    category: "Cash Management",
    frequency: "Weekly",
    lastGenerated: "2024-01-28",
    nextScheduled: "2024-02-04",
    format: ["PDF", "Excel"],
    recipients: ["CFO", "Finance Manager", "Treasury"],
    status: "active",
    automated: true,
    size: "1.2 MB",
    pages: 8
  },
  {
    id: "RPT-003",
    name: "Plant Profitability Analysis",
    description: "Individual plant performance analysis with revenue, costs, and profitability metrics",
    category: "Operations Analysis",
    frequency: "Monthly",
    lastGenerated: "2024-01-30",
    nextScheduled: "2024-02-28",
    format: ["PDF", "Excel", "PowerPoint"],
    recipients: ["Plant Managers", "Operations Director", "CFO"],
    status: "active",
    automated: true,
    size: "4.1 MB",
    pages: 25
  },
  {
    id: "RPT-004",
    name: "Accounts Receivable Aging Report",
    description: "Detailed aging analysis of customer receivables with collection status and recommendations",
    category: "Credit Management",
    frequency: "Weekly",
    lastGenerated: "2024-01-29",
    nextScheduled: "2024-02-05",
    format: ["Excel", "CSV"],
    recipients: ["Credit Manager", "Sales Team", "Finance"],
    status: "active",
    automated: true,
    size: "850 KB",
    pages: 12
  },
  {
    id: "RPT-005",
    name: "Vendor Payment Schedule",
    description: "Upcoming vendor payments with due dates, amounts, and cash flow impact",
    category: "Accounts Payable",
    frequency: "Weekly",
    lastGenerated: "2024-01-30",
    nextScheduled: "2024-02-06",
    format: ["PDF", "Excel"],
    recipients: ["Accounts Payable", "CFO", "Treasury"],
    status: "active",
    automated: true,
    size: "1.5 MB",
    pages: 10
  },
  {
    id: "RPT-006",
    name: "Budget vs Actual Variance Report",
    description: "Monthly comparison of actual performance against budget with variance analysis",
    category: "Budget Analysis",
    frequency: "Monthly",
    lastGenerated: "2024-01-31",
    nextScheduled: "2024-02-28",
    format: ["PDF", "Excel"],
    recipients: ["Budget Committee", "Department Heads", "CFO"],
    status: "active",
    automated: true,
    size: "3.2 MB",
    pages: 18
  },
  {
    id: "RPT-007",
    name: "Regulatory Compliance Report",
    description: "Financial compliance report for regulatory authorities including tax and statutory requirements",
    category: "Compliance",
    frequency: "Quarterly",
    lastGenerated: "2023-12-31",
    nextScheduled: "2024-03-31",
    format: ["PDF"],
    recipients: ["Legal Team", "External Auditors", "Regulatory Affairs"],
    status: "pending",
    automated: false,
    size: "5.8 MB",
    pages: 45
  },
  {
    id: "RPT-008",
    name: "Executive Dashboard Report",
    description: "High-level executive summary with key financial KPIs and performance indicators",
    category: "Executive Summary",
    frequency: "Daily",
    lastGenerated: "2024-01-31",
    nextScheduled: "2024-02-01",
    format: ["PDF", "PowerPoint"],
    recipients: ["CEO", "Board of Directors", "Senior Management"],
    status: "active",
    automated: true,
    size: "800 KB",
    pages: 5
  }
];

const reportCategories = [
  { name: "Financial Statements", count: 1, icon: FileText },
  { name: "Cash Management", count: 1, icon: DollarSign },
  { name: "Operations Analysis", count: 1, icon: BarChart3 },
  { name: "Credit Management", count: 1, icon: TrendingUp },
  { name: "Accounts Payable", count: 1, icon: PieChart },
  { name: "Budget Analysis", count: 1, icon: BarChart3 },
  { name: "Compliance", count: 1, icon: Settings },
  { name: "Executive Summary", count: 1, icon: TrendingUp }
];

const recentGenerations = [
  {
    id: "GEN-001",
    reportName: "Monthly Financial Statement",
    generatedAt: "2024-01-31 09:30:00",
    generatedBy: "System (Automated)",
    format: "PDF",
    size: "2.5 MB",
    recipients: 3,
    status: "delivered"
  },
  {
    id: "GEN-002",
    reportName: "Plant Profitability Analysis",
    generatedAt: "2024-01-30 16:45:00",
    generatedBy: "Finance Manager",
    format: "Excel",
    size: "4.1 MB",
    recipients: 5,
    status: "delivered"
  },
  {
    id: "GEN-003",
    reportName: "Vendor Payment Schedule",
    generatedAt: "2024-01-30 08:15:00",
    generatedBy: "System (Automated)",
    format: "PDF",
    size: "1.5 MB",
    recipients: 3,
    status: "delivered"
  },
  {
    id: "GEN-004",
    reportName: "Accounts Receivable Aging Report",
    generatedAt: "2024-01-29 14:20:00",
    generatedBy: "Credit Manager",
    format: "Excel",
    size: "850 KB",
    recipients: 4,
    status: "delivered"
  },
  {
    id: "GEN-005",
    reportName: "Weekly Cash Flow Report",
    generatedAt: "2024-01-28 10:00:00",
    generatedBy: "System (Automated)",
    format: "PDF",
    size: "1.2 MB",
    recipients: 4,
    status: "delivered"
  }
];

export default function FinancialReportsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) return null;

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'delivered': return 'default';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalReports = availableReports.length;
  const activeReports = availableReports.filter(r => r.status === 'active').length;
  const automatedReports = availableReports.filter(r => r.automated).length;
  const pendingReports = availableReports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive financial reporting and analytics system for Butane Energy
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {activeReports} active reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automated Reports</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{automatedReports}</div>
            <p className="text-xs text-muted-foreground">
              {((automatedReports/totalReports)*100).toFixed(0)}% automation rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Require manual generation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-xs text-muted-foreground">
              Reports generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Categories</option>
          {reportCategories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Bulk Export
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
          <TabsTrigger value="scheduler">Report Scheduler</TabsTrigger>
        </TabsList>

        {/* Available Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.category}</Badge>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.automated && <RefreshCw className="h-3 w-3 mr-1" />}
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="text-sm font-medium">{report.frequency}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Last Generated</p>
                        <p className="text-sm font-medium">{report.lastGenerated}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Next Scheduled</p>
                        <p className="text-sm font-medium">{report.nextScheduled}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Recipients</p>
                        <p className="text-sm font-medium">{report.recipients.length} users</p>
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Available Formats</p>
                        <div className="flex gap-1 flex-wrap">
                          {report.format.map((format) => (
                            <Badge key={format} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Distribution List</p>
                        <div className="flex gap-1 flex-wrap">
                          {report.recipients.slice(0, 3).map((recipient) => (
                            <Badge key={recipient} variant="secondary" className="text-xs">
                              {recipient}
                            </Badge>
                          ))}
                          {report.recipients.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{report.recipients.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Size: {report.size} • {report.pages} pages
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Generate Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* By Category Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportCategories.map((category) => {
              const IconComponent = category.icon;
              const categoryReports = availableReports.filter(r => r.category === category.name);

              return (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>{category.count} report{category.count !== 1 ? 's' : ''}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryReports.slice(0, 2).map((report) => (
                        <div key={report.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{report.name}</span>
                          <Badge variant={getStatusColor(report.status)} className="text-xs">
                            {report.frequency}
                          </Badge>
                        </div>
                      ))}
                      {categoryReports.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{categoryReports.length - 2} more reports
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" size="sm">
                        View All Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Generation History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Report Generations
              </CardTitle>
              <CardDescription>
                History of recently generated reports with delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGenerations.map((generation) => (
                  <div key={generation.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{generation.reportName}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDateTime(generation.generatedAt)}</span>
                        <span>by {generation.generatedBy}</span>
                        <span>{generation.format} • {generation.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{generation.recipients} recipients</p>
                        <Badge variant={getStatusColor(generation.status)} className="text-xs">
                          {generation.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Scheduler Tab */}
        <TabsContent value="scheduler" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Scheduled Reports
                </CardTitle>
                <CardDescription>
                  Reports scheduled for generation in the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableReports
                    .filter(r => r.automated)
                    .sort((a, b) => new Date(a.nextScheduled).getTime() - new Date(b.nextScheduled).getTime())
                    .slice(0, 5)
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-xs text-muted-foreground">{report.frequency} • {report.nextScheduled}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.frequency}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Report Generation Statistics
                </CardTitle>
                <CardDescription>
                  Performance metrics for report generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <p className="text-xs text-green-700">Success Rate</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.3s</div>
                      <p className="text-xs text-blue-700">Avg. Generation Time</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reports Generated This Month</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Automated vs Manual</span>
                        <span className="font-medium">85% Auto</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-time Delivery</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common report generation and management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button className="h-20 flex flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Generate Monthly P&L</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Create Custom Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Send className="h-6 w-6" />
                    <span>Email All Stakeholders</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule New Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Settings className="h-6 w-6" />
                    <span>Configure Templates</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>View Report Archive</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}