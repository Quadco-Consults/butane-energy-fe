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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User, Edit, Save, Camera, Phone, Mail, MapPin, Calendar,
  Building, Briefcase, GraduationCap, Award, FileText,
  Users, Heart, Shield, CreditCard, Clock, Target
} from 'lucide-react'

export default function MyInfoPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  // Sample employee data (in real app, this would come from API)
  const employeeData = {
    id: 'EMP001',
    firstName: 'Adebayo',
    lastName: 'Johnson',
    email: 'adebayo.johnson@butaneenergy.com',
    phone: '+234-803-123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Nigerian',
    stateOfOrigin: 'Lagos',
    address: '15, Victoria Island, Lagos, Nigeria',
    emergencyContact: {
      name: 'Funmi Johnson',
      relationship: 'Spouse',
      phone: '+234-805-987-6543'
    },
    employment: {
      employeeId: 'EMP001',
      department: 'Operations',
      position: 'Senior Operations Engineer',
      supervisor: 'Emeka Nwosu',
      hireDate: '2020-03-15',
      employmentType: 'Full-time',
      workLocation: 'Lagos Office',
      salary: 550000,
      grade: 'Level 7'
    },
    education: [
      {
        id: 1,
        institution: 'University of Lagos',
        degree: 'B.Eng Chemical Engineering',
        year: '2008',
        grade: 'Second Class Upper'
      },
      {
        id: 2,
        institution: 'Lagos Business School',
        degree: 'Project Management Certificate',
        year: '2018',
        grade: 'Distinction'
      }
    ],
    certifications: [
      {
        id: 1,
        name: 'Process Safety Management',
        issuer: 'Nigeria Society of Engineers',
        date: '2019-06-15',
        expiry: '2024-06-15',
        status: 'Active'
      },
      {
        id: 2,
        name: 'LPG Operations Certification',
        issuer: 'DPR Nigeria',
        date: '2021-01-20',
        expiry: '2026-01-20',
        status: 'Active'
      }
    ],
    dependents: [
      {
        id: 1,
        name: 'Adunni Johnson',
        relationship: 'Child',
        dateOfBirth: '2015-08-10',
        gender: 'Female'
      },
      {
        id: 2,
        name: 'Adesola Johnson',
        relationship: 'Child',
        dateOfBirth: '2018-03-22',
        gender: 'Male'
      }
    ],
    benefits: [
      {
        id: 1,
        type: 'Health Insurance',
        provider: 'AIICO Insurance',
        coverage: 'Employee + Family',
        premium: 85000,
        status: 'Active'
      },
      {
        id: 2,
        type: 'Pension',
        provider: 'Stanbic IBTC Pension',
        contribution: '8% Employee + 10% Employer',
        status: 'Active'
      },
      {
        id: 3,
        type: 'Life Insurance',
        provider: 'AXA Mansard',
        coverage: '4x Annual Salary',
        status: 'Active'
      }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-xl font-bold">
                    {employeeData.firstName.charAt(0)}{employeeData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {employeeData.firstName} {employeeData.lastName}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {employeeData.employment.position}
                    </span>
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {employeeData.employment.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {employeeData.employment.workLocation}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Years of Service</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(employeeData.employment.hireDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Salary</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(employeeData.employment.salary)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Dependents</p>
                <p className="text-xl font-bold text-purple-600">
                  {employeeData.dependents.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade Level</p>
                <p className="text-xl font-bold text-orange-600">
                  {employeeData.employment.grade}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="employment">Employment Details</TabsTrigger>
              <TabsTrigger value="education">Education & Certifications</TabsTrigger>
              <TabsTrigger value="dependents">Dependents</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={employeeData.firstName}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={employeeData.lastName}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={employeeData.email}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={employeeData.phone}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={employeeData.dateOfBirth}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select disabled={!isEditing} defaultValue={employeeData.gender}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select disabled={!isEditing} defaultValue={employeeData.maritalStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={employeeData.nationality}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="stateOfOrigin">State of Origin</Label>
                      <Input
                        id="stateOfOrigin"
                        value={employeeData.stateOfOrigin}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Home Address</Label>
                      <Textarea
                        id="address"
                        value={employeeData.address}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                    <CardDescription>Contact person in case of emergency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="emergencyName">Full Name</Label>
                      <Input
                        id="emergencyName"
                        value={employeeData.emergencyContact.name}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Select disabled={!isEditing} defaultValue={employeeData.emergencyContact.relationship}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input
                        id="emergencyPhone"
                        value={employeeData.emergencyContact.phone}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                  <CardDescription>Current employment details and job information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={employeeData.employment.employeeId}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Job Title</Label>
                        <Input
                          id="position"
                          value={employeeData.employment.position}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={employeeData.employment.department}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="supervisor">Supervisor</Label>
                        <Input
                          id="supervisor"
                          value={employeeData.employment.supervisor}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hireDate">Hire Date</Label>
                        <Input
                          id="hireDate"
                          type="date"
                          value={employeeData.employment.hireDate}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="employmentType">Employment Type</Label>
                        <Input
                          id="employmentType"
                          value={employeeData.employment.employmentType}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="workLocation">Work Location</Label>
                        <Input
                          id="workLocation"
                          value={employeeData.employment.workLocation}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade">Grade Level</Label>
                        <Input
                          id="grade"
                          value={employeeData.employment.grade}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Educational Background</CardTitle>
                    <CardDescription>Academic qualifications and degrees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institution</TableHead>
                          <TableHead>Degree/Certificate</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeData.education.map((edu) => (
                          <TableRow key={edu.id}>
                            <TableCell className="font-medium">{edu.institution}</TableCell>
                            <TableCell>{edu.degree}</TableCell>
                            <TableCell>{edu.year}</TableCell>
                            <TableCell>{edu.grade}</TableCell>
                            <TableCell className="text-right">
                              {isEditing && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Certifications</CardTitle>
                    <CardDescription>Professional licenses and certifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certification</TableHead>
                          <TableHead>Issuing Authority</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeData.certifications.map((cert) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell>{cert.issuer}</TableCell>
                            <TableCell>{new Date(cert.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(cert.expiry).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={cert.status === 'Active' ? 'default' : 'destructive'}>
                                {cert.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {isEditing && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dependents">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dependents</CardTitle>
                      <CardDescription>Family members covered under your benefits</CardDescription>
                    </div>
                    {isEditing && (
                      <Button size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Add Dependent
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Relationship</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeData.dependents.map((dependent) => {
                        const age = Math.floor((new Date().getTime() - new Date(dependent.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                        return (
                          <TableRow key={dependent.id}>
                            <TableCell className="font-medium">{dependent.name}</TableCell>
                            <TableCell>{dependent.relationship}</TableCell>
                            <TableCell>{new Date(dependent.dateOfBirth).toLocaleDateString()}</TableCell>
                            <TableCell>{dependent.gender}</TableCell>
                            <TableCell>{age} years</TableCell>
                            <TableCell className="text-right">
                              {isEditing && (
                                <div className="flex items-center justify-end space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Benefits</CardTitle>
                  <CardDescription>Current benefit enrollments and coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {employeeData.benefits.map((benefit) => (
                      <div key={benefit.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {benefit.type === 'Health Insurance' && <Heart className="h-6 w-6 text-blue-600" />}
                            {benefit.type === 'Pension' && <Shield className="h-6 w-6 text-blue-600" />}
                            {benefit.type === 'Life Insurance' && <FileText className="h-6 w-6 text-blue-600" />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{benefit.type}</div>
                            <div className="text-sm text-gray-600">{benefit.provider}</div>
                            <div className="text-sm text-gray-500">
                              {benefit.coverage || benefit.contribution}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={benefit.status === 'Active' ? 'default' : 'destructive'}>
                            {benefit.status}
                          </Badge>
                          {benefit.premium && (
                            <div className="text-sm text-gray-600 mt-1">
                              {formatCurrency(benefit.premium)}/year
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}