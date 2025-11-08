"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { BarChart3 } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function ProcurementReportsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Procurement Reports</h1>
        <p className={designSystem.getBody("small")}>
          Analytics and reporting for procurement activities
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Procurement Analytics & Reporting"
        description="Comprehensive analytics and reporting for procurement insights"
        icon={<BarChart3 className="h-5 w-5" />}
        features={[
          "Spending analysis and trends",
          "Supplier performance reports",
          "Procurement cycle analytics",
          "Cost savings tracking",
          "Compliance reporting",
          "Custom dashboard widgets"
        ]}
        estimatedLaunch="Q3 2024"
      />
    </div>
  );
}