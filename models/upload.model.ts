export interface Upload{
  upload_id: string,
  uid: string,
  upload_items: Array<{
    name: string,
    data: {
      1080: {
        current_fps: number,
        timemark: string,
      }
    }
  }>,
  completed: Boolean,
  options: Upload_Options,
}

export interface Upload_Options{
  types: {
    videos: boolean,
    images: boolean,
  },
  autopublish: boolean,
  caption: string,
}