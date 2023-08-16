import { getAuth } from 'firebase-admin/auth';
import Users from '~/server/models/users';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const { token, skip, limit } = await readBody(event)
    const handle = event.context.params.handle;
    if (skip === undefined) {
      throw 'Missing skip amount';
    }
    if (limit === undefined) {
      throw 'Missing limit amount';
    }

    const result = token === undefined ?
    { uid: undefined } :
    await getAuth().verifyIdToken(token);
    const document = await Users.aggregate([
      {
        $match: {
          user_handle: handle,
        }
      },
      {
        $lookup: {
          from: 'posts',
          let: {user_uid: '$user_uid'},
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ['$uid', '$$user_uid']
                    }
                  },
                  {
                    $expr: {
                      $eq: ['$published', true]
                    }
                  }
                ],
              }
            }
          ],
          as: 'posts'
        }
      },
      {
        $unwind: '$posts'
      },
      {
        $sort: {
          "posts.created_at": -1,
        }
      },
      { $skip: skip },
      { $limit: skip + limit },
      {
        $project: {
          _id : 0 ,
          post_id: "$posts._id",
          user: {
            verified: "$user_verified",
            handle:  "$user_handle",
            avatar_url:  "$user_avatar",
          },
          post_by_current_user: { $eq: [ "$posts.uid", result.uid ] },
          liked_by_current_user: { $cond: [result !== undefined, { $in: [result.uid, "$posts.likes"] }, false]},
          urls: "$posts.urls",
          likes_count: { $size: "$posts.likes" },
          comments_count: { $size: "$posts.comments" },
          caption: "$posts.caption",
          users_tagged: "$posts.users_tagged",
          created_at: "$posts.created_at",
        }
      }
    ]);
    
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

    for (let i = 0; i < document.length; i++) {
      const index = document[i];
      index.likes = {
        likes: [],
        skip_amount: 0,
        likes_false: true,
        likes_loading: true,
      }
      index.comments = {
        comments: [],
        skip_amount: 0,
        comments_false: true,
        comments_loading: true,
      }
    }

    return {
      data: {
        posts: document,
        skip_amount: document.length,
      },
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
