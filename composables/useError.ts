import { Throw_Error } from "models/return.model";

export const firebase_handle_error: Function = (error: any):void => {
  const { code } = error;
  switch (code) {
    case 'auth/weak-password':
      alert_firebase_weakPassword();
      break;
    case 'auth/wrong-password':
      alert_firebase_wrongPassword();
      break;
    case 'auth/email-already-in-use':
      alert_firebase_emailAlreadyInUse();
      break;
    case 'auth/popup-closed-by-user':
      alert_firebase_popupClosedByUser();
      break;
    case 'auth/popup-blocked':
      alert_firebase_popupBlocked();
      break;
    case 'auth/popup-request-cancelled':
      alert_firebase_popupRequestCancelled();
      break;
    case 'auth/user-not-found':
      alert_firebase_userNotFound();
      break;
    case 'auth/user-disabled':
      alert_firebase_userDisabled();
      break;
    case 'auth/user-mismatch':
      alert_firebase_userMismatch();
      break;
    default:
      handle_error(error)
      break;
  }
};

export const handle_error: Function = async (error:Throw_Error) => {
  switch(error.severity) {
    case 1:
      // SEND TO SENTRY
      console.error(error)
      console.error(`${error.code}: ${error.message}`);
      alert_handle_error_1(error.message)
      break;
    case 2:
      console.error(`${error.code}: ${error.message}`);
      alert_handle_error_2(error.message)
      break;
    case 3:
      console.warn(`${error.code}: ${error.message}`);
      alert_handle_error_3(error.message)
      break;
    case 4:
      console.warn(`${error.code}: ${error.message}`);
      break;
  }
}