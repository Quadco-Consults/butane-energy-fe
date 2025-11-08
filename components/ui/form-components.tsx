"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "./modal";
import { AlertCircle, Check } from "lucide-react";

// Form Field Wrapper Component
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, required, error, description, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        {children}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <div className="flex items-center space-x-1 text-destructive text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

// Form Container Component
interface FormContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  footer?: React.ReactNode;
}

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({ title, description, children, onSubmit, className, footer }, ref) => {
    return (
      <Card className={cn("w-full", className)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <form ref={ref} onSubmit={onSubmit} className="space-y-4">
            {children}
            {footer && <div className="pt-4">{footer}</div>}
          </form>
        </CardContent>
      </Card>
    );
  }
);
FormContainer.displayName = "FormContainer";

// Form Modal Component
interface FormModalProps {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const FormModal = ({
  title,
  description,
  trigger,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isLoading = false,
  open,
  onOpenChange,
  size = "md"
}: FormModalProps) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : submitLabel}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Validation Hook
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, (value: any) => string | null>>
) => {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const rule = validationRules[field];

      if (rule) {
        const error = rule(values[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Common Validation Rules
export const validationRules = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },
  email: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },
  minLength: (min: number) => (value: string) => {
    if (!value) return null;
    return value.length >= min ? null : `Minimum ${min} characters required`;
  },
  maxLength: (max: number) => (value: string) => {
    if (!value) return null;
    return value.length <= max ? null : `Maximum ${max} characters allowed`;
  },
  number: (value: any) => {
    if (!value) return null;
    return !isNaN(Number(value)) ? null : 'Please enter a valid number';
  },
  positiveNumber: (value: any) => {
    if (!value) return null;
    const num = Number(value);
    return !isNaN(num) && num > 0 ? null : 'Please enter a positive number';
  }
};

// Success Message Component
interface SuccessMessageProps {
  message: string;
  show: boolean;
}

export const SuccessMessage = ({ message, show }: SuccessMessageProps) => {
  if (!show) return null;

  return (
    <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
      <Check className="h-4 w-4" />
      <span className="text-sm">{message}</span>
    </div>
  );
};