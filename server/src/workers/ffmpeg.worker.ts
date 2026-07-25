import Queue from 'bull';
import { FFmpegService } from '../services/ffmpeg.service';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const videoQueue = new Queue('video-processing', REDIS_URL);

videoQueue.process('generate-video', async (job) => {
  const { prompt, voiceId, outputPath } = job.data;
  
  job.progress(10);
  
  // Simulation/Processing placeholder for pipeline steps
  job.progress(50);

  // Overlay audio or process video
  const finalVideo = await FFmpegService.overlayAudio({
    videoPath: job.data.videoPath,
    audioPath: job.data.audioPath,
    outputPath: outputPath,
  });
  
  job.progress(100);
  return { resultPath: finalVideo };
});
