import Comments from '~/server/models/comments';
import Posts from '~/server/models/posts';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, post_id, text } = await readBody(event)
    if (post_id === undefined) {
      throw 'Missing post id';
    }
    if (token === undefined) {
      throw 'Missing token';
    }
    if (text === undefined) {
      throw 'Missing text';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = new Comments({
      post_id: post_id,
      uid: result.uid,
      text: text,
      likes: [],
      replies: [],
      created_at: new Date().getTime(),
    })
    document.save();

    if (document === null) {
      throw 'Unable to create comment index'
    }

    const post = await Posts.findOneAndUpdate({
      _id: post_id
    }, {
      $addToSet: { comments: document._id }
    });

    if (post === null) {
      throw 'Unable to add comment to correct post'
    }

    
    post.save();

    return {
      data: {
        id: document._id
      },
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts/comments/',
        request_type: 'POST',
      },
    }
  }
 });
