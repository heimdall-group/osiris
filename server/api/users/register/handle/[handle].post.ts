import Users from "~/server/models/users";
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters';
    }

    const handle = event.context.params.handle;
    const document = await Users.findOne({user_handle: handle});

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
        request_endpoint: 'users/handle',
        request_type: 'POST',
      },
    }
  }
 });
