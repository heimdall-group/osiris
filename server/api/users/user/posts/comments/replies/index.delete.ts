import Comments from '~/server/models/comments';
import Replies from '~/server/models/replies';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, comment_id, reply_id } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }
    if (comment_id === undefined) {
      throw 'Missing comment id';
    }
    if (reply_id === undefined) {
      throw 'Missing reply id';
    }

    const result = await getAuth().verifyIdToken(token);

    const document = await Replies.findOneAndDelete({
      _id: reply_id,
    })

    const comment = await Comments.findOneAndUpdate({
      _id: comment_id
    }, {
      $pull: { replies: { $in: [new mongoose.Types.ObjectId(reply_id)] } },
    });

    if (comment === null) {
      throw 'Unable to remove reply of comment'
    }
    comment.save();

    return {
      data: true,
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts/comments/replies',
        request_type: 'DELETE',
      },
    }
  }
 });
