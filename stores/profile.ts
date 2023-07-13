import { defineStore } from 'pinia';
import { Profile, Profile_Follow, Profile_Followers, Profile_Following } from 'models/profile.model';
import { Return_Followers, Return_Following } from 'models/return.model';

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      profile: {} as Profile,
      followers: {
        followers: [] as Array<Profile_Follow>,
        skip_amount: 0,
      } as Profile_Followers,
      following: {
        following: [] as Array<Profile_Follow>,
        skip_amount: 0,
      } as Profile_Following,
      followers_loading: true as boolean,
      following_loading: true as boolean,
      followers_false: true as boolean,
      following_false: true as boolean,
    };
  },
  getters: {
    getProfile():Profile {
      return this.profile;
    },
    getFollowers():Profile_Followers {
      return this.followers;
    },
    getFollowing():Profile_Following {
      return this.following;
    },
    getFollowers_loading():boolean {
      return this.followers_loading;
    },
    getFollowing_loading():boolean {
      return this.following_loading;
    },
    getFollowers_false():boolean {
      return this.followers_false;
    },
    getFollowing_false():boolean {
      return this.following_false;
    },
  },
  actions: {
    setProfile(profile:Profile) {
      this.profile = profile;
    },
    pushFollowers(result:Return_Followers) {
      if (result.data === 'completed') {
        this.followers_loading = false;
      } else if (result.data === 'no-followers') {
        this.followers_loading = false;
        this.followers_false = false;
      } else if (result.data) {
        this.followers.followers.push(...result.data.followers);
        this.followers.skip_amount += result.data.skip_amount;
      }

      if (this.followers.followers.length === this.profile.user_followers_count) {
        this.followers_loading = false;
      }
    },
    pushFollowing(result:Return_Following) {
      if (result.data === 'completed') {
        this.following_loading = false;
      } else if (result.data === 'no-followers') {
        this.following_loading = false;
        this.following_false = false;
      } else if (result.data) {
        this.following.following.push(...result.data.following);
        this.following.skip_amount += result.data.skip_amount;
      }

      if (this.following.following.length === this.profile.user_following_count) {
        this.following_loading = false;
      }
    },
    resetProfile() {
      this.profile = {} as Profile;
    },
    changeFollowerState(handle: string, type: 'follow'|'remove') {
      const followers_index = this.followers.followers.find((item) => item.user_handle === handle)
      if (followers_index) {
        if (type === 'follow') {
          followers_index.user_follow_back_by_current_user = true;
        } else if (type === 'remove') {
          followers_index.user_follow_back_by_current_user = false;
        }
      }
      const following_index = this.following.following.find((item) => item.user_handle === handle)
      if (following_index) {
        if (type === 'follow') {
          following_index.user_follow_back_by_current_user = true;
        } else if (type === 'remove') {
          following_index.user_follow_back_by_current_user = false;
        }
      }
    },
    resetFollowers() {
      this.followers = {
        followers: [] as Array<Profile_Follow>,
        skip_amount: 0,
      }
      this.followers_loading = true as boolean;
      this.followers_false = true as boolean;
    },
    resetFollowing() {
      this.following = {
        following: [] as Array<Profile_Follow>,
        skip_amount: 0,
      }
      this.following_loading = true as boolean;
      this.following_false = true as boolean;
    },
  },
});
