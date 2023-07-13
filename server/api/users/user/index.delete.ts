import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";

export default defineEventHandler(async (event) => {
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
        message: 'User not authenticated',
      }
    } 
  } catch (err) {
    console.log(err)
    return {
      data: false,
      success: false,
      message: 'users/user/profile/delete',
    }
  }
 })