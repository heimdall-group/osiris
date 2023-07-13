import { Return } from 'models/return.model';
import Users from "~/server/models/users";

export default defineEventHandler(async (event):Promise<Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const email = event.context.params.email;
    const document = await Users.findOne({user_email: email});

    if (document === null) {
      return {
        data: true,
        success: true,
      }
    } else {
      return {
        data: false,
        success: true,
      }
    }
    
  } catch (err: any) {
    console.log(err)
    return {
      error: err,
      success: false,
      message: 'users/register/email/post',
    }
  }
 });
