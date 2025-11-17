"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Briefcase, Users, Clock, TrendingUp, Edit, Eye, Calendar, MessageSquare, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const openPositions = [
  {
    id: "JOB-001",
    title: "Senior Gas Engineer",
    department: "TDU",
    location: "Lagos",
    type: "Full-time",
    status: "active",
    applicants: 45,
    posted: "2025-11-10",
    deadline: "2025-12-10",
    priority: "high",
    salary: "₦180,000 - ₦250,000",
    hiringManager: "Emeka Okafor"
  },
  {
    id: "JOB-002",
    title: "Logistics Coordinator",
    department: "Logistics",
    location: "Abuja",
    type: "Full-time",
    status: "active",
    applicants: 32,
    posted: "2025-11-08",
    deadline: "2025-12-08",
    priority: "medium",
    salary: "₦120,000 - ₦180,000",
    hiringManager: "Grace Nneka"
  },
  {
    id: "JOB-003",
    title: "Financial Analyst",
    department: "Finance",
    location: "Lagos",
    type: "Full-time",
    status: "interviewing",
    applicants: 28,
    posted: "2025-11-05",
    deadline: "2025-12-05",
    priority: "medium",
    salary: "₦150,000 - ₦220,000",
    hiringManager: "Ahmed Hassan"
  },
  {
    id: "JOB-004",
    title: "HR Business Partner",
    department: "HR",
    location: "Port Harcourt",
    type: "Full-time",
    status: "closed",
    applicants: 67,
    posted: "2025-10-25",
    deadline: "2025-11-25",
    priority: "high",
    salary: "₦200,000 - ₦280,000",
    hiringManager: "David Eze"
  }
];

const candidates = [
  {
    id: "CND-001",
    name: "Adunni Olatunji",
    position: "Senior Gas Engineer",
    stage: "technical_interview",
    score: 85,
    experience: "8 years",
    education: "B.Eng Petroleum Engineering",
    appliedDate: "2025-11-12",
    nextStep: "Final Interview",
    recruiter: "Grace Nneka"
  },
  {
    id: "CND-002",
    name: "Kelechi Nwankwo",
    position: "Logistics Coordinator",
    stage: "screening",
    score: 72,
    experience: "5 years",
    education: "B.Sc Logistics Management",
    appliedDate: "2025-11-14",
    nextStep: "Phone Screen",
    recruiter: "David Eze"
  },
  {
    id: "CND-003",
    name: "Maryam Abdullahi",
    position: "Financial Analyst",
    stage: "offer_pending",
    score: 92,
    experience: "6 years",
    education: "M.Sc Finance, CFA",
    appliedDate: "2025-11-09",
    nextStep: "Offer Negotiation",
    recruiter: "Ahmed Hassan"
  },
  {
    id: "CND-004",
    name: "Chinedu Okoro",
    position: "HR Business Partner",
    stage: "rejected",
    score: 58,
    experience: "4 years",
    education: "B.Sc Psychology",
    appliedDate: "2025-11-01",
    nextStep: "Application Closed",
    recruiter: "Grace Nneka"
  }
];

const interviewSchedule = [
  {
    id: "INT-001",
    candidate: "Adunni Olatunji",
    position: "Senior Gas Engineer",
    type: "Technical Interview",
    date: "2025-11-18",
    time: "14:00",
    interviewer: "Emeka Okafor",
    location: "Conference Room A",
    status: "scheduled"
  },
  {
    id: "INT-002",
    candidate: "Kelechi Nwankwo",
    position: "Logistics Coordinator",
    type: "Phone Screen",
    date: "2025-11-17",
    time: "10:30",
    interviewer: "David Eze",
    location: "Virtual",
    status: "scheduled"
  },
  {
    id: "INT-003",
    candidate: "Fatima Garba",
    position: "Financial Analyst",
    type: "HR Interview",
    date: "2025-11-19",
    time: "11:00",
    interviewer: "Grace Nneka",
    location: "Conference Room B",
    status: "scheduled"
  }
];

