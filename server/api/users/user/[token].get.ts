import { getAuth } from 'firebase-admin/auth';
import { documentId } from 'firebase/firestore';
import Users from '~/server/models/users';

export default defineEventHandler(async (event) => {
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
  } catch(error) {
    return {
      error: error,
      success: false,
      message: 'posts/post/post',
    }
  }
 })