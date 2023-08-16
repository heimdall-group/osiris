import Comments from '~/server/models/comments';
import Replies from '~/server/models/replies';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, comment_id, post_id, text } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }
    if (comment_id === undefined) {
      throw 'Missing comment id';
    }
    if (post_id === undefined) {
      throw 'Missing post id';
    }
    if (text === undefined) {
      throw 'Missing text';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = new Replies({
      comment_id: comment_id,
      post_id: post_id,
      uid: result.uid,
      text: text,
      likes: [],
      created_at: new Date().getTime(),
    })
    document.save();

    if (document === null) {
      throw 'Unable to create reply index'
    }

    const comment = await Comments.findOneAndUpdate({
      _id: comment_id
    }, {
      $addToSet: { replies: document._id }
    });

    if (comment === null) {
      throw 'Unable to add reply to correct comment'
    }
    comment.save();

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
        request_endpoint: 'users/user/posts/comments/replies',
        request_type: 'POST',
      },
    }
  }
 });
