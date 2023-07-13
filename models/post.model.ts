import { ObjectId } from "mongoose"
import { Pagnation } from "./pagnation.model"

export interface Likes {
  likes: Array<Like>,
  pagnation: Pagnation,
}

export interface Comments {
  comments: Array<Comment>,
  pagnation: Pagnation,
}

export interface Replies {
  replies: Array<Reply>,
  pagnation: Pagnation,
}

export interface Posts {
  posts: Array<Post>,
  pagnation: Pagnation,
}

export interface Like {
  post_id: ObjectId,
  like_id: ObjectId,
  uid: String,
  created_at: Number,
}

export interface Comment {
  post_id: ObjectId,
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
  uid: String,
  user: {
    verified: boolean,
    handle: String,
    displayname: String,
    avatar_url: String,
  },
  liked: boolean,
  likes: Array<Likes>,
  comments: Array<Comments>,
  urls: Array<{
    url: String,
    type: String,
  }>,
  likes_total: Number,
  comments_total: Number,
  caption: String,
  users_tagged: Array<String>
  created_at: Number,
}
