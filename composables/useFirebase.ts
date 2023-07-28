import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { User_db } from 'models/user_db.model';
import { Return } from 'models/return.model';
import { useStore } from '~/stores/main';

export const firebase_initAuth: Function = async ():Promise<void> => {
  const store = useStore();
  const auth = getAuth();
  const subscribe = onAuthStateChanged(auth, async (user) => {
    try {
      const result = await getRedirectResult(auth);
      if (result !== null && user !== null) {
        firebase_getRedirectResults(result)
      }
      else if (user !== null) {
        firebase_existingUser(user)
      } else {
        store.setGlobalLoading(false)
      }
      subscribe();
    } catch(err) {
      console.error(err)
      store.setGlobalLoading(false)
    }
  });
}

export const firebase_password_createUser: Function = async (
  displayName: string,
  mail: string,
  password: string,
  handle: string,
):Promise<Return> => {
  const auth = getAuth();
  try {
    const result = await createUserWithEmailAndPassword(auth, mail, password);
    await updateProfile(result.user , { displayName: displayName})
    firebase_newUser(result.user, handle)
    return {
      data: true,
      success: true,
    };
  } catch (error:any) {
    firebase_handle_error(error);
    return {
      error: error,
      success: false,
    }
  }
};

export const firebase_password_signInUser: Function = async (email: string, password: string):Promise<Return> => {
  const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    firebase_existingUser(result)
    return {
      data: true,
      success: true,
    };
  } catch (error:any) {
    firebase_handle_error(error);
    return {
      error: error,
      success: false,
    }
  }
};

export const firebase_redirectToGoogle: Function = async ():Promise<void> => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithRedirect(auth, provider);
};

export const firebase_getRedirectResults: Function = async (result:UserCredential):Promise<void> => {
  const auth = getAuth();
  try {
    // The signed-in user info.
    const user = result.user;
    const additionalUserInfo = getAdditionalUserInfo(result);

    if (additionalUserInfo === null) {
      throw {
        code: 'auth/additional-user-info-null',
        message: 'Internal: Additional user info is null',
        severity: 1,
        type: 'client',
      }
    }
    if (additionalUserInfo.isNewUser) {
      firebase_newUser(user, user.displayName, true);
    } else {
      firebase_existingUser(user, true);
    }
  } catch (error:any) {
    firebase_handle_error(error);
  }
};

export const firebase_newUser: Function = async (user: User, handle: string, redirect?: boolean):Promise<Return> => {
  try {
    const store = useStore();
    const router = useRouter();
    const result = await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        token: await user.getIdToken(),
        handle: handle,
        email: user.email
      }
    });
    if (result.success) {
      alert_resetAlert();
      const result:any = await $fetch(`/api/users/user/${await user.getIdToken()}`)
      if (result.success) {
        const user_db:User_db = result.data
        store.setUser_db(user_db)
        store.setUser(user);
        store.setGlobalLoading(false);
        if (!user.emailVerified) {
          alert_verifyEmail();
        }
        alert_registerSuccess();
        if (redirect) {
          router.push('/')
        }
        return {
          data: true,
          success: true
        }
      } else {
        throw {
          code: 'auth/user_db-fetch-failed',
          message: 'User_db fetch failed',
          severity: 1,
          type: 'client',
        }
      }
    } else {
      throw {
        code: 'auth/user-registration-failed',
        message: 'User registration failed',
        severity: 1,
        type: 'client',
      }
    }
  } catch (error:any) {
    firebase_handle_error(error);
    return {
      error: error,
      success: false,
    }
  }
}

export const firebase_existingUser: Function = async (user:User, redirect?: boolean):Promise<Return> => {
  try {
    const store = useStore();
    const router = useRouter();
    alert_resetAlert();
    const result:any = await $fetch(`/api/users/user/${await user.getIdToken()}`)
    if (result.success) {
      const user_db:User_db = result.data
      store.setUser_db(user_db)
      store.setUser(user);
      store.setGlobalLoading(false);
      if (!user.emailVerified) {
        alert_verifyEmail();
      }
      alert_loginSuccess();
      if (redirect) {
        router.push('/')
      }
      return {
        data: true,
        success: true,
      }
    } else {
      throw {
        code: 'auth/user_db-fetch-failed',
        message: 'User_db fetch failed',
        severity: 1,
        type: 'client',
      }
    }
  } catch (error:any) {
    firebase_handle_error(error);
    return {
      error: error,
      success: false,
    }
  }
}

export const firebase_destroyAuth: Function = async ():Promise<void> => {
  const store = useStore();
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      store.setUser({} as User);
      const router = useRouter();
      router.push('/');
      alert_resetAlert();
      alert_signoutSuccess();
    })
    .catch((error) => {
      firebase_handle_error(error);
    });
}
