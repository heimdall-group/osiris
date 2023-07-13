export interface Profile {
  user_uid: string,
  user_handle: string,
  user_avatar: string,
  user_followers_count: number,
  user_following_count: number,
  user_verified: boolean,
  user_displayName: string,
  user_description: string,
  user_followed_by_current_user: boolean,
  user_follow_back_by_current_user: boolean,
  user_same: boolean,
  current_user_blocked: boolean,
}

export interface Profile_Follow {
  user_avatar: string;
  user_follow_back_by_current_user: boolean;
  user_followed_by_current_user: boolean;
  user_handle: string;
  user_same: boolean;
  user_verified: boolean;
  _id: string;
}

export interface Profile_Followers {
  skip_amount: number,
  followers: Array<Profile_Follow>
}

export interface Profile_Following {
  skip_amount: number,
  following: Array<Profile_Follow>
}
