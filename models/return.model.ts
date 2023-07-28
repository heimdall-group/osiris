import { Posts_Unpublished, Posts } from "./post.model";
import { Profile_Followers, Profile_Following } from "./profile.model";

export interface Return {
  data?: Object,
  success: boolean,
  message?: string,
  error?: string,
  error_code?: string,
}

export interface Return_Api extends Return {
  server_message?: {
    request_type: string,
    request_endpoint: string,
  },
}

export interface Return_Followers extends Return {
  data?: Profile_Followers | 'completed' | 'no-followers',
} 

export interface Return_Following extends Return {
  data?: Profile_Following | 'completed' | 'no-followers',
}

export interface Return_Posts extends Return {
  data?: Posts | 'completed' | 'no-posts'
}

export interface Return_Unpublished_Posts extends Return {
  data?: Posts_Unpublished | 'completed' | 'no-posts'
}

export interface Return_Compression_Item {
  path: string,
  name?: string,
  append_name?: string,
  type: string,
}


export interface Return_Compression extends Return {
  data?: Return_Compression_Item
}

export interface Throw_Error {
  message: string,
  // section/error
  // example: auth/user_db-fetch-failed
  code: string,
  // 1: Sent to sentry + console.error and alert
  // 2: console.error and alert
  // 3: console.warning and alert
  // 4: console.warning
  severity: 1 | 2 | 3 | 4,
  type: 'client' | 'server',
  server_error?: any,
}