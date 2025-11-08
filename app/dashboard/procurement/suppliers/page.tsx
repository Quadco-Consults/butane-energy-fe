"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { Truck } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function SuppliersPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Suppliers</h1>
        <p className={designSystem.getBody("small")}>
          Manage supplier relationships, contracts, and performance
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Supplier Management System"
        description="Comprehensive supplier relationship and performance management"
        icon={<Truck className="h-5 w-5" />}
        features={[
          "Supplier directory and profiles",
          "Performance tracking and ratings",
          "Contract management",
          "Qualification and prequalification",
          "Payment tracking",
          "Supplier communications"
        ]}
        estimatedLaunch="Q2 2024"
      />
    </div>
  );
}