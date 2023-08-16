import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const { token } = await readBody(event);
    const handle = event.context.params.handle;
    const result = await getAuth().verifyIdToken(token);

    const user = await getAuth().getUser(result.uid);

    const document = await Users.aggregate([
      {
        $match: {
          user_handle: handle,
          user_uid: result.uid,
        }
      }, 
      {
        $project: {
          _id : 0 ,
          user_email: '$user_email',
          user_handle: '$user_handle',
          user_avatar: '$user_avatar',
          user_verified: '$user_verified',
          user_unpublished_posts_count: { $size: "$user_unpublished_posts" },
          user_description: '$user_description',
        }
      }
    ])

    if (document.length === 0) {
      return {
        error: 'Not your edit page',
        success: false,
      }
    }

    return {
      data: {
        user_email: document[0].user_email,
        user_handle: document[0].user_handle,
        user_avatar: document[0].user_avatar,
        user_verified: document[0].user_verified,
        user_unpublished_posts_count: document[0].user_unpublished_posts_count,
        user_displayName: user.displayName,
        user_description: document[0].user_description,
      },
      success: true,
    }
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/profile/edit',
        request_type: 'POST',
      },
    }
  }
 });
