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
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_addFollower(handle as string, profilePage_followStateUpdated)
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not added',
        code: 'profile/follower-not-added',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }

  } catch(error:any) {
    handle_error(error)
    return {
      success: false,
    }
  }
}

export const profilePage_removeFollower = async ():Promise<Return> => {
  try {
    const route = useRoute();
    const handle = route.params.handle
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_removeFollower(handle as string, profilePage_followStateUpdated)
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not removed',
        code: 'profile/follower-not-removed',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error:any) {
    handle_error(error)
    return {
      success: false,
    }
  }
  
}

export const profileList_addFollower = async (handle: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_addFollower(handle as string, () => {profileList_followStateUpdated(handle, 'follow')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not added',
        code: 'profile/follower-not-added-list',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error:any) {
    handle_error(error)
    return {
      success: false,
    }
  }
}

export const profileList_removeFollower = async (handle: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_removeFollower(handle as string, () => {profileList_followStateUpdated(handle, 'remove')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not removed',
        code: 'profile/follower-not-removed-list',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error:any) {
    handle_error(error)
    return {
      success: false,
    }
  }

}

export const profileList_user_same_addFollower = async (handle: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_addFollower(handle as string, () => {profileList_user_same_followStateUpdated(handle, 'follow')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not added',
        code: 'profile/follower-not-added-list',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error:any) {
    handle_error(error)
    return {
      success: false,
    }
  }
}

export const profileList_user_same_removeFollower = async (handle: string):Promise<Return> => {
  try {
    if (!profile_validRequest()) {
      throw {
        message: 'User not signed in',
        code: 'profile/user-not-authenticated',
        severity: 4,
        type: 'client',
      }
    }
    const result = await profile_removeFollower(handle as string, () => {profileList_user_same_followStateUpdated(handle, 'remove')})
    if (result.success) {
      return {
        success: true,
        data: true,
      }
    } else {
      throw {
        message: 'Follower not removed',
        code: 'profile/follower-not-removed-list',
        severity: 1,
        type: 'server',
        server_error: result.error,
      }
    }
  } catch(error:any) {
    handle_error(error)
    return {
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

export const profileList_user_same_followStateUpdated = async (handle: string, type: 'follow'|'remove',):Promise<void> => {
  const profileStore = useProfileStore();
  profileStore.changeFollowerStateUserSame(handle, type);
}


const profile_removeFollower = async (handle: string, callback: Function):Promise<Return> => {
  try {
    const store = useStore();
    const user = store.getUser;
    const user_db = store.getUser_db;

    if (handle === user_db.user_handle) {
      throw {
        message: 'You cannot unfollow yourself',
        code: 'profile/unfollow-yourself',
        severity: 4,
        type: 'client',
      }
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
      // Error thrown where function is called
      return {
        success: false,
        error: result.error,
      }
    }
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
    }
  }
}

const profile_addFollower = async (handle: string, callback: Function):Promise<Return> => {
  try {
    const store = useStore();
    const user = store.getUser;
    const user_db = store.getUser_db;

    if (handle === user_db.user_handle) {
      throw {
        message: 'You cannot follow yourself',
        code: 'profile/unfollow-yourself',
        severity: 4,
        type: 'client',
      }
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
      // Error thrown where function is called
      return {
        success: false,
        error: result.error,
      }
    }
  } catch(error: any) {
    handle_error(error)
    return {
      success: false,
    }
  }
}
