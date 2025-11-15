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
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Building,
  Shield,
  Award,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  Upload,
  RefreshCw,
  Archive,
  AlertCircle,
  BookOpen,
  Gavel
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

// Mock permits and licenses data
const mockPermitsLicenses = [
  {
    id: 'PL-001',
    permitNumber: 'OGL/2022/001',
    name: 'Oil & Gas Operating License',
    type: 'Operating License',
    category: 'Oil & Gas',
    issuingAuthority: 'Department of Petroleum Resources (DPR)',
    status: 'Active',
    priority: 'Critical',
    issueDate: '2022-01-15',
    expiryDate: '2025-01-15',
    renewalDate: '2024-10-15',
    daysToExpiry: 61,
    location: 'Lagos Operations',
    responsiblePerson: 'Emeka Nwosu',
    department: 'Operations',
    complianceScore: 95,
    cost: 2500000,
    renewalCost: 3000000,
    documents: [
      { name: 'Operating License Certificate', type: 'Certificate', uploadDate: '2022-01-20' },
      { name: 'Environmental Compliance Report', type: 'Compliance', uploadDate: '2024-01-15' },
      { name: 'Safety Assessment Report', type: 'Safety', uploadDate: '2024-06-15' }
    ],
    conditions: [
      'Maintain environmental standards as per EPA guidelines',
      'Submit quarterly operational reports',
      'Conduct annual safety audits',
      'Notify authority of any operational changes'
    ],
    renewalStatus: 'Renewal Required',
    lastInspection: '2024-08-15',
    nextInspection: '2025-02-15',
    violations: [],
    notes: 'Critical license for oil and gas operations. Renewal process initiated.'
  },
  {
    id: 'PL-002',
    permitNumber: 'EPA/ENV/2023/045',
    name: 'Environmental Impact Assessment Permit',
    type: 'Environmental Permit',
    category: 'Environmental',
    issuingAuthority: 'Environmental Protection Agency (EPA)',
    status: 'Active',
    priority: 'High',
    issueDate: '2023-03-10',
    expiryDate: '2026-03-10',
    renewalDate: '2025-12-10',
    daysToExpiry: 481,
    location: 'Port Harcourt Facility',
    responsiblePerson: 'Adaobi Okechukwu',
    department: 'HSE',
    complianceScore: 88,
    cost: 1800000,
    renewalCost: 2000000,
    documents: [
      { name: 'EIA Permit Certificate', type: 'Certificate', uploadDate: '2023-03-15' },
      { name: 'Environmental Monitoring Plan', type: 'Plan', uploadDate: '2023-03-20' },
      { name: 'Waste Management Plan', type: 'Plan', uploadDate: '2023-03-25' }
    ],
    conditions: [
      'Monitor air quality levels monthly',
      'Submit environmental reports quarterly',
      'Maintain waste management protocols',
      'Conduct environmental impact assessments annually'
    ],
    renewalStatus: 'On Track',
    lastInspection: '2024-09-10',
    nextInspection: '2024-12-10',
    violations: [
      { date: '2024-07-15', description: 'Minor air quality deviation', severity: 'Minor', resolved: true }
    ],
    notes: 'Regular monitoring required for air and water quality parameters.'
  },
  {
    id: 'PL-003',
    permitNumber: 'FIRE/SAFETY/2024/012',
    name: 'Fire Safety Certificate',
    type: 'Safety Certificate',
    category: 'Fire Safety',
    issuingAuthority: 'Lagos State Fire Service',
    status: 'Active',
    priority: 'High',
    issueDate: '2024-02-01',
    expiryDate: '2025-02-01',
    renewalDate: '2024-11-01',
    daysToExpiry: 79,
    location: 'Lagos Head Office',
    responsiblePerson: 'Kemi Adebayo',
    department: 'HSE',
    complianceScore: 92,
    cost: 750000,
    renewalCost: 850000,
    documents: [
      { name: 'Fire Safety Certificate', type: 'Certificate', uploadDate: '2024-02-05' },
      { name: 'Fire Safety Plan', type: 'Plan', uploadDate: '2024-02-10' },
      { name: 'Emergency Evacuation Plan', type: 'Plan', uploadDate: '2024-02-15' }
    ],
    conditions: [
      'Maintain fire safety equipment',
      'Conduct monthly fire drills',
      'Annual fire safety inspection',
      'Staff fire safety training'
    ],
    renewalStatus: 'Renewal Due',
    lastInspection: '2024-10-01',
    nextInspection: '2025-01-01',
    violations: [],
    notes: 'All fire safety equipment inspected and certified. Renewal process to begin soon.'
  },
  {
    id: 'PL-004',
    permitNumber: 'NECA/ELECT/2023/089',
    name: 'Electrical Installation Certificate',
    type: 'Installation Certificate',
    category: 'Electrical',
    issuingAuthority: 'Nigerian Electricity Management Services Agency (NEMSA)',
    status: 'Expired',
    priority: 'Critical',
    issueDate: '2023-01-20',
    expiryDate: '2024-01-20',
    renewalDate: '2023-10-20',
    daysToExpiry: -298,
    location: 'Abuja Operations Center',
    responsiblePerson: 'Tunde Lawal',
    department: 'Engineering',
    complianceScore: 65,
    cost: 1200000,
    renewalCost: 1400000,
    documents: [
      { name: 'Electrical Certificate', type: 'Certificate', uploadDate: '2023-01-25' },
      { name: 'Electrical Safety Report', type: 'Safety', uploadDate: '2023-01-30' }
    ],
    conditions: [
      'Regular electrical safety inspections',
      'Maintain electrical installation standards',
      'Staff electrical safety training',
      'Incident reporting requirements'
    ],
    renewalStatus: 'Overdue',
    lastInspection: '2023-12-15',
    nextInspection: 'TBD',
    violations: [
      { date: '2024-02-01', description: 'Operating with expired certificate', severity: 'Major', resolved: false }
    ],
    notes: 'URGENT: Certificate expired. Immediate renewal required to maintain operations.'
  },
  {
    id: 'PL-005',
    permitNumber: 'WORK/PERMIT/2024/156',
    name: 'Work Permit - Expatriate Staff',
    type: 'Work Permit',
    category: 'Immigration',
    issuingAuthority: 'Nigeria Immigration Service (NIS)',
    status: 'Active',
    priority: 'Medium',
    issueDate: '2024-05-01',
    expiryDate: '2025-05-01',
    renewalDate: '2025-02-01',
    daysToExpiry: 167,
    location: 'All Locations',
    responsiblePerson: 'Fatima Abubakar',
    department: 'HR',
    complianceScore: 90,
    cost: 500000,
    renewalCost: 550000,
    documents: [
      { name: 'Work Permit Certificate', type: 'Certificate', uploadDate: '2024-05-05' },
      { name: 'Employment Contract', type: 'Contract', uploadDate: '2024-05-01' },
      { name: 'Qualification Documents', type: 'Qualification', uploadDate: '2024-04-25' }
    ],
    conditions: [
      'Employment within specified role only',
      'Regular reporting to immigration office',
      'No change of employer without approval',
      'Maintain passport validity'
    ],
    renewalStatus: 'On Track',
    lastInspection: '2024-08-01',
    nextInspection: '2025-02-01',
    violations: [],
    notes: 'Work permit for 3 expatriate technical advisors. On track for renewal.'
  }
];

