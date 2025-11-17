"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, AlertCircle, CheckCircle, Heart, Clock, Calendar, Shield, DollarSign, Settings, Circle, MessageSquare, UserPlus, Eye, User, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const employeeIssues = [
  {
    id: "ER-001",
    employee: "John Adeyemi",
    department: "TDU",
    issue: "Work Schedule Conflict",
    priority: "medium",
    status: "open",
    dateReported: "2025-11-15",
    assignedTo: "Grace Nneka",
    description: "Requesting flexible work hours due to transportation challenges",
    type: "schedule"
  },
  {
    id: "ER-002",
    employee: "Sarah Okafor",
    department: "Logistics",
    issue: "Workplace Harassment",
    priority: "high",
    status: "investigating",
    dateReported: "2025-11-12",
    assignedTo: "David Eze",
    description: "Reported inappropriate behavior from a colleague",
    type: "harassment"
  },
  {
    id: "ER-003",
    employee: "Ahmed Hassan",
    department: "Finance",
    issue: "Overtime Compensation Dispute",
    priority: "medium",
    status: "resolved",
    dateReported: "2025-11-08",
    assignedTo: "Grace Nneka",
    description: "Discrepancy in overtime calculation for October",
    type: "compensation"
  },
  {
    id: "ER-004",
    employee: "Fatima Sule",
    department: "Admin",
    issue: "Equipment Failure Impact",
    priority: "low",
    status: "open",
    dateReported: "2025-11-14",
    assignedTo: "David Eze",
    description: "Computer equipment malfunction affecting productivity",
    type: "equipment"
  }
];

const grievanceProcedures = [
  {
    stage: "Initial Report",
    description: "Employee submits formal complaint",
    timeframe: "Within 30 days of incident",
    responsible: "HR Representative",
    status: "active"
  },
  {
    stage: "Initial Review",
    description: "HR conducts preliminary assessment",
    timeframe: "5 business days",
    responsible: "HR Manager",
    status: "active"
  },
  {
    stage: "Investigation",
    description: "Formal investigation if required",
    timeframe: "10-15 business days",
    responsible: "Investigation Team",
    status: "active"
  },
  {
    stage: "Resolution",
    description: "Final decision and action taken",
    timeframe: "3-5 business days",
    responsible: "HR Director",
    status: "active"
  },
  {
    stage: "Follow-up",
    description: "Post-resolution monitoring",
    timeframe: "30-60 days",
    responsible: "HR Representative",
    status: "active"
  }
];

const teamSatisfaction = [
  { department: "TDU", satisfaction: 87, responses: 45, issues: 2 },
  { department: "Logistics", satisfaction: 82, responses: 38, issues: 5 },
  { department: "Finance", satisfaction: 91, responses: 25, issues: 1 },
  { department: "HR", satisfaction: 89, responses: 18, issues: 1 },
  { department: "Admin", satisfaction: 85, responses: 22, issues: 3 },
  { department: "Sales", satisfaction: 79, responses: 35, issues: 6 },
  { department: "Trading", satisfaction: 84, responses: 28, issues: 4 }
];

const monthlyTrends = [
  { month: "Jan", issues: 12, resolved: 11, satisfaction: 85 },
  { month: "Feb", issues: 8, resolved: 9, satisfaction: 87 },
  { month: "Mar", issues: 15, resolved: 13, satisfaction: 83 },
  { month: "Apr", issues: 10, resolved: 12, satisfaction: 86 },
  { month: "May", issues: 7, resolved: 8, satisfaction: 89 },
  { month: "Jun", issues: 11, resolved: 10, satisfaction: 88 }
];

const issueTypes = [
  { name: "Schedule", value: 35, color: "#10B981" },
  { name: "Compensation", value: 25, color: "#3B82F6" },
  { name: "Harassment", value: 15, color: "#EF4444" },
  { name: "Equipment", value: 12, color: "#F59E0B" },
  { name: "Other", value: 13, color: "#8B5CF6" }
];

const communicationTools = [
  {
    id: "CT-001",
    name: "Employee Suggestion Box",
    type: "Anonymous Feedback",
    usage: "High",
    responses: 45,
    lastUpdate: "2025-11-15"
  },
  {
    id: "CT-002",
    name: "Monthly Town Halls",
    type: "Open Forum",
    usage: "Medium",
    responses: 120,
    lastUpdate: "2025-11-10"
  },
  {
    id: "CT-003",
    name: "Exit Interviews",
    type: "Departure Feedback",
    usage: "Low",
    responses: 8,
    lastUpdate: "2025-11-08"
  },
  {
    id: "CT-004",
    name: "Pulse Surveys",
    type: "Satisfaction Check",
    usage: "High",
    responses: 180,
    lastUpdate: "2025-11-12"
  }
];

export default function EmployeeRelationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "investigating": return "bg-orange-100 text-orange-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "escalated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "schedule": return <Calendar className="h-4 w-4" />;
      case "harassment": return <Shield className="h-4 w-4" />;
      case "compensation": return <DollarSign className="h-4 w-4" />;
      case "equipment": return <Settings className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const filteredIssues = employeeIssues.filter(issue => {
    const matchesSearch = issue.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Relations</h1>
          <p className="text-muted-foreground">Manage employee concerns, grievances, and workplace satisfaction</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">Within SLA timeframe</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">Average resolution</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Active Issues</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee, issue, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issues List */}
          <div className="grid gap-4">
            {filteredIssues.map((issue) => (
              <Card key={issue.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(issue.type)}
                      <div>
                        <CardTitle className="text-lg">{issue.issue}</CardTitle>
                        <CardDescription>{issue.employee} • {issue.department}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Reported Date</p>
                      <p className="font-medium">{issue.dateReported}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{issue.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Issue ID</p>
                      <p className="font-medium">{issue.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grievance Resolution Procedure</CardTitle>
              <CardDescription>Standard process for handling employee concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {grievanceProcedures.map((stage, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium">{stage.stage}</h3>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {stage.timeframe}
                        </span>
                        <span className="text-muted-foreground">
                          <User className="inline h-3 w-3 mr-1" />
                          {stage.responsible}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">
                      {stage.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Satisfaction Scores</CardTitle>
              <CardDescription>Employee satisfaction by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamSatisfaction.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.responses} responses</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                        <p className={`text-lg font-bold ${getSatisfactionColor(dept.satisfaction)}`}>
                          {dept.satisfaction}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Open Issues</p>
                        <p className="text-lg font-bold">{dept.issues}</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.satisfaction >= 90 ? 'bg-green-500' :
                            dept.satisfaction >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.satisfaction}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
              <CardDescription>Employee feedback and communication tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {communicationTools.map((tool) => (
                  <Card key={tool.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">{tool.type}</p>
                        </div>
                        <Badge variant={tool.usage === "High" ? "default" : tool.usage === "Medium" ? "secondary" : "outline"}>
                          {tool.usage} Usage
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tool.responses} responses</p>
                        <p className="text-sm text-muted-foreground">Last updated: {tool.lastUpdate}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Issue Trends</CardTitle>
                <CardDescription>Issues reported vs resolved over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#EF4444" name="Reported" />
                    <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trend</CardTitle>
                <CardDescription>Employee satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Type Distribution</CardTitle>
                <CardDescription>Breakdown by issue category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={issueTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {issueTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}