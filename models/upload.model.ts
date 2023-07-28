export interface Upload{
  upload_id: string,
  uid: string,
  completed: Boolean,
  error: Boolean,
  options: Upload_Options,
}

export interface Upload_Options{
  types: {
    videos: boolean,
    images: boolean,
  },
  autopublish: boolean,
  caption: string,
  users_tagged: Array<string>,
}