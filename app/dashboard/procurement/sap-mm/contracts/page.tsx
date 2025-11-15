'use client';

import DashboardLayout from '@/components/DashboardLayout';
import ContractManagement from '@/components/procurement/ContractManagement';

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <ContractManagement />
    </DashboardLayout>
  );
}