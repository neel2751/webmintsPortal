"use client";
import { toast } from "sonner";
import { GlobalForm } from "../form/global-form";
import { useUploaderNew } from "@/hooks/useUploaderNew";

export default function CalendarPage() {
  const { uploadFile } = useUploaderNew();

  const fields = [
    {
      fields: [
        {
          name: "docImage",
          labelText: "Document",
          type: "image",
          placeholder: "Upload Profile Image",
          acceptedFileTypes: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
            "video/*": [".mp4"],
          },
          maxFileSize: 1024 * 1024 * 300, // allow up to 300 MB
          maxFiles: 1,
          size: true,
          validationOptions: {
            required: "Image is required",
          },
        },
      ],
    },
  ];
  const handleSubmit = async (data) => {
    let file = null;
    // Handle different cases for uploaded file structure
    if (data.docImage instanceof File) {
      file = data.docImage;
    } else if (Array.isArray(data.docImage)) {
      file = data.docImage[0];
    } else if (data.docImage?.file instanceof File) {
      file = data.docImage.file;
    }

    if (!file) {
      toast.error("File upload failed", {
        description: "No valid file selected.",
      });
      return;
    }
    console.log("File to upload:", file);

    const results = await uploadFile(file, "uploads", "private");
    console.log("Upload results:", results);
    if (!results) {
      toast.error("File upload failed", {
        description: "No results returned from upload function.",
      });
      return;
    }
    if (!results.success) {
      toast.error("File upload failed", {
        description: results.error,
      });
      return;
    }
    toast.success("File uploaded successfully", {
      description: `File: ${file.name}`,
    });
  };

  return (
    <>
      <div className="flex h-screen p-4">
        <div className="flex-1 flex flex-col">
          {/* <CalendarHeader /> */}
          <main className="flex-1 overflow-auto p-4">
            {/* <CalendarView /> */}
            <GlobalForm groupedFields={fields} onSubmit={handleSubmit} />
            {/* {files && Object.keys(progressMap).length > 0 && (
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                  {Object.keys(progressMap).map((file) => (
                    <div key={file} className="flex items-center space-x-2">
                      <div>
                        <h3 className="text-sm font-bold">{file}</h3>
                      </div>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        {uploadProgress[file]}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </main>
        </div>
      </div>
    </>
  );
}
