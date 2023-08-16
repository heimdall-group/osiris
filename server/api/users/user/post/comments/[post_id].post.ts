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
    const document = await Posts.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(post_id) } 
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'external_comments'
        }
      },
      { 
        $unwind: '$external_comments'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'external_comments.uid',
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
          comment_by_current_user: { $eq: [ "$external_comments.uid", result.uid ] },
          liked_by_current_user: { $in: [ result.uid, "$external_comments.likes"] },
          comment_id: '$external_comments._id',
          post_id: '$external_comments.post_id',
          text: '$external_comments.text',
          likes_count: { $size: '$external_comments.likes' },
          reply_count: { $size: '$external_comments.replies' },
          created_at: '$external_comments.created_at',
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
        data: 'no-comments',
        success: true,
      }
    }

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
        request_endpoint: 'users/user/post/comments',
        request_type: 'POST',
      },
    }
  }
 });