import Users from '~/server/models/users';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }


    const result = await getAuth().verifyIdToken(token);
    const document = await Users.aggregate([
      {
        $match: { user_uid: result.uid } 
      },
      {
        $project: {
          _id : 0 ,
          user_handle: '$user_handle',
          user_avatar: '$user_avatar',
          user_verified: '$user_verified',
        }
      },
    ])

    return {
      data: {
        likes: document,
      },
      success: true,
    }
  } catch (error:any) {
    console.log(error)
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/post/likes',
        request_type: 'POST',
      },
    }
  }
 });