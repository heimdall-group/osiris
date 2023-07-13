import { getAuth } from 'firebase-admin/auth';
import { Return } from 'models/return.model';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const { token } = await readBody(event);
    if (token === undefined) {
      throw 'Missing token'
    }

    const handle = event.context.params.handle;
    const auth = await getAuth();
    const result = await auth.verifyIdToken(token)
    if (result === null) {
      throw 'Firebase Index not found';
    }

    const document = await Users.aggregate([
      {
        $match: {
          user_handle: handle,
        },
      },
      {
        $project: {
          user_uid: "$user_uid",
          user_handle: "$user_handle",
          user_avatar: "$user_avatar",
          user_verified: "$user_verified",
          user_followers_count: { $size: "$user_followers" },
          user_following_count: { $size: "$user_following" },
          user_programs_count: { $size: "$user_programs" },
          user_description: "$user_description",
          user_followed_by_current_user: { $in: [result.uid, "$user_following"] },
          user_follow_back_by_current_user: { $in: [result.uid, "$user_followers"] },
          current_user_blocked: {$in: [result.uid, "$users_blocked"]}
        },
      }, 
    ]);

    if (document.length === 0) {
      throw 'DB Index not found';
    }

    if (document[0].user_uid === undefined) {
      throw 'DB missing uid'
    }

    const firebase_user = await auth.getUser(document[0].user_uid);

    return {
      data: {
        user_uid: document[0].user_uid,
        user_handle: document[0].user_handle,
        user_avatar: document[0].user_avatar,
        user_followers_count: document[0].user_followers_count,
        user_following_count: document[0].user_following_count,
        user_verified: document[0].user_verified,
        user_displayName: firebase_user.displayName,
        user_description: document[0].user_description,
        user_followed_by_current_user: document[0].user_followed_by_current_user,
        user_follow_back_by_current_user: document[0].user_follow_back_by_current_user,
        user_same: document[0].user_uid === result.uid,
        current_user_blocked: document[0].current_user_blocked,
      },
      success: true,
    }
  } catch (err: any) {
    console.log(err)
    return {
      error: err,
      success: false,
      message: 'users/user/profile/get',
    }
  }
 });
