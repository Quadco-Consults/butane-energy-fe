"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { ShoppingCart } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function PurchaseRequestPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Purchase Request</h1>
        <p className={designSystem.getBody("small")}>
          Submit purchase requests for approval by the Procurement Department
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Purchase Request System"
        description="Request purchases that require procurement approval"
        icon={<ShoppingCart className="h-5 w-5" />}
        features={[
          "Multi-step approval workflow",
          "Budget validation",
          "Supplier management",
          "Purchase order generation",
          "Real-time status tracking"
        ]}
        estimatedLaunch="Q1 2024"
      />
    </div>
  );
}