"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Building2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermissions?: string[];
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredPermissions = []
}: AuthGuardProps) {
  const { user, isLoading, hasAnyPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions as any)) {
        // User doesn't have required permissions, redirect to dashboard
        router.push('/dashboard?error=unauthorized');
        return;
      }
    }
  }, [user, isLoading, requireAuth, requiredPermissions, router, hasAnyPermission]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="font-bold text-xl text-green-600">BUTANE ENERGY</h1>
              <p className="text-xs text-muted-foreground">RC 423007 • ERP System</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (requireAuth && !user) {
    return null; // Will redirect to login
  }

  // Insufficient permissions
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions as any)) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}