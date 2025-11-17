"use client";

import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentImage?: string;
  fallback: string;
  onImageChange: (file: File | null) => void;
  onImageSave: () => void;
  isLoading?: boolean;
  className?: string;
}

export function AvatarUpload({
  currentImage,
  fallback,
  onImageChange,
  onImageSave,
  isLoading = false,
  className
}: AvatarUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setSelectedFile(file);
    onImageChange(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      onImageSave();
      setSelectedFile(null);
      setPreview("");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview("");
    onImageChange(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Display */}
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || currentImage} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {fallback}
          </AvatarFallback>
        </Avatar>

        {/* Drag & Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-muted-foreground/50",
            "w-full max-w-sm"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("avatar-input")?.click()}
        >
          <Icons.Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>

        {/* Hidden File Input */}
        <Input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex space-x-2 w-full max-w-sm">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Icons.Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <Icons.X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}