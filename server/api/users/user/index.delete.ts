import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  const { token } = await readBody(event);
  const result = await getAuth().verifyIdToken(token);
  try {
    if (result) {
      const firebase = await getAuth().deleteUser(result.uid);
      const mongo = await Users.findOneAndDelete({user_uid: result.uid})
      return {
        data: true,
        success: true,
      }
    } else {
      return {
        data: false,
        success: false,
        message: 'User not signed in',
        server_message: {
          request_endpoint: 'users/user/profile',
          request_type: 'DELETE',
        },
      }
    } 
  } catch (error: any) {
    return {
      data: false,
      success: false,
      error: error,
      server_message: {
        request_endpoint: 'users/user/profile',
        request_type: 'DELETE',
      },
    }
  }
 })