"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { FileText } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function ContractsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Contracts</h1>
        <p className={designSystem.getBody("small")}>
          Manage supplier contracts, agreements, and compliance
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Contract Management System"
        description="Comprehensive contract lifecycle management"
        icon={<FileText className="h-5 w-5" />}
        features={[
          "Contract creation and templates",
          "Digital signature integration",
          "Renewal and expiration tracking",
          "Compliance monitoring",
          "Amendment management",
          "Contract performance metrics"
        ]}
        estimatedLaunch="Q3 2024"
      />
    </div>
  );
}