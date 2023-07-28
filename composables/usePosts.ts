import Compressor from "compressorjs";
import { Return } from "~/models/return.model";
import { Upload_Options } from "models/upload.model";
import { useStore } from "~/stores/main";
import { useUploadStore } from "~/stores/upload";
import { Post_Unpublished } from "models/post.model";
import { usePostsStore } from "~/stores/posts";
export const posts_getUploadId = (uid: string):string => {
  const date = new Date().getTime();
  const hash = posts_hashName(uid);
  const random = Math.floor(Math.random() * 1000);
  return `${date}_${hash}_${random}`;
}

export const posts_createPost = async (arr:Array<File>, options:Upload_Options):Promise<Return> => {
  try {
    const store = useStore();
    const user = store.getUser;

    if (Object.keys(user).length === 0) {
      throw {
        message: 'User not authenticated',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const id = posts_getUploadId(user.uid);

    const images:Array<Blob> = [];
    const videos:Array<File> = [];

    if (arr.length === 0) {
      throw {
        message: 'No files attached',
        code: 'upload/no-files-attached',
        severity: 4,
        type: 'client',
      }
    }

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.type.includes('image')) {
        options.types.images = true
        const result:Blob = await posts_compressImages(item);
        images.push(result);
      } else if (item.type.includes('video')) {
        options.types.videos = true
        videos.push(item);
      }
    }
    if (!options.types.videos) {
      const result = await upload_files(images, options, id);
      return {
        data: result,
        success: true,
      }
    } else {
      const uploadStore = useUploadStore();

      uploadStore.setUploads({
        upload_id: id,
        uid: store.getUser.uid,
        completed: false,
        error: false,
        options: options,
      })
    
      const result = await upload_files([...images, ...videos], options, id);
      
      if (result.success) {
        uploadStore.setCompleted(id);
      } else {
        uploadStore.setError(id);
        throw {
          message: 'Upload failed',
          code: 'upload/failed',
          severity: 1,
          type: 'server',
          server_error: result.error,
        }
      }

      return {
        data: result,
        success: true,
      };
    }
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_publishPost = async (post: Post_Unpublished) => {
  try {
    const store = useStore();
    const user = store.getUser;
    if (Object.keys(user).length === 0) {
      throw {
        message: 'User not authenticated',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }

    const postStore = usePostsStore();
    const result:Return = await $fetch('/api/users/user/posts/publish', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        post_id: post.post_id,
      }
    });
    if (result.success) {
      const result = await postStore.cutUnpublishedPost(post)
      return result;
    } else {
      throw {
        message: 'Publishing of post failed',
        code: 'profile/publish-post-failed',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error) {
    handle_error(error)
  }
}

const upload_files = async (arr: Array<Blob>, options:Upload_Options, id:string,):Promise<Return> => {
  try {
    const store = useStore();
    const form = new FormData();
    const keys:Array<string> = [];
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      const hash = posts_hashName(file.name + file.size)
      form.append(`${hash}`, file);
      keys.push(`${hash}`)
    }
    form.append('options', JSON.stringify(options))
    form.append('keys', JSON.stringify(keys))
    form.append('id', id)
    const result:Return = await $fetch(`/api/users/user/posts/${await store.getUser.getIdToken()}`, {
      method: 'POST',
      body: form,
    });

    if (result.success) {
      return {
        data: result.data,
        success: true,
      }
    } else {
      return {
        error: result.error,
        success: false,
      }
    }

  } catch(error: any) {
    return {
      success: false,
      error: error,
    }
  }
}

const posts_compressImages = (file:File):Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const compressor = new Compressor(file, {
      mimeType: 'image/webp',
      success: (result) => {
        resolve(result)
      }
    });
  })
}

const posts_hashName = (string: string) => {         
  var hash = 0;
  if (string.length == 0) {
    return hash;
  }
  for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
  }
  return hash;
}