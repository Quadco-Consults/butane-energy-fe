'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Wrench,
  Building,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Edit,
  Play,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const { user } = useAuth();

  // Mock maintenance data
  const maintenanceItems = [
    {
      id: 'MAINT-2025-018',
      title: 'Air Conditioning System Repair - Building A',
      description: 'Central AC unit not cooling properly, needs compressor inspection',
      type: 'facility',
      category: 'HVAC',
      reportedBy: 'Grace Adebayo',
      assignedTo: 'TechCorp Services',
      location: 'Building A - 3rd Floor',
      priority: 'high',
      status: 'in_progress',
      reportedDate: '2025-11-06',
      scheduledDate: '2025-11-08',
      expectedCompletion: '2025-11-10',
      estimatedCost: 150000,
      actualCost: null,
      plant: 'Head Office',
      workOrder: 'WO-2025-045'
    },
    {
      id: 'MAINT-2025-019',
      title: 'Office Furniture Assembly',
      description: 'Assembly and setup of new furniture in HR department',
      type: 'office',
      category: 'Furniture',
      reportedBy: 'Ahmed Mohammed',
      assignedTo: 'Internal Team',
      location: 'Building B - HR Department',
      priority: 'medium',
      status: 'scheduled',
      reportedDate: '2025-11-05',
      scheduledDate: '2025-11-12',
      expectedCompletion: '2025-11-12',
      estimatedCost: 25000,
      actualCost: null,
      plant: 'Head Office',
      workOrder: 'WO-2025-046'
    },
    {
      id: 'MAINT-2025-020',
      title: 'Elevator Service and Inspection',
      description: 'Monthly elevator maintenance and safety inspection',
      type: 'facility',
      category: 'Elevator',
      reportedBy: 'System Generated',
      assignedTo: 'Elevator Solutions Ltd',
      location: 'Building A - Main Elevator',
      priority: 'high',
      status: 'pending',
      reportedDate: '2025-11-07',
      scheduledDate: '2025-11-15',
      expectedCompletion: '2025-11-15',
      estimatedCost: 85000,
      actualCost: null,
      plant: 'Head Office',
      workOrder: 'WO-2025-047'
    },
    {
      id: 'MAINT-2025-021',
      title: 'Plumbing Repair - Restroom Block C',
      description: 'Water leakage from pipes in restroom facilities',
      type: 'facility',
      category: 'Plumbing',
      reportedBy: 'Ibrahim Usman',
      assignedTo: 'PlumbTech Solutions',
      location: 'Building C - Ground Floor Restroom',
      priority: 'medium',
      status: 'completed',
      reportedDate: '2025-11-01',
      scheduledDate: '2025-11-03',
      expectedCompletion: '2025-11-04',
      estimatedCost: 45000,
      actualCost: 42000,
      plant: 'Head Office',
      workOrder: 'WO-2025-042'
    },
    {
      id: 'MAINT-2025-022',
      title: 'Electrical Socket Installation',
      description: 'Install additional power outlets in conference room',
      type: 'office',
      category: 'Electrical',
      reportedBy: 'Fatima Bello',
      assignedTo: 'ElectroPro Services',
      location: 'Building A - Conference Room 2',
      priority: 'low',
      status: 'overdue',
      reportedDate: '2025-10-28',
      scheduledDate: '2025-11-05',
      expectedCompletion: '2025-11-06',
      estimatedCost: 35000,
      actualCost: null,
      plant: 'Head Office',
      workOrder: 'WO-2025-041'
    },
    {
      id: 'MAINT-2025-023',
      title: 'Security Camera System Maintenance',
      description: 'Quarterly maintenance of CCTV surveillance system',
      type: 'facility',
      category: 'Security',
      reportedBy: 'Emeka Okafor',
      assignedTo: 'SecureWatch Systems',
      location: 'All Buildings',
      priority: 'medium',
      status: 'approved',
      reportedDate: '2025-11-04',
      scheduledDate: '2025-11-20',
      expectedCompletion: '2025-11-22',
      estimatedCost: 120000,
      actualCost: null,
      plant: 'All Plants',
      workOrder: 'WO-2025-048'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'scheduled': return 'bg-cyan-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'facility': return <Building className="h-4 w-4" />;
      case 'office': return <Wrench className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getDaysLeft = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const maintenanceStats = {
    totalItems: maintenanceItems.length,
    inProgress: maintenanceItems.filter(item => item.status === 'in_progress').length,
    overdue: maintenanceItems.filter(item => item.status === 'overdue').length,
    totalCost: maintenanceItems.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost), 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Office & Facility Maintenance</h1>
            <p className="text-muted-foreground">
              Track and manage office and facility maintenance activities
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/maintenance/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Maintenance Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Maintenance</p>
                  <p className="text-xl font-bold">{maintenanceStats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-xl font-bold">{maintenanceStats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-xl font-bold">{maintenanceStats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold">₦{maintenanceStats.totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Maintenance Items</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search maintenance..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceItems.map((item) => {
                const daysLeft = getDaysLeft(item.expectedCompletion);
                const isOverdue = item.status === 'overdue' || (daysLeft < 0 && item.status !== 'completed');
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                          </div>
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">{item.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Maintenance ID</p>
                            <p className="text-muted-foreground">{item.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Category</p>
                            <p className="text-muted-foreground">{item.category}</p>
                          </div>
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{item.location}</p>
                          </div>
                          <div>
                            <p className="font-medium">Assigned To</p>
                            <p className="text-muted-foreground">{item.assignedTo}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Reported: {new Date(item.reportedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.status === 'completed' ? (
                              <span className="text-green-600 font-medium">
                                Completed on {new Date(item.expectedCompletion).toLocaleDateString()}
                              </span>
                            ) : isOverdue ? (
                              <span className="text-red-600 font-medium">
                                Overdue by {Math.abs(daysLeft)} days
                              </span>
                            ) : (
                              <span className={`${daysLeft <= 2 ? 'text-orange-600 font-medium' : ''}`}>
                                Due in {daysLeft} days ({new Date(item.expectedCompletion).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <div>
                            Work Order: {item.workOrder}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Estimated Cost: </span>
                            <span className="text-muted-foreground">₦{item.estimatedCost.toLocaleString()}</span>
                          </div>
                          {item.actualCost && (
                            <div>
                              <span className="font-medium">Actual Cost: </span>
                              <span className="text-muted-foreground">₦{item.actualCost.toLocaleString()}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Reported by: </span>
                            <span className="text-muted-foreground">{item.reportedBy}</span>
                          </div>
                        </div>

                        {/* Status-specific alerts */}
                        {isOverdue && item.status !== 'overdue' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              This maintenance item is overdue and requires immediate attention
                            </div>
                          </div>
                        )}

                        {item.status === 'in_progress' && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Work in progress - Expected completion: {new Date(item.expectedCompletion).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {(item.status === 'pending' || item.status === 'scheduled') && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        {item.status === 'approved' && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Play className="h-3 w-3" />
                            Start Work
                          </Button>
                        )}
                        {item.status === 'in_progress' && (
                          <Button variant="outline" size="sm" className="gap-2 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}