const mockRegulatoryBodies = [
  {
    name: 'Department of Petroleum Resources (DPR)',
    contact: 'info@dpr.gov.ng',
    phone: '+234-9-461-0100',
    address: 'No. 7, Kofo Abayomi Street, Victoria Island, Lagos',
    type: 'Federal Agency',
    permits: ['Operating License', 'Drilling Permits', 'Import/Export License']
  },
  {
    name: 'Environmental Protection Agency (EPA)',
    contact: 'info@epa.gov.ng',
    phone: '+234-9-234-5678',
    address: 'Federal Secretariat, Shehu Shagari Way, Abuja',
    type: 'Federal Agency',
    permits: ['Environmental Permits', 'EIA Permits', 'Waste Management']
  },
  {
    name: 'Lagos State Fire Service',
    contact: 'info@lagosfire.gov.ng',
    phone: '+234-1-199',
    address: 'Fire Service Headquarters, Alausa, Ikeja, Lagos',
    type: 'State Agency',
    permits: ['Fire Safety Certificates', 'Building Permits']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Expired': return 'bg-red-100 text-red-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Suspended': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Medium': return 'bg-blue-100 text-blue-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRenewalStatusColor = (status: string) => {
  switch (status) {
    case 'On Track': return 'bg-green-100 text-green-800';
    case 'Renewal Due': return 'bg-yellow-100 text-yellow-800';
    case 'Renewal Required': return 'bg-orange-100 text-orange-800';
    case 'Overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function PermitsPage() {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [viewPermitDialog, setViewPermitDialog] = useState(false);
  const [createPermitDialog, setCreatePermitDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredPermits = mockPermitsLicenses.filter(permit => {
    const matchesSearch = permit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || permit.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || permit.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || permit.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleViewPermit = (permit: any) => {
    setSelectedPermit(permit);
    setViewPermitDialog(true);
  };

  const permitStats = {
    total: mockPermitsLicenses.length,
    active: mockPermitsLicenses.filter(p => p.status === 'Active').length,
    expired: mockPermitsLicenses.filter(p => p.status === 'Expired').length,
    pending: mockPermitsLicenses.filter(p => p.status === 'Pending').length,
    renewalsDue: mockPermitsLicenses.filter(p => p.daysToExpiry <= 90 && p.daysToExpiry > 0).length,
    overdue: mockPermitsLicenses.filter(p => p.daysToExpiry < 0).length,
    avgComplianceScore: Math.round(mockPermitsLicenses.reduce((sum, p) => sum + p.complianceScore, 0) / mockPermitsLicenses.length)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permits & Licenses Management</h1>
            <p className="text-muted-foreground">
              Comprehensive tracking and management of regulatory permits, licenses, and compliance documentation
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={createPermitDialog} onOpenChange={setCreatePermitDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Permit/License
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Permit/License</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Permit Name *</label>
                      <Input placeholder="Enter permit/license name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Permit Number *</label>
                      <Input placeholder="Enter permit number" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operating License">Operating License</SelectItem>
                          <SelectItem value="Environmental Permit">Environmental Permit</SelectItem>
                          <SelectItem value="Safety Certificate">Safety Certificate</SelectItem>
                          <SelectItem value="Installation Certificate">Installation Certificate</SelectItem>
                          <SelectItem value="Work Permit">Work Permit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                          <SelectItem value="Environmental">Environmental</SelectItem>
                          <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Immigration">Immigration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Issuing Authority *</label>
                      <Input placeholder="Enter issuing authority" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority *</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Issue Date *</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry Date *</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location *</label>
                      <Input placeholder="Enter location" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Responsible Person *</label>
                      <Input placeholder="Enter responsible person" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea placeholder="Enter any additional notes" rows={3} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreatePermitDialog(false)}>
                      Cancel
                    </Button>
                    <Button>Add Permit/License</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Permits Stats */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Permits</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{permitStats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Active</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{permitStats.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-medium">Expired</h3>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{permitStats.expired}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Renewals Due</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{permitStats.renewalsDue}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-medium">Overdue</h3>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{permitStats.overdue}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Avg Compliance</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{permitStats.avgComplianceScore}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="permits" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="permits">Permits & Licenses</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="authorities">Regulatory Bodies</TabsTrigger>
          </TabsList>

          <TabsContent value="permits" className="space-y-6">
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
                        placeholder="Search permits, numbers, or authorities..."
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                      <SelectItem value="Environmental">Environmental</SelectItem>
                      <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Immigration">Immigration</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Permits Table */}
            <Card>
              <CardHeader>
                <CardTitle>Permits & Licenses ({filteredPermits.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permit Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Days to Expiry</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPermits.map((permit) => (
                        <TableRow key={permit.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{permit.permitNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{permit.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {permit.issuingAuthority.substring(0, 30)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{permit.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(permit.status)}>
                              {permit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(permit.priority)}>
                              {permit.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{permit.expiryDate}</TableCell>
                          <TableCell>
                            <div className={`text-sm font-medium ${permit.daysToExpiry < 0 ? 'text-red-600' : permit.daysToExpiry <= 90 ? 'text-orange-600' : 'text-green-600'}`}>
                              {permit.daysToExpiry < 0 ? `${Math.abs(permit.daysToExpiry)} days overdue` : `${permit.daysToExpiry} days`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={permit.complianceScore} className="w-16 h-2" />
                              <span className="text-sm">{permit.complianceScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => handleViewPermit(permit)}
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

          <TabsContent value="renewals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permit Renewal Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPermitsLicenses
                    .filter(permit => permit.daysToExpiry <= 180)
                    .sort((a, b) => a.daysToExpiry - b.daysToExpiry)
                    .map((permit) => (
                    <div key={permit.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{permit.name}</div>
                        <Badge className={getRenewalStatusColor(permit.renewalStatus)}>
                          {permit.renewalStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Permit Number:</span>
                          <div className="font-medium">{permit.permitNumber}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiry Date:</span>
                          <div className="font-medium">{permit.expiryDate}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Renewal Date:</span>
                          <div className="font-medium">{permit.renewalDate}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Days to Expiry:</span>
                          <div className={`font-medium ${permit.daysToExpiry < 0 ? 'text-red-600' : permit.daysToExpiry <= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                            {permit.daysToExpiry < 0 ? `${Math.abs(permit.daysToExpiry)} days overdue` : `${permit.daysToExpiry} days`}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <RefreshCw className="h-3 w-3" />
                          Start Renewal
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          Schedule Reminder
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          View Documents
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-3xl font-bold text-blue-600">{permitStats.avgComplianceScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Compliance Score</div>
                  </div>

                  <div className="space-y-3">
                    {mockPermitsLicenses.map((permit) => (
                      <div key={permit.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{permit.name}</div>
                          <div className="text-sm text-muted-foreground">{permit.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={permit.complianceScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">{permit.complianceScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPermitsLicenses
                      .filter(permit => permit.violations.length > 0)
                      .map((permit) => (
                      <div key={permit.id} className="p-3 border rounded">
                        <div className="font-medium mb-2">{permit.name}</div>
                        {permit.violations.map((violation, index) => (
                          <div key={index} className="text-sm p-2 bg-muted rounded mb-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Violation Date: {violation.date}</span>
                              <Badge className={violation.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {violation.resolved ? 'Resolved' : 'Open'}
                              </Badge>
                            </div>
                            <div className="mt-1">{violation.description}</div>
                            <div className="mt-1">
                              <Badge className={violation.severity === 'Major' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                                {violation.severity} Severity
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authorities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Bodies & Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRegulatoryBodies.map((authority, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Gavel className="h-5 w-5 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <div className="font-medium">{authority.name}</div>
                          <Badge variant="outline" className="mt-1 mb-2">{authority.type}</Badge>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a href={`mailto:${authority.contact}`} className="text-blue-600 hover:underline">
                                {authority.contact}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{authority.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <span className="text-xs">{authority.address}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Permits Issued:</div>
                            <div className="flex flex-wrap gap-1">
                              {authority.permits.map((permit, pIndex) => (
                                <Badge key={pIndex} variant="outline" className="text-xs">
                                  {permit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Permit Details Dialog */}
        <Dialog open={viewPermitDialog} onOpenChange={setViewPermitDialog}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {selectedPermit?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedPermit && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Permit Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Permit Number:</span>
                            <div className="font-medium">{selectedPermit.permitNumber}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium">{selectedPermit.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <Badge variant="outline">{selectedPermit.category}</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority:</span>
                            <Badge className={getPriorityColor(selectedPermit.priority)}>
                              {selectedPermit.priority}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={getStatusColor(selectedPermit.status)}>
                              {selectedPermit.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Compliance Score:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={selectedPermit.complianceScore} className="w-16 h-2" />
                              <span className="font-medium">{selectedPermit.complianceScore}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Dates & Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Issue Date:</span>
                            <span className="font-medium">{selectedPermit.issueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expiry Date:</span>
                            <span className="font-medium">{selectedPermit.expiryDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Renewal Date:</span>
                            <span className="font-medium">{selectedPermit.renewalDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Days to Expiry:</span>
                            <span className={`font-medium ${selectedPermit.daysToExpiry < 0 ? 'text-red-600' : selectedPermit.daysToExpiry <= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                              {selectedPermit.daysToExpiry < 0 ? `${Math.abs(selectedPermit.daysToExpiry)} days overdue` : `${selectedPermit.daysToExpiry} days`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Renewal Status:</span>
                            <Badge className={getRenewalStatusColor(selectedPermit.renewalStatus)}>
                              {selectedPermit.renewalStatus}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Authority & Responsibility</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Issuing Authority</div>
                        <div className="font-medium">{selectedPermit.issuingAuthority}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Responsible Person</div>
                        <div className="font-medium">{selectedPermit.responsiblePerson}</div>
                        <div className="text-sm text-muted-foreground">{selectedPermit.department} Department</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
                        <div className="font-medium">{selectedPermit.location}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Cost Information</div>
                        <div className="text-sm">Initial Cost: ₦{selectedPermit.cost.toLocaleString()}</div>
                        <div className="text-sm">Renewal Cost: ₦{selectedPermit.renewalCost.toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedPermit.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedPermit.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Associated Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPermit.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {doc.type} • Uploaded: {doc.uploadDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <Button variant="outline" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conditions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Permit Conditions & Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPermit.conditions.map((condition, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Inspections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">Last Inspection</div>
                          <div className="font-medium">{selectedPermit.lastInspection}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">Next Inspection</div>
                          <div className="font-medium">{selectedPermit.nextInspection}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Permit History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                          <div className="font-medium">Permit Issued</div>
                          <div className="text-sm text-muted-foreground">{selectedPermit.issueDate}</div>
                          <div className="text-sm">Initial permit issued by {selectedPermit.issuingAuthority}</div>
                        </div>

                        {selectedPermit.lastInspection && (
                          <div className="border-l-2 border-blue-500 pl-4">
                            <div className="font-medium">Last Inspection Completed</div>
                            <div className="text-sm text-muted-foreground">{selectedPermit.lastInspection}</div>
                            <div className="text-sm">Regular compliance inspection completed</div>
                          </div>
                        )}

                        {selectedPermit.violations.length > 0 && selectedPermit.violations.map((violation, index) => (
                          <div key={index} className="border-l-2 border-red-500 pl-4">
                            <div className="font-medium">Violation Reported</div>
                            <div className="text-sm text-muted-foreground">{violation.date}</div>
                            <div className="text-sm">{violation.description}</div>
                            <Badge className={violation.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {violation.resolved ? 'Resolved' : 'Open'}
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