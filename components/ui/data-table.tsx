"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Table Column Definition
export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  className?: string;
}

// Table Data Interface
export interface TableData<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    column: string;
    direction: "asc" | "desc";
    onSortChange: (column: string, direction: "asc" | "desc") => void;
  };
  selection?: {
    selectedRows: string[];
    onRowSelect: (rowId: string) => void;
    onSelectAll: () => void;
  };
  actions?: {
    row?: (row: T, index: number) => React.ReactNode;
    bulk?: React.ReactNode;
  };
  emptyState?: {
    message: string;
    action?: React.ReactNode;
  };
}

// Data Table Component
export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  sorting,
  selection,
  actions,
  emptyState,
}: TableData<T>) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key: columnId, direction });
    sorting?.onSortChange(columnId, direction);
  };

  const getSortIcon = (columnId: string) => {
    if (!sortConfig || sortConfig.key !== columnId) {
      return <ArrowUpDown className="h-4 w-4" />;
    }

    return sortConfig.direction === "asc"
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    if (column.cell) {
      return column.cell(row, index);
    }

    if (column.accessorKey) {
      const value = row[column.accessorKey];
      return value?.toString() || "";
    }

    return "";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                {columns.map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-muted rounded animate-pulse"
                    style={{ width: `${Math.random() * 100 + 50}px` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Bulk Actions */}
        {selection && selection.selectedRows.length > 0 && actions?.bulk && (
          <div className="p-4 bg-muted/50 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selection.selectedRows.length} selected
              </span>
              {actions.bulk}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {selection && (
                  <th className="w-10 p-4">
                    <Checkbox
                      checked={
                        data.length > 0 && selection.selectedRows.length === data.length
                      }
                      onCheckedChange={selection.onSelectAll}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "p-4 text-left font-medium text-muted-foreground",
                      column.className
                    )}
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => handleSort(column.id)}
                      >
                        {column.header}
                        {getSortIcon(column.id)}
                      </Button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
                {actions?.row && (
                  <th className="w-10 p-4">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selection ? 1 : 0) +
                      (actions?.row ? 1 : 0)
                    }
                    className="p-8 text-center"
                  >
                    <div className="text-muted-foreground">
                      <p className="mb-2">
                        {emptyState?.message || "No data available"}
                      </p>
                      {emptyState?.action}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    {selection && (
                      <td className="p-4">
                        <Checkbox
                          checked={selection.selectedRows.includes(row.id)}
                          onCheckedChange={() => selection.onRowSelect(row.id)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn("p-4", column.className)}
                      >
                        {renderCell(column, row, index)}
                      </td>
                    ))}
                    {actions?.row && (
                      <td className="p-4">
                        {actions.row(row, index)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Show</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>of {pagination.total} entries</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                <span className="text-sm">Page</span>
                <input
                  type="number"
                  value={pagination.page}
                  onChange={(e) => {
                    const page = Number(e.target.value);
                    if (page >= 1 && page <= Math.ceil(pagination.total / pagination.pageSize)) {
                      pagination.onPageChange(page);
                    }
                  }}
                  className="w-12 text-center border rounded px-1 py-1 text-sm"
                  min={1}
                  max={Math.ceil(pagination.total / pagination.pageSize)}
                />
                <span className="text-sm">
                  of {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.pageSize))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper components for common table cells
export const StatusCell = ({
  status,
  variant
}: {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}) => (
  <Badge variant={variant}>{status}</Badge>
);

export const DateCell = ({ date }: { date: string | Date }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return <span className="text-sm">{formattedDate}</span>;
};

export const CurrencyCell = ({
  amount,
  currency = "USD"
}: {
  amount: number;
  currency?: string;
}) => (
  <span className="font-mono text-sm">
    {new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)}
  </span>
);

export const ActionCell = ({
  actions
}: {
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline";
  }>;
}) => (
  <div className="flex items-center space-x-2">
    {actions.map((action, index) => (
      <Button
        key={index}
        variant={action.variant || "outline"}
        size="sm"
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    ))}
  </div>
);