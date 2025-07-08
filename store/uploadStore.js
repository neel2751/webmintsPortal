// store/uploadStore.ts
import { create } from "zustand";

export const useUploadStore = create((set, get) => ({
  uploads: [],
  controllers: {},

  // ✅ Add a new upload
  addUpload: (upload) =>
    set((state) => ({
      uploads: [...state.uploads, upload],
    })),

  // ✅ Update progress for a file
  updateProgress: (id, progress) =>
    set((state) => ({
      uploads: state.uploads.map((u) => (u.id === id ? { ...u, progress } : u)),
    })),

  // ✅ Mark upload as completed
  markCompleted: (id, key) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "completed", key } : u
      ),
    })),

  // ✅ Mark as failed
  markFailed: (id, error) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "failed", error } : u
      ),
    })),

  // ✅ EXPORT THIS: Save AbortController
  setController: (id, controller) =>
    set((state) => ({
      controllers: {
        ...state.controllers,
        [id]: controller,
      },
    })),

  // ✅ Cancel file upload
  cancelUpload: (id) => {
    const controller = get().controllers[id];
    if (controller) controller.abort();
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "canceled" } : u
      ),
    }));
  },

  // ✅ Pause file upload
  pauseUpload: (id) => {
    const controller = get().controllers[id];
    if (controller) controller.abort();
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "paused" } : u
      ),
    }));
  },

  // ✅ Resume (you’ll call `uploadFile()` again in your hook)
  resumeUpload: async (file, uploadFileFn) => {
    const fileId = file.id;
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === fileId ? { ...u, status: "uploading" } : u
      ),
    }));
    await uploadFileFn(file.rawFile, file.path, file.access, fileId);
  },
}));
