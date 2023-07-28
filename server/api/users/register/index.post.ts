import { getAuth } from 'firebase-admin/auth';
import Users from "~/server/models/users";
import { hashName } from '~/server/functions';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    let { token, handle, email, } = await readBody(event);

    const config = useRuntimeConfig();

    if (token === undefined) {
      throw 'Missing token';
    }
    if (handle === undefined) {
      throw 'Missing handle';
    }
    if (email === undefined) {
      throw 'Missing email';
    }

    handle = handle.replaceAll(' ', '')
    const result = await getAuth().verifyIdToken(token);
    const existingUser = await Users.findOne({user_handle: handle});
    if (existingUser !== null) {
      let hash = hashName(result.uid)
      hash = Math.abs(hash)
      handle = `${handle}${hash}`
    }

    const document = new Users({
      user_handle: handle,
      user_uid: result.uid,
      user_email: email,
      user_ranks: [],
      user_followers: [],
      user_following: [],
      user_programs: [],
      user_avatar: result.photoUrl || config.default_profile_avatar_url,
      user_verified: false,
      user_description: {
        text: 'Standard Description',
        links: [],
      },
      user_created_at: new Date().getTime(),
    })
    document.save()
    return {
      data: true,
      success: true,
    }
  } catch(error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/register',
        request_type: 'POST',
      },
    }
  }
 })