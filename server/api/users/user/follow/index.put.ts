import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { user_handle, token } = await readBody(event);
    if (user_handle === undefined) {
      throw 'Missing uid';
    }
    
    const result = await getAuth().verifyIdToken(token);

    const document_1 = await Users.findOneAndUpdate({
      user_handle: user_handle,
    }, {
      $addToSet: { user_followers: result.uid }
    });

    if (document_1 === null) {
      throw 'Initial fetch is null'
    }

    const document_2 = await Users.findOneAndUpdate({
      user_uid: result.uid,
    }, {
      $addToSet: { user_following: document_1.user_uid }
    });

    if (document_2 === null) {
      throw 'Second fetch is null'
    }

    return {
      data: true,
      success: true,
    }
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/follow',
        request_type: 'PUT',
      },
    }
  }
 });
