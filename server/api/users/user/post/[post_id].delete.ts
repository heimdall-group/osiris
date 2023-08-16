import Comments from '~/server/models/comments';
import Posts from '~/server/models/posts';
import Replies from '~/server/models/replies';
import Users from '~/server/models/users'
import { getAuth } from 'firebase-admin/auth';
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }
    
    const post_id = event.context.params.post_id
    const { token } = await readBody(event)
    if (token === undefined) {
      throw 'Missing token';
    }

    const result = await getAuth().verifyIdToken(token);
    const post = await Posts.findOneAndDelete({
      uid: result.uid,
      _id: post_id
    });
    
    const comments = await Comments.deleteMany({
      post_id: post_id
    });

    const replies = await Replies.deleteMany({
      post_id: post_id
    })
    const users = await Users.findOneAndUpdate({
      user_uid: result.uid,
    }, {
      $pull: { user_posts: { $in: [new mongoose.Types.ObjectId(post_id)] } },
    })

    return {
      data: true,
      success: true,
    }
  } catch (error:any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts',
        request_type: 'POST',
      },
    }
  }
 });