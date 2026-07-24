import { useCallback, useEffect, useRef, useState } from "react";
import { useUploaderNew } from "@/hooks/useUploaderNew";

const DEFAULT_MAX_FILE_SIZE = 1024 * 1024; // 1 MB — same cap as every blog image

// Uploads an editor image to S3 (via useUploaderNew) and hands the permanent
// URL to onUpload. Rejects files over maxFileSize before any network call.
export function useImageUpload({
  onUpload,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  uploadPath = "blog/content",
  access = "public",
} = {}) {
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadMultipleFiles } = useUploaderNew();

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > maxFileSize) {
        const maxMb = (maxFileSize / (1024 * 1024)).toFixed(0);
        setError(`Image is too large — maximum size is ${maxMb} MB`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setError(null);
      setFileName(file.name);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      previewRef.current = localUrl;

      try {
        setUploading(true);
        const results = await uploadMultipleFiles([file], uploadPath, access);
        const uploaded = results?.[0];
        if (!uploaded?.success || !uploaded?.url) {
          throw new Error(uploaded?.error || "Upload failed");
        }
        onUpload?.(uploaded.url);
      } catch (err) {
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        setFileName(null);
        setError(err instanceof Error ? err.message : "Upload failed");
        console.error("Editor image upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, maxFileSize, uploadPath, access, uploadMultipleFiles]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading,
    error,
  };
}
