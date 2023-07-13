import * as fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { path } from '@ffmpeg-installer/ffmpeg';

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

import env from 'dotenv';

env.config();

initializeApp({
  credential: cert('./cert.json')
})

const db = getFirestore();
ffmpeg.setFfmpegPath(path);

process.on("message", async (payload) => {
  const { tempFilePath, name, id, hash } = payload;
  
  // Process video and send back the result
  // ffmpeg(tempFilePath).withVideoCodec('h264_nvenc')
  ffmpeg(tempFilePath).withVideoCodec('libx264')
  .videoBitrate('3500k')
  .fps(30)
  .output(`./public/${name}-1080x1920.mp4`)
  .size('1080x1920')
  .on("end", () => {
    end({
      success: true,
      data: `./public/${name}-1080x1920.mp4`,
    });
  }).on('progress', function(progress) {
    updateFirestore(progress, 1080)
  })
  .run();



  const object = {};
  object[hash] = {}
  async function updateFirestore (progress, quality) {
    const document = db.collection('active_uploads').doc(id);
    object[hash][quality] = {
      current_fps: progress.currentFps,
      timemark: progress.timemark,
    }
    const result = await document.update(object);
  }

  function end (payload) {
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        process.send({
          success: false,
          error: err,
        });
      }
    });

    process.send(payload);
    process.exit();
  };
});