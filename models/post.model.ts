import { ObjectId } from "mongoose"

export interface Likes {
  likes: Array<Like>,
  skip_amount: number,
}

export interface Comments {
  comments: Array<Comment>,
  skip_amount: number,
}

export interface Replies {
  replies: Array<Reply>,
  skip_amount: number,
}

export interface Posts {
  posts: Array<Post>,
  skip_amount: number,
}

export interface Posts_Unpublished {
  posts: Array<Post_Unpublished>,
  skip_amount: number,
}

export interface Like {
  post_id: ObjectId,
  like_id: ObjectId,
  uid: String,
  created_at: Number,
}

export interface Comment {
  post_id?: ObjectId,
  comment_id: ObjectId,
  uid: String,
  text: String,
  likes: Array<Likes>,
  likes_count: Number,
  replies: Array<Replies>,
  reply_count: Number,
  created_at: Number,
}

export interface Reply {
  post_id: ObjectId,
  reply_id: ObjectId,
  uid: String,
  text: String,
  likes: Array<Likes>
  likes_count: Number,
  created_at: Number,
}

export interface Post {
  post_id: ObjectId,
  user: {
    verified: boolean,
    handle: String,
    avatar_url: String,
  },
  liked_by_current_user: boolean,
  likes: Likes,
  comments: Comments,
  urls: Array<string>,
  likes_total: Number,
  comments_total: Number,
  caption: String,
  users_tagged: Array<String>,
  created_at: Number,
}

export interface Post_Unpublished {
  post_id: ObjectId,
  urls: Array<string>,
  caption: String,
  users_tagged: Array<String>,
  created_at: Number,
}
