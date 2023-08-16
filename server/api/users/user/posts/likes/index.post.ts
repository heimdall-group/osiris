import Posts from '~/server/models/posts';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, post_id } = await readBody(event)
    if (post_id === undefined) {
      throw 'Missing post id';
    }
    if (token === undefined) {
      throw 'Missing token';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Posts.findOneAndUpdate({
      _id: post_id
    }, {
      $addToSet: { likes: result.uid }
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
        request_endpoint: 'users/user/posts/likes/',
        request_type: 'POST',
      },
    }
  }
 });
