"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonCard } from "@/components/ui/layout-cards";
import { Shield } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function AccessManagementPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Access Management</h1>
        <p className={designSystem.getBody("small")}>
          Manage user permissions, roles, and system access controls
        </p>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Access Management System"
        description="Control user permissions, roles, and system access"
        icon={<Shield className="h-5 w-5" />}
        features={[
          "User role management",
          "Permission assignments",
          "Department access controls",
          "System access monitoring",
          "Audit trails and logging"
        ]}
        estimatedLaunch="Q2 2024"
      />
    </div>
  );
}