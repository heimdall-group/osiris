import Replies from '~/server/models/replies';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, reply_id } = await readBody(event)
    if (reply_id === undefined) {
      throw 'Missing reply id';
    }
    if (token === undefined) {
      throw 'Missing token';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Replies.findOneAndUpdate({
      _id: reply_id
    }, {
      $pull: { likes: { $in: [result.uid] } },
    });

    return {
      data: true,
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts/comments/replies/likes',
        request_type: 'DELETE',
      },
    }
  }
 });
