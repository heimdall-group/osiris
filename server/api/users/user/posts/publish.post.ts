import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import Posts from "~/server/models/posts";
import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';
import mongoose from 'mongoose';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameter'
    }

    const { token, post_id } = await readBody(event);
    if (token === undefined) {
      throw 'Missing Token';
    }
    if (post_id === undefined) {
      throw 'Missing post id';
    }

    const result: DecodedIdToken = await getAuth().verifyIdToken(token);
    const document = await Posts.findOneAndUpdate({
      uid: result.uid,
      _id: post_id,
    }, {
      published: true,
    });
    if (document === null) {
      throw 'Document is null'
    }

    const user = await Users.findOneAndUpdate(
      {
        user_uid: result.uid,
      },
      {
        $addToSet: { user_posts: post_id },
        $pull: { user_unpublished_posts: { $in: [new mongoose.Types.ObjectId(post_id)] } },
      }
    );
    if (user === null) {
      throw 'User fetch is null'
    }
    user.save();

    return {
      data: true,
      success: true,
    }
    
  } catch(error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts',
        request_type: 'POST',
      },
    }
  }
 })