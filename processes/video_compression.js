import * as fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { path } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(path);

process.on("message", async (payload) => {
  try {
    const { path, name, id, quality, codec } = payload;
    
    // Process video and send back the result
    ffmpeg(path).withVideoCodec(codec)
    // ffmpeg(tempFilePath).withVideoCodec('libx264')
    .videoBitrate('3500k')
    .fps(30)
    .output(`./temp/${id}/${name}-${quality}.mp4`)
    .size(quality)
    .on("end", () => {
      end({
        success: true,
        data: {
          path: `./temp/${id}/${name}-${quality}.mp4`,
          append_name: `${quality}.mp4`,
        }
      });
    })
    .run();

    function end (payload) {
      fs.unlink(path, (err) => {
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
  } catch(error) {
    process.send({
      success: false,
      error: error,
    });
    process.exit();
  }
});