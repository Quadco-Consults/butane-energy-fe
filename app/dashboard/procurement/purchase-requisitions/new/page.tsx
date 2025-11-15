'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { PurchaseRequisitionForm } from '@/components/procurement/PurchaseRequisitionForm'

// Sample data for the form
const sampleData = {
  plants: [
    { id: '1', name: 'Lagos Main Plant', location: 'Lagos, Nigeria' },
    { id: '2', name: 'Port Harcourt Plant', location: 'Port Harcourt, Nigeria' },
    { id: '3', name: 'Abuja Office', location: 'Abuja, Nigeria' }
  ],
  departments: [
    { id: '1', name: 'Human Resources' },
    { id: '2', name: 'Information Technology' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Operations' },
    { id: '5', name: 'Marketing' },
    { id: '6', name: 'Procurement' }
  ],
  costCenters: [
    { id: '1', name: 'HR Operations', department: 'Human Resources' },
    { id: '2', name: 'IT Infrastructure', department: 'Information Technology' },
    { id: '3', name: 'Financial Management', department: 'Finance' },
    { id: '4', name: 'Plant Operations', department: 'Operations' },
    { id: '5', name: 'Marketing Campaigns', department: 'Marketing' }
  ],
  vendors: [
    { id: '1', name: 'ABC Office Supplies Ltd', code: 'ABC001' },
    { id: '2', name: 'TechWorld Nigeria', code: 'TW002' },
    { id: '3', name: 'Lagos Equipment Co.', code: 'LEC003' },
    { id: '4', name: 'SafeTech Solutions', code: 'STS004' }
  ],
  materialMasters: [
    { id: '1', number: 'MAT001', description: 'Office Chairs', group: 'Furniture', unit: 'PC' },
    { id: '2', number: 'MAT002', description: 'Laptop Computers', group: 'IT Equipment', unit: 'PC' },
    { id: '3', number: 'MAT003', description: 'Safety Helmets', group: 'Safety', unit: 'PC' },
    { id: '4', number: 'MAT004', description: 'A4 Paper', group: 'Stationery', unit: 'RM' }
  ]
}

export default function NewPurchaseRequisitionPage() {
  const handleSubmit = async (data: any) => {
    console.log('PR Form Data:', data)
    // TODO: Implement actual submission logic
    alert('Purchase Requisition submitted successfully!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Purchase Requisition</h1>
          <p className="text-gray-500 mt-1">Create a new purchase requisition request</p>
        </div>

        <PurchaseRequisitionForm
          onSubmit={handleSubmit}
          mode="create"
          plants={sampleData.plants}
          departments={sampleData.departments}
          costCenters={sampleData.costCenters}
          vendors={sampleData.vendors}
          materialMasters={sampleData.materialMasters}
        />
      </div>
    </DashboardLayout>
  )
}