export interface Likes {
  likes: Array<Like>,
  skip_amount: number,
  likes_false?: boolean,
  likes_loading?: boolean,
}

export interface Replies {
  replies: Array<Reply>,
  skip_amount: number,
  replies_false?: boolean,
  replies_loading?: boolean,
}

export interface Posts {
  posts: Array<Post>,
  skip_amount: number,
}

export interface Posts_Unpublished {
  posts: Array<Post_Unpublished>,
  skip_amount: number,
}

export interface Comments {
  comments: Array<Comment>,
  skip_amount: number,
  comments_false?: boolean,
  comments_loading?: boolean,
}

export interface Like {
  user_avatar: string,
  user_handle: string,
  user_verified: boolean,
}

export interface Comment {
  post_id?: string,
  user: {
    user_handle: string, 
    user_avatar: string, 
    user_verified: boolean 
  },
  comment_by_current_user: boolean,
  liked_by_current_user: boolean,
  comment_id: string,
  text: string,
  likes_count: number,
  replies: Replies,
  reply_count: number,
  created_at: number,
}

export interface Reply {
  post_id: string,
  reply_id: string,
  comment_id: string,
  reply_by_current_user: boolean,
  text: string,
  likes_count: number,
  created_at: number,
}

export interface Post {
  post_id: string,
  user: {
    verified: boolean,
    handle: string,
    avatar_url: string,
  },
  liked_by_current_user: boolean,
  likes: Likes,
  comments: Comments,
  urls: Array<string>,
  likes_count: number,
  comments_count: number,
  caption: string,
  users_tagged: Array<string>,
  created_at: number,
}

export interface Post_Unpublished {
  post_id: string,
  urls: Array<string>,
  caption: string,
  users_tagged: Array<string>,
  created_at: number,
}
