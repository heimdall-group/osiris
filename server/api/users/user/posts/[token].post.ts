import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import Posts from "~/server/models/posts";
import Users from '~/server/models/users';
import formidable from 'formidable';
import { fork } from 'child_process';
import { mkdir, readFileSync, rm, unlink } from 'fs';
import { Return_Compression, Return_Compression_Item } from 'models/return.model';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload_Options } from 'models/upload.model';
import { Return_Api } from 'models/return.model';

export default defineEventHandler(async (event):Promise<Return_Api> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameter'
    }

    const body = await getBody(event.node.req);
    const id: string = body.id[0];
    const unparsed_options: string = body.options[0];
    const token: string = event.context.params.token;
    const files:Array<{file: any, key: string}> = getFiles(body);

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

    const result: DecodedIdToken = await getAuth().verifyIdToken(token);
    const options: Upload_Options = JSON.parse(unparsed_options);
    const { 
      aws_key, 
      aws_secret_key, 
      aws_region, 
      s3_bucket_url, 
      s3_bucket_name,
      compression_types,
      s3_bucket_endpoint,
      video_codec,
    }:{ 
      aws_key: string,
      aws_secret_key: string,
      aws_region: string,
      s3_bucket_url: string,
      s3_bucket_name: string,
      compression_types: string,
      s3_bucket_endpoint: string,
      video_codec: string,
    }
     = useRuntimeConfig();

    if (aws_key === undefined) {
      throw 'Missing Aws key';
    }
    if (aws_secret_key === undefined) {
      throw 'Missing Aws secret key';
    }
    if (aws_region === undefined) {
      throw 'Missing Aws region';
    }
    if (s3_bucket_url === undefined) {
      throw 'Missing S3 Bucket url';
    }
    if (s3_bucket_name === undefined) {
      throw 'Missing S3 Bucket name';
    }
    if (compression_types === undefined) {
      throw 'Missing compression types'
    }
    if (s3_bucket_endpoint === undefined) {
      throw 'Missing S3 Bucket endpoint'
    }
    if (video_codec === undefined) {
      throw 'Missing video codec'
    }
    
    const s3: S3Client = new S3Client({
      region: aws_region,
      credentials: {
        accessKeyId: aws_key,
        secretAccessKey: aws_secret_key,
      },
      endpoint: s3_bucket_url,
    })
    const filePaths:Array<{path: string, name: string, type: string}> = []
    mkdir(`temp/${id}`, (err): void => {
      if (err) {
        console.error(err);
      }
    });

    const compressions: Array<string> = compression_types.split(' ')
    for (let i = 0; i < files.length; i++) {
      const {
        filepath,
        newFilename,
        mimetype
      }: {
        filepath: string,
        newFilename: string,
        mimetype: string,
      } 
       = files[i].file[0];

      if (mimetype.includes('video')) {
        for (let y = 0; y < compressions.length; y++) {
          const quality: string = compressions[y];
          const result:Return_Compression = await compressVideo(filepath, newFilename, id, quality, video_codec)
          if (result === undefined) {
            throw 'Compression result is undefiend'
          }
          if (result.data === undefined) {
            throw 'Compression result data is undefiend'
          }

          if (result.success) {
            filePaths.push({
              path: result.data.path,
              name: `${id}-${i}-${result.data.append_name}`,
              type: mimetype
            })
          } else {
            throw result.error
          }
        }
      } else if (mimetype.includes('image')) {
        filePaths.push({
          path: filepath,
          name: `${id}-${i}.webp`,
          type: mimetype
        })
      }
    }

    const urls: Array<string> = [];
    for (let i = 0; i < filePaths.length; i++) {
      const filePath: Return_Compression_Item = filePaths[i];
      await s3.send(new PutObjectCommand({
        Bucket: s3_bucket_name,
        Body: await readFileSync(filePath.path),
        Key: `users/posts/${filePath.name}`,
        ContentType: filePath.type
      }));
      unlink(filePath.path, (err): void => {
        if (err) {
          console.error(err);
        }
      });
      urls.push(`${s3_bucket_endpoint}users/posts/${filePath.name}`);
    }
    rm(`temp/${id}`, {recursive: true}, (err): void => {
      if (err) {
        console.error(err);
      }
    });

    const post = new Posts({
      uid: result.uid,
      urls: urls,
      likes: [],
      comments: [],
      caption: options.caption,
      users_taged: [],
      published: options.autopublish,
      created_at: new Date().getTime(),
    });
    post.save();
    const action = options.autopublish ? 
      {$addToSet: { user_posts: post._id }} :
      {$addToSet: { user_unpublished_posts: post._id }}

    const user = await Users.findOneAndUpdate(
      { user_uid: result.uid },
      action
    );
    if (user === null) {
      throw 'User fetch is null'
    }
    user.save();

    return {
      data: true,
      success: true,
    }
  } catch(error: any) {
    return {
      error: error,
      success: false,
      server_message: {
        request_endpoint: 'users/user/posts/::token',
        request_type: 'POST',
      },
    }
  }
 })

function compressVideo(path: string, name: string, id: string, quality:string, codec:string):Promise<Return_Compression> {
  return new Promise((resolve, reject) => {
    try {
      const process = fork('processes/video_compression');
      process.send({ path, name, id, quality, codec });
      process.on('message', (result: Return_Compression) => {
        resolve(result);
      })
    } catch(error) {
      reject(error);
    }
  })
}

function getFiles(body:any):Array<{file: any, key: string}> {
  const unparsed_keys = body.keys[0];
  if (unparsed_keys === undefined) {
    throw 'Keys are undefined'
  }

  const keys = JSON.parse(unparsed_keys)

  if (keys.length === 0) {
    throw 'Keys length is 0'
  }

  const arr:Array<{file: any, key: string}> = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const file = body[key];
    arr.push({
      file: file,
      key: key,
    })
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