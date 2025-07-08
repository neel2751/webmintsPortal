"use client";

import {
  completeMultipartUpload,
  createMultipartUpload,
  generatePreSignedUrl,
  getChuckPresignedUrl,
} from "@/server/aws/awsUpload";
import { useUploadStore } from "@/store/uploadStore";
import axios from "axios";

export function useUploaderNew() {
  const addUpload = useUploadStore((s) => s.addUpload);
  const updateProgress = useUploadStore((s) => s.updateProgress);
  const markCompleted = useUploadStore((s) => s.markCompleted);
  const markFailed = useUploadStore((s) => s.markFailed);

  const setController = useUploadStore((s) => s.setController);

  const generateFileId = (fileName) => `${Date.now()}-${fileName}`;

  const uploadFile = async (file, path = "uploads", access = "private") => {
    const fileId = generateFileId(file.name);

    addUpload({
      id: fileId,
      name: file.name,
      rawFile: file, // store the raw file for potential resume
      progress: 0,
      status: "uploading",
      path,
      access,
    });

    if (file.size > 20 * 1024 * 1024) {
      return await uploadInChunks(file, fileId, file.name, path, access);
    } else {
      return await uploadDirect(file, fileId, file.name, path, access);
    }
  };

  const uploadDirect = async (file, fileId, name, path, access) => {
    const { url, key } = await generatePreSignedUrl({
      fileName: name,
      contentType: file.type,
      path,
      access,
    });

    const controller = new AbortController();
    setController(fileId, controller);

    try {
      await axios.put(url, file, {
        signals: controller.signal,
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          updateProgress(fileId, progress);
        },
      });

      markCompleted(fileId, key);
      return { success: true, fileId, key };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload canceled");
      } else {
        markFailed(fileId, error.message);
      }
      return { success: false, error: error.message };
    }
  };

  const uploadInChunks = async (file, fileId, name, path, access) => {
    const { uploadId, key } = await createMultipartUpload({
      fileName: name,
      contentType: file.type,
      path,
      access,
    });

    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const parts = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const controller = new AbortController();
      setController(fileId, controller);

      try {
        const presignedUrl = await getChuckPresignedUrl({
          key,
          uploadId,
          partNumber: i + 1,
        });

        const response = await axios.put(presignedUrl, chunk, {
          signal: controller.signal,
          headers: { "Content-Type": file.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              ((i + progressEvent.loaded / progressEvent.total) / totalChunks) *
                100
            );
            updateProgress(fileId, percent);
          },
        });

        parts.push({
          ETag: response.headers.etag?.replace(/"/g, ""),
          PartNumber: i + 1,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Upload paused/canceled for:", file.name);
        } else {
          markFailed(fileId, error.message);
        }
        return { success: false, error: error.message };
      }
    }

    const response = await completeMultipartUpload({
      uploadId,
      parts,
      key,
    });

    if (response.success) {
      updateProgress(fileId, 100);
      markCompleted(fileId, key);
      return {
        success: true,
        fileId,
        key,
        url: response.url,
      };
    } else {
      markFailed(fileId, "Failed to complete multipart upload");
      return { success: false, error: "Complete multipart upload failed" };
    }
  };

  // handle mautiple file uploads
  const uploadMultipleFiles = async (
    files,
    path = "uploads",
    access = "private"
  ) => {
    const results = [];
    for (const file of files) {
      const result = await uploadFile(file, path, access);
      results.push(result);
    }
    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
  };
}
