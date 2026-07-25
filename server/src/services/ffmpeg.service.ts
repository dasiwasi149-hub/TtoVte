export class FFmpegService {
  static async processVideo(input: string): Promise<string> {
    return input;
  }

  static async overlayAudio(videoPath: string, audioPath: string, outputPath: string): Promise<string> {
    return outputPath;
  }

  static async mergeVideos(videoPaths: string[], outputPath: string): Promise<string> {
    return outputPath;
  }
}
