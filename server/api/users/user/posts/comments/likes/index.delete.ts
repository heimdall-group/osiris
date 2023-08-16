import Comments from '~/server/models/comments';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, comment_id } = await readBody(event)
    if (comment_id === undefined) {
      throw 'Missing comment id';
    }
    if (token === undefined) {
      throw 'Missing token';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Comments.findOneAndUpdate({
      _id: comment_id
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
        request_endpoint: 'users/user/posts/comments/likes',
        request_type: 'DELETE',
      },
    }
  }
 });
