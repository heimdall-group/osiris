import { getAuth } from 'firebase-admin/auth';
import Posts from "~/server/models/posts";
import formidable from 'formidable';

export default defineEventHandler(async (event) => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameter'
    }

    const body = await getBody(event.node.req);
    const id = body.id[0];
    const unparsed_options = body.options[0];
    const token = event.context.params.token;
    const files = getFiles(body);

    if (token === undefined) {
      throw 'Missing Token';
    }
    if (id === undefined) {
      throw 'Missing Id';
    }
    if (unparsed_options === undefined) {
      throw 'Missing Options';
    }
    if (files.length === 0) {
      throw 'Missing Files';
    }

    const options = JSON.parse(unparsed_options);

    
    
    const result = await getAuth().verifyIdToken(token);
    const document = new Posts({
      uid: result.uid,
      urls: [],
      likes_total: 0,
      comments_total: 0,
      caption: options.caption,
      users_taged: [],
      upload_id: id,
      created_at: new Date().getTime(),
    });
    document.save()

    return {
      data: true,
      success: true,
    }
  } catch(error) {
    return {
      error: error,
      success: false,
      message: 'posts/post/post',
    }
  }
 })

function getFiles(body:any):Array<File> {
  const unparsed_keys = body.keys[0];
  if (unparsed_keys === undefined) {
    throw 'Keys are undefined'
  }

  const keys = JSON.parse(unparsed_keys)

  if (keys.length === 0) {
    throw 'Keys length is 0'
  }

  const arr:Array<File> = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const file = body[key];
    arr.push(file)
  }
  return arr;
}

function getBody(req:any):Promise<any> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(req, (error:any, fields:any, files:any) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}