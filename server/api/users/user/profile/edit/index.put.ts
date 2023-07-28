import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    const { token, handle, description, displayName } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }
    if (handle === undefined) {
      throw 'Missing handle';
    }
    if (description === undefined) {
      throw 'Missing description';
    }
    if (displayName === undefined) {
      throw 'Missing display name';
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Users.findOneAndUpdate({user_uid: result.uid}, {
      user_handle: handle,
      user_description: description,
    });

    if (document === null) {
      throw 'Document update failed'
    }

    const user = await getAuth().updateUser(result.uid, {
      displayName: displayName,
    })
    
    return {
      data: document,
      success: true,
    }
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/profile/edit',
        request_type: 'PUT',
      },
    }
  }
 });
