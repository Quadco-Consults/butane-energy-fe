"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { MoreVertical, Plus, Search, Filter, Download, RefreshCw } from "lucide-react";

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, description, icon, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const ActionCard = ({ title, description, icon, actions, className }: ActionCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="w-full justify-start"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// List Card Component
interface ListCardProps {
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    status?: {
      label: string;
      variant?: "default" | "secondary" | "destructive" | "outline";
    };
    actions?: React.ReactNode;
    metadata?: Array<{ label: string; value: string }>;
  }>;
  emptyState?: {
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  headerActions?: React.ReactNode;
  className?: string;
}

export const ListCard = ({
  title,
  description,
  items,
  emptyState,
  headerActions,
  className
}: ListCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="text-center py-8 px-6">
            <p className="text-muted-foreground mb-4">
              {emptyState?.message || "No items found"}
            </p>
            {emptyState?.action && (
              <Button onClick={emptyState.action.onClick}>
                {emptyState.action.label}
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item, index) => (
              <div key={item.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.status && (
                        <Badge variant={item.status.variant}>
                          {item.status.label}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.metadata && (
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        {item.metadata.map((meta, metaIndex) => (
                          <span key={metaIndex}>
                            {meta.label}: {meta.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.actions && (
                    <div className="flex items-center space-x-2">
                      {item.actions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Data Table Header Component
interface DataTableHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const DataTableHeader = ({
  title,
  description,
  searchPlaceholder = "Search...",
  onSearch,
  onRefresh,
  onExport,
  filters,
  actions,
  className
}: DataTableHeaderProps) => {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {actions}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onSearch && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}
        {filters && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filters}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Action Button Group
interface QuickActionsProps {
  actions: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
  }>;
  className?: string;
}

export const QuickActions = ({ actions, className }: QuickActionsProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex items-center space-x-2"
        >
          {action.icon}
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

// Coming Soon Card (Improved version)
interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
  estimatedLaunch?: string;
  className?: string;
}

export const ComingSoonCard = ({
  title,
  description,
  icon,
  features,
  estimatedLaunch,
  className
}: ComingSoonCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground mb-6">
            This module is being developed and will be available soon.
          </p>

          {features && (
            <div className="text-left max-w-md mx-auto mb-6">
              <h4 className="font-medium mb-2">Planned Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estimatedLaunch && (
            <p className="text-xs text-muted-foreground mb-4">
              Estimated Launch: {estimatedLaunch}
            </p>
          )}

          <Button disabled className="cursor-not-allowed">
            <Plus className="h-4 w-4 mr-2" />
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};