const recruitmentMetrics = [
  { month: "Jan", applications: 245, hired: 8, timeToHire: 25 },
  { month: "Feb", applications: 198, hired: 6, timeToHire: 28 },
  { month: "Mar", applications: 312, hired: 12, timeToHire: 22 },
  { month: "Apr", applications: 267, hired: 9, timeToHire: 26 },
  { month: "May", applications: 289, hired: 11, timeToHire: 24 },
  { month: "Jun", applications: 324, hired: 14, timeToHire: 21 }
];

const sourceEffectiveness = [
  { source: "LinkedIn", applications: 145, hired: 8, cost: 150000 },
  { source: "Job Boards", applications: 98, hired: 5, cost: 80000 },
  { source: "Referrals", applications: 67, hired: 12, cost: 45000 },
  { source: "University", applications: 89, hired: 6, cost: 60000 },
  { source: "Direct Apply", applications: 156, hired: 4, cost: 25000 }
];

const stageConversion = [
  { name: "Applied", value: 100, color: "#3B82F6" },
  { name: "Screening", value: 65, color: "#10B981" },
  { name: "Interview", value: 35, color: "#F59E0B" },
  { name: "Offer", value: 18, color: "#8B5CF6" },
  { name: "Hired", value: 12, color: "#EF4444" }
];

export default function RecruitmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "interviewing": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-gray-100 text-gray-800";
      case "on_hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "screening": return "bg-blue-100 text-blue-800";
      case "technical_interview": return "bg-purple-100 text-purple-800";
      case "hr_interview": return "bg-orange-100 text-orange-800";
      case "offer_pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredPositions = openPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || position.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || position.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings, candidates, and hiring process</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job Posting
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">+15% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21 days</div>
            <p className="text-xs text-muted-foreground">-3 days vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground">+0.8% improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by position or department..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="TDU">TDU</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Open Positions */}
          <div className="grid gap-4">
            {filteredPositions.map((position) => (
              <Card key={position.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{position.title}</CardTitle>
                      <CardDescription>{position.department} • {position.location} • {position.type}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(position.priority)}>
                        {position.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(position.status)}>
                        {position.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{position.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="font-medium">{position.applicants} candidates</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted / Deadline</p>
                      <p className="font-medium">{position.posted} / {position.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hiring Manager</p>
                      <p className="font-medium">{position.hiringManager}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      View Candidates
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

        <TabsContent value="candidates" className="space-y-4">
          {/* Candidates Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search candidates by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          {/* Candidates List */}
          <div className="grid gap-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription>{candidate.position}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStageColor(candidate.stage)}>
                        {candidate.stage.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">{candidate.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Education</p>
                      <p className="font-medium">{candidate.education}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="font-medium">{candidate.appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Step</p>
                      <p className="font-medium">{candidate.nextStep}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Recruiter: {candidate.recruiter}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Notes
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Scheduled interviews for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviewSchedule.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{interview.candidate}</p>
                        <p className="text-sm text-muted-foreground">{interview.position}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{interview.type}</p>
                      <p className="text-sm text-muted-foreground">{interview.location}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{interview.date}</p>
                      <p className="text-sm text-muted-foreground">{interview.time}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{interview.interviewer}</p>
                      <Badge variant="outline">
                        {interview.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Source Effectiveness</CardTitle>
              <CardDescription>Performance metrics by recruitment channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceEffectiveness.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.applications} applications
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{source.hired} hires</p>
                      <p className="text-sm text-muted-foreground">
                        {((source.hired / source.applications) * 100).toFixed(1)}% rate
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">₦{source.cost.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Cost per hire</p>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${((source.hired / source.applications) * 100) * 4}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Funnel</CardTitle>
                <CardDescription>Candidate progression through stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageConversion} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Hiring Trends</CardTitle>
                <CardDescription>Applications vs hires over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={recruitmentMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="hired" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time to Hire Trend</CardTitle>
                <CardDescription>Average days from application to hire</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={recruitmentMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="timeToHire" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
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