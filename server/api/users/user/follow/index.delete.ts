import { Return } from 'models/return.model';
import { getAuth } from 'firebase-admin/auth';
import Users from '~/server/models/users';

export default defineEventHandler(async (event): Promise<Return> => {
  try {
    const { user_handle, token } = await readBody(event);
    if (user_handle === undefined) {
      throw 'Missing uid';
    }

    const result = await getAuth().verifyIdToken(token);
    console;

    // Removes current users follower index
    const document_1 = await Users.findOneAndUpdate(
      {
        user_handle: user_handle,
      },
      {
        $pull: { user_followers: { $in: [result.uid] } },
      },
      {
        new: true,
      }
    );

    if (document_1 === null) {
      throw 'Initial fetch is null';
    }

    // Removes current users following index
    const document_2 = await Users.findOneAndUpdate(
      {
        user_uid: result.uid,
      },
      {
        $pull: { user_following: { $in: [document_1.user_uid] } },
      },
      {
        new: true,
      }
    );

    if (document_2 === null) {
      throw 'Second fetch is null';
    }

    document_1.save();
    document_2.save();

    return {
      data: true,
      success: true,
    };
  } catch (err: any) {
    console.log(err);
    return {
      error: err,
      success: false,
      message: 'users/user/friendshop/put',
    };
  }
});
