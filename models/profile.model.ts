export interface Profile_Description {
  text: string,
  links: Array<{
    href: string,
    text: string,
    disabled?: boolean,
  }>,
}

export interface Profile {
  user_handle: string,
  user_avatar: string,
  user_posts_counts: number,
  user_followers_count: number,
  user_following_count: number,
  user_posts_count: number,
  user_programs_count: number,
  user_verified: boolean,
  user_displayName: string,
  user_description: Profile_Description,
  user_followed_by_current_user: boolean,
  user_follow_back_by_current_user: boolean,
  user_same: boolean,
  current_user_blocked: boolean,
}

export interface Profile_Edit {
  user_handle: string,
  user_email: string,
  user_avatar: string,
  user_verified: boolean,
  user_displayName: string,
  user_unpublished_posts_count: string,
  user_description: Profile_Description,
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