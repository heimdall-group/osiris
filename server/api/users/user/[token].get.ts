import { getAuth } from 'firebase-admin/auth';
import Users from '~/server/models/users';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameter'
    }

    const token = event.context.params.token;
    if (token === undefined) {
      throw 'Missing Token';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Users.findOne({user_uid: result.uid});

    if (document === null) {
      throw 'Document null'
    }

    return {
      data: {
        user_handle: document.user_handle,
        user_avatar: document.user_avatar,
      },
      success: true,
    }
  } catch(error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user',
        request_type: 'GET',
      },
    }
  }
 })