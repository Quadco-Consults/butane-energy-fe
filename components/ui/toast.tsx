"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Toast Types
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast Context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

// Toast Provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    ...context,
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) =>
      context.addToast({ ...options, type: "success", description: message }),

    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) =>
      context.addToast({ ...options, type: "error", description: message }),

    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) =>
      context.addToast({ ...options, type: "warning", description: message }),

    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) =>
      context.addToast({ ...options, type: "info", description: message }),
  };
};

// Toast Container
const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// Toast Item Component
interface ToastItemProps {
  toast: Toast;
}

const ToastItem = ({ toast }: ToastItemProps) => {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = React.useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-900";
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-900";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-900";
    }
  };

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        getStyles(),
        isExiting ? "animate-out slide-out-to-right-full" : "animate-in slide-in-from-right-full",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full"
      )}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          {toast.title && (
            <p className="text-sm font-semibold">{toast.title}</p>
          )}
          {toast.description && (
            <p className="text-sm opacity-90">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

// Notification Component (Alternative simpler version)
export interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Notification = ({
  type,
  title,
  message,
  onClose,
  className
}: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-900";
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-900";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-900";
    }
  };

  return (
    <div className={cn(
      "flex items-start space-x-3 rounded-md border p-4",
      getStyles(),
      className
    )}>
      {getIcon()}
      <div className="flex-1 space-y-1">
        {title && (
          <p className="text-sm font-semibold">{title}</p>
        )}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-foreground/50 hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
};