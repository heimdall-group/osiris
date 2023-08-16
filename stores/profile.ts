import { Profile, Profile_Description, Profile_Edit, Profile_Follow, Profile_Followers, Profile_Following } from 'models/profile.model';
import { Return_Followers, Return_Following, } from 'models/return.model';
import { useStore } from '~/stores/main';
import { getAuth } from 'firebase/auth';
import { User_db } from 'models/user_db.model';

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
      profile_edit: {} as Profile_Edit,
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
    getProfile_edit(): Profile_Edit {
      return this.profile_edit
    }
  },
  actions: {
    setProfile(profile:Profile) {
      this.profile = profile;
    },
    pushFollowers(result:Return_Followers) {
      try {
        if (result.data === 'completed') {
          this.followers_loading = false;
        } else if (result.data === 'no-followers') {
          this.followers_loading = false;
          this.followers_false = false;
        } else if (result.data) {
          this.followers.followers = Array.from(new Set([...this.followers.followers, ...result.data.followers]))
          this.followers.skip_amount += result.data.skip_amount;
        }

        if (this.followers.followers.length === this.profile.user_followers_count) {
          this.followers_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    pushFollowing(result:Return_Following) {
      try {
        if (result.data === 'completed') {
          this.following_loading = false;
        } else if (result.data === 'no-followers') {
          this.following_loading = false;
          this.following_false = false;
        } else if (result.data) {
          const set = new Set(this.following.following);
          result.data.following.forEach(follow => {
            set.add(follow);
          });
          this.following.following = Array.from(set)
          this.following.skip_amount += result.data.skip_amount;
        }

        if (this.following.following.length === this.profile.user_following_count) {
          this.following_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    setProfileEdit(result: Profile_Edit) {
      this.profile_edit = result;
    },
    async editProfile(handle: string, displayName: string, description: Profile_Description,) {
      try {
        const store = useStore()
        const user = await getAuth().currentUser
        const user_db = store.getUser_db;

        if (user === null) {
          throw {
            message: 'User not signed in',
            code: 'profile-edit/user-not-authenticated',
            severity: 4,
            type: 'client',
          }
        }

        store.setUser(user)
        store.setUser_db({user_handle: handle, user_avatar: user_db.user_avatar} as User_db);
        this.profile.user_description.text = description.text;
        this.profile.user_description.links = [...description.links];         
      } catch(error) {
        handle_error(error)
      }
    },
    changeFollowerState(handle: string, type: 'follow'|'remove') {
      const followers_index = this.followers.followers.find((item) => item.user_handle === handle)
      if (followers_index) {
        if (type === 'follow') {
          followers_index.current_user_follows = true;
        } else if (type === 'remove') {
          followers_index.current_user_follows = false;
        }
      }
      const following_index = this.following.following.find((item) => item.user_handle === handle)
      if (following_index) {
        if (type === 'follow') {
          following_index.current_user_follows = true;
        } else if (type === 'remove') {
          following_index.current_user_follows = false;
        }
      }
    },
    changeFollowerStateUserSame(handle: string, type: 'follow'|'remove') {
      const followers_index = this.followers.followers.find((item) => item.user_handle === handle)
      if (followers_index) {
        if (type === 'follow') {
          followers_index.current_user_follows = true;
          this.resetFollowing();
        } else if (type === 'remove') {
          followers_index.current_user_follows = false;
        }
      }

      const following_index = this.following.following.find((item) => item.user_handle === handle)
      if (following_index) {
        if (type === 'follow') {
          following_index.current_user_follows = true;
        } else if (type === 'remove') {
          const index = this.following.following.indexOf(following_index);
          this.following.following.splice(index, 1)
        }
      }

      if (type === 'follow') {
        this.profile.user_following_count++
      } else if (type === 'remove') {
        this.profile.user_following_count--
      }
    },
    decrementProfilePostsCount() {
      this.profile.user_posts_count--
    },
    resetProfile() {
      this.profile = {} as Profile;
    },
    resetProfileEdit() {
      this.profile_edit = {} as Profile_Edit;
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
