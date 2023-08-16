import { getAuth } from 'firebase-admin/auth';
import { Return_Unpublished_Posts } from 'models/return.model';
import Posts from "~/server/models/posts";

export default defineEventHandler(async (event):Promise<Return_Unpublished_Posts> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameter'
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

    const result = await getAuth().verifyIdToken(token);

    const document = await Posts.aggregate([
      {
        $match: {
          uid: result.uid,
          published: false,
        }
      },
      {
        $sort: {"created_at": -1}
      },
      {
        $skip: skip,
      },
      {
        $limit: skip + limit,
      },
      {
        $project: {
          _id : 0 ,
          post_id: "$_id",
          urls: "$urls",
          caption: "$caption",
          users_tagged: "$users_tagged",
          created_at: "$created_at",
        }
      }
    ])
    
    if (document.length === 0 && skip !== 0) {
      return {
        data: 'completed',
        success: true,
      }
    } else if (document.length === 0) {
      return {
        data: 'no-posts',
        success: true,
      }
    }

    return {
      data: {
        posts: document,
        skip_amount: document.length,
      },
      success: true,
    }

  } catch(error: any) {
    return {
      error: error,
      success: false,
      message: 'users/user/posts/unpublished/post',
    }
  }
 })