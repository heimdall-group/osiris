import Posts from '~/server/models/posts';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const post_id = event.context.params.post_id;
    const { skip, limit } = await readBody(event)
    if (skip === undefined) {
      throw 'Missing skip';
    }
    if (limit === undefined) {
      throw 'Missing limit';
    }

    const document = await Posts.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(post_id) } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likes',
          foreignField: 'user_uid',
          as: 'user'
        }
      },
      { 
        $unwind: '$user'
      },
      {
        $project: {
          _id : 0 ,
          user_handle: '$user.user_handle',
          user_avatar: '$user.user_avatar',
          user_verified: '$user.user_verified',
        }
      },
      { $skip: skip },
      { $limit: skip + limit },
    ])

    if (document.length === 0 && skip !== 0) {
      return {
        data: 'completed',
        success: true,
      }
    } else if (document.length === 0) {
      return {
        data: 'no-likes',
        success: true,
      }
    }

    return {
      data: {
        likes: document,
        skip_amount: document.length,
        likes_false: true,
        likes_loading: true,
      },
      success: true,
    }
  } catch (error:any) {
    console.log(error)
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/post/likes',
        request_type: 'POST',
      },
    }
  }
 });