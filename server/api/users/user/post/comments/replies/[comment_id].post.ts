import Comments from '~/server/models/comments';
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const comment_id = event.context.params.comment_id;
    const { token, skip, limit } = await readBody(event)
    if (skip === undefined) {
      throw 'Missing skip';
    }
    if (limit === undefined) {
      throw 'Missing limit';
    }

    const result = token !== undefined ?
      await getAuth().verifyIdToken(token)
      : {uid: ''}
    const document = await Comments.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(comment_id) } 
      },
      {
        $lookup: {
          from: 'replies',
          localField: 'replies',
          foreignField: '_id',
          as: 'external_replies'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'external_replies.uid',
          foreignField: 'user_uid',
          as: 'user'
        }
      },
      { 
        $unwind: '$external_replies'
      },
      { 
        $unwind: '$user'
      },
      {
        $project: {
          _id : 0 ,
          reply_by_current_user: { $eq: [ "$external_replies.uid", result.uid ] },
          liked_by_current_user: { $in: [ result.uid, "$external_replies.likes"] },
          post_id: '$external_replies.post_id',
          comment_id: '$external_replies.comment_id',
          reply_id: '$external_replies._id',
          text: '$external_replies.text',
          likes_count: { $size: '$external_replies.likes' },
          created_at: '$external_replies.created_at',
          user: {
            user_handle: '$user.user_handle',
            user_avatar: '$user.user_avatar',
            user_verified: '$user.user_verified',
          }
        }
      },
      {
        $sort:{ likes_count: -1 }
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
        data: 'no-replies',
        success: true,
      }
    }

    return {
      data: {
        replies: document,
        skip_amount: document.length,
      },
      success: true,
    }
  } catch (error:any) {
    console.log(error);
    
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/post/comments/replies',
        request_type: 'POST',
      },
    }
  }
 });