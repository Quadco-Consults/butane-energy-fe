'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  UserPlus, Users, Search, Filter, Download, Upload, Plus,
  Eye, Edit, Trash2, Calendar, MapPin, Building, Briefcase,
  Clock, CheckCircle, XCircle, AlertTriangle, Mail, Phone,
  FileText, Star, TrendingUp, Target, BarChart3
} from 'lucide-react'

export default function RecruitmentPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('jobs')

  // Sample job postings
  const jobPostings = [
    {
      id: 'JOB001',
      title: 'Senior Operations Engineer',
      department: 'Operations',
      location: 'Lagos Office',
      type: 'Full-time',
      salary: '₦450,000 - ₦650,000',
      postedDate: '2024-11-01',
      deadline: '2024-12-01',
      status: 'Active',
      applicants: 24,
      hired: 0,
      description: 'Lead LPG operations and safety protocols'
    },
    {
      id: 'JOB002',
      title: 'HR Specialist',
      department: 'Human Resources',
      location: 'Abuja Office',
      type: 'Full-time',
      salary: '₦350,000 - ₦450,000',
      postedDate: '2024-10-15',
      deadline: '2024-11-30',
      status: 'Active',
      applicants: 18,
      hired: 0,
      description: 'Manage employee relations and HR processes'
    },
    {
      id: 'JOB003',
      title: 'Finance Manager',
      department: 'Finance',
      location: 'Port Harcourt',
      type: 'Full-time',
      salary: '₦500,000 - ₦750,000',
      postedDate: '2024-11-05',
      deadline: '2024-12-15',
      status: 'Active',
      applicants: 31,
      hired: 0,
      description: 'Oversee financial operations and reporting'
    },
    {
      id: 'JOB004',
      title: 'Sales Representative',
      department: 'Sales',
      location: 'Multiple Locations',
      type: 'Full-time',
      salary: '₦280,000 - ₦380,000',
      postedDate: '2024-10-20',
      deadline: '2024-11-20',
      status: 'Closed',
      applicants: 45,
      hired: 2,
      description: 'Drive LPG sales in assigned territory'
    }
  ]

  // Sample candidates
  const candidates = [
    {
      id: 'CAND001',
      name: 'Adebola Ogundimu',
      position: 'Senior Operations Engineer',
      email: 'adebola.ogundimu@email.com',
      phone: '+234-803-123-4567',
      location: 'Lagos',
      experience: '8 years',
      status: 'Interview Scheduled',
      appliedDate: '2024-11-03',
      rating: 4.5,
      resume: 'resume_001.pdf'
    },
    {
      id: 'CAND002',
      name: 'Fatima Hassan',
      position: 'HR Specialist',
      email: 'fatima.hassan@email.com',
      phone: '+234-805-234-5678',
      location: 'Abuja',
      experience: '5 years',
      status: 'Application Review',
      appliedDate: '2024-10-20',
      rating: 4.2,
      resume: 'resume_002.pdf'
    },
    {
      id: 'CAND003',
      name: 'Chinedu Okoro',
      position: 'Finance Manager',
      email: 'chinedu.okoro@email.com',
      phone: '+234-807-345-6789',
      location: 'Port Harcourt',
      experience: '10 years',
      status: 'Offer Extended',
      appliedDate: '2024-11-07',
      rating: 4.8,
      resume: 'resume_003.pdf'
    },
    {
      id: 'CAND004',
      name: 'Amina Yusuf',
      position: 'Sales Representative',
      email: 'amina.yusuf@email.com',
      phone: '+234-809-456-7890',
      location: 'Kano',
      experience: '3 years',
      status: 'Hired',
      appliedDate: '2024-10-25',
      rating: 4.0,
      resume: 'resume_004.pdf'
    }
  ]

  const departments = ['Operations', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'IT', 'Procurement']
  const jobStatuses = ['Active', 'Closed', 'Draft', 'On Hold']
  const candidateStatuses = ['Application Review', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected']

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getJobStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Active': { variant: 'default', color: 'text-green-600' },
      'Closed': { variant: 'secondary', color: 'text-gray-600' },
      'Draft': { variant: 'outline', color: 'text-yellow-600' },
      'On Hold': { variant: 'destructive', color: 'text-red-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
  }

  const getCandidateStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Application Review': { variant: 'outline', color: 'text-blue-600' },
      'Interview Scheduled': { variant: 'secondary', color: 'text-purple-600' },
      'Offer Extended': { variant: 'default', color: 'text-green-600' },
      'Hired': { variant: 'default', color: 'text-green-600' },
      'Rejected': { variant: 'destructive', color: 'text-red-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
  }

  const getRecruitmentStats = () => {
    const totalJobs = jobPostings.length
    const activeJobs = jobPostings.filter(job => job.status === 'Active').length
    const totalApplicants = jobPostings.reduce((sum, job) => sum + job.applicants, 0)
    const totalHired = jobPostings.reduce((sum, job) => sum + job.hired, 0)
    const avgTimeToHire = 45 // days
    const hireRate = totalApplicants > 0 ? ((totalHired / totalApplicants) * 100) : 0

    return { totalJobs, activeJobs, totalApplicants, totalHired, avgTimeToHire, hireRate }
  }

  const stats = getRecruitmentStats()

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Recruitment & Hiring</h1>
                  <p className="text-sm text-gray-600">Manage job postings, candidates, and hiring processes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Post New Job</DialogTitle>
                      <DialogDescription>
                        Create a new job posting to attract candidates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input id="jobTitle" placeholder="e.g., Senior Engineer" />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lagos Office">Lagos Office</SelectItem>
                              <SelectItem value="Abuja Office">Abuja Office</SelectItem>
                              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                              <SelectItem value="Kano Office">Kano Office</SelectItem>
                              <SelectItem value="Multiple Locations">Multiple Locations</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="jobType">Job Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input id="salary" placeholder="e.g., ₦300,000 - ₦500,000" />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input id="deadline" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea id="description" placeholder="Describe the role, responsibilities, and requirements..." rows={4} />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Post Job
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Applicants</p>
                <p className="text-xl font-bold text-purple-600">{stats.totalApplicants}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-xl font-bold text-orange-600">{stats.totalHired}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Time</p>
                <p className="text-xl font-bold text-yellow-600">{stats.avgTimeToHire}d</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hire Rate</p>
                <p className="text-xl font-bold text-indigo-600">{stats.hireRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs or candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {jobStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Job Postings</CardTitle>
                      <CardDescription>
                        {filteredJobs.length} of {jobPostings.length} jobs
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Bulk Actions</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Salary Range</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => {
                        const statusInfo = getJobStatusBadge(job.status)

                        return (
                          <TableRow key={job.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Briefcase className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{job.title}</div>
                                  <div className="text-sm text-gray-500">{job.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{job.department}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {job.location}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{job.salary}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{job.applicants}</span>
                                <Badge variant="outline" className="text-xs">
                                  {job.hired} hired
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={statusInfo.variant} className={statusInfo.color}>
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="candidates">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Candidates</CardTitle>
                      <CardDescription>
                        {filteredCandidates.length} of {candidates.length} candidates
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CVs
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Position Applied</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => {
                        const statusInfo = getCandidateStatusBadge(candidate.status)

                        return (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{candidate.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center space-x-3">
                                    <span className="flex items-center">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {candidate.email}
                                    </span>
                                    <span className="flex items-center">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {candidate.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{candidate.position}</TableCell>
                            <TableCell>{candidate.experience}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {candidate.location}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{candidate.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusInfo.variant} className={statusInfo.color}>
                                {candidate.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Scheduled Interviews</CardTitle>
                    <CardDescription>Upcoming interview sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium">Adebola Ogundimu</div>
                            <div className="text-sm text-gray-600">Senior Operations Engineer</div>
                            <div className="text-sm text-gray-500">Tomorrow, 2:00 PM</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button size="sm">Start Interview</Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Ibrahim Musa</div>
                            <div className="text-sm text-gray-600">Finance Assistant</div>
                            <div className="text-sm text-gray-500">Friday, 10:00 AM</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button size="sm">Prepare</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interview Stats</CardTitle>
                    <CardDescription>This month's interview metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <span className="font-semibold">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-semibold text-green-600">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Duration</span>
                      <span className="font-semibold">45 min</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recruitment Funnel</CardTitle>
                    <CardDescription>Application to hire conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Applications</span>
                        <span className="font-semibold">118</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Screen Passed</span>
                        <span className="font-semibold">65</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-3/5"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Interviews</span>
                        <span className="font-semibold">35</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Offers</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-1/12"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Hires</span>
                        <span className="font-semibold">6</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-1/20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                    <CardDescription>Recruitment performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">5.1%</div>
                        <div className="text-sm text-blue-700">Overall Hire Rate</div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">45 days</div>
                        <div className="text-sm text-green-700">Average Time to Hire</div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">₦485K</div>
                        <div className="text-sm text-purple-700">Cost Per Hire</div>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">92%</div>
                        <div className="text-sm text-orange-700">Offer Acceptance Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}