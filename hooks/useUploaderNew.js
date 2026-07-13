"use client";

import { useState } from "react";
import axios from "axios";
import {
  completeMultipartUpload,
  createMultipartUpload,
  generatePreSignedUrl,
  getChuckPresignedUrl,
  getPublicUrl,
  listAlreadyUploadedParts,
} from "@/server/aws/awsUpload";
import { addMedia } from "@/server/mediaServer/mediaServer";

export function useUploaderNew() {
  const [progressMap, setProgressMap] = useState({});

  // IMPORTANT: Using just fileName (or a slug) makes it easier for
  // the component to find the progress in the map.
  const generateFileId = (fileName) => `${fileName}-${Date.now()}`;

  const uploadFile = async (
    file,
    path = "uploads",
    access = "private",
    category = "general",
    tags = []
  ) => {
    const fileId = generateFileId(file.name);

    // Initialize progress at 0
    setProgressMap((prev) => ({ ...prev, [fileId]: 0 }));

    // Choose upload method based on size (20MB threshold)
    if (file.size > 20 * 1024 * 1024) {
      return await uploadInChunks(
        file,
        fileId,
        file.name,
        path,
        access,
        category,
        tags
      );
    } else {
      return await uploadDirect(
        file,
        fileId,
        file.name,
        path,
        access,
        category,
        tags
      );
    }
  };

  const uploadDirect = async (
    file,
    fileId,
    name,
    path,
    access,
    category,
    tags
  ) => {
    try {
      const { url, key } = await generatePreSignedUrl({
        fileName: name,
        contentType: file.type,
        path,
        access,
      });

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
        },
      });

      const fileUrl = await getPublicUrl({ key });
      const mediaRes = await addMedia({
        fileName: name,
        fileType: file.type,
        fileSize: file.size,
        url: fileUrl.url,
        key,
        access,
        status: "uploaded",
        category,
        tags,
      });

      setProgressMap((prev) => ({ ...prev, [fileId]: 100 }));

      return {
        success: true,
        fileId,
        key,
        url: fileUrl.url,
        fileName: name,
        fileType: file.type,
        mediaId: mediaRes.mediaId,
      };
    } catch (error) {
      console.error("Direct Upload Error:", error);
      setProgressMap((prev) => ({ ...prev, [fileId]: -1 })); // -1 indicates error
      return { success: false, error: error.message };
    }
  };

  const uploadInChunks = async (file, fileId, name, path, access) => {
    try {
      const { uploadId, key } = await createMultipartUpload({
        fileName: name,
        contentType: file.type,
        path,
        access,
      });

      const chunkSize = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      const completedParts = new Array(totalChunks).fill(null);
      const chunkIndices = Array.from({ length: totalChunks }, (_, i) => i);

      const uploadWorker = async () => {
        while (chunkIndices.length > 0) {
          const i = chunkIndices.shift();
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          const presignedUrl = await getChuckPresignedUrl({
            key,
            uploadId,
            partNumber: i + 1,
          });

          const response = await axios.put(presignedUrl, chunk, {
            onUploadProgress: (progressEvent) => {
              const uploadedPartsCount = completedParts.filter(
                (p) => p !== null
              ).length;
              const currentChunkProgress =
                progressEvent.loaded / progressEvent.total;
              const totalPercent = Math.round(
                ((uploadedPartsCount + currentChunkProgress) / totalChunks) *
                  100
              );
              setProgressMap((prev) => ({
                ...prev,
                [fileId]: Math.min(totalPercent, 99),
              }));
            },
          });

          completedParts[i] = {
            ETag: response.headers.etag.replace(/"/g, ""),
            PartNumber: i + 1,
          };
        }
      };

      await Promise.all([uploadWorker(), uploadWorker(), uploadWorker()]); // 3 workers

      const response = await completeMultipartUpload({
        uploadId,
        parts: completedParts,
        key,
      });

      if (response.success) {
        setProgressMap((prev) => ({ ...prev, [fileId]: 100 }));
        return {
          success: true,
          fileId,
          key,
          url: response.url,
          fileName: name,
          fileType: file.type,
        };
      }
    } catch (error) {
      console.error("Chunk Upload Error:", error);
      setProgressMap((prev) => ({ ...prev, [fileId]: -1 }));
      return { success: false, error: error.message };
    }
  };

  const uploadMultipleFiles = async (files, path, access) => {
    return await Promise.all(
      files.map((file) => uploadFile(file, path, access))
    );
  };

  return { uploadMultipleFiles, progressMap, uploadFile };
}
