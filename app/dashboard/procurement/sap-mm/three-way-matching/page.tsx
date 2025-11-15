'use client';

import DashboardLayout from '@/components/DashboardLayout';
import ThreeWayMatchingEngine from '@/components/procurement/ThreeWayMatchingEngine';

export default function ThreeWayMatchingPage() {
  return (
    <DashboardLayout>
      <ThreeWayMatchingEngine />
    </DashboardLayout>
  );
}