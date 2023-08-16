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
    const { token } = await readBody(event)
    const result = token !== undefined ?
      await getAuth().verifyIdToken(token)
      : {uid: ''}
    const document = await Comments.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(comment_id) } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'uid',
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
          comment_by_current_user: { $eq: [ "$uid", result.uid ] },
          liked_by_current_user: { $in: [ result.uid, "$likes"] },
          comment_id: '$_id',
          post_id: '$post_id',
          text: '$text',
          likes_count: { $size: '$likes' },
          reply_count: { $size: '$replies' },
          created_at: '$created_at',
          user: {
            user_handle: '$user.user_handle',
            user_avatar: '$user.user_avatar',
            user_verified: '$user.user_verified',
          }
        }
      },
    ]);

    for (let i = 0; i < document.length; i++) {
      const index = document[i];
      index.replies = {
        replies: [],
        skip_amount: 0,
        replies_false: true,
        replies_loading: true,
      }
    }

    return {
      data: {
        comments: document,
      },
      success: true,
    }
  } catch (error:any) {
    console.log(error);
    
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/post/comments/comment',
        request_type: 'POST',
      },
    }
  }
 });