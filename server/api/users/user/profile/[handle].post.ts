import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const { token } = await readBody(event);
    const handle = event.context.params.handle;
    const auth = await getAuth();
    const result = token === undefined ?
    { uid: undefined } :
    await auth.verifyIdToken(token);

    const document = await Users.aggregate([
      {
        $match: {
          user_handle: handle,
        },
      },
      {
        $project: {
          _id : 0 ,
          user_uid: "$user_uid",
          user_handle: "$user_handle",
          user_avatar: "$user_avatar",
          user_verified: "$user_verified",
          user_followers_count: { $size: "$user_followers" },
          user_following_count: { $size: "$user_following" },
          user_posts_count: { $size: "$user_posts" },
          user_programs_count: { $size: "$user_programs" },
          user_description: "$user_description",
          current_user_followed: { $cond: [result !== undefined, { $in: [result.uid, "$user_following"] }, false]},
          current_user_follows: { $cond: [result !== undefined, { $in: [result.uid, "$user_followers"] }, false]},
          current_user_blocked: { $cond: [result !== undefined, { $in: [result.uid, "$users_blocked"] }, false]},
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
        user_handle: document[0].user_handle,
        user_avatar: document[0].user_avatar,
        user_followers_count: document[0].user_followers_count,
        user_following_count: document[0].user_following_count,
        user_posts_count: document[0].user_posts_count,
        user_programs_count: document[0].user_programs_count,
        user_verified: document[0].user_verified,
        user_displayName: firebase_user.displayName,
        user_description: document[0].user_description,
        current_user_followed: document[0].current_user_followed,
        current_user_follows: document[0].current_user_follows,
        user_same: document[0].user_uid === result.uid,
        current_user_blocked: document[0].current_user_blocked,
      },
      success: true,
    }
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/profile',
        request_type: 'POST',
      },
    }
  }
 });
