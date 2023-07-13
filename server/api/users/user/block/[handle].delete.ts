import { Return } from 'models/return.model';
import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }
    const { user_handle, token } = await readBody(event);
    if (user_handle === undefined) {
      throw 'Missing uid';
    }

    const handle = event.context.params.handle;
    if (handle === undefined) {
      throw 'Missing handle';
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
  } catch (err: any) {
    console.log(err)
    return {
      error: err,
      success: false,
      message: 'users/user/friendshop/put',
    }
  }
 });
