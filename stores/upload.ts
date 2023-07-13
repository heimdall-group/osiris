import { Upload } from 'models/upload.model';
import { defineStore } from 'pinia';

export const useUploadStore = defineStore('upload', {
  state: () => {
    return {
      uploads: {} as any,
    };
  },
  getters: {
    getUploads():Array<Upload> {
      return this.uploads;
    }
  },
  actions: {
    setUploads(upload:Upload) {
      this.uploads[upload.upload_id] = upload;
    },
    completeUpload(upload_id:string) {
      this.uploads[upload_id].completed = true;
    }
  },
});
