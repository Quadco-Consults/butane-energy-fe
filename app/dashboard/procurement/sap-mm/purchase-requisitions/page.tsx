'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PurchaseRequisitionForm from '@/components/procurement/PurchaseRequisitionForm';

export default function PurchaseRequisitionsPage() {
  return (
    <DashboardLayout>
      <PurchaseRequisitionForm />
    </DashboardLayout>
  );
}