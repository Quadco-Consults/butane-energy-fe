'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ClipboardList,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Edit,
  Check,
  X,
  Package,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function RequestsPage() {
  const { user } = useAuth();

  // Mock item request data
  const requests = [
    {
      id: 'REQ-2025-034',
      title: 'Office Chair Request',
      description: 'Executive chair needed for new HR manager office setup',
      requestedBy: 'Grace Adebayo',
      department: 'HR',
      requestDate: '2025-11-05',
      requiredDate: '2025-11-12',
      status: 'pending',
      priority: 'medium',
      items: [
        { name: 'Executive Office Chair', quantity: 1, estimatedCost: 85000, available: true }
      ],
      totalEstimatedCost: 85000,
      approvedBy: null,
      plant: 'Head Office'
    },
    {
      id: 'REQ-2025-035',
      title: 'IT Equipment for New Employee',
      description: 'Computer setup required for new developer in IT department',
      requestedBy: 'Ahmed Mohammed',
      department: 'IT',
      requestDate: '2025-11-03',
      requiredDate: '2025-11-10',
      status: 'approved',
      priority: 'high',
      items: [
        { name: 'Desktop Computer', quantity: 1, estimatedCost: 180000, available: false },
        { name: 'Monitor 24-inch', quantity: 1, estimatedCost: 65000, available: true },
        { name: 'Keyboard & Mouse Set', quantity: 1, estimatedCost: 15000, available: true }
      ],
      totalEstimatedCost: 260000,
      approvedBy: 'Musa Garba',
      plant: 'Head Office'
    },
    {
      id: 'REQ-2025-036',
      title: 'Cleaning Supplies Restock',
      description: 'Monthly restock of cleaning supplies for office maintenance',
      requestedBy: 'Ibrahim Usman',
      department: 'Facilities',
      requestDate: '2025-11-01',
      requiredDate: '2025-11-08',
      status: 'processing',
      priority: 'medium',
      items: [
        { name: 'Cleaning Supplies Kit', quantity: 10, estimatedCost: 3500, available: true },
        { name: 'Toilet Paper (Pack)', quantity: 20, estimatedCost: 1200, available: true },
        { name: 'Hand Sanitizer', quantity: 15, estimatedCost: 2500, available: true }
      ],
      totalEstimatedCost: 102500,
      approvedBy: 'Grace Adebayo',
      plant: 'All Plants'
    },
    {
      id: 'REQ-2025-037',
      title: 'Stationery Supplies',
      description: 'Monthly office stationery requirement for sales department',
      requestedBy: 'Emeka Okafor',
      department: 'Sales',
      requestDate: '2025-10-28',
      requiredDate: '2025-11-15',
      status: 'completed',
      priority: 'low',
      items: [
        { name: 'Office Paper A4 (Ream)', quantity: 50, estimatedCost: 2500, available: true },
        { name: 'Pens (Box)', quantity: 10, estimatedCost: 3000, available: true },
        { name: 'Folders', quantity: 25, estimatedCost: 800, available: true }
      ],
      totalEstimatedCost: 175000,
      approvedBy: 'Musa Garba',
      plant: 'Head Office'
    },
    {
      id: 'REQ-2025-038',
      title: 'Safety Equipment Request',
      description: 'Safety equipment for new plant operations team',
      requestedBy: 'Fatima Bello',
      department: 'Operations',
      requestDate: '2025-11-04',
      requiredDate: '2025-11-18',
      status: 'rejected',
      priority: 'high',
      items: [
        { name: 'Safety Helmets', quantity: 20, estimatedCost: 5000, available: true },
        { name: 'Safety Boots', quantity: 20, estimatedCost: 12000, available: false },
        { name: 'Safety Goggles', quantity: 20, estimatedCost: 3500, available: true }
      ],
      totalEstimatedCost: 410000,
      approvedBy: null,
      plant: 'Kano Plant',
      rejectionReason: 'Budget exceeded for this quarter'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'processing': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
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

  const getDaysLeft = (requiredDate: string) => {
    const today = new Date();
    const required = new Date(requiredDate);
    const diffTime = required.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const requestStats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(req => req.status === 'pending').length,
    urgentRequests: requests.filter(req => req.priority === 'high' && req.status !== 'completed' && req.status !== 'rejected').length,
    totalValue: requests.reduce((sum, req) => sum + req.totalEstimatedCost, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Item Request Management</h1>
            <p className="text-muted-foreground">
              Process and track internal item requests from departments
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/requests/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Request Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-xl font-bold">{requestStats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-xl font-bold">{requestStats.pendingRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-xl font-bold">{requestStats.urgentRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{requestStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Item Requests</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => {
                const daysLeft = getDaysLeft(request.requiredDate);
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{request.title}</h3>
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {request.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(request.priority)}>
                            {request.priority.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">{request.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Request ID</p>
                            <p className="text-muted-foreground">{request.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Requested By</p>
                            <p className="text-muted-foreground">{request.requestedBy}</p>
                          </div>
                          <div>
                            <p className="font-medium">Department</p>
                            <p className="text-muted-foreground">{request.department}</p>
                          </div>
                          <div>
                            <p className="font-medium">Plant/Location</p>
                            <p className="text-muted-foreground">{request.plant}</p>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="mb-3">
                          <p className="font-medium text-sm mb-2">Requested Items:</p>
                          <div className="bg-gray-50 rounded p-3 space-y-2">
                            {request.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{item.name}</span>
                                  <Badge variant={item.available ? "default" : "destructive"} className="text-xs">
                                    {item.available ? "Available" : "Not Available"}
                                  </Badge>
                                </div>
                                <div className="text-muted-foreground">
                                  Qty: {item.quantity} × ₦{item.estimatedCost.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Requested: {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.status !== 'completed' && request.status !== 'rejected' && daysLeft >= 0 ? (
                              <span className={`${daysLeft <= 2 ? 'text-red-600 font-medium' : ''}`}>
                                Required in {daysLeft} days ({new Date(request.requiredDate).toLocaleDateString()})
                              </span>
                            ) : request.status === 'completed' ? (
                              <span className="text-green-600 font-medium">Completed</span>
                            ) : request.status === 'rejected' ? (
                              <span className="text-red-600 font-medium">Rejected</span>
                            ) : (
                              <span>Required: {new Date(request.requiredDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div>
                            Total: ₦{request.totalEstimatedCost.toLocaleString()}
                          </div>
                        </div>

                        <div className="mt-2 text-sm">
                          {request.approvedBy ? (
                            <span className="text-green-600">Approved by: {request.approvedBy}</span>
                          ) : request.status === 'rejected' ? (
                            <div>
                              <span className="text-red-600">Rejected</span>
                              {request.rejectionReason && (
                                <p className="text-red-600 mt-1">Reason: {request.rejectionReason}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-yellow-600">Awaiting approval</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-red-600">
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button variant="outline" size="sm" className="gap-2 text-purple-600">
                            <Package className="h-3 w-3" />
                            Process
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