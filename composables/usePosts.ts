import Compressor from "compressorjs";
import { setDoc, doc, onSnapshot, deleteDoc, Firestore } from "firebase/firestore";
import { Return } from "~/models/return.model";
import { Upload_Options } from "models/upload.model";
import { useStore } from "~/stores/main";
import { useUploadStore } from "~/stores/upload";

export const posts_getUploadId = (uid: string):string => {
  const date = new Date().getTime();
  const hash = posts_hashName(uid);
  return `${date}_${hash}`
}

export const posts_createPost = async (arr:Array<File>, options:Upload_Options):Promise<Return> => {
  const store = useStore();
  const uid = store.getUser.uid
  const id = posts_getUploadId(uid);

  const images:Array<Blob> = [];
  const videos:Array<File> = [];
  const hashs:Array<any> = [];
  const firestore_object:any = {
    uid: uid,
  };

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.type.includes('image')) {
      options.types.images = true
      const result:Blob = await posts_compressPromise(item);
      images.push(result);
    } else if (item.type.includes('video')) {
      options.types.videos = true
      videos.push(item);

      const hash = posts_hashName(item.name + item.size)
      hashs.push({
        name: item.name,
        hash: hash,
      });
      firestore_object[hash] = {
        1080: {
          current_fps: 0,
          timemark: '',
        }
      };
    }
  }
  if (!options.types.videos) {
  // CALL BACKEND HERE
    const result = await upload_files(images, options, id);
    return {
      data: result,
      success: true,
      message: 'Breakpoint'

    }
  }
  const firestore = useNuxtApp().$firestore as Firestore;
  const uploadStore = useUploadStore();

  await setDoc(doc(firestore, 'active_uploads', id), firestore_object);
  const unsub = onSnapshot(doc(firestore, 'active_uploads', id), (doc) => {
    const arr = [];
    const document = doc.data();
    if (document === undefined) {
      return
    }
    for (let i = 0; i < hashs.length; i++) {
      const { hash, name } = hashs[i];
      if (document[hash] === undefined) {
        return
      }

      arr.push({
        name: name,
        data: document[hash],
      })
    }
    uploadStore.setUploads({
      upload_id: id,
      uid: store.getUser.uid,
      upload_items: arr,
      completed: false,
      options: options,
    })
  });

  // CALL BACKEND HERE
  const result = await upload_files([...images, ...videos], options, id);

  unsub();
  uploadStore.completeUpload(id)
  return {
    data: result,
    success: true,
    message: 'Full'
  };
}

const upload_files = async (arr: Array<Blob>, options:Upload_Options, id:string,):Promise<any> => {
  const store = useStore();
  const form = new FormData();
  const keys:Array<string> = [];
  for (let i = 0; i < arr.length; i++) {
    const file = arr[i];
    form.append(`file-${i}`, file);
    keys.push(`file-${i}`)
  }
  form.append('options', JSON.stringify(options))
  form.append('keys', JSON.stringify(keys))
  form.append('id', id)
  const result = await $fetch(`/api/posts/post/${await store.getUser.getIdToken()}`, {
    method: 'POST',
    body: form,
  })
  console.log(result)
}

const posts_compressPromise = (file:File):Promise<Blob> => {
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