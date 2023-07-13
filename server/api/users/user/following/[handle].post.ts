import { Return } from 'models/return.model';
import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { doc } from 'firebase/firestore';

export default defineEventHandler(async (event):Promise<Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }
    const { skip, limit, token } = await readBody(event);
    if (skip === undefined) {
      throw 'Missing skip amount';
    }
    if (limit === undefined) {
      throw 'Missing limit amount';
    }
    if (token === undefined) {
      throw 'Missing token';
    }

    const handle = event.context.params.handle;
    if (handle === undefined) {
      throw 'Missing handle';
    }

    const result = token === undefined ?
      { uid: undefined } :
      await getAuth().verifyIdToken(token);
    const document = await Users.aggregate([
      {
        $match: {
          user_handle: handle,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_following",
          foreignField: "user_uid",
          as: "user_following",
        },
      },
      { 
        $unwind: "$user_following"
      },
      {
        $sort: {
          "user_following.user_handle": 1,
        }
      },
      { $skip: skip },
      { $limit: skip + limit },
      {
        $project: {
          user_avatar: "$user_following.user_avatar",
          user_handle: "$user_following.user_handle",
          user_verified: "$user_following.user_verified",
          user_followed_by_current_user: { $cond: [result !== undefined, { $in: [result.uid, "$user_following.user_following"] }, false]},
          user_follow_back_by_current_user: { $cond: [result !== undefined, { $in: [result.uid, "$user_following.user_followers"] }, false]},
          user_same: {
            $eq: [ "$user_following.user_uid", result.uid ]
         },
        },
      }, 
    ]);

    if (document.length === 0 && skip !== 0) {
      return {
        data: 'completed',
        success: true,
      }
    } else if (document.length === 0) {
      return {
        data: 'no-followers',
        success: true,
      }
    }
    
    return {
      data: {
        skip_amount: document.length,
        following: document,
      },
      success: true,
    }
  } catch (err: any) {
    console.log(err)
    return {
      error: err,
      success: false,
      message: 'users/user/following/post',
    }
  }
 });
