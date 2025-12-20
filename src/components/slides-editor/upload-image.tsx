"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Check, AlertCircle, Loader, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import type { ContentItem } from "@/types";
import { supabase } from "@/config/supabase";

interface UploadImageProps {
  onImageSelect?: (file: File, preview: string, publicUrl: string) => void;
  maxSize?: number;
  acceptedFormats?: string[];
  bucketName?: string;
  bucketPath?: string;
  slideId?: string;
  contentId: string;
  onContentChange: (
    contentId: string,
    newContent:
      | string
      | ContentItem
      | string[]
      | string[][]
      | ContentItem[]
      | (string | ContentItem)[]
  ) => void;
}

type UploadStatus = "idle" | "preview" | "uploading" | "success" | "error";

export default function UploadImage({
  onImageSelect,
  maxSize = 5 * 1024 * 1024,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  bucketName = "slide-images",
  bucketPath = "images",
  slideId,
}: UploadImageProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string }>();
  const fileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const validateFile = (file: File) => {
    if (!acceptedFormats.includes(file.type)) {
      return "Unsupported file format";
    }
    if (file.size > maxSize) {
      return `File too large (max ${formatSize(maxSize)})`;
    }
    return null;
  };

  const reset = useCallback(() => {
    setPreview(null);
    setError(null);
    setStatus("idle");
    setFileInfo(undefined);
    fileRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setFileInfo({ name: file.name, size: formatSize(file.size) });
      fileRef.current = file;
      setStatus("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadImage = async () => {
    if (!fileRef.current || !preview) return;

    setStatus("uploading");
    setError(null);

    try {
      const file = fileRef.current;
      const filePath = `${bucketPath}/${slideId ?? "common"}/${Date.now()}-${
        file.name
      }`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      onImageSelect?.(file, preview, data.publicUrl);
      setStatus("success");

      setTimeout(handleClose, 1200);
    } catch (e) {
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <ImagePlus className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Drag & drop or click to upload an image
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-muted bg-muted/30 hover:bg-muted/50 p-6 text-center transition"
            >
              <Input
                ref={inputRef}
                type="file"
                accept={acceptedFormats.join(",")}
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFile(e.target.files[0])
                }
              />

              {status === "preview" && preview ? (
                <img
                  src={preview}
                  className="h-40 w-full object-cover rounded-md"
                  alt="Preview"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  <p className="text-sm">
                    Click or drag image here (max {formatSize(maxSize)})
                  </p>
                </div>
              )}
            </div>

            {fileInfo && (
              <div className="flex items-center justify-between rounded-md border bg-background p-3">
                <div className="text-sm">
                  <p className="font-medium truncate">{fileInfo.name}</p>
                  <p className="text-muted-foreground">{fileInfo.size}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={reset}
                  disabled={status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" /> Uploaded successfully
              </div>
            )}

            {status === "error" && error && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={uploadImage} disabled={status !== "preview"}>
              {status === "uploading" && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
