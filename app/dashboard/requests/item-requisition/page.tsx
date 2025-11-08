"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { Package } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function ItemRequisitionPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Item Requisition</h1>
        <p className={designSystem.getBody("small")}>
          Request items from the organizational inventory system
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Item Requisition System"
        description="Submit and track item requests from various departments"
        icon={<Package className="h-5 w-5" />}
        features={[
          "Inventory item catalog",
          "Department-based requisitions",
          "Approval workflows",
          "Stock level tracking",
          "Automated notifications"
        ]}
        estimatedLaunch="Q1 2024"
      />
    </div>
  );
}