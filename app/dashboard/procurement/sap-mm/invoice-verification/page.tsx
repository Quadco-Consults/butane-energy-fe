'use client';

import DashboardLayout from '@/components/DashboardLayout';
import InvoiceVerificationManagement from '@/components/procurement/InvoiceVerificationManagement';

export default function InvoiceVerificationPage() {
  return (
    <DashboardLayout>
      <InvoiceVerificationManagement />
    </DashboardLayout>
  );
}