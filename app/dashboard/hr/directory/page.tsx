'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Book, Search, Filter, Users, Phone, Mail, MapPin,
  Building, Briefcase, Calendar, Download, Grid3x3,
  List, User, Award, Clock
} from 'lucide-react'

export default function DirectoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Sample employee directory data
  const employees = [
    {
      id: 'EMP001',
      firstName: 'Adebayo',
      lastName: 'Johnson',
      email: 'adebayo.johnson@butaneenergy.com',
      phone: '+234-803-123-4567',
      position: 'Senior Operations Engineer',
      department: 'Operations',
      location: 'Lagos Office',
      supervisor: 'Emeka Nwosu',
      hireDate: '2020-03-15',
      extension: '2345',
      status: 'Active',
      skills: ['Process Engineering', 'Safety Management', 'LPG Operations']
    },
    {
      id: 'EMP002',
      firstName: 'Fatima',
      lastName: 'Abdullahi',
      email: 'fatima.abdullahi@butaneenergy.com',
      phone: '+234-805-234-5678',
      position: 'HR Specialist',
      department: 'Human Resources',
      location: 'Abuja Office',
      supervisor: 'Sarah Ibrahim',
      hireDate: '2021-08-22',
      extension: '3456',
      status: 'Active',
      skills: ['Employee Relations', 'Recruitment', 'Training']
    },
    {
      id: 'EMP003',
      firstName: 'Chidi',
      lastName: 'Okafor',
      email: 'chidi.okafor@butaneenergy.com',
      phone: '+234-807-345-6789',
      position: 'Finance Manager',
      department: 'Finance',
      location: 'Port Harcourt',
      supervisor: 'Mohammed Ali',
      hireDate: '2019-11-10',
      extension: '4567',
      status: 'Active',
      skills: ['Financial Analysis', 'Budgeting', 'Tax Management']
    },
    {
      id: 'EMP004',
      firstName: 'Aisha',
      lastName: 'Bello',
      email: 'aisha.bello@butaneenergy.com',
      phone: '+234-809-456-7890',
      position: 'Sales Representative',
      department: 'Sales',
      location: 'Kano Office',
      supervisor: 'Ibrahim Musa',
      hireDate: '2022-01-20',
      extension: '5678',
      status: 'On Leave',
      skills: ['Customer Relations', 'Sales Strategy', 'Market Analysis']
    },
    {
      id: 'EMP005',
      firstName: 'Emeka',
      lastName: 'Nwosu',
      email: 'emeka.nwosu@butaneenergy.com',
      phone: '+234-801-567-8901',
      position: 'Operations Manager',
      department: 'Operations',
      location: 'Lagos Office',
      supervisor: 'CEO',
      hireDate: '2018-06-05',
      extension: '6789',
      status: 'Active',
      skills: ['Team Leadership', 'Operations Management', 'Strategic Planning']
    },
    {
      id: 'EMP006',
      firstName: 'Kemi',
      lastName: 'Adeyemi',
      email: 'kemi.adeyemi@butaneenergy.com',
      phone: '+234-803-678-9012',
      position: 'IT Specialist',
      department: 'Information Technology',
      location: 'Lagos Office',
      supervisor: 'David Okonkwo',
      hireDate: '2021-03-12',
      extension: '7890',
      status: 'Active',
      skills: ['Network Administration', 'Cybersecurity', 'System Support']
    },
    {
      id: 'EMP007',
      firstName: 'Musa',
      lastName: 'Garba',
      email: 'musa.garba@butaneenergy.com',
      phone: '+234-805-789-0123',
      position: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Abuja Office',
      supervisor: 'Funmi Adebayo',
      hireDate: '2023-02-15',
      extension: '8901',
      status: 'Active',
      skills: ['Digital Marketing', 'Content Creation', 'Brand Management']
    },
    {
      id: 'EMP008',
      firstName: 'Ngozi',
      lastName: 'Emenike',
      email: 'ngozi.emenike@butaneenergy.com',
      phone: '+234-807-890-1234',
      position: 'Procurement Officer',
      department: 'Procurement',
      location: 'Port Harcourt',
      supervisor: 'John Akpan',
      hireDate: '2020-09-18',
      extension: '9012',
      status: 'Active',
      skills: ['Vendor Management', 'Contract Negotiation', 'Supply Chain']
    },
    {
      id: 'EMP009',
      firstName: 'Yusuf',
      lastName: 'Aliyu',
      email: 'yusuf.aliyu@butaneenergy.com',
      phone: '+234-809-901-2345',
      position: 'Health & Safety Officer',
      department: 'Health & Safety',
      location: 'Multiple Locations',
      supervisor: 'Emeka Nwosu',
      hireDate: '2021-07-03',
      extension: '0123',
      status: 'Active',
      skills: ['Risk Assessment', 'Compliance', 'Emergency Response']
    },
    {
      id: 'EMP010',
      firstName: 'Grace',
      lastName: 'Okwu',
      email: 'grace.okwu@butaneenergy.com',
      phone: '+234-801-012-3456',
      position: 'Administrative Assistant',
      department: 'Administration',
      location: 'Lagos Office',
      supervisor: 'Emeka Nwosu',
      hireDate: '2022-05-10',
      extension: '1234',
      status: 'Active',
      skills: ['Office Management', 'Documentation', 'Customer Service']
    }
  ]

  const departments = [
    'Operations',
    'Human Resources',
    'Finance',
    'Sales',
    'Marketing',
    'Information Technology',
    'Procurement',
    'Health & Safety',
    'Administration'
  ]

  const locations = [
    'Lagos Office',
    'Abuja Office',
    'Port Harcourt',
    'Kano Office',
    'Multiple Locations'
  ]

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    const matchesLocation = selectedLocation === 'all' || employee.location === selectedLocation

    return matchesSearch && matchesDepartment && matchesLocation
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'Active': { variant: 'default', color: 'text-green-600' },
      'On Leave': { variant: 'secondary', color: 'text-blue-600' },
      'Inactive': { variant: 'destructive', color: 'text-red-600' }
    }
    return variants[status] || { variant: 'outline', color: 'text-gray-600' }
  }

  const getEmployeeInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const calculateYearsOfService = (hireDate: string) => {
    const years = Math.floor((new Date().getTime() - new Date(hireDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return years
  }

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
                  <Book className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
                  <p className="text-sm text-gray-600">Find and connect with colleagues across the organization</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Directory
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-xl font-bold text-green-600">{departments.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Locations</p>
                <p className="text-xl font-bold text-purple-600">{locations.length - 1}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Found Results</p>
                <p className="text-xl font-bold text-orange-600">{filteredEmployees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, position, department, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Directory Content */}
        <div className="px-6 py-6">
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => {
                const statusInfo = getStatusBadge(employee.status)
                const yearsOfService = calculateYearsOfService(employee.hireDate)

                return (
                  <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-bold">
                            {getEmployeeInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {employee.firstName} {employee.lastName}
                        </h3>

                        <p className="text-sm text-gray-600 mb-2">{employee.position}</p>

                        <Badge variant={statusInfo.variant} className={`${statusInfo.color} mb-4`}>
                          {employee.status}
                        </Badge>

                        <div className="w-full space-y-2 text-sm">
                          <div className="flex items-center justify-center space-x-1">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{employee.department}</span>
                          </div>

                          <div className="flex items-center justify-center space-x-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{employee.location}</span>
                          </div>

                          <div className="flex items-center justify-center space-x-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{employee.email}</span>
                          </div>

                          <div className="flex items-center justify-center space-x-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{employee.phone}</span>
                          </div>

                          <div className="flex items-center justify-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{yearsOfService} years of service</span>
                          </div>
                        </div>

                        <div className="w-full mt-4 pt-4 border-t">
                          <div className="flex flex-wrap justify-center gap-1">
                            {employee.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {employee.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{employee.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            // List View
            <Card>
              <CardHeader>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  {filteredEmployees.length} of {employees.length} employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => {
                    const statusInfo = getStatusBadge(employee.status)
                    const yearsOfService = calculateYearsOfService(employee.hireDate)

                    return (
                      <div key={employee.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                            {getEmployeeInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{employee.position}</p>
                            <p className="text-xs text-gray-500">{employee.id}</p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{employee.department}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{employee.location}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{employee.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{employee.phone}</span>
                            </div>
                          </div>

                          <div>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              {employee.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{yearsOfService} years</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No employees found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}