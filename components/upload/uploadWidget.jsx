"use client";
import { useUploaderNew } from "@/hooks/useUploaderNew";
import { useUploadStore } from "@/store/uploadStore";

export const UploadWidget = () => {
  const uploads = useUploadStore((s) => s.uploads);
  const pauseUpload = useUploadStore((s) => s.pauseUpload);
  const cancelUpload = useUploadStore((s) => s.cancelUpload);
  const resumeUpload = useUploadStore((s) => s.resumeUpload);
  const { uploadFile } = useUploaderNew();

  if (!uploads.length) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[320px] z-50 space-y-2">
      {uploads.map((file) => (
        <div key={file.id} className="p-3 bg-white rounded-xl shadow border">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="flex gap-1 ml-2">
              {file.status === "uploading" && (
                <>
                  <button
                    onClick={() => pauseUpload(file.id)}
                    className="text-xs text-yellow-600"
                  >
                    ⏸️
                  </button>
                  <button
                    onClick={() => cancelUpload(file.id)}
                    className="text-xs text-red-600"
                  >
                    ❌
                  </button>
                </>
              )}
              {file.status === "paused" && (
                <button
                  onClick={() => resumeUpload(file, uploadFile)}
                  className="text-xs text-green-600"
                >
                  ▶️
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded mt-1 overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded transition-all"
              style={{ width: `${file.progress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-gray-500">
            {file.status === "completed"
              ? "Upload complete"
              : file.status === "paused"
              ? "Paused"
              : file.status === "canceled"
              ? "Canceled"
              : `${file.progress}%`}
          </p>
        </div>
      ))}
    </div>
  );
};
