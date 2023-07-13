import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";

export default defineEventHandler(async (event) => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const handle = event.context.params.handle;
    const auth = await getAuth();



    return {
    }
  } catch (err) {
    console.log(err)
    return {
      error: err,
      success: false,
      message: 'users/user/profile/posts/get',
    }
  }
 });
