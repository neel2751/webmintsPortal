"use server";

import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  },
});

export async function generatePreSignedUrl({
  path,
  fileName,
  access = "private",
  contentType,
}) {
  try {
    const validAccessTypes = ["public", "private"];
    if (!validAccessTypes.includes(access)) {
      throw new Error("Invalid access type. Use 'public' or 'private'.");
    }
    if (!fileName || !contentType) {
      throw new Error("File name and content type are required.");
    }
    if (!path) {
      path = "uploads"; // Default path if not provided
    }
    if (access === "public" && !path.startsWith("public")) {
      path = `public/${path}`;
    }
    // // Ensure the path ends with a slash
    // if (!path.endsWith("/")) {
    //   path += "/";
    // }

    const fileId = `${uuidv4()}-${fileName}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${path}/${fileName}`,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL valid for 1 hour
    });

    return {
      success: true,
      url,
      key: `${path}/${fileName}`,
      fileId,
    };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return {
      success: false,
      message: "Failed to generate pre-signed URL",
    };
  }
}
export async function createMultipartUpload({
  fileName,
  contentType,
  access = "private",
}) {
  try {
    const validAccessTypes = ["public", "private"];
    if (!validAccessTypes.includes(access)) {
      throw new Error("Invalid access type. Use 'public' or 'private'.");
    }
    if (!fileName || !contentType) {
      throw new Error("File name and content type are required.");
    }
    const fileId = `${uuidv4()}-${fileName}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileId,
      ContentType: contentType,
      ACL: access === "public" ? "public-read" : "private",
    };
    console.log("Creating multipart upload with params:", params);
    // Log the S3 client configuration
    const command = new CreateMultipartUploadCommand(params);
    const response = await s3Client.send(command);
    return {
      success: true,
      uploadId: response.UploadId,
      key: response.Key,
    };
  } catch (error) {
    console.error("Error creating multipart upload:", error);
    return {
      success: false,
      message: "Failed to create multipart upload",
    };
  }
}
export async function completeMultipartUpload({ uploadId, key, parts }) {
  try {
    console.log(
      "Completing multipart upload with uploadId:",
      uploadId,
      "for key:",
      key
    );
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part, index) => ({
          ETag: part.ETag,
          PartNumber: index + 1,
        })),
      },
    };
    const command = new CompleteMultipartUploadCommand(params);
    await s3Client.send(command);
    return {
      success: true,
      message: "Multipart upload completed successfully",
      key,
    };
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    return {
      success: false,
      message: "Failed to complete multipart upload",
    };
  }
}
export async function getChuckPresignedUrl({ key, uploadId, partNumber }) {
  console.log(
    "Generating chunk pre-signed URL for part:",
    partNumber,
    key,
    uploadId
  );
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    };
    const command = new UploadPartCommand(params);
    return getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL valid for 1 hour
    });
  } catch (error) {
    console.error("Error generating chunk pre-signed URL:", error);
    return null;
  }
}
export const listPartUploads = async ({ uploadId, key }) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    };
    const command = new ListPartsCommand(params);
    const response = await s3Client.send(command);
    return {
      success: true,
      parts: response.Parts,
    };
  } catch (error) {
    console.error("Error listing parts:", error);
    return {
      success: false,
      message: "Failed to list parts",
    };
  }
};

export async function generateDownloadUrl({ key, expiresIn = 3600 }) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error generating download URL:", error);
    return {
      success: false,
      message: "Failed to generate download URL",
    };
  }
}
