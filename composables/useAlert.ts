import { useStore } from "~/stores/main"

export const alert_restrictAuth = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'You are not authenticated',
  })
};

export const alert_restrictNoAuth = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'You are already authenticated',
  })
};

export const alert_verifyEmail = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',  
    message: {
      prepend: 'Your email is not verified. Click ',
      button: {
        type: 'button-callback',
        callback: () => {console.log('gaming')},
        text: 'here',
      },
      append: ' to send verification email.',
    },
  });
};

export const alert_registerSuccess = () => {
  const store = useStore();
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: 'Register successfull',
  })
};

export const alert_loginSuccess = () => {
  const store = useStore();
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: 'Login successfull',
  })
};

export const alert_signoutSuccess = () => {
  const store = useStore();
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: 'Signout successfull',
  })
};

export const alert_firebase_weakPassword = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'Your password doesnt meet our requirments.',
  })
};

export const alert_firebase_wrongPassword = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'Incorrect password.',
  })
};

export const alert_firebase_emailAlreadyInUse = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'This email is already in use.',
  })
};

export const alert_firebase_popupClosedByUser = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'The popup was closed. Please try again.',
  })
};

export const alert_firebase_popupBlocked = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'The popup request was cancelled. Please try again.',
  })
};

export const alert_firebase_popupRequestCancelled = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'The popup request was cancelled. Please try again.',
  })
};

export const alert_firebase_userNotFound = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'This account doesnt exists',
  })
};

export const alert_firebase_userDisabled = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'You are already authenticated',
  })
};

export const alert_firebase_userMismatch = () => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: 'Mismatched authentication. Please authenticate the correct account',
  })
};

export const alert_firebase_passwordEmailSent = () => {
  const store = useStore();
  const user = store.getUser;
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: `Password reset email sent to ${user.email}`,
  })
};
 
export const alert_firebase_passwordUpdated = () => {
  const store = useStore();
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: 'Your password has been updated.',
  })
};

export const alert_firebase_verifyEmailSent = () => {
  const store = useStore();
  const user = store.getUser;
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: `Verification email sent to ${user.email}`,
  })
};

export const alert_accountRemoved = () => {
  const store = useStore();
  store.setAlert({
    type: 'success',
    icon: 'fa-solid fa-square-check',
    message: `Your account has been removed`,
  })
};

export const alert_handle_error_1 = (error: string) => {
  const store = useStore();
  store.setAlert({
    type: 'error',
    icon: 'fa-solid fa-circle-info',
    message: {
      prepend: 'An ',
      button: {
        type: 'button-title',
        title: error,
        text: 'error'
      },
      append: ' has accured. We have recived an error report and will investigate',
    }
  });
};

export const alert_handle_error_2 = (error: string) => {
  const store = useStore();
  store.setAlert({
    type: 'error',
    icon: 'fa-solid fa-circle-info',
    message: {
      prepend: 'An ',
      button: {
        type: 'button-title',
        title: error,
        text: 'error'
      },
      append: ' has accured.',
    }
  });
};

export const alert_handle_error_3 = (error: string) => {
  const store = useStore();
  store.setAlert({
    type: 'warning',
    icon: 'fa-solid fa-circle-info',
    message: {
      prepend: 'An ',
      button: {
        type: 'button-title',
        title: error,
        text: 'error'
      },
      append: ' has accured.',
    }
  });
};

export const alert_resetAlert = () => {
  const store = useStore();
  store.resetAlerts();
};