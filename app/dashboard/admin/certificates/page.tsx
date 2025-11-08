'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Award,
  Plus,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Eye,
  Edit,
  Send,
  Download,
  Star,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function CertificatesPage() {
  const { user } = useAuth();

  // Mock job completion certificate data
  const certificates = [
    {
      id: 'JCC-2025-012',
      title: 'Office Cleaning Services',
      description: 'Monthly deep cleaning of all office floors and facilities',
      serviceOrder: 'SO-2025-023',
      vendor: 'CleanCorp Services',
      serviceType: 'Cleaning',
      completionDate: '2025-11-08',
      issuedDate: '2025-11-08',
      issuedBy: 'Ibrahim Usman',
      certifiedBy: 'Grace Adebayo',
      status: 'issued',
      rating: 5,
      contractValue: 85000,
      location: 'Head Office - All Floors',
      plant: 'Head Office',
      validFrom: '2025-11-01',
      validTo: '2025-11-30',
      remarks: 'Excellent service quality, all areas thoroughly cleaned'
    },
    {
      id: 'JCC-2025-013',
      title: 'HVAC System Maintenance',
      description: 'Quarterly maintenance and inspection of air conditioning systems',
      serviceOrder: 'SO-2025-024',
      vendor: 'CoolAir Systems Ltd',
      serviceType: 'HVAC Maintenance',
      completionDate: '2025-11-07',
      issuedDate: null,
      issuedBy: null,
      certifiedBy: null,
      status: 'pending_approval',
      rating: null,
      contractValue: 120000,
      location: 'Building A & B',
      plant: 'Head Office',
      validFrom: '2025-11-01',
      validTo: '2025-12-31',
      remarks: 'Pending final inspection and approval'
    },
    {
      id: 'JCC-2025-014',
      title: 'Security System Installation',
      description: 'Installation and configuration of new CCTV surveillance system',
      serviceOrder: 'SO-2025-025',
      vendor: 'SecureWatch Systems',
      serviceType: 'Security Installation',
      completionDate: '2025-11-06',
      issuedDate: '2025-11-07',
      issuedBy: 'Ahmed Mohammed',
      certifiedBy: 'Emeka Okafor',
      status: 'issued',
      rating: 4,
      contractValue: 450000,
      location: 'All Buildings',
      plant: 'All Plants',
      validFrom: '2025-11-06',
      validTo: '2025-11-06',
      remarks: 'Good installation quality, minor adjustment needed for camera positioning'
    },
    {
      id: 'JCC-2025-015',
      title: 'Electrical Installation Works',
      description: 'Installation of additional power outlets and lighting in conference rooms',
      serviceOrder: 'SO-2025-026',
      vendor: 'ElectroPro Services',
      serviceType: 'Electrical',
      completionDate: '2025-11-05',
      issuedDate: null,
      issuedBy: null,
      certifiedBy: null,
      status: 'draft',
      rating: null,
      contractValue: 85000,
      location: 'Conference Rooms 1-3',
      plant: 'Head Office',
      validFrom: '2025-11-05',
      validTo: '2025-11-05',
      remarks: 'Work completed, certificate being prepared'
    },
    {
      id: 'JCC-2025-016',
      title: 'Fire Safety System Testing',
      description: 'Annual fire alarm and suppression system testing and certification',
      serviceOrder: 'SO-2025-027',
      vendor: 'FireSafe Solutions',
      serviceType: 'Fire Safety',
      completionDate: '2025-11-04',
      issuedDate: '2025-11-04',
      issuedBy: 'Fatima Bello',
      certifiedBy: 'Grace Adebayo',
      status: 'issued',
      rating: 5,
      contractValue: 150000,
      location: 'All Buildings',
      plant: 'All Plants',
      validFrom: '2025-11-04',
      validTo: '2026-11-04',
      remarks: 'All systems tested successfully, full compliance achieved'
    },
    {
      id: 'JCC-2025-017',
      title: 'Network Infrastructure Upgrade',
      description: 'Upgrade of office network infrastructure and Wi-Fi systems',
      serviceOrder: 'SO-2025-028',
      vendor: 'NetTech Solutions',
      serviceType: 'IT Infrastructure',
      completionDate: '2025-11-03',
      issuedDate: null,
      issuedBy: null,
      certifiedBy: null,
      status: 'rejected',
      rating: 2,
      contractValue: 280000,
      location: 'Building A - IT Department',
      plant: 'Head Office',
      validFrom: '2025-11-01',
      validTo: '2025-11-03',
      remarks: 'Work quality below standard, network stability issues persist',
      rejectionReason: 'Poor service quality, multiple network outages post-installation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'issued': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const certificateStats = {
    totalCertificates: certificates.length,
    pendingApproval: certificates.filter(cert => cert.status === 'pending_approval').length,
    issuedThisMonth: certificates.filter(cert =>
      cert.status === 'issued' &&
      cert.issuedDate &&
      new Date(cert.issuedDate).getMonth() === new Date().getMonth()
    ).length,
    totalValue: certificates.reduce((sum, cert) => sum + cert.contractValue, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Completion Certificates</h1>
            <p className="text-muted-foreground">
              Issue and manage certificates for completed services
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/certificates/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Issue Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Certificate Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Certificates</p>
                  <p className="text-xl font-bold">{certificateStats.totalCertificates}</p>
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
                  <p className="text-xl font-bold">{certificateStats.pendingApproval}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Issued This Month</p>
                  <p className="text-xl font-bold">{certificateStats.issuedThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{certificateStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Job Completion Certificates</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search certificates..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.map((certificate) => {
                return (
                  <div key={certificate.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{certificate.title}</h3>
                          <Badge className={`${getStatusColor(certificate.status)} text-white`}>
                            {certificate.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{certificate.serviceType}</Badge>
                          {certificate.rating && (
                            <div className="flex items-center gap-1">
                              {getRatingStars(certificate.rating)}
                              <span className={`text-xs font-medium ${getRatingColor(certificate.rating)}`}>
                                ({certificate.rating}/5)
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-3">{certificate.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Certificate ID</p>
                            <p className="text-muted-foreground">{certificate.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Service Order</p>
                            <p className="text-muted-foreground">{certificate.serviceOrder}</p>
                          </div>
                          <div>
                            <p className="font-medium">Vendor</p>
                            <p className="text-muted-foreground">{certificate.vendor}</p>
                          </div>
                          <div>
                            <p className="font-medium">Contract Value</p>
                            <p className="text-muted-foreground font-semibold">₦{certificate.contractValue.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Completed: {new Date(certificate.completionDate).toLocaleDateString()}
                          </div>
                          {certificate.issuedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Issued: {new Date(certificate.issuedDate).toLocaleDateString()}
                            </div>
                          )}
                          <div>
                            Location: {certificate.location}
                          </div>
                          <div>
                            Plant: {certificate.plant}
                          </div>
                        </div>

                        {certificate.issuedBy && certificate.certifiedBy && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div>
                              <span className="font-medium">Issued by:</span> {certificate.issuedBy}
                            </div>
                            <div>
                              <span className="font-medium">Certified by:</span> {certificate.certifiedBy}
                            </div>
                          </div>
                        )}

                        <div className="text-sm">
                          <span className="font-medium">Remarks:</span>
                          <span className="text-muted-foreground ml-2">{certificate.remarks}</span>
                        </div>

                        {/* Status-specific alerts */}
                        {certificate.status === 'pending_approval' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending approval - Review and approve completion certificate
                            </div>
                          </div>
                        )}

                        {certificate.status === 'rejected' && certificate.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Rejected: {certificate.rejectionReason}
                            </div>
                          </div>
                        )}

                        {certificate.rating && certificate.rating <= 2 && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Poor service rating - Consider vendor review
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {certificate.status === 'draft' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        {certificate.status === 'pending_approval' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        {certificate.status === 'draft' && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Send className="h-3 w-3" />
                            Submit
                          </Button>
                        )}
                        {certificate.status === 'issued' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-3 w-3" />
                            Download
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