import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
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
    
  } catch (error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/register/email',
        request_type: 'POST',
      },
    }
  }
 });
