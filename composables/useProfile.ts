import { useProfileStore } from "~/stores/profile";
import { useStore } from "~/stores/main";
import { Profile } from 'models/profile.model';
import { Return } from "models/return.model";

// For public profiles. Not user_same profiles

export const profile_validRequest = ():boolean => {
  const store = useStore();
  const user = store.getUser;

  if (Object.keys(user).length === 0) {
    store.setSignInAlert(true);
    return false
  } else {
    return true
  }
}

export const profilePage_addFollower = async ():Promise<Return> => {
  try {
    const route = useRoute();
    const handle = route.params.handle
    const result = await profile_addFollower(handle as string, profilePage_followStateUpdated)
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw 'Follower not added'
    }

  } catch(error:any) {
    profile_handleErrors(error)
    return {
      error: error,
      success: false,
    }
  }
}

export const profilePage_removeFollower = async ():Promise<Return> => {
  try {
    const route = useRoute();
    const handle = route.params.handle
    const result = await profile_removeFollower(handle as string, profilePage_followStateUpdated)
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw 'Follower not removed'
    }
  } catch(error:any) {
    profile_handleErrors(error)
    return {
      error: error,
      success: false,
    }
  }
  
}

export const profileList_addFollower = async (handle: string):Promise<Return> => {
  try {
    const result = await profile_addFollower(handle as string, () => {profileList_followStateUpdated(handle, 'follow')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw 'Follower not added'
    }
  } catch(error:any) {
    profile_handleErrors(error)
    return {
      error: error,
      success: false,
    }
  }
}

export const profileList_removeFollower = async (handle: string):Promise<Return> => {
  try {
    const result = await profile_removeFollower(handle as string, () => {profileList_followStateUpdated(handle, 'remove')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw 'Follower not removed'
    }
  } catch(error:any) {
    profile_handleErrors(error)
    return {
      error: error,
      success: false,
    }
  }

}

export const profilePage_followStateUpdated = async ():Promise<void> => {
  const store = useStore();
  const profileStore = useProfileStore();
  const user = store.getUser;
  const route = useRoute();
  const handle = route.params.handle;
  const token = await user.getIdToken();
  const result = await $fetch(`/api/users/user/profile/${handle}`, {
    method: 'POST',
    body: {
      token: token,
    }
  });
  
  if (result.success) {
    profileStore.setProfile(result.data as Profile)
    profileStore.resetFollowers();
  } else {
    console.error(result.error)
  }
}

export const profileList_followStateUpdated = async (handle: string, type: 'follow'|'remove',):Promise<void> => {
  const profileStore = useProfileStore();
  profileStore.changeFollowerState(handle, type);
}

const profile_removeFollower = async (handle: string, callback: Function):Promise<Return> => {
  try {
    if (profile_validRequest()) {
      const store = useStore();
      const user = store.getUser;
      const user_db = store.getUser_db;

      if (handle === user_db.user_handle) {
        throw 'You cannot unfollow yourself'
      }

      const result = await $fetch(`/api/users/user/follow`, {
        method: 'DELETE',
        body: {
          token: await user.getIdToken(),
          user_handle: handle,
        }
      });

      if (result.success) {
        callback();
        return {
          success: true,
          data: true,
        }
      } else {
        profile_handleErrors(result.error);
        return {
          success: false,
        }
      }

    } else {
      throw 'User is not signed in'
    }
  } catch(error: any) {
    return {
      success: false,
      error: error
    }
  }
}

const profile_addFollower = async (handle: string, callback: Function):Promise<Return> => {
  try {
    if (profile_validRequest()) {
      const store = useStore();
      const user = store.getUser;
      const user_db = store.getUser_db;
  
      if (handle === user_db.user_handle) {
        throw 'You cannot follow yourself'
      }

      const result = await $fetch(`/api/users/user/follow`, {
        method: 'PUT',
        body: {
          token: await user.getIdToken(),
          user_handle: handle,
        }
      });

      if (result.success) {
        callback();
        return {
          success: true,
          data: true,
        }
      } else {
        profile_handleErrors(result.error);
        return {
          success: false,
        }
      }
    } else {
      throw 'User is not signed in'
    }
  } catch(error: any) {
    return {
      success: false,
      error: error
    }
  }
}



const profile_handleErrors = (error:any):void => {
  console.error(error)
}