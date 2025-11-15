'use client';

import DashboardLayout from '@/components/DashboardLayout';
import ProcurementDashboard from '@/components/procurement/ProcurementDashboard';

export default function SAPMMDashboardPage() {
  return (
    <DashboardLayout>
      <ProcurementDashboard />
    </DashboardLayout>
  );
}