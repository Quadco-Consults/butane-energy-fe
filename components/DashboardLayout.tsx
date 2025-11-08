"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Truck,
  ClipboardCheck,
  Briefcase,
  Bell,
  Search,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AuthGuard } from "./AuthGuard";
import { getAuthorizedNavigation } from "@/lib/filters";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "view_dashboard" as const },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package, permission: "view_orders" as const },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart, permission: "view_orders" as const },
  { name: "Customers", href: "/dashboard/customers", icon: Users, permission: "manage_customers" as const },
  { name: "Plants", href: "/dashboard/plants", icon: Building2, permission: "view_dashboard" as const },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3, permission: "view_financial_reports" as const },
  { name: "User Management", href: "/dashboard/users", icon: Users, permission: "manage_users" as const },
  { name: "System Settings", href: "/dashboard/settings", icon: Settings, permission: "system_settings" as const },
];

const workflowNavigation = [
  { name: "Admin Operations", href: "/dashboard/admin", icon: Briefcase, department: "admin", permission: "manage_admin_operations" as const },
  { name: "Operations Department", href: "/dashboard/operations", icon: Package, department: "operations", permission: "manage_inbound_operations" as const },
  { name: "Inbound Operations", href: "/dashboard/inbound", icon: Truck, department: "operations", permission: "manage_inbound_operations" as const },
  { name: "Procurement", href: "/dashboard/procurement", icon: ClipboardCheck, department: "procurement", permission: "create_purchase_requests" as const },
  { name: "Finance Department", href: "/dashboard/finance", icon: DollarSign, department: "finance", permission: "view_financial_reports" as const },
  { name: "Trading Operations", href: "/dashboard/trading", icon: TrendingUp, department: "trading", permission: "manage_trading_operations" as const },
  { name: "Fleet Management", href: "/dashboard/fleet", icon: Truck, department: "logistics", permission: "manage_fleet" as const },
  { name: "HR Management", href: "/dashboard/hr", icon: Users, department: "hr", permission: "manage_employees" as const },
  { name: "Investigations", href: "/dashboard/investigations", icon: Search, department: "operations", permission: "handle_investigations" as const },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading, hasPermission, currentPlant } = useAuth();
  const { getNotificationsForUser, getDashboardStats } = useWorkflow();
  const router = useRouter();
  const pathname = usePathname();

  // Get user notifications and workflow stats
  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const workflowStats = getDashboardStats();

  // Get authorized navigation for the user
  const authorizedNavigation = user ? getAuthorizedNavigation(user) : { coreModules: [], businessProcesses: [] };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Official Butane Energy Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/butane-logo-official.jpeg"
                  alt="Butane Energy"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-sm">BUTANE ENERGY</h1>
                <p className="text-xs text-muted-foreground">RC 423007 • ERP System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {/* Core Modules */}
            <div className="mb-4">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Core Modules
              </h3>
              {authorizedNavigation.coreModules.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const IconComponent = navigation.find(n => n.name === item.name)?.icon || LayoutDashboard;
                return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
              })}
            </div>

            {/* Workflow Processes */}
            <div className="mb-4">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Business Processes
              </h3>
              {authorizedNavigation.businessProcesses.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");

                // Get count for this process type
                const processCount = workflowStats.processesByType.find(
                  p => p.type.includes(item.name.toLowerCase().split(' ')[0])
                )?.count || 0;

                const IconComponent = workflowNavigation.find(w => w.name === item.name)?.icon || Briefcase;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      {item.name}
                    </div>
                    {processCount > 0 && (
                      <span className="bg-butane-orange text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                        {processCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Investigation Alert */}
            {workflowStats.investigationsRequired > 0 && (
              <div className="mx-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {workflowStats.investigationsRequired} Investigation{workflowStats.investigationsRequired > 1 ? 's' : ''} Required
                  </span>
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          {/* Page Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {pathname === "/dashboard" ? "Dashboard" :
               pathname.includes("/inbound") ? "Inbound Operations" :
               pathname.includes("/procurement") ? "Procurement" :
               pathname.includes("/projects") ? "Projects" :
               pathname.includes("/investigations") ? "Investigations" :
               pathname.split("/").pop()?.replace(/^\w/, c => c.toUpperCase()) || "Dashboard"}
            </h2>
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-butane-orange text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex-col items-start p-3 cursor-pointer"
                        asChild
                      >
                        <Link href={notification.actionUrl || '#'}>
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-butane-orange rounded-full mt-1"></div>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length > 5 && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/notifications" className="text-center text-sm text-primary">
                          View all notifications
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{user.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="text-xs text-muted-foreground">{user.department?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dept.</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pl-64 pt-16">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
    </AuthGuard>
  );
}
