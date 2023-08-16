import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
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
          localField: "user_followers",
          foreignField: "user_uid",
          as: "user_followers",
        },
      },
      { 
        $unwind: "$user_followers"
      },
      {
        $sort: {
          "user_followers.user_handle": 1,
        }
      },
      { $skip: skip },
      { $limit: skip + limit },
      {
        $project: {
          _id : 0 ,
          user_avatar: "$user_followers.user_avatar",
          user_handle: "$user_followers.user_handle",
          user_verified: "$user_followers.user_verified",
          current_user_followed: { $in: [result.uid, "$user_followers.user_following"] },
          current_user_follows: { $in: [result.uid, "$user_followers.user_followers"] },
          user_same: {
            $eq: [ "$user_followers.user_uid", result.uid ]
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
        followers: document,
      },
      success: true,
    }
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/profile/followers',
        request_type: 'POST',
      },
    }
  }
 });
