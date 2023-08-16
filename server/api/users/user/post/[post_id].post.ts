import Posts from '~/server/models/posts';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const post_id = event.context.params.post_id;
    const { token } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }

    const document = Posts.findOne({
      _id: post_id,
    })

    if (document === null) {
      throw 'Invalid post id'
    }

    return {
      data: document,
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts',
        request_type: 'POST',
      },
    }
  }
 });