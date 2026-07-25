import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export interface TrimOptions {
  inputPath: string;
  outputPath: string;
  startTime: number;
  duration: number;
}

export interface MergeOptions {
  inputPaths: string[];
  outputPath: string;
}

export interface AudioOverlayOptions {
  videoPath: string;
  audioPath: string;
  outputPath: string;
  audioVolume?: number;
}

export class FFmpegService {
  static async trimVideo(options: TrimOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(options.inputPath)
        .setStartTime(options.startTime)
        .setDuration(options.duration)
        .output(options.outputPath)
        .on('end', () => resolve(options.outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  static async mergeVideos(options: MergeOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg();
      options.inputPaths.forEach((file) => command.input(file));

      command
        .on('end', () => resolve(options.outputPath))
        .on('error', (err) => reject(err))
        .mergeToFile(options.outputPath, path.dirname(options.outputPath));
    });
  }

  static async overlayAudio(options: AudioOverlayOptions): Promise<string> {
    const volume = options.audioVolume ?? 1.0;
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(options.videoPath)
        .input(options.audioPath)
        .complexFilter([
          `[1:a]volume=${volume}[a1]`,
          `[0:v][a1]concat=n=1:v=1:a=1[v][a]`
        ])
        .outputOptions(['-map 0:v', '-map [a1]', '-c:v copy'])
        .output(options.outputPath)
        .on('end', () => resolve(options.outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
