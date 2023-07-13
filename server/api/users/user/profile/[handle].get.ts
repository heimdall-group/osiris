import { getAuth } from 'firebase-admin/auth';
import { Return } from 'models/return.model';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const handle = event.context.params.handle;
    const document = await Users.findOne({user_handle: handle});
    const user = await Users.aggregate([
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
        },
      }, 
    ]);

    if (user.length === 0) {
      throw 'DB Index not found';
    }

    if (user[0].user_uid === undefined) {
      throw 'DB missing uid'
    }
    const result = await getAuth().getUser(user[0].user_uid);

    if (result === null) {
      throw 'Firebase Index not found';
    }
    
    return {
      data: {
        user_uid: user[0].user_uid,
        user_handle: user[0].user_handle,
        user_avatar: user[0].user_avatar,
        user_followers_count: user[0].user_followers_count,
        user_following_count: user[0].user_following_count,
        user_verified: user[0].user_verified,
        user_displayName: result.displayName,
        user_description: user[0].user_description,
        user_followed_by_current_user: false,
        user_follow_back_by_current_user: false,
        user_same: false,
        current_user_blocked: false,
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
