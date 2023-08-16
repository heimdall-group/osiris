import Comments from '~/server/models/comments';
import Posts from '~/server/models/posts';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, post_id, comment_id } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }
    if (post_id === undefined) {
      throw 'Missing post id';
    }
    if (comment_id === undefined) {
      throw 'Missing comment id';
    }

    const result = await getAuth().verifyIdToken(token);

    const document = await Comments.findOneAndDelete({
      _id: comment_id,
    })

    const post = await Posts.findOneAndUpdate({
      _id: post_id
    }, {
      $pull: { comments: { $in: [new mongoose.Types.ObjectId(comment_id)] } },
    });

    if (post === null) {
      throw 'Unable to remove comment of post'
    }

    post.save();

    return {
      data: true,
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts/comments/',
        request_type: 'DELETE',
      },
    }
  }
 });
