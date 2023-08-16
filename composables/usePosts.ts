import Compressor from "compressorjs";
import { Return } from "~/models/return.model";
import { Upload_Options } from "models/upload.model";
import { useStore } from "~/stores/main";
import { useUploadStore } from "~/stores/upload";
import { Post_Unpublished } from "models/post.model";
import { useProfileStore } from '~/stores/profile';
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

    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
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
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
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
      const result = postStore.spliceRemoveUnpublishedPost(post.post_id)
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

export const posts_removePost = async (post_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const profileStore = useProfileStore();
    const user = store.getUser;
    const result = await $fetch(`/api/users/user/post/${post_id}`, {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
      }
    })

    if (result.success) {
      postStore.spliceRemovePost(post_id)
      profileStore.decrementProfilePostsCount();
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt remove post',
        code: 'posts/couldnt-remove-post',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_likePost = async (post_id: string, limit: number):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result: Return = await $fetch('/api/users/user/posts/likes/', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        post_id: post_id,
      }
    })

    if (result.success && result.data) {
      const user = store.getUser;
      const like: Return = await $fetch(`/api/users/user/post/likes/like`,{
        method: 'POST',
        body: {
          token: await user.getIdToken(),
        }
      })
      postStore.pushLikes(like , post_id, limit)
      postStore.incrementPostLikeCount(post_id);
      postStore.setLikesFalse(post_id);
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt like post',
        code: 'posts/couldnt-like-post',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_unlikePost = async (post_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result = await $fetch('/api/users/user/posts/likes/', {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
        post_id: post_id,
      }
    })

    if (result.success) {
      postStore.spliceRemovePostLike(post_id)
      postStore.decrementPostLikeCount(post_id)
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt unlike post',
        code: 'posts/couldnt-unlike-post',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_likeComment = async (comment_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const user = store.getUser;
    const result = await $fetch('/api/users/user/posts/comments/likes', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        comment_id: comment_id,
      }
    })

    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt like comment',
        code: 'posts/couldnt-like-comment',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_unlikeComment = async (comment_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const user = store.getUser;
    const result = await $fetch('/api/users/user/posts/comments/likes/', {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
        comment_id: comment_id,
      }
    })

    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt unlike comment',
        code: 'posts/couldnt-unlike-comment',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_likeReply = async (reply_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const user = store.getUser;
    const result = await $fetch('/api/users/user/posts/comments/replies/likes', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        reply_id: reply_id,
      }
    })

    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt like reply',
        code: 'posts/couldnt-like-reply',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_unlikeReply = async (reply_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const user = store.getUser;
    const result = await $fetch('/api/users/user/posts/comments/replies/likes', {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
        reply_id: reply_id,
      }
    })

    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt unlike reply',
        code: 'posts/couldnt-unlike-reply',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_commentPost = async (post_id: string, text: string, limit: number):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result: Return = await $fetch('/api/users/user/posts/comments/', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        post_id: post_id,
        text: text,
      }
    })
    if (result.success && result.data) {
      const comment: Return = await $fetch(`/api/users/user/post/comments/comment/${result.data.id}`,{
        method: 'POST',
        body: {
          token: await user.getIdToken(),
        }
      }) 
      postStore.pushComments(comment, post_id, limit);
      postStore.incrementPostCommentCount(post_id);
      postStore.setCommentsFalse(post_id);
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt comment on post',
        code: 'posts/couldnt-comment-on-post',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_unCommentPost = async (post_id: string, comment_id: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result: Return = await $fetch('/api/users/user/posts/comments/', {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
        post_id: post_id,
        comment_id: comment_id,
      }
    })

    if (result.success) {
      postStore.spliceRemoveComment(post_id, comment_id);
      postStore.decrementPostCommentCount(post_id);
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt remove comment on post',
        code: 'posts/couldnt-remove-comment-on-post',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_replyComment = async (post_id: string, comment_id: string, text: string, limit: number) => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result: Return = await $fetch('/api/users/user/posts/comments/replies', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        comment_id: comment_id,
        post_id: post_id,
        text: text,
      }
    })
    if (result.success && result.data) {
      const reply: Return = await $fetch(`/api/users/user/post/comments/replies/reply/${result.data.id}`,{
        method: 'POST',
        body: {
          token: await user.getIdToken(),
        }
      })
      postStore.pushReplies(reply, post_id, comment_id, limit);
      postStore.incrementCommentReplyCount(post_id, comment_id);
      postStore.setRepliesFalse(post_id, comment_id);
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt reply on comment',
        code: 'posts/couldnt-reply-on-comment',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
  }
}

export const posts_unReplyComment = async (post_id: string, comment_id: string, reply_id: string) => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'upload/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    };

    const store = useStore();
    const postStore = usePostsStore();
    const user = store.getUser;
    const result: Return = await $fetch('/api/users/user/posts/comments/replies', {
      method: 'DELETE',
      body: {
        token: await user.getIdToken(),
        comment_id: comment_id,
        reply_id: reply_id,
      }
    })

    if (result.success) {
      postStore.spliceRemoveReply(post_id, comment_id, reply_id);
      postStore.decrementCommentReplyCount(post_id, comment_id);
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Couldnt remove reply on comment',
        code: 'posts/couldnt-remove-reply-on-comment',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }    
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
      data: false,
    }
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
