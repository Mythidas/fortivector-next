'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Upload, X, File, FileImage } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { Label } from "@/lib/components/ui/label";

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  onChange?: (file: File | null) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  error?: string;
  description?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, onChange, onBlur, accept, maxSize, className, error, description, ...props }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);
    const actualRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;

      if (selectedFile) {
        if (maxSize && selectedFile.size > maxSize) {
          console.error(`File size exceeds the maximum allowed size of ${formatFileSize(maxSize)}`);
          return;
        }

        setFile(selectedFile);

        if (onChange) {
          onChange(selectedFile);
        }
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        if (maxSize && droppedFile.size > maxSize) {
          console.error(`File size exceeds the maximum allowed size of ${formatFileSize(maxSize)}`);
          return;
        }

        setFile(droppedFile);

        if (onChange) {
          onChange(droppedFile);
        }

        // Update the input's files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        if (actualRef.current) {
          actualRef.current.files = dataTransfer.files;
        }
      }
    };

    const clearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      setPreview(null);
      if (actualRef.current) {
        actualRef.current.value = '';
      }
      if (onChange) {
        onChange(null);
      }
    };

    useEffect(() => {
      if (!file) {
        setPreview(null);
        return;
      }

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      return () => {
        // Clean up preview URL
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      };
    }, [file]);

    const getFileIcon = () => {
      if (file?.type.startsWith('image/')) {
        return <FileImage className="h-4 w-4 mr-2" />;
      }
      return <File className="h-4 w-4 mr-2" />;
    };

    return (
      <div className={cn("grid w-full gap-1.5", className)}>
        {label && (
          <Label htmlFor={props.id || "file-upload"}>
            {label}
          </Label>
        )}

        <div
          className={cn(
            "relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-muted/50"
              : error
                ? "border-destructive bg-destructive/10"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            file ? "py-4" : "py-8"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => actualRef.current?.click()}
        >
          <input
            type="file"
            id={props.id || "file-upload"}
            className="sr-only"
            ref={actualRef}
            onChange={handleFileChange}
            onBlur={onBlur}
            accept={accept}
            {...props}
          />

          {file ? (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-foreground truncate flex-1">
                  {getFileIcon()}
                  <span className="truncate">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>

              {preview ? (
                <div className="relative border rounded-md overflow-hidden bg-muted/50">
                  <img
                    src={preview}
                    alt={file.name}
                    className="max-h-48 w-auto mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center p-2 rounded-md bg-muted/50">
                  <span className="text-sm text-muted-foreground truncate">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                </p>
                {(accept || maxSize) && (
                  <p className="text-xs">
                    {accept
                      ? `Accepted formats: ${accept.replace(/\./g, "").replace(/,/g, ", ")}`
                      : "Any file format"}
                    {maxSize && ` (Max: ${formatFileSize(maxSize)})`}